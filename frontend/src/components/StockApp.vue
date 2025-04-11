<template>
  <div class="stock-app">
    <div class="app-header">
      <img src="../assets/logo.svg" alt="Stock Ticker Logo" class="app-logo" />
      <h1>Stock Ticker App</h1>
    </div>
    
    <!-- Using the StockSearch component -->
    <StockSearch
      :searchResults="stocksStore.searchResults"
      :loading="stocksStore.loading"
      :error="stocksStore.error"
      @search="handleSearch"
      @select-stock="getStockQuote"
    />
    
    <!-- Using the StockDetails component -->
    <StockDetails 
      v-if="stocksStore.currentStock"
      :stock="stocksStore.currentStock"
      @save-stock="saveStock"
      @clear-stock="clearCurrentStock"
    />
    
    <!-- Using other components -->
    <StockWatchlist 
      :savedStocks="stocksStore.savedStocks"
      @view-stock="getStockQuote"
      @delete-stock="deleteStock"
    />
    
    <FinancialNews 
      :newsArticles="stocksStore.newsArticles"
      :loading="stocksStore.loading"
      :error="stocksStore.error"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStocksStore } from '../stores/stocks';
import StockWatchlist from './StockWatchlist.vue';
import FinancialNews from './FinancialNews.vue';
import StockDetails from './StockDetails.vue';
import StockSearch from './StockSearch.vue';

const stocksStore = useStocksStore();

onMounted(() => {
  stocksStore.getSavedStocks();
  stocksStore.getNews('general');
});

const handleSearch = (query: string, usExchangeOnly: boolean) => {
  if (query.trim()) {
    stocksStore.searchStocks(query, usExchangeOnly);
  } else {
    stocksStore.clearSearchResults();
  }
};

const getStockQuote = (symbol: string) => {
  stocksStore.getStockQuote(symbol);
  stocksStore.clearSearchResults();
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
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  gap: 15px;
}

.app-logo {
  width: 50px;
  height: 50px;
  animation: pulse 3s infinite alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

h1 {
  color: #333;
  margin: 0;
  text-align: center;
}

/* Add responsive adjustments at the end */
@media (max-width: 768px) {
  .stock-app {
    width: 95%;
    padding: 15px;
  }
  
  .app-header {
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .app-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .app-logo {
    width: 40px;
    height: 40px;
  }
  
  h1 {
    font-size: 24px;
  }
}
</style> 