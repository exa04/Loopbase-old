<template>
  <TitleBar></TitleBar>
</template>

<script>
    import TitleBar from './components/TitleBar.vue';
    import '@fontsource/rubik';

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
        font-family: 'Rubik', Arial, Helvetica, sans-serif;
        color: $foreground-100;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: $window-background;
    }
</style>
