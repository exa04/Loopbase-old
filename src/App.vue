<template>
  <div
    :class="theme + ' ' + (compactMode ? 'sizing-compact' : 'sizing-regular')"
    class="appRoot"
  >
    <Transition name="popup">
      <Settings
        ref="Settings"
        v-if="settingsOpen"
        @close="
          settingsOpen = false;
          loadTheme();
        "
      />
    </Transition>
    <Transition name="popup">
      <ProfilePage
        v-if="profilePageOpen"
        @close="profilePageOpen = false"
        :artist="{
          username: 'stxarixdust',
          profilePicUrl:
            'https://www.looperman.com/media/avatars/med/looperman-avatar-02420154.jpg',
          tagline: 'Audio dev and interdisciplinary designer',
          info: {
            about:
              'Sound/Graphic/*-Designer, Musician. I also develop software. Getting into VST development.',
            soundsLike:
              'A lot of different stuff, I don\'t have a musical project with a fixed aesthetic.',
            extra:
              'Design, program, do whatever I spontaneously decide to hyper-fixate upon, try to finish high school.',
            from: 'Göttingen, Germany',
            joined: 'Tue 3rd Oct 2017, 4 years ago',
            using: {
              instruments: 'computer!! beep boop!',
              software: 'FL Studio, Ableton Live, Bitwig, and a ton of VSTs',
              hardware:
                'Ryzen 7 3700x octacore, 16gb RAM, 1TB SSD, GTX 1050ti, some old ThinkPad.',
            },
            fav: {
              general:
                'iglooghost, 7038634357, varg, flume, sophie, bladee, ecco2k',
              albums:
                'drain gang - trash island, iglooghost - lei line eon, 1788-l - sentience, villovilduveta - langtan far vingar, porter robinson - worlds, 100 gecs - 1000 gecs',
              artists: 'Whatever\'s on my Pinterest feed atm.',
            },
          },
        }"
      />
    </Transition>
    <TitleBar ref="TitleBar" @settingsOpen="settingsOpen = !settingsOpen" />
    <MainContent ref="MainContent" />
    <PlayBar ref="PlayBar" />
  </div>
</template>

<script>
import TitleBar from "./components/TitleBar.vue";
import MainContent from "./components/MainContent.vue";
import PlayBar from "./components/PlayBar.vue";
import Settings from "./components/Settings.vue";
import ProfilePage from "./components/ProfilePage.vue";
import "@fontsource/rubik/400.css";
import "@fontsource/rubik/600.css";
import "@fontsource/rubik/700.css";
import "@ibm/plex/scss/ibm-plex.scss";

const electron = window.require("electron");

export default {
  name: "App",
  components: {
    TitleBar,
    MainContent,
    PlayBar,
    ProfilePage,
    Settings,
  },
  methods: {
    search() {
      let originalQuery = this.$refs.TitleBar.$refs.SearchBar.value;
      let topBarQuery = JSON.parse(
        JSON.stringify(this.$refs.MainContent.$refs.TopArea.queryInfo)
      );
      let query = {
        category: topBarQuery.category,
        keys: "",
        order: topBarQuery.order,
        tempo: topBarQuery.tempo,
        page: 1,
        key: topBarQuery.key,
        date: topBarQuery.date,
        genre: topBarQuery.genre,
        filterByKey: topBarQuery.key[0] != "",
        author: topBarQuery.author,
      };

      // This matches every ocurrence of (NUMBER) BPM in the query
      let bpmregex = /[0-9]+ *bpm(?: |$)/gi;
      let bpmtext = Array.from(originalQuery.matchAll(bpmregex));
      query.keys = originalQuery.replaceAll(bpmregex, "");

      if (bpmtext.length > 0) {
        query.tempo = bpmtext.pop()[0].match(/[1-9][0-9]*/)[0];
        query.tempo = [Number(query.tempo), Number(query.tempo)];
        this.$refs.MainContent.$refs.TopArea.setTempo(query.tempo);
      }

      // This matches every occurence of a key in the query
      let keyregex = /([a-g]|A-G) *[#b]? *(maj|min)(or)?(?: |$)/gi;
      let keytext = Array.from(originalQuery.matchAll(keyregex));
      query.keys = query.keys.replaceAll(keyregex, "");

      // Remove BPM/Key information from query
      this.$refs.TitleBar.$refs.SearchBar.value = query.keys
        .replaceAll("  ", " ")
        .trim();

      if (keytext.length > 0) {
        query.filterByKey = true;
        let keymatch = keytext.pop()[0].toLowerCase();
        let note = keymatch[0];
        if (keymatch[1] == "#") note += "s";
        if (keymatch[1] == "b") {
          let charcode = keymatch.charCodeAt(1) - "a".charCodeAt(0) + 1;
          charcode %= 8;
          charcode += "a".charCodeAt(0);
          note = String.fromCharCode(charcode);
        }
        query.key = [
          note,
          keymatch.match(/(maj|min)/i)[0].toLowerCase() == "min" ? "m" : "",
        ];
      }

      console.log(query);
      this.$refs.MainContent.$refs.TopArea.$data.query = JSON.parse(
        JSON.stringify(query)
      );
      this.$refs.MainContent.$refs.Results.$data.query = JSON.parse(
        JSON.stringify(query)
      );
      this.$refs.MainContent.$refs.Results.reset();
    },
    async loadTheme() {
      let prefs = await electron.ipcRenderer.invoke("getPrefs");
      this.theme = prefs.theme;
      this.compactMode = prefs.compactMode;
    },
  },
  data() {
    return {
      settingsOpen: false,
      profilePageOpen: true,
      theme: "theme-dark",
      compactMode: false,
    };
  },
  async beforeCreate() {
    let prefs = await electron.ipcRenderer.invoke("getPrefs");
    this.theme = prefs.theme;
    this.compactMode = prefs.compactMode;
  },
};
</script>

<style lang="scss">
@import "./styles/sizing-regular.scss";
@import "./styles/sizing-compact.scss";
@import "./styles/globals.scss";

@import "./styles/themes/chroma.scss";
@import "./styles/themes/dark.scss";
@import "./styles/themes/dracula.scss";
@import "./styles/themes/light.scss";
@import "./styles/themes/purple.scss";
@import "./styles/themes/dino.scss";

@import "./styles/components/MainContent.scss";
@import "./styles/components/PlayBar.scss";
@import "./styles/components/ProfilePage.scss";
@import "./styles/components/Results.scss";
@import "./styles/components/Settings.scss";
@import "./styles/components/TitleBar.scss";
@import "./styles/components/TopArea.scss";

@import "./styles/inputs/Button.scss";
@import "./styles/inputs/FileSelector.scss";
@import "./styles/inputs/SearchBar.scss";
@import "./styles/inputs/Select.scss";
@import "./styles/inputs/Slider.scss";
@import "./styles/inputs/Switch.scss";
@import "./styles/inputs/Tag.scss";

.popup-enter-active,
.popup-leave-active {
  transition: all var(--animation-duration-alt) var(--animation-timing-alt);
}

.popup-enter-from,
.popup-leave-to {
  transform: translateY(calc(64px)) scale(0.97);
  opacity: 0;
  box-shadow: 0px 0px 0px 0px #000;
}

.popup-enter-to,
.popup-leave-from {
  transform: none;
  opacity: 1;
}

body {
  margin: 0;
  overflow-y: overlay;
}

.appRoot {
  color: var(--foreground-100);
  font-size: var(--font-size);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--background-200);
  .title-bar {
    top: 0;
  }
  .title-bar,
  .play-bar {
    z-index: 5;
    position: fixed;
    box-sizing: border-box;
    width: 100%;
  }
  .main-content {
    z-index: -1;
  }
  .play-bar {
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
  transition: var(--animation-duration);
  background: var(--scroll-thumb-color);
  &:hover {
    background: var(--scroll-thumb-color-hover);
  }
  border-radius: 10px;
}
@media only screen and (max-width: 1200px) {
  h1 {
    font-size: calc(
      var(--font-size) * var(--heading-scale) * var(--heading-scale) *
        var(--heading-scale) * var(--heading-scale) * var(--scale)
    );
  }
  .play-bar {
    .player-controls .player-buttons,
    .side-playbar-controls {
      gap: var(--item-gap);
    }
  }
}
@media only screen and (max-width: 800px) {
  .mono-value {
    letter-spacing: -0.5px;
  }
  .info-duration {
    display: none;
  }
  .result {
    grid-template-columns: var(--profile-pic-large-size) auto 6ch 5ch;
    gap: calc(var(--item-gap) / 1.5);
    row-gap: calc(var(--item-gap) / 2);
    grid-template-areas:
      "p d k b "
      "v v a a ";
    .result-profile-pic {
      grid-area: p;
    }
    .visualizer {
      grid-area: v;
    }
    .actions-result {
      grid-area: a;
    }
    .info-key {
      grid-area: k;
    }
    .info-bpm {
      grid-area: b;
    }
    .info-audio {
      grid-area: d;
    }
  }
  .player-controls {
    flex-grow: 2;
    flex-shrink: 2;
  }
  #volume-btt-spacer,
  #volumeSlider-btt {
    display: block;
  }
  .play-bar .default-slider {
    display: none;
  }
  .play-bar .profile-picture {
    width: calc(var(--profile-pic-large-size) * 0.8);
  }
  .results-header {
    grid-template-columns: var(--profile-pic-large-size) auto 6ch 5ch;
    gap: calc(var(--item-gap) / 1.5);
  }
  .settings-window {
    flex-direction: column;
    .content {
      @include glass(true, true);
      background: var(--soft-glass-200);
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-top: 1px solid var(--seperator);
    }
    .sidebar {
      @include glass(false, true);
      background: var(--glass-200);
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;
      .last {
        position: relative;
      }
    }
    #sidebar-x {
      display: block;
    }
    #content-x {
      display: none;
    }
  }
}
@media only screen and (max-width: 600px) {
  .settings-window .content .inner-content .input-component {
    margin-left: 0px;
    width: 100%;
  }
  .play-bar .audio-desc {
    display: none;
  }
  .play-bar .info-audio {
    flex-grow: 0;
    -webkit-mask-image: none;
  }
  .settings-window {
    margin-left: -50vw;
    width: 100vw;
    height: calc(100vh - (2 * var(--side-padding)));
    margin-top: calc(-0.5 * (100vh - (2 * var(--side-padding))));
  }
}
@media only screen and (max-width: 500px) {
  .result {
    grid-template-columns: var(--profile-pic-large-size) auto 6ch;
    grid-template-rows: auto;
    grid-template-areas:
      "p d k"
      "p d b"
      "v v v"
      "a a a";
    .actions-result {
      width: 100%;
    }
  }
  .results-header {
    grid-template-columns: var(--profile-pic-large-size) auto auto;
    gap: calc(var(--item-gap) / 1.5);
    div:nth-of-type(3) {
      text-align: right;
      &::after {
        content: " & Tempo";
      }
    }
    div:nth-of-type(4) {
      display: none;
    }
  }
  .hide-bp-500 {
    display: none;
  }
  .play-bar .player-controls .player-buttons,
  .play-bar .side-playbar-controls {
    flex-grow: 0;
  }
  h1 {
    font-size: calc(
      var(--font-size) * var(--heading-scale) * var(--heading-scale) *
        var(--heading-scale) * var(--scale)
    );
  }
}
@media only screen and (max-width: 400px) {
  #topSearch {
    display: none;
  }
  #bottomSearch {
    display: block;
  }
  h1 {
    font-size: calc(
      var(--font-size) * var(--heading-scale) * var(--heading-scale) *
        var(--scale)
    );
  }
  .hide-bp-400 {
    display: none;
  }
  .settings-window {
    .content,
    .sidebar a,
    .sidebar h2,
    #version-string {
      padding-left: var(--item-gap);
      padding-right: var(--item-gap);
    }
    .sidebar,
    .content {
      padding-top: var(--item-gap);
    }
  }
}
@media only screen and (max-width: 300px) {
  .result {
    grid-template-columns: var(--profile-pic-large-size) auto;
    grid-template-areas:
      "p k"
      "p b"
      "d d"
      "v v"
      "a a";
  }
  .hide-bp-300 {
    display: none;
  }
  h1 {
    font-size: calc(var(--font-size) * var(--scale) * var(--heading-scale));
  }
  .settings-window .vue-feather,
  .settings-window .content .inner-content .section .ico-heading {
    display: none;
  }
}
</style>
