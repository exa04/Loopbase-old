<template>
    <TitleBar></TitleBar>
    <MainContent></MainContent>
    <PlayBar 
        profile_picture="https://avatars.githubusercontent.com/u/68156346?v=4"
        title="Midwest emo guitar - Brakence type hyperpop guitar loop"
        info="stxarixdust - 150bpm - D# Minor"
    ></PlayBar>
</template>

<script>
    import TitleBar from './components/TitleBar.vue';
    import MainContent from './components/MainContent.vue';
    import PlayBar from './components/PlayBar.vue';
    import '@fontsource/rubik/400.css';
    import '@fontsource/rubik/700.css';

    export default {
        name: 'App',
        components: {
            TitleBar,
            MainContent,
            PlayBar
        }
    }
</script>

<style lang="scss">
    @import 'styles/globals.scss';
    body{ margin: 0; background-color: $window-background;}
    #app {
        font-family: 'Rubik', Arial, Helvetica, sans-serif;
        color: $foreground-100;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: $window-background;
        display: flex;
        flex-direction: column;
        height: 100vh;
    }
</style>
