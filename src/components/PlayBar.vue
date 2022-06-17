<template>
  <div
    ref="PlayBar"
    class="play-bar"
    v-bind:class="{ hidden: res.title == undefined }"
  >
    <audio
      id="audioPlayer"
      ref="audioPlayer"
      :loop="loop"
      :volume="volume / 100"
      @timeupdate="setPlaybackPos()"
    />
    <div ref="InfoArea" class="info-audio hide-bp-400">
      <img
        ref="ProfilePicture"
        :src="res.profile_pic"
        class="profile-picture"
      />
      <div class="audio-desc">
        <div ref="LoopName" class="desc-title">{{ res.title }}</div>
        <div ref="ArtistName" class="desc-artist subtext">
          {{ res.author }} | {{ res.tempo }} | {{ res.key }}
        </div>
      </div>
    </div>
    <div class="player-controls">
      <div class="player-buttons">
        <vue-feather class="icon-btn hitbox-ico" type="heart" />
        <vue-feather
          class="icon-btn hitbox-ico"
          type="skip-back"
          @click="this.$parent.$refs.MainContent.$refs.Results.skip(-1)"
        />
        <vue-feather
          class="icon-btn hitbox-ico"
          :type="
            this.$refs.audioPlayer == undefined || this.$refs.audioPlayer.paused
              ? 'play'
              : 'pause'
          "
          :class="{
            active: !(
              this.$refs.audioPlayer == undefined ||
              this.$refs.audioPlayer.paused
            ),
          }"
          @click="togglePlay()"
        />
        <vue-feather
          class="icon-btn hitbox-ico"
          type="skip-forward"
          @click="this.$parent.$refs.MainContent.$refs.Results.skip(1)"
        />
        <vue-feather
          class="icon-btn hitbox-ico"
          type="repeat"
          @click="loop = !loop"
          :class="{ active: loop }"
        />
      </div>
      <vue-slider
        v-model="position"
        id="playbackSlider"
        ref="playbackSlider"
        :lazy="true"
        :min="0"
        :max="1"
        :interval="0.0001"
        @drag-start="dragging = true"
        @drag-end="
          dragging = false;
          positionToAudio();
        "
        tooltip="none"
        :dragOnClick="true"
      />
    </div>
    <div class="side-playbar-controls">
      <vue-feather
        type="folder"
        v-if="res.downloaded"
        class="icon-btn hitbox-ico"
        @click="
          this.$parent.$refs.MainContent.$refs.Results.revealFile(res.localPath)
        "
      />
      <vue-feather type="clock" v-else-if="res.downloading" class="icon-btn" />
      <vue-feather
        type="download"
        v-else
        class="icon-btn hitbox-ico"
        @click="this.$parent.$refs.MainContent.$refs.Results.download(res)"
      />
      <vue-feather
        class="icon-btn hitbox-ico hide-bp-500"
        type="link"
        @click="
          this.$parent.$refs.MainContent.$refs.Results.openLink(res.web_link)
        "
      />
      <vue-feather
        class="icon-btn hitbox-ico hide-bp-500"
        type="user"
        @click="this.$parent.$refs.MainContent.$refs.Results.openProfile(res)"
      />
      <vue-feather
        class="icon-btn active hitbox-ico default-slider"
        type="volume-x"
        v-if="volume == 0"
        @click="volume = prevVolume"
      />
      <div
        v-else
        @click="
          prevVolume = volume;
          volume = 0;
        "
        class="default-slider"
        style="height: 18px"
      >
        <vue-feather
          class="icon-btn hitbox-ico"
          type="volume"
          v-if="volume < 33"
        ></vue-feather>
        <vue-feather
          class="icon-btn hitbox-ico"
          type="volume-1"
          v-else-if="volume < 67"
        ></vue-feather>
        <vue-feather
          class="icon-btn hitbox-ico"
          type="volume-2"
          v-else-if="volume >= 67"
        ></vue-feather>
      </div>
      <vue-slider
        v-model="volume"
        id="volumeSlider"
        :min="0"
        :max="100"
        class="default-slider"
      />
      <div id="volume-btt-spacer"></div>
      <div id="volumeSlider-btt">
        <vue-slider
          v-model="volume"
          :min="0"
          :max="100"
          direction="btt"
          class="btt-slider"
        />
        <vue-feather
          class="icon-btn active hitbox-ico"
          type="volume-x"
          v-if="volume == 0"
          @click="volume = prevVolume"
        />
        <div
          v-else
          @click="
            prevVolume = volume;
            volume = 0;
          "
          style="height: 18px margin-bottom = calc(var(--item-gap) * -1)"
        >
          <vue-feather
            class="icon-btn hitbox-ico"
            type="volume"
            v-if="volume < 33"
          ></vue-feather>
          <vue-feather
            class="icon-btn hitbox-ico"
            type="volume-1"
            v-else-if="volume < 67"
          ></vue-feather>
          <vue-feather
            class="icon-btn hitbox-ico"
            type="volume-2"
            v-else-if="volume >= 67"
          ></vue-feather>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueFeather from "vue-feather";
import VueSlider from "vue-slider-component";

export default {
  name: "PlayBar",
  components: {
    VueFeather,
    VueSlider,
  },
  props: {},
  methods: {
    loadSample(res) {
      let audio = document.getElementById("audioPlayer");
      if (audio == undefined) return;
      if (res.mp3_url == audio.src) {
        if (audio.currentTime == audio.duration) {
          audio.currentTime = 0;
        }
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
        return;
      }
      this.$data.res = res;
      audio.src = this.$data.res.mp3_url;
      audio.play();
    },
    togglePlay() {
      let audio = document.getElementById("audioPlayer");
      if (audio == undefined) return;
      if (audio.paused) {
        audio.play();
        this.$parent.$refs.MainContent.$refs.Results.paused = false;
      } else {
        audio.pause();
        this.$parent.$refs.MainContent.$refs.Results.paused = true;
      }
    },
    getPlaybackPos() {
      let audio = document.getElementById("audioPlayer");
      if (audio == undefined) return 0;
      if (!this.$data.dragging) return audio.currentTime / audio.duration;
    },
    setPlaybackPos() {
      let audio = document.getElementById("audioPlayer");
      if (audio == undefined) return 0;
      this.$data.position = audio.currentTime / audio.duration;
    },
    getDuration() {
      let audio = document.getElementById("audioPlayer");
      if (audio == undefined) return 0;
      return audio.duration;
    },
    positionToAudio() {
      let audio = document.getElementById("audioPlayer");
      if (audio == undefined) return 0;
      setTimeout(
        (audio.currentTime = audio.duration * this.$data.position),
        10
      );
    },
  },
  data() {
    return {
      position: 0,
      volumePercent: 100,
      loop: false,
      res: {},
      info: "",
      url: "",
      localUrl: "",
      volume: 100,
      prevVolume: 100,
      dragging: false,
    };
  },
};
</script>
