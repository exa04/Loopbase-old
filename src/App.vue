<template>
    <TitleBar ref="TitleBar"/>
    <MainContent ref="MainContent"/>
    <PlayBar ref="PlayBar"/>
</template>

<script>
    import TitleBar from './components/TitleBar.vue';
    import MainContent from './components/MainContent.vue';
    import PlayBar from './components/PlayBar.vue';
    import '@fontsource/rubik/400.css';
    import '@fontsource/rubik/700.css';
    import '@ibm/plex/scss/ibm-plex.scss';

    export default {
        name: 'App',
        components: {
            TitleBar,
            MainContent,
            PlayBar
        },
        methods: {
            search(){
                let originalQuery = this.$refs.TitleBar.$refs.SearchBar.value;
                let query = {
                    category:       'loops',
                    keys:           '',
                    order:          ['date', 'd'],
                    tempo:          [0,200],
                    page:           1,
                    key:            ['', ''],
                    date:           0,
                    genre:          0
                };

                // This matches every ocurrence of (NUMBER) BPM in the query
                let bpmregex = /[0-9]+ *bpm(?: |$)/gi;
                let bpmtext = Array.from(originalQuery.matchAll(bpmregex));
                query.keys = originalQuery.replaceAll(bpmregex, "");

                if(bpmtext.length > 0){
                    query.tempo = bpmtext.pop()[0].match(/[1-9][0-9]*/)[0];
                    query.tempo = [Number(query.tempo), Number(query.tempo)];
                }
                // This matches every occurence of a key in the query
                let keyregex = /([a-g]|A-G) *[#b]? *(maj|min)(or)?(?: |$)/gi;
                let keytext = Array.from(originalQuery.matchAll(keyregex));
                query.keys = query.keys.replaceAll(keyregex, "");

                if(keytext.length > 0){
                    query.filterByKey = true;
                    let keymatch = keytext.pop()[0].toLowerCase();
                    let note = keymatch[0];
                    if(keymatch[1] == "#") note += "s";
                    if(keymatch[1] == "b") {
                        let charcode = (keymatch.charCodeAt(1) - "a".charCodeAt(0)) + 1;
                        charcode %= 8;
                        charcode += "a".charCodeAt(0);
                        note = String.fromCharCode(charcode);
                    }
                    query.key = [
                        note,
                        keymatch.match(/(maj|min)/i)[0].toLowerCase() == "min" ? "m" : ""
                    ];
                }
                this.$refs.MainContent.$refs.TopArea.$data.query = query;
                this.$refs.MainContent.$refs.Results.$data.query = query;
                this.$refs.MainContent.$refs.Results.reset();
            }
        }
    }
</script>

<style lang="scss">
    @import 'styles/globals.scss';
    body{
        margin: 0;
        background-color: $window-background;
        overflow-y: overlay;
    }
    #app {
        color: $foreground-100;
        font-size: $font-size;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: $window-background;
        .title-bar{
            top: 0;
        }
        .title-bar, .play-bar{
            z-index: 5;
            position: fixed;
            box-sizing: border-box;
            width: 100%;
        }
        .main-content{
            z-index: -1;
        }
        .play-bar{
            bottom: 0;
        }
    }
    *::-webkit-scrollbar {
        width: 10px;
        margin-right: 10px;
    }

    *::-webkit-scrollbar-track {
        background: transparent;
    }

    *::-webkit-scrollbar-thumb {
        transition: $animation-duration;
        background-color: rgba($foreground-100, 25%);
        &:hover{
            background-color: rgba($foreground-100, 50%);
        }
        border-radius: 10px;
    }
</style>
