<template>
  <div class="stock-app">
    <h1>Stock Ticker App</h1>
    
    <div class="search-section">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="debouncedSearch"
          placeholder="Search for stocks..."
          class="search-input"
        />
        <div v-if="stocksStore.loading" class="loading">Loading...</div>
      </div>
      
      <div v-if="stocksStore.searchResults.length > 0" class="search-results">
        <div 
          v-for="result in stocksStore.searchResults" 
          :key="result.symbol"
          @click="getStockQuote(result.symbol)"
          class="search-result-item"
        >
          <div class="symbol">{{ result.symbol }}</div>
          <div class="description">{{ result.description }}</div>
        </div>
      </div>
    </div>
    
    <div v-if="stocksStore.currentStock" class="stock-details">
      <div class="details-header">
        <div>
          <h2>{{ stocksStore.currentStock.name }} ({{ stocksStore.currentStock.symbol }})</h2>
          <div class="price-container">
            <span class="price">${{ stocksStore.currentStock.price?.toFixed(2) }}</span>
            <span 
              class="change" 
              :class="stocksStore.currentStock.change && stocksStore.currentStock.change >= 0 ? 'positive' : 'negative'"
            >
              {{ stocksStore.currentStock.change?.toFixed(2) }} 
              ({{ stocksStore.currentStock.percentChange?.toFixed(2) }}%)
            </span>
          </div>
        </div>
        <button @click="saveStock(stocksStore.currentStock.symbol)" class="save-button">
          Save to Watchlist
        </button>
      </div>
      
      <div class="detail-grid">
        <div class="detail-item">
          <div class="label">Open</div>
          <div class="value">${{ stocksStore.currentStock.open?.toFixed(2) }}</div>
        </div>
        <div class="detail-item">
          <div class="label">Previous Close</div>
          <div class="value">${{ stocksStore.currentStock.previousClose?.toFixed(2) }}</div>
        </div>
        <div class="detail-item">
          <div class="label">Day's High</div>
          <div class="value">${{ stocksStore.currentStock.high?.toFixed(2) }}</div>
        </div>
        <div class="detail-item">
          <div class="label">Day's Low</div>
          <div class="value">${{ stocksStore.currentStock.low?.toFixed(2) }}</div>
        </div>
      </div>
      
      <button @click="clearCurrentStock" class="clear-button">
        Back to Search
      </button>
    </div>
    
    <div class="saved-stocks-section">
      <h2>Your Watchlist</h2>
      
      <div v-if="stocksStore.savedStocks.length === 0" class="no-saved-stocks">
        No stocks saved yet. Search and save some stocks to see them here.
      </div>
      
      <div v-else class="saved-stocks-list">
        <div 
          v-for="stock in stocksStore.savedStocks" 
          :key="stock.id" 
          class="saved-stock-item"
        >
          <div class="saved-stock-info">
            <div class="symbol-name">
              <span class="symbol">{{ stock.symbol }}</span>
              <span class="name">{{ stock.name }}</span>
            </div>
            <div class="price-change">
              <span class="price">${{ stock.price?.toFixed(2) }}</span>
              <span 
                class="change" 
                :class="stock.change && stock.change >= 0 ? 'positive' : 'negative'"
              >
                {{ stock.change?.toFixed(2) }}
              </span>
            </div>
          </div>
          <div class="saved-stock-actions">
            <button @click="getStockQuote(stock.symbol)" class="view-button">
              View
            </button>
            <button @click="deleteStock(stock.id)" class="delete-button">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStocksStore } from '../stores/stocks';

const stocksStore = useStocksStore();
const searchQuery = ref('');
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  stocksStore.getSavedStocks();
});

const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = setTimeout(() => {
    stocksStore.searchStocks(searchQuery.value);
  }, 500);
};

const getStockQuote = (symbol: string) => {
  stocksStore.getStockQuote(symbol);
  stocksStore.clearSearchResults();
  searchQuery.value = '';
};

const saveStock = (symbol: string) => {
  stocksStore.saveStock(symbol);
};

const deleteStock = (id?: number) => {
  if (id) stocksStore.deleteStock(id);
};

const clearCurrentStock = () => {
  stocksStore.clearCurrentStock();
};
</script>

<style scoped>
.stock-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1, h2 {
  color: #333;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
}

.search-section {
  position: relative;
  margin-bottom: 30px;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #4a6cf7;
}

.search-results {
  position: absolute;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.search-result-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f5f8ff;
}

.search-result-item .symbol {
  font-weight: bold;
  color: #333;
}

.search-result-item .description {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.stock-details {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.price-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  margin-right: 10px;
}

.change {
  font-size: 18px;
  font-weight: 500;
}

.positive {
  color: #28a745;
}

.negative {
  color: #dc3545;
}

.save-button {
  background-color: #4a6cf7;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.save-button:hover {
  background-color: #3a5ce5;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.detail-item {
  background-color: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.value {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.clear-button {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.clear-button:hover {
  background-color: #e9ecef;
}

.saved-stocks-section h2 {
  margin-bottom: 16px;
}

.saved-stocks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.saved-stock-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.saved-stock-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.saved-stock-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.symbol-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.symbol-name .symbol {
  font-weight: bold;
  color: #333;
}

.symbol-name .name {
  color: #666;
  font-size: 14px;
}

.price-change {
  display: flex;
  align-items: center;
  gap: 10px;
}

.saved-stock-actions {
  display: flex;
  gap: 8px;
}

.view-button, .delete-button {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.view-button {
  background-color: #e9ecef;
  color: #333;
  border: 1px solid #ddd;
}

.view-button:hover {
  background-color: #dde1e6;
}

.delete-button {
  background-color: #f8d7da;
  color: #dc3545;
  border: 1px solid #f5c2c7;
}

.delete-button:hover {
  background-color: #f5c2c7;
}

.no-saved-stocks {
  color: #666;
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.loading {
  margin-left: 12px;
  color: #666;
}
</style> 