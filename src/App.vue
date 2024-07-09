<template>    
    <TaskManager/>
</template>

<script>
import TaskManager from './components/TaskManager.vue';

export default {
  name: 'App',
  components: {
    TaskManager
  }
}
</script>

<style>
#app {
  font-family: 'Segou UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgb(44, 62, 80);
  margin-top: 10px;
}

.app-logo {
  margin: 0;
  width: 50px;
  height: 50px;
}
</style>
