<template>
  <div class="profile-page" v-if="artist">
    <div class="sidebar">
      <VueFeather
        class="close-x"
        id="sidebar-x"
        type="x"
        size="18"
        @click="this.$emit('close')"
      />
      <h2>{{ artist.username }}</h2>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfilePage",
  props: {
    artist: Object,
  },
};
</script>
