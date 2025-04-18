import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface Stock {
  id?: number;
  symbol: string;
  name?: string;
  price?: number;
  change?: number;
  percentChange?: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
  exchange?: string;
  country?: string;
  currency?: string;
  industry?: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NewsArticle {
  category: string;
  datetime: string;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

interface StockState {
  searchResults: any[];
  currentStock: Stock | null;
  savedStocks: Stock[];
  newsArticles: NewsArticle[];
  loading: boolean;
  error: string | null;
}

export const useStocksStore = defineStore('stocks', {
  state: (): StockState => ({
    searchResults: [],
    currentStock: null,
    savedStocks: [],
    newsArticles: [],
    loading: false,
    error: null,
  }),
  
  actions: {
    async searchStocks(query: string, usExchangeOnly: boolean = false) {
      if (!query.trim()) {
        this.searchResults = [];
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(
          `${API_URL}/stocks/search?q=${query}${usExchangeOnly ? '&exchange=US' : ''}`
        );
        this.searchResults = response.data;
      } catch (error) {
        console.error('Error searching stocks:', error);
        this.error = 'Failed to search stocks';
        this.searchResults = [];
      } finally {
        this.loading = false;
      }
    },
    
    async getStockQuote(symbol: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/stocks/quote/${symbol}`);
        this.currentStock = response.data;
        return response.data;
      } catch (error) {
        console.error('Error getting stock quote:', error);
        this.error = 'Failed to get stock quote';
      } finally {
        this.loading = false;
      }
    },
    
    async getNews(category: string = 'general') {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/stocks/news?category=${category}`);
        this.newsArticles = response.data;
        return response.data;
      } catch (error) {
        console.error('Error getting news:', error);
        this.error = 'Failed to get latest news';
        this.newsArticles = [];
      } finally {
        this.loading = false;
      }
    },
    
    async saveStock(symbol: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${API_URL}/stocks/save`, { symbol });
        await this.getSavedStocks();
        return response.data;
      } catch (error) {
        console.error('Error saving stock:', error);
        this.error = 'Failed to save stock';
      } finally {
        this.loading = false;
      }
    },
    
    async getSavedStocks() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/stocks`);
        this.savedStocks = response.data;
        return response.data;
      } catch (error) {
        console.error('Error getting saved stocks:', error);
        this.error = 'Failed to get saved stocks';
      } finally {
        this.loading = false;
      }
    },
    
    async deleteStock(id: number) {
      this.loading = true;
      this.error = null;
      
      try {
        await axios.delete(`${API_URL}/stocks/${id}`);
        this.savedStocks = this.savedStocks.filter(stock => stock.id !== id);
      } catch (error) {
        console.error('Error deleting stock:', error);
        this.error = 'Failed to delete stock';
      } finally {
        this.loading = false;
      }
    },
    
    clearCurrentStock() {
      this.currentStock = null;
    },
    
    clearSearchResults() {
      this.searchResults = [];
    },
  },
}); 