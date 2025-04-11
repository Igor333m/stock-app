<script setup lang="ts">
import StockApp from './components/StockApp.vue'
</script>

<template>
  <div class="app">
    <StockApp />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: 20px 0;
}

@media (max-width: 480px) {
  .app {
    padding: 10px 0;
  }
}
</style>
