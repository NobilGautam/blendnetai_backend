const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const request = require('request-promise-native');
require('dotenv').config();

const app = express();

app.use(express.json());

const corsOptions = {
    origin: 'https://blendnetai-frontend.vercel.app',
    optionsSuccessStatus: 200
};



app.use(cors(corsOptions));

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.REACT_MONGO_URI; // Add your MongoDB URI here

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchlist: { type: [String], default: [] }
});

const User = mongoose.model('User', userSchema);

// Alpha Vantage setup
const API_KEY = process.env.REACT_STOCK_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the express server of the stock monitoring project');
});

// User registration
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ user: { id: user._id, username: user.username } });
});


// Route to fetch intraday stock data
app.get('/api/stocks/intraday/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const { interval } = req.query;
    const url = `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval || '5min'}&apikey=demo`;

    try {
        const data = await request.get({
            url: url,
            json: true,
            headers: { 'User-Agent': 'request' }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch intraday stock data' });
    }
});

// Route to get user's watchlist
app.get('/api/watchlist/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch watchlist' });
    }
});

// Route to add stock to user's watchlist
app.post('/api/watchlist', async (req, res) => {
    const { username, symbol } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.watchlist.includes(symbol)) {
            return res.status(400).json({ error: 'Stock already in watchlist' });
        }

        user.watchlist.push(symbol);
        await user.save();
        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add stock to watchlist' });
    }
});

// Route to remove stock from user's watchlist
app.delete('/api/watchlist', async (req, res) => {
    const { username, symbol } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.watchlist = user.watchlist.filter(s => s !== symbol);
        await user.save();
        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove stock from watchlist' });
    }
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
