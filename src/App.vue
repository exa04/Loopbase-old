<template>
  <TitleBar></TitleBar>
</template>

<script>
import TitleBar from './components/TitleBar.vue';

export default {
  name: 'App',
  components: {
    TitleBar
  }
}
</script>

<style lang="scss">
@import 'styles/variables.scss';
body{ margin: 0; background-color: $window-background;}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: $window-background;
}
</style>
