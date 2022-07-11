<template>
  <div class="profile-page" v-if="artist">
    <div class="sidebar">
      <div class="sidebar-section">
        <VueFeather
          class="close-x"
          id="sidebar-x"
          type="x"
          size="18"
          @click="this.$emit('close')"
        />
        <div class="author-info" :class="{ truncated: !detailsExpanded }">
          <h2>About me</h2>
          <div class="info-el">
            <div class="info-heading">
              <VueFeather type="info" size="18" />
              <h3>Bio</h3>
            </div>
            <p>{{ artist.info.about }}</p>
          </div>
          <div class="info-el">
            <div class="info-heading">
              <VueFeather type="music" size="18" />
              <h3>My music sounds like...</h3>
            </div>
            <p>{{ artist.info.soundsLike }}</p>
          </div>
          <div class="info-el">
            <div class="info-heading">
              <VueFeather type="globe" size="18" />
              <h3>In my other life, I...</h3>
            </div>
            <p>{{ artist.info.extra }}</p>
          </div>
          <div class="details">
            <h2>Equipment</h2>
            <div class="info-el">
              <div class="info-heading">
                <VueFeather type="music" size="18" />
                <h3>Instruments</h3>
              </div>
              <ul
                v-if="
                  artist.info.using.instruments.split(/, *(and)? */g).length > 1
                "
              >
                <li
                  v-for="e in artist.info.using.instruments
                    .split(/, *(and)? */g)
                    .filter(Boolean)"
                  :key="e"
                >
                  {{ e }}
                </li>
              </ul>
              <p v-else>{{ artist.info.using.instruments }}</p>
            </div>
            <div class="info-el">
              <div class="info-heading">
                <VueFeather type="monitor" size="18" />
                <h3>Software</h3>
              </div>
              <ul
                v-if="
                  artist.info.using.software.split(/, *(and)? */g).length > 1
                "
              >
                <li
                  v-for="e in artist.info.using.software
                    .split(/, *(and)? */g)
                    .filter(Boolean)"
                  :key="e"
                >
                  {{ e }}
                </li>
              </ul>
              <p v-else>{{ artist.info.using.software }}</p>
            </div>
            <div class="info-el">
              <div class="info-heading">
                <VueFeather type="speaker" size="18" />
                <h3>Hardware</h3>
              </div>
              <ul
                v-if="
                  artist.info.using.hardware.split(/, *(and)? */g).length > 1
                "
              >
                <li
                  v-for="e in artist.info.using.hardware
                    .split(/, *(and)? */g)
                    .filter(Boolean)"
                  :key="e"
                >
                  {{ e }}
                </li>
              </ul>
              <p v-else>{{ artist.info.using.hardware }}</p>
            </div>
            <h2>Favorite Music</h2>
            <div class="info-el">
              <div class="info-heading">
                <VueFeather type="heart" size="18" />
                <h3>Listening to...</h3>
              </div>
              <ul
                v-if="artist.info.fav.general.split(/, *(and)? */g).length > 1"
              >
                <li
                  v-for="e in artist.info.fav.general
                    .split(/, *(and)? */g)
                    .filter(Boolean)"
                  :key="e"
                >
                  {{ e }}
                </li>
              </ul>
              <p v-else>{{ artist.info.fav.general }}</p>
            </div>
            <div class="info-el">
              <div class="info-heading">
                <VueFeather type="disc" size="18" />
                <h3>Albums</h3>
              </div>
              <ul
                v-if="artist.info.fav.albums.split(/, *(and)? */g).length > 1"
              >
                <li
                  v-for="e in artist.info.fav.albums
                    .split(/, *(and)? */g)
                    .filter(Boolean)"
                  :key="e"
                >
                  {{ e }}
                </li>
              </ul>
              <p v-else>{{ artist.info.fav.albums }}</p>
            </div>
            <div class="info-el">
              <div class="info-heading">
                <VueFeather type="user" size="18" />
                <h3>Artists</h3>
              </div>
              <ul
                v-if="artist.info.fav.artists.split(/, *(and)? */g).length > 1"
              >
                <li
                  v-for="e in artist.info.fav.artists
                    .split(/, *(and)? */g)
                    .filter(Boolean)"
                  :key="e"
                >
                  {{ e }}
                </li>
              </ul>
              <p v-else>{{ artist.info.fav.artists }}</p>
            </div>
          </div>
        </div>
        <div class="centered-btns" :class="{ expand: !detailsExpanded }">
          <Button @click="detailsExpanded = !detailsExpanded" secondary>
            Show {{ detailsExpanded ? "less" : "more" }}
          </Button>
        </div>
      </div>
      <div class="sidebar-section">
        <h2>More actions</h2>
        <div class="centered-btns" :class="{ expand: !detailsExpanded }">
          <Button>All loops</Button>
          <Button secondary>See original</Button>
        </div>
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
      <div class="header">
        <img :src="artist.profilePicUrl" class="banner-image" />
        <div class="inner">
          <img :src="artist.profilePicUrl" class="profile-image" />
          <div class="info">
            <h1>{{ artist.username }}</h1>
            <p>{{ artist.tagline }}</p>
            <p class="subtext">
              Joined {{ artist.info.joined }} - From {{ artist.info.from }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueFeather from "vue-feather";
import Button from "./inputs/Button.vue";

export default {
  name: "ProfilePage",
  props: {
    artist: Object,
  },
  data() {
    return {
      detailsExpanded: false,
    };
  },
  components: {
    VueFeather,
    Button,
  },
};
</script>
