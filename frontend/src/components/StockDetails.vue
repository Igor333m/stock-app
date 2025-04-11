<template>
  <div v-if="stock" class="stock-details">
    <div class="details-header">
      <div>
        <h2>{{ stock.name }} ({{ stock.symbol }})</h2>
        <div class="stock-meta" v-if="stock.exchange">
          {{ stock.exchange }} 
          <span v-if="stock.country">, {{ stock.country }}</span>
          <span v-if="stock.currency">, {{ stock.currency }}</span>
        </div>
        <div class="stock-industry" v-if="stock.industry">
          {{ stock.industry }}
        </div>
        <div class="price-container">
          <span class="price">${{ stock.price?.toFixed(2) }}</span>
          <span 
            class="change" 
            :class="stock.change && stock.change >= 0 ? 'positive' : 'negative'"
          >
            {{ stock.change?.toFixed(2) }} 
            ({{ stock.percentChange?.toFixed(2) }}%)
          </span>
        </div>
      </div>
      <button @click="onSaveStock(stock.symbol)" class="save-button">
        Save to Watchlist
      </button>
    </div>
    
    <div class="detail-grid">
      <div class="detail-item">
        <div class="label">Open</div>
        <div class="value">${{ stock.open?.toFixed(2) }}</div>
      </div>
      <div class="detail-item">
        <div class="label">Previous Close</div>
        <div class="value">${{ stock.previousClose?.toFixed(2) }}</div>
      </div>
      <div class="detail-item">
        <div class="label">Day's High</div>
        <div class="value">${{ stock.high?.toFixed(2) }}</div>
      </div>
      <div class="detail-item">
        <div class="label">Day's Low</div>
        <div class="value">${{ stock.low?.toFixed(2) }}</div>
      </div>
    </div>
    
    <button @click="onClearStock" class="clear-button">
      Back to Search
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Stock {
  symbol: string;
  name: string;
  exchange?: string;
  country?: string;
  currency?: string;
  industry?: string;
  price?: number;
  change?: number;
  percentChange?: number;
  open?: number;
  previousClose?: number;
  high?: number;
  low?: number;
}

const props = defineProps({
  stock: {
    type: Object as () => Stock | null,
    default: null
  }
});

const emit = defineEmits(['save-stock', 'clear-stock']);

const onSaveStock = (symbol: string) => {
  emit('save-stock', symbol);
};

const onClearStock = () => {
  emit('clear-stock');
};
</script>

<style scoped>
.stock-details {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stock-meta {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.stock-industry {
  font-size: 14px;
  color: #555;
  margin-top: 4px;
  font-style: italic;
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
  grid-template-columns: repeat(4, 1fr);
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

/* Responsive styles */
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .details-header {
    flex-direction: column;
  }
  
  .save-button {
    margin-top: 15px;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style> 