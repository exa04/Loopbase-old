<template>
  <div class="settings-window settings">
    <div class="sidebar">
      <VueFeather
        class="close-x"
        id="sidebar-x"
        type="x"
        size="18"
        @click="this.$emit('close')"
      />
      <h2>Settings</h2>
      <a>
        <VueFeather type="search" size="18" />
        <span> Search &amp; Content </span>
      </a>
      <a>
        <VueFeather type="edit-2" size="18" />
        <span> Appearance </span>
      </a>
      <a>
        <VueFeather type="code" size="18" />
        <span> Advanced </span>
      </a>
      <div class="last">
        <a
          @click="
            openLink('https://github.com/StarburstAudio/loopbase/issues/new')
          "
        >
          <VueFeather type="alert-triangle" size="18" />
          <span> Bugs &amp; Suggestions </span>
        </a>
        <p id="version-string">
          Loopbase version
          <br />
          {{ version }}
        </p>
      </div>
    </div>
    <div class="content">
      <VueFeather
        class="close-x"
        id="content-x"
        type="x"
        size="18"
        @click="this.$emit('close')"
      />
      <div class="inner-content" v-if="prefsLoaded">
        <h1>Settings</h1>
        <div class="section">
          <h2>
            <span class="ico-heading">
              <VueFeather type="search" size="18" />
            </span>
            <span>Search &amp; Content</span>
          </h2>
          <h3>Directories</h3>
          <p>
            If you change the samples directory, your previously downloaded
            samples will stay in the old one. You can migrate them yourself, but
            you will also have to re-link them in your project files!
          </p>
          <FileSelector
            title="Samples"
            openBtn
            class="input-component"
            @update:modelValue="(v) => (prefs.dir.content = v)"
            :modelValue="prefs.dir.content"
          ></FileSelector>
          <h3>Keys</h3>
          <p>
            These settings don't affect your actual keys, just the way that they
            are displayed.
          </p>
          <Switch
            title="Germanic key labels"
            class="input-component big"
            :modelValue="prefs.keys.germanic"
            @update:modelValue="(v) => (prefs.keys.germanic = v)"
          />
          <Switch
            title="Mode accurate key labels"
            class="input-component big"
            :modelValue="prefs.keys.modeAccurate"
            @update:modelValue="(v) => (prefs.keys.modeAccurate = v)"
          />
          <h3>Searching</h3>
          <Switch title="Smart filters" class="input-component big" />
        </div>
        <div class="section">
          <h2>
            <span class="ico-heading">
              <VueFeather type="edit-2" size="18" />
            </span>
            <span>Appearance</span>
          </h2>
          <h3>Theme</h3>
          <p>
            Some features, like native title bar and compact mode, require
            restarting the app.
          </p>
          <p>{{ prefs }}</p>
          <Select
            :options="
              hasKdeTheme
                ? themes.concat([['theme-kde-native', kdeThemeName]])
                : themes
            "
            class="input-component"
            :selected="prefs.theme"
            @selectOption="(o) => (prefs.theme = o)"
            >Theme</Select
          >
          <Switch
            title="Compact mode"
            class="input-component big"
            :modelValue="prefs.compactMode"
            @update:modelValue="(v) => (prefs.compactMode = v)"
          />
          <Switch title="Reduced motion" class="input-component big" />
          <h3>Navigation</h3>
          <Switch title="Native title bar" class="input-component big" />
          <Switch title="Sidebar" class="input-component big" />
        </div>
        <div class="section">
          <h2>
            <span class="ico-heading">
              <VueFeather type="code" size="18" />
            </span>
            <span>Advanced</span>
          </h2>
          <h3>Settings</h3>
          <div class="input-component">
            <Button secondary class="il-block">Reset all settings</Button>
            <Button tertiary class="il-block">Export</Button>
            <Button tertiary class="il-block">Import</Button>
          </div>
          <h3>Code</h3>
          <Switch
            title="Send anonymous usage statistics"
            class="input-component big"
          />
          <div class="input-component">
            <Button secondary class="il-block">Patch Notes</Button>
            <Button tertiary class="il-block">Source Code</Button>
          </div>
        </div>
      </div>
      <div class="action-pair">
        <div
          class="subtext unsaved-warn"
          v-if="JSON.stringify(prefs) !== JSON.stringify(originalPrefs)"
        >
          <VueFeather type="alert-triangle" class="centered il-block" />
          You have unsaved changes!
        </div>
        <div>
          <Button class="il-block" secondary @click="this.$emit('close')">
            Cancel
          </Button>
          <Button
            class="il-block"
            @click="
              savePrefs();
              this.$emit('close');
            "
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueFeather from "vue-feather";
import Button from "./inputs/Button.vue";
import Select from "./inputs/Select.vue";
import Switch from "./inputs/Switch.vue";
import FileSelector from "./inputs/FileSelector.vue";
const electron = window.require("electron");

export default {
  name: "Settings",
  components: {
    VueFeather,
    Button,
    FileSelector,
    Select,
    Switch,
  },
  props: {
    hasKdeTheme: {
      type: Boolean,
      default: false,
    },
    kdeThemeName: {
      type: String,
      default: "System theme",
    },
  },
  data() {
    return {
      version: String,
      prefs: Object,
      originalPrefs: Object,
      prefsLoaded: false,
      themes: [
        ["theme-chroma", "Chroma"],
        ["theme-dark", "Dark"],
        ["theme-dino", "Dino"],
        ["theme-dracula", "Dracula"],
        ["theme-light", "Light"],
        ["theme-purple", "Purple"],
      ],
    };
  },
  methods: {
    openLink(url) {
      electron.ipcRenderer.invoke("openLink", url);
    },
    savePrefs() {
      let p = JSON.parse(JSON.stringify(this.prefs));
      electron.ipcRenderer.invoke("setPrefs", p);
      this.originalPrefs = p;
    },
  },
  async beforeCreate() {
    this.version = await electron.ipcRenderer.invoke("getVersion");

    let prefs = await electron.ipcRenderer.invoke("getPrefs");
    this.prefs = JSON.parse(JSON.stringify(prefs));
    this.originalPrefs = JSON.parse(JSON.stringify(prefs));
    this.prefsLoaded = true;
  },
};
</script>
