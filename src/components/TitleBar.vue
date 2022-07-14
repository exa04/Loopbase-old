<template>
  <div class="title-bar" :class="{ reverse: platform == 'win32' }">
    <div class="window-btns win" v-if="platform == 'win32'">
      <vue-feather
        class="hitbox-ico"
        size="18"
        @click="triggerWindowInteraction('minimize')"
      />
      <vue-feather
        class="hitbox-ico"
        size="16"
        @click="triggerWindowInteraction('resize')"
      />
      <vue-feather
        class="hitbox-ico"
        size="20"
        @click="triggerWindowInteraction('close')"
      />
    </div>
    <div class="window-btns mac" v-else-if="platform == 'darwin'">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <SearchBar
      placeholder="Search for loops..."
      @submitSearch="this.$parent.search()"
      ref="SearchBar"
      id="topSearch"
    />
    <div class="actions">
      <vue-feather
        size="24"
        type="folder"
        class="hitbox-ico"
        @click="revealFile('')"
      ></vue-feather>
      <vue-feather
        size="24"
        type="settings"
        class="hitbox-ico"
        @click="this.$emit('settingsOpen')"
      ></vue-feather>
    </div>
  </div>
</template>

<script>
import VueFeather from "vue-feather";
import SearchBar from "./inputs/SearchBar";
const electron = window.require("electron");

export default {
  components: {
    VueFeather,
    SearchBar,
  },
  data() {
    return {
      platform: "",
    };
  },
  methods: {
    revealFile(f) {
      electron.ipcRenderer.invoke("revealFile", f);
    },
    triggerWindowInteraction(interaction) {
      electron.ipcRenderer.invoke("interactWindow", interaction);
    },
  },
  async beforeCreate() {
    this.platform = await electron.ipcRenderer.invoke("getPlatform");
  },
};
</script>
