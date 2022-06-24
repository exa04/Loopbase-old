<template>
  <div class="results" ref="resultsArea">
    <div
      class="result"
      v-for="(res, i) in resultsData"
      :key="res.mp3_url"
      @dragstart.prevent="if (res.downloaded) startDrag(res.localPath);"
      draggable="true"
      :class="{
        playing:
          resultsData[playing] != null &&
          res.mp3_url == resultsData[playing].mp3_url,
      }"
      @click.self="playResult(i)"
    >
      <div class="result-profile-pic">
        <img :src="res.profile_pic" class="profile-picture-large" />
        <div class="play-btn icon-btn" @click="playResult(i)">
          <vue-feather
            :type="
              resultsData[playing] != null &&
              res.mp3_url == resultsData[playing].mp3_url &&
              !paused
                ? 'pause'
                : 'play'
            "
          />
        </div>
      </div>
      <div class="info-audio">
        <div class="audio-desc">
          <div ref="LoopName" class="desc-title" @click="playResult(i)">
            {{ res.title }}
          </div>
          <div
            ref="AuthorName"
            class="desc-author subtext"
            @click="openProfile(res)"
          >
            {{ res.author }}
          </div>
        </div>
      </div>
      <img
        class="visualizer"
        :src="res.waveform"
        draggable="false"
        @click="playResult(i)"
      />
      <div class="mono-value info-duration" style="">
        {{ res.duration }}0:00
      </div>
      <div class="mono-value info-key">{{ res.key }}</div>
      <div class="mono-value info-tempo">{{ res.tempo }}</div>
      <div class="actions-result">
        <vue-feather
          type="trash-2"
          v-if="res.downloaded"
          class="icon-btn"
          @click="remove(res.localPath).then((res.downloaded = false))"
        />
        <div class="icon-spacer" v-else />
        <vue-feather
          type="folder"
          v-if="res.downloaded"
          class="icon-btn"
          @click="revealFile(res.localPath)"
        />
        <vue-feather
          type="clock"
          v-else-if="res.downloading"
          class="icon-btn"
        />
        <vue-feather
          type="download"
          v-else
          class="icon-btn"
          @click="download(res)"
        />
        <vue-feather
          type="heart"
          id="like"
          v-bind:class="[{ liked: false }, 'like', 'icon-btn']"
        />
        <vue-feather
          type="link"
          class="icon-btn"
          @click="openLink(res.web_link)"
        />
      </div>
    </div>
  </div>
  <VueEternalLoading
    :load="load"
    v-model:is-initial="isInitial"
    id="loading-section"
  >
    <template #loading>
      <LoadingIndicator />
    </template>
  </VueEternalLoading>
</template>

<script>
import VueFeather from "vue-feather";
const electron = window.require("electron");
import { VueEternalLoading } from "@ts-pro/vue-eternal-loading";
import LoadingIndicator from "./LoadingIndicator.vue";

export default {
  components: {
    VueFeather,
    VueEternalLoading,
    LoadingIndicator,
  },
  name: "ResultList",
  data() {
    return {
      resultsData: [],
      query: {
        category: "loops",
        keys: "",
        order: ["date", "d"],
        tempo: [0, 200],
        page: 1,
        key: ["c", ""],
        date: 0,
        genre: 0,
        filterByKey: false,
        author: "",
      },
      isInitial: false,
      playing: Number,
      paused: true,
    };
  },
  mounted() {
    window.addEventListener("keydown", this.keyPress);
  },
  umnounted() {
    window.removeEventListener("keydown", this.keyPress);
  },
  methods: {
    load({ loaded }) {
      electron.ipcRenderer
        .invoke("search", {
          category: this.query.category,
          keys: this.query.keys,
          order: [this.query.order[0], this.query.order[1]],
          tempo: [this.query.tempo[0], this.query.tempo[1]],
          page: this.query.page,
          key: [this.query.key[0], this.query.key[1]],
          date: this.query.date,
          genre: this.query.genre,
          filterByKey: this.query.filterByKey,
          author: this.query.author,
        })
        .then((res) => {
          // if(res.length < 0){
          //     return;
          // }
          res.forEach((r) => {
            r.filename = r.mp3_url.split("/").splice(-1)[0].split("?")[0];

            r.localPath =
              "loops/" +
              r.category.toLowerCase() +
              "/" +
              r.tempo.replace(" ", "_") +
              "_" +
              (r.key != "Unknown" ? r.key.toLowerCase() + "_" : "") +
              r.filename;

            let oldKey = r.key;
            if (oldKey == "Unknown") {
              r.key = "Unknown";
            } else {
              r.key = oldKey[0] + (oldKey[1] == "#" ? "#" : " ");
              if (oldKey.slice(-1) == "m") {
                r.key += " Minor";
              } else {
                r.key += " Major";
              }
            }

            if (r.tempo[2].match(/\d+/g) == null) {
              r.tempo = " " + r.tempo;
            }

            electron.ipcRenderer
              .invoke("fileExists", r.localPath)
              .then((exists) => {
                r.downloaded = exists;
                this.addResult(r);
              });
          });
          loaded(res.length, 10);
          this.query.page++;
        });
    },
    reset() {
      this.resultsData = [];
      this.isInitial = true;
    },
    addResult(res) {
      this.resultsData.push(res);
    },
    openLink(link) {
      electron.ipcRenderer.invoke("openLink", link);
    },
    async download(res) {
      res.downloading = true;
      return new Promise((resolve) => {
        electron.ipcRenderer
          .invoke("downloadMP3", {
            url: res.mp3_url,
            dest: res.localPath,
          })
          .then(() => {
            res.downloading = false;
            res.downloaded = true;
            resolve();
          });
      });
    },
    async remove(localPath) {
      return new Promise((resolve) => {
        electron.ipcRenderer.invoke("fileDelete", localPath).then(() => {
          resolve();
        });
      });
    },
    revealFile(path) {
      electron.ipcRenderer.invoke("revealFile", path);
    },
    startDrag(path) {
      electron.ipcRenderer.send("ondragstart", path);
    },
    playResult(i) {
      let playbar = this.$parent.$parent.$refs.PlayBar;
      let res = this.resultsData[i];
      if (!this.paused && res.mp3_url == this.playing) {
        playbar.togglePlay();
        this.paused = true;
        return;
      }
      playbar.loadSample(res);
      this.playing = i;
      this.paused = false;
    },
    skip(steps) {
      let i = this.playing + steps;
      if (this.playing != undefined) this.playResult(i);
      this.$refs.resultsArea.children[i].scrollIntoView({
        block: "center",
      });
    },
    openProfile(res) {
      this.$parent.$refs.TopArea.$data.queryInfo.author = res.author;
      this.$parent.$parent.search();
    },
    keyPress(e) {
      switch (e.key) {
        case "ArrowLeft":
          this.skip(-1);
          break;
        case "ArrowRight":
          this.skip(1);
          break;
        case " ":
          if (e.target.nodeName != "INPUT") {
            this.$parent.$parent.$refs.PlayBar.togglePlay();
            e.preventDefault();
          }
          break;
      }
    },
  },
};
</script>
