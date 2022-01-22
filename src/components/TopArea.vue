<template>
    <div class="top-area">
        <p ref="LibraryName" class="LibraryName">{{library_name}}</p>
        <h1>{{section_name}}</h1>
        <div class="tags-container" v-if="search_header">
            <div class="tags-left">
                <div>
                    <div class="tag active">
                        <vue-feather type="activity" size="18"/>
                        <div>Tempo</div>
                    </div>
                    <div class="tag-popout">
                        <h2>Tempo</h2>
                        <Switch
                            title="Range"
                            v-model="queryInfo.tempoRange"
                        />
                        <vue-slider
                            v-model="position"
                            id="playbackSlider"
                            ref="playbackSlider"
                            :lazy="true"
                            min="0"
                            max="1"
                            interval=".0001"
                            @drag-start="dragging = true"
                            @drag-end="dragging = false; positionToAudio()"
                            tooltip="none"
                        />
                        <div class="button-duo">
                            <Button>Apply</Button>
                            <Button secondary>Cancel</Button>
                        </div>
                    </div>
                </div>
                <div class="tag">
                    <vue-feather type="music" size="18"/> 
                    <div>Key</div>
                </div>
                <div class="tag">
                    <div>Instrument</div>
                </div>
                <div class="tag">
                    <div>Genre</div>
                </div>
            </div>
            <div class="tag-duo">
                <div>Sort by date</div>
                <vue-feather type="chevron-down" size="18"/> 
            </div>
        </div>
        <div class="results-header" v-if="search_header">
            <div style="width: 52px">User</div>
            <div style="flex-grow: 1">Title</div>
            <div style="width: 68px">Key</div>
            <div style="width: 183px">Tempo</div>
        </div>
    </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    import VueSlider from 'vue-slider-component';
    import Switch from './inputs/Switch';
    import Button from './inputs/Button';
    export default {
        name: "TopArea",
        components: {
            VueFeather,
            VueSlider,
            Switch,
            Button
        },
        props: {
            library_name: String,
            section_name: String,
            search_header: Boolean
        },
        data() {
            return {
                queryInfo: {
                    category:       'loops',
                    order:          ['date', 'd'],
                    tempo:          [0,200],
                    tempoRange:     false,
                    key:            ['c', ''],
                    date:           0,
                    genre:          0,
                    filterByKey:    false,
                },
                filterEnabled: {
                    tempo: false,
                    key: false
                }
            }
        },
        methods:{
            sendQuery(){
                this.$parent.search();
            }
        }
    }
</script>

<style lang="scss">
    @import '../styles/globals.scss';

    .top-area{
        padding: $side-padding;
        padding-bottom: $item-gap;
        border-bottom: 1px solid $background-300;
        h1{
            max-width: $max-content-width;
            margin: auto;
        }
    }
    .LibraryName{
        max-width: $max-content-width;
        margin: auto;
        color: $foreground-200;
    }
    .tags-container{
        max-width: $max-content-width;
        margin: auto;
        margin-top: $item-gap;
    }
    .tags-container, .tags-left{
        display: flex;
        flex-grow: 1;
        gap: $item-gap;
    }
    .tag, .tag-duo > *{
        float: left;
        display: flex;
        gap: 8px;
        height: $item-scale;
        padding: 8px;
        padding-top: 4px;
        padding-bottom: 4px;
        background: rgba($foreground-100, .2);
        border-radius: $radius;
        box-shadow: inset 0 0 0px 2px $foreground-100;
        font-weight: 900;
        cursor: pointer;
        transition-duration: $animation-duration;
        transition-timing-function: $animation-timing;
        &:hover{
            background: rgba($foreground-100, .4);
        }
        &:active{
            background: rgba($foreground-100, .3);
        }
        &.active{
            background: rgba($accent-1, .3);
            box-shadow: inset 0 0 0px 2px $accent-1;
            &:hover{
                background: rgba($accent-1, .4);
            }
            &:active{
                background: rgba($accent-1, .3);
            }
        }
    }
    .tag-duo{
        display: flex;
        div{
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        i {
            margin-left: -2px;
            padding-left: 8px;
            padding-right: 8px;
            padding-top: 4px;
            padding-bottom: 4px;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
    .tag-popout{
        @include glass-box(false);
        width: 200px;
        height: fit-content;
        position: absolute;
        transform: translateY($item-scale + $item-gap);
        padding: $side-padding;
        z-index: 2;
        > *{
            margin-bottom: $item-gap / 2;
        }
    }
    .results-header{
        display: flex;
        gap: $item-gap;
        color: $foreground-200;
        max-width: $max-content-width;
        margin: auto;
        margin-top: $item-gap;
    }
</style>