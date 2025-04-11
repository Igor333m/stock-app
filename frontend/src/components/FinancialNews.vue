<template>
  <div class="news-section">
    <h2>Latest Financial News</h2>
    
    <div v-if="loading && !newsArticles.length" class="loading-news">
      Loading latest news...
    </div>
    
    <div v-else-if="error && !newsArticles.length" class="error-message">
      {{ error }}
    </div>
    
    <div v-else-if="!newsArticles.length" class="no-news">
      No news articles available at the moment.
    </div>
    
    <div v-else class="news-grid">
      <a 
        v-for="article in newsArticles" 
        :key="article.id"
        :href="article.url"
        target="_blank"
        rel="noopener noreferrer"
        class="news-card"
      >
        <div class="news-image-container">
          <img 
            v-if="article.image" 
            :src="article.image" 
            :alt="article.headline"
            class="news-image"
          />
          <div v-else class="news-image-placeholder">
            <span>{{ article.source }}</span>
          </div>
        </div>
        
        <div class="news-content">
          <h3 class="news-headline">{{ article.headline }}</h3>
          <p class="news-summary">{{ truncateSummary(article.summary) }}</p>
          <div class="news-meta">
            <span class="news-source">{{ article.source }}</span>
            <span class="news-date">{{ formatDate(article.datetime) }}</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface NewsArticle {
  id: number;
  headline: string;
  summary: string;
  url: string;
  datetime: string;
  image: string;
  source: string;
}

const props = defineProps({
  newsArticles: {
    type: Array as () => NewsArticle[],
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

// Format date to a readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};

// Truncate long summary text
const truncateSummary = (summary: string, maxLength: number = 120) => {
  if (summary.length <= maxLength) return summary;
  return summary.substring(0, maxLength) + '...';
};
</script>

<style scoped>
.news-section {
  margin-top: 40px;
}

.news-section h2 {
  margin-bottom: 20px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.news-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.news-image-container {
  height: 180px;
  overflow: hidden;
  position: relative;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #dfe6f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #687790;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.news-content {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.news-headline {
  font-size: 18px;
  margin-bottom: 10px;
  line-height: 1.3;
  color: #333;
}

.news-summary {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  flex-grow: 1;
  line-height: 1.5;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-top: auto;
}

.news-source {
  font-weight: 500;
}

.loading-news, .no-news {
  text-align: center;
  padding: 40px;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 16px;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 5px;
}

/* Adjust responsive styles for news grid */
@media (max-width: 992px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 580px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
}
</style> 