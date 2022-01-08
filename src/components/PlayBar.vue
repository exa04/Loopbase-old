<template>
    <div ref="PlayBar" class="play-bar">
        <div ref="InfoArea" class="info-audio">
            <img ref="ProfilePicture" :src="profile_picture" class="profile-picture">
            <div class="audio-desc">
                <div ref="LoopName" class="desc-title">{{title}}</div>
                <div ref="ArtistName" class="desc-artist">{{info}}</div>
            </div>
        </div>
        <div class="playback-controls">
            <vue-feather type="skip-back" size="18"></vue-feather>
            <vue-feather type="play" size="18"></vue-feather>
            <vue-feather type="skip-forward" size="18"></vue-feather>
        </div>
        <Slider
            v-model="position"
            :tooltips="false"
            id="playbackSlider"
            :min="0"
            :step="0.001"
            :max="1"
        />
        <vue-feather type="volume-x" size="18" v-if="volume==0"></vue-feather>
        <vue-feather type="volume" size="18" v-else-if="volume < 33"></vue-feather>
        <vue-feather type="volume-1" size="18" v-else-if="volume < 67"></vue-feather>
        <vue-feather type="volume-2" size="18" v-else></vue-feather>
        <Slider
            v-model="volume"
            showTooltip="drag"
            id="volumeSlider"
            :lazy="false"
            :min="0"
            :step="1"
            :max="100"
        />
    </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    import Slider from '@vueform/slider'
    export default {
        name:'PlayBar',
        components: {
            VueFeather,
            Slider
        },
        props: {
            title: String,
            info: String,
            profile_picture: String
        },
        data() {
            return {
                position: 0,
                volume: 100
            }
        }
    }
</script>

<style lang="scss">
    @import "../styles/globals.scss";
    @import "@vueform/slider/themes/default.scss";

    .play-bar{
        background-color: $playbar-background;
        padding: 0 $side-padding;
        gap: $side-padding;
        height: 90px;
        align-items: center;
        display: flex;
        border-top: 1px solid $seperator;
    }
    .info-audio{
        display: flex;
        align-items: center;
        flex-grow: 2;
        height: 100%;
        @include side-gradient(to right, $playbar-background);
    }
    .profile-picture{
        width: 36px;
        image-rendering: crisp-edges;
        border-radius: $radius;
    }
    .audio-desc{
        margin-left: $item-gap / 2;
        div{
            width: max-content;
        }
        overflow: hidden;
        width: 10px;
        flex-grow: 1;
    }
    .playback-controls{
        display: flex;
        gap: $item-gap;
        align-items: center;
    }
    .slider-target{
        flex-grow: 2;
    }
    #volumeSlider{
        flex-grow: 1;
    }
</style>