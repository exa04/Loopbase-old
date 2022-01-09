<template>
    <div class="result">
        <img :src="profile_picture" class="profile-picture-large">
        <div class="info-audio">
            <div class="audio-desc">
                <div ref="LoopName" class="desc-title">{{title}}</div>
                <div ref="ArtistName" class="desc-artist">{{artist}}</div>
            </div>
        </div>
        <img class="visualizer" :src="audio_waveform">
        <div class="mono-value secondary">{{duration}}</div>
        <div class="mono-value">{{key_scale}}</div>
        <div class="mono-value">{{tempo}}</div>
        <div class="actions-result">
            <vue-feather type="trash-2" size="18" v-if="downloaded" class="icon-btn"></vue-feather>
            <div class="icon-spacer" v-else/>
            <vue-feather type="folder" size="18" v-if="downloaded" class="icon-btn"></vue-feather>
            <vue-feather type="download" size="18" v-else class="icon-btn"></vue-feather>
            <vue-feather type="heart" size="18" id="like" v-bind:class="[{liked: liked}, 'like', 'icon-btn']"></vue-feather>
            <vue-feather type="link" size="18" class="icon-btn"></vue-feather>
        </div>
    </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    export default {
        components: {
            VueFeather
        },
        props: {
            title: String,
            artist: String,
            duration: String,
            key_scale: String,
            tempo: String,
            profile_picture: String,
            audio_waveform: String,
            downloaded: Boolean,
            liked: Boolean
        }
    }
</script>

<style lang="scss">
    @import "../styles/globals.scss";
    .result{
        box-sizing: border-box;
        width: 100%;
        display: flex;
        padding: $item-gap $side-padding;
        gap: $item-gap;
        height: 52px + 2 * $item-gap;
        align-items: center;
        .info-audio{
            @include side-gradient(to right, $window-background);
        }
        .audio-desc{
            margin-left: 0;
        }
        .actions-result{
            width: 125px - $item-gap;
            display: flex;
            justify-content: space-between;
        }
    }
    .profile-picture-large{
        width: 52px;
        border-radius: $radius;
    }
    .visualizer{
        height: 100%;
        flex-shrink: 1;
        flex-grow: 1;
    }
    .icon-spacer{
        width: 18px;
    }
    .like{
        &.liked svg{
            fill: $accent-1;
            stroke: $accent-1;
            &:hover{
                fill: rgba($accent-1, .3);
                stroke: $accent-1;
            }
            &:active{
                fill: rgba($accent-1, .5);
                stroke: $accent-1;
            }
        }
    }
</style>