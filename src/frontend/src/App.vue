<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Эмуляция мира</h1>
    </header>
    
    <main class="app-content">
      <div class="tab-content">
        <HumanView />
      </div>
    </main>
  </div>
</template>

<script>
import HumanView from './components/human/HumanView.vue'

export default {
  name: 'App',
  components: {
    HumanView
  }
}
</script>

<style>
.app-container {
  width: 100%;
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.app-header {
  background-color: #1a237e;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.navigation {
  display: flex;
  gap: 10px;
}

.nav-button {
  padding: 10px 20px;
  background-color: rgba(255,255,255,0.1);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background-color: rgba(255,255,255,0.2);
}

.nav-button.active {
  background-color: #3949ab;
}

.app-content {
  padding: 20px;
}

.tab-content {
  width: 100%;
  height: calc(100vh - 80px);
}

/* Responsive design */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .navigation {
    width: 100%;
    justify-content: center;
  }
  
  .nav-button {
    flex: 1;
    max-width: 150px;
  }
}
</style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
