<template>
  <div class="saved-stocks-section">
    <h2>Your Watchlist</h2>
    
    <div v-if="savedStocks.length === 0" class="no-saved-stocks">
      No stocks saved yet. Search and save some stocks to see them here.
    </div>
    
    <div v-else class="saved-stocks-list">
      <div 
        v-for="stock in savedStocks" 
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
          <button @click="onViewStock(stock.symbol)" class="view-button">
            View
          </button>
          <button @click="onDeleteStock(stock.id)" class="delete-button">
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  savedStocks: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['view-stock', 'delete-stock']);

const onViewStock = (symbol: string) => {
  emit('view-stock', symbol);
};

const onDeleteStock = (id: number) => {
  emit('delete-stock', id);
};
</script>

<style scoped>
.saved-stocks-section h2 {
  margin-bottom: 16px;
}

.saved-stocks-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
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

@media (max-width: 480px) {
  .saved-stocks-list {
    grid-template-columns: 1fr;
  }
  
  .saved-stock-item {
    flex-direction: column;
  }
  
  .saved-stock-actions {
    margin-top: 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  
  .view-button, .delete-button {
    width: 48%;
  }
}
</style> 