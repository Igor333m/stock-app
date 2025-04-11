# Stock Ticker App

A web application for searching stock tickers, viewing their prices, and saving them to a watchlist. Built with Vue 3, Pinia, NestJS, SQLite, and Prisma.

## Features

- Search for stocks by company name or ticker symbol
- View detailed stock information including price, changes, and daily stats
- Save favorite stocks to a watchlist
- Remove stocks from the watchlist

## Tech Stack

### Frontend
- Vue 3 with Composition API
- TypeScript
- Pinia for state management
- Axios for API calls

### Backend
- NestJS framework
- Prisma ORM
- SQLite database
- Finnhub API integration

## Project Structure

```
stock-app/
├── frontend/           # Vue 3 frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── stores/     # Pinia stores
│   │   ├── App.vue
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
│
├── backend/            # NestJS backend
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── stocks/     # Stocks module
│   │   ├── prisma/     # Prisma service
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   └── package.json
```

## Getting Started

### Prerequisites

- Node.js v16 or higher
- npm v7 or higher

### Installation

1. Clone the repository
2. Set up the backend:
   ```
   cd stock-app/backend
   npm install
   ```
3. Set up the frontend:
   ```
   cd stock-app/frontend
   npm install
   ```
4. Create a `.env` file in the backend folder with your Finnhub API key:
   ```
   DATABASE_URL="file:./dev.db"
   FINNHUB_API_KEY="your_finnhub_api_key"
   ```

### Running the App

1. Start the backend:
   ```
   cd stock-app/backend
   npm run start:dev
   ```
2. Start the frontend:
   ```
   cd stock-app/frontend
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

- `GET /stocks/search?q=query` - Search for stocks
- `GET /stocks/quote/:symbol` - Get stock quote for a symbol
- `POST /stocks/save` - Save a stock to the watchlist
- `GET /stocks` - Get all saved stocks
- `DELETE /stocks/:id` - Delete a stock from the watchlist

## Acknowledgements

- [Finnhub API](https://finnhub.io/) for providing stock data 