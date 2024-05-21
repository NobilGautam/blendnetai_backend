# BlendNetAI Backend

This repository contains the backend code for BlendNetAI, a stock market watchlist application. The backend is built using Node.js and Express, and it interfaces with a MongoDB database to manage user data and stock watchlists. The application is deployed on Render.com.

## Table of Contents

- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Design Choices](#design-choices)
- [Implementation Details](#implementation-details)
- [Error Handling](#error-handling)
- [Dependencies](#dependencies)

## Getting Started

To get started with the BlendNetAI backend, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/blendnetai-backend.git
    cd blendnetai-backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your MongoDB URI:
    ```sh
    MONGODB_URI=your_mongodb_uri
    ```

4. Start the server:
    ```sh
    npm start
    ```

The server should now be running on `http://localhost:4000`.

## API Endpoints

### User Authentication

- `POST /api/login`: Authenticates a user and returns a JWT token.

### Watchlist Management

- `GET /api/watchlist/:username`: Retrieves the watchlist for a specific user.
- `POST /api/watchlist`: Adds a stock symbol to the user's watchlist.
- `DELETE /api/watchlist`: Removes a stock symbol from the user's watchlist.

### Stock Data

- `GET /api/stocks/daily/:symbol`: Fetches daily stock data for a specific symbol.
- `GET /api/stocks/intraday/:symbol`: Fetches intraday stock data for a specific symbol with a given interval.
- `POST /api/stocks/brief`: Fetches brief stock data for multiple symbols.

## Design Choices

1. **Separation of Concerns**: The backend is designed to separate different functionalities into distinct endpoints. This makes the code more modular and easier to maintain.
   
2. **Middleware Usage**: The `cors` middleware is used to handle Cross-Origin Resource Sharing (CORS), allowing the frontend hosted on Vercel to communicate with the backend hosted on Render.com.

3. **Error Handling**: Proper error handling is implemented to return meaningful error messages and status codes, helping in debugging and improving the user experience.

4. **Database Interaction**: The backend interacts with MongoDB to store and retrieve user watchlist data. Mongoose is used as the ODM (Object Data Modeling) library to simplify database operations.

5. **Deployment**: The backend is deployed on Render.com, providing a reliable hosting solution with easy deployment processes.

## Implementation Details

### Middleware Configuration

The CORS middleware is configured to allow requests from the frontend hosted on Vercel:

```js
const corsOptions = {
    origin: 'https://blendnetai-frontend.vercel.app',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
```

### API Endpoints

#### Watchlist Management

- **Add to Watchlist**:
  - Validates the stock symbol by fetching intraday data.
  - Adds the symbol to the user's watchlist if valid.
  - Endpoint: `POST /api/watchlist`
  
- **Remove from Watchlist**:
  - Removes the specified symbol from the user's watchlist.
  - Endpoint: `DELETE /api/watchlist`

#### Stock Data Fetching

- **Daily Stock Data**:
  - Fetches daily stock data for a given symbol.
  - Endpoint: `GET /api/stocks/daily/:symbol`
  
- **Intraday Stock Data**:
  - Fetches intraday stock data for a given symbol and interval.
  - Endpoint: `GET /api/stocks/intraday/:symbol`
  
- **Brief Stock Data**:
  - Fetches brief stock data for multiple symbols.
  - Endpoint: `POST /api/stocks/brief`

### Error Handling

The backend includes comprehensive error handling to manage various failure scenarios, such as user not found, invalid stock symbol, and database errors. Proper HTTP status codes and messages are returned to the client.

### Dependencies

Key dependencies used in this project include:

- `express`: Web framework for Node.js.
- `cors`: Middleware for handling CORS.
- `mongoose`: ODM for MongoDB.
- `axios`: HTTP client for making API requests.

## Contact

For any questions or issues, please contact nobilgautam007@gmail.com
