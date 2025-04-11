<template>
  <div class="search-section">
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        @input="onInputChange"
        placeholder="Search for stocks..."
        class="search-input"
      />
      <div v-if="loading" class="loading">Loading...</div>
    </div>
    
    <div class="filter-options">
      <label class="checkbox-container">
        <input type="checkbox" v-model="usExchangeOnly" @change="onInputChange">
        <span class="checkbox-text">US Exchange Only</span>
      </label>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-if="searchResults.length > 0" class="search-results">
      <div 
        v-for="result in searchResults" 
        :key="result.symbol"
        @click="onStockSelect(result.symbol)"
        class="search-result-item"
      >
        <div class="symbol">{{ result.symbol }}</div>
        <div class="description">{{ result.description }}</div>
        <div class="exchange">{{ result.type || 'Stock' }} - {{ result.exchange }}</div>
      </div>
    </div>
    
    <div v-else-if="searchQuery && !loading" class="no-results">
      No results found. Try another search term.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

interface SearchResult {
  symbol: string;
  description: string;
  type?: string;
  exchange: string;
}

const props = defineProps({
  searchResults: {
    type: Array as () => SearchResult[],
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['search', 'select-stock']);

const searchQuery = ref('');
const usExchangeOnly = ref(true);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const onInputChange = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      emit('search', searchQuery.value, usExchangeOnly.value);
    } else {
      emit('search', '', usExchangeOnly.value);
    }
  }, 500);
};

const onStockSelect = (symbol: string) => {
  emit('select-stock', symbol);
  searchQuery.value = '';
};
</script>

<style scoped>
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

.search-result-item .exchange {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.filter-options {
  margin-top: 10px;
  margin-bottom: 5px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  margin-right: 8px;
  cursor: pointer;
}

.checkbox-text {
  font-size: 14px;
  color: #555;
}

.no-results {
  color: #666;
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 5px;
}

.loading {
  margin-left: 12px;
  color: #666;
}
</style> 