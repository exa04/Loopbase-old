<template>
    <div
        :class="theme"
        class="appRoot"
    >
        <Transition name="popup">
            <Settings
                ref="Settings"
                v-if="settingsOpen"
                @close="settingsOpen = false; loadTheme()"
            />
        </Transition>
        <TitleBar
            ref="TitleBar"
            @settingsOpen="settingsOpen = !settingsOpen"
        />
        <MainContent
            ref="MainContent"
        />
        <PlayBar
            ref="PlayBar"
        />
    </div>
</template>

<script>
    import TitleBar from './components/TitleBar.vue';
    import MainContent from './components/MainContent.vue';
    import PlayBar from './components/PlayBar.vue';
    import Settings from './components/Settings.vue';
    import '@fontsource/rubik/400.css';
    import '@fontsource/rubik/700.css';
    import '@ibm/plex/scss/ibm-plex.scss';

    const electron = window.require("electron");

    export default {
        name: 'App',
        components: {
            TitleBar,
            MainContent,
            PlayBar,
            Settings
        },
        methods: {
            search(){
                let originalQuery = this.$refs.TitleBar.$refs.SearchBar.value;
                let topBarQuery = this.$refs.MainContent.$refs.TopArea.queryInfo;
                let query = {
                    category:       topBarQuery.category,
                    keys:           '',
                    order:          topBarQuery.order,
                    tempo:          topBarQuery.tempo,
                    page:           1,
                    key:            [topBarQuery.key[0], topBarQuery.key[1]],
                    date:           topBarQuery.date,
                    genre:          topBarQuery.genre,
                    filterByKey:    this.$refs.MainContent.$refs.TopArea.filterAdded.keytest
                };

                // This matches every ocurrence of (NUMBER) BPM in the query
                let bpmregex = /[0-9]+ *bpm(?: |$)/gi;
                let bpmtext = Array.from(originalQuery.matchAll(bpmregex));
                query.keys = originalQuery.replaceAll(bpmregex, "");

                if(bpmtext.length > 0){
                    query.tempo = bpmtext.pop()[0].match(/[1-9][0-9]*/)[0];
                    query.tempo = [Number(query.tempo), Number(query.tempo)];
                    this.$refs.MainContent.$refs.TopArea.setTempo(query.tempo);
                }

                // This matches every occurence of a key in the query
                let keyregex = /([a-g]|A-G) *[#b]? *(maj|min)(or)?(?: |$)/gi;
                let keytext = Array.from(originalQuery.matchAll(keyregex));
                query.keys = query.keys.replaceAll(keyregex, "");

                // Remove BPM/Key information from query
                this.$refs.TitleBar.$refs.SearchBar.value = query.keys.replaceAll("  ", " ").trim();

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

                console.log(query);
                this.$refs.MainContent.$refs.TopArea.$data.query = query;
                this.$refs.MainContent.$refs.Results.$data.query = query;
                this.$refs.MainContent.$refs.Results.reset();
            },
            async loadTheme(){
                let prefs = await electron.ipcRenderer.invoke("getPrefs");
                this.theme = prefs.theme;
            }
        },
        data() {
            return {
                settingsOpen: false,
                theme: 'theme-dark'
            };
        },
        async beforeCreate () {
            let prefs = await electron.ipcRenderer.invoke("getPrefs");
            this.theme = prefs.theme;
        }
    }
</script>

<style lang="scss">
    @import './styles/globals.scss';

    @import './styles/themes/chroma.scss';
    @import './styles/themes/dark.scss';
    @import './styles/themes/dracula.scss';
    @import './styles/themes/light.scss';
    @import './styles/themes/purple.scss';

    @import './styles/components/MainContent.scss';
    @import './styles/components/PlayBar.scss';
    @import './styles/components/Results.scss';
    @import './styles/components/Settings.scss';
    @import './styles/components/TitleBar.scss';
    @import './styles/components/TopArea.scss';

    @import './styles/inputs/Button.scss';
    @import './styles/inputs/FileSelector.scss';
    @import './styles/inputs/SearchBar.scss';
    @import './styles/inputs/Select.scss';
    @import './styles/inputs/Slider.scss';
    @import './styles/inputs/Switch.scss';
    @import './styles/inputs/Tag.scss';

    .popup-enter-active,
    .popup-leave-active {
        transition: all $animation-duration-alt $animation-timing-alt;
    }

    .popup-enter-from, .popup-leave-to{
        transform: translate(-50%, calc(-50% + 64px)) scale(.97);
        opacity: 0;
        box-shadow: 0px 0px 0px 0px #000;
    }

    .popup-enter-to, .popup-leave-from{
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }

    body{
        margin: 0;
        background: $window-background;
        overflow-y: overlay;
    }
    .appRoot {
        color: var(--foreground-100);
        font-size: $font-size;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background: $window-background;
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
        background: --scroll-thumb-color;
        &:hover{
            background: --scroll-thumb-color-hover;
        }
        border-radius: 10px;
    }
    @media only screen and (max-width: 800px) {
        .mono-value{
            letter-spacing: -.5px;
        }
        .info-duration{
            display: none;
        }
        .result{
            grid-template-columns: $profile-pic-large-size auto 6ch 5ch;
            gap: $item-gap / 1.5;
            row-gap: $item-gap / 2;
            grid-template-areas: 
                "p d k b "
                "v v a a ";
            .result-profile-pic{
                grid-area: p;
            }
            .visualizer{
                grid-area: v;
            }
            .actions-result{
                grid-area: a;
            }
            .info-key{
                grid-area: k;
            }
            .info-bpm{
                grid-area: b;
            }
            .info-audio{
                grid-area: d;
            }
        }
        .settings-window{
            flex-direction: column;
            .content{
                @include glass(true, true);
                background: var(--soft-glass-200);
                border-top-left-radius: 0;
                border-top-right-radius: 0;
                border-top: 1px solid var(--seperator);
            }
            .sidebar{
                @include glass(false, true);
                background: var(--glass-200);
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                border-bottom: none;
                .last{
                    position: relative;
                }
            }
            #sidebar-x{
                display: block;
            }
            #content-x{
                display: none;
            }
        }
    }
    @media only screen and (max-width: 600px) {
        h1{ font-size: $font-size * 5 * $scale; }
        .settings-window .content .inner-content .input-component {
            margin-left: 0px;
            width: 100%;
        }
        .settings-window {
            width: 100vw;
            height: 100vh;
            max-height: 100vh;
        }
    }
    @media only screen and (max-width: 500px) {
        .result{
            grid-template-columns: $profile-pic-large-size auto 6ch;
            grid-template-rows: auto;
            grid-template-areas: 
                "p d k"
                "p d b"
                "v v v"
                "a a a";
            .actions-result{
                width: 100%;
            }
        }
        h1{ font-size: $font-size * 4 * $scale; }
    }
    @media only screen and (max-width: 400px) {
        #topSearch{ display: none; }
        #bottomSearch{ display: block; }
        h1{ font-size: $font-size * 3 * $scale; }
    }
    @media only screen and (max-width: 300px) {
        .result{
            grid-template-columns: $profile-pic-large-size auto;
            grid-template-areas: 
                "p k"
                "p b"
                "d d"
                "v v"
                "a a";
        }
        .hide-bp-300{
            display: none;
        }
        h1{ font-size: $font-size * 2 * $scale; }
        .settings-window .vue-feather{
            display: none;
        }
    }
</style>
