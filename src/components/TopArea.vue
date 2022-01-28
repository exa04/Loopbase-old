<template>
    <div class="top-area">
        <p ref="LibraryName" class="LibraryName">
            {{query.keys == undefined || query.keys == "" ? library_name : "Search results for:"}}</p>
        <h1>
            <span :if="query.keys == undefined || query.keys == ''">{{query.keys}}</span>
            {{section_name}}
        </h1>
        <div class="tags-container" v-if="search_header">
            <div class="tags-left">
                <div>
                    <div class="tag"
                        @click.self="filterEnabled.tempo = !filterEnabled.tempo;
                                filterValues.tempoRange = queryInfo.tempo"
                        :class="{ active: filterAdded.tempo }"
                    >
                        <vue-feather
                            type="activity"
                            size="18"
                            @click="filterEnabled.tempo = !filterEnabled.tempo;
                                    filterValues.tempoRange = queryInfo.tempo"
                        />
                        <div
                            @click="filterEnabled.tempo = !filterEnabled.tempo;
                                    filterValues.tempoRange = queryInfo.tempo"
                        >
                            Tempo{{filterAdded.tempo ? ": " + queryInfo.tempo[0] + " - " + queryInfo.tempo[1] + " BPM" : ""}}
                        </div>
                        <vue-feather
                            type="x"
                            size="18"
                            @click="filterAdded.tempo = false"
                            :class="{hidden: !filterAdded.tempo}"
                        />
                    </div>
                    <div class="tag-popout" :class="{ hidden: !filterEnabled.tempo }">
                        <h2>Tempo</h2>
                        <vue-slider
                            v-model="filterValues.tempoRange"
                            id="playbackSlider"
                            ref="playbackSlider"
                            :lazy="true"
                            min="0"
                            max="200"
                            interval="1"
                        />
                        <div class="button-duo"
                            @click="filterEnabled.tempo = false"
                        >
                            <Button
                                @click="queryInfo.tempo = filterValues.tempoRange;
                                filterAdded.tempo = true"
                            >
                                Apply
                            </Button>
                            <Button secondary @click="filterValues.tempoRange = queryInfo.tempo">Cancel</Button>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="tag"
                        @click.self="filterEnabled.key = !filterEnabled.key;
                                filterValues.key = queryInfo.key"
                        :class="{ active: filterAdded.key }"
                    >
                        <vue-feather
                            type="music"
                            size="18"
                            @click="filterEnabled.key = !filterEnabled.key;
                                    filterValues.key = queryInfo.key"
                        />
                        <div
                            @click="filterEnabled.key = !filterEnabled.key;
                                    filterValues.key = queryInfo.key"
                        >
                            Key
                        </div>
                        <vue-feather
                            type="x"
                            size="18"
                            @click="filterAdded.key = false"
                            :class="{hidden: !filterAdded.key}"
                        />
                    </div>
                    <div class="tag-popout" :class="{ hidden: !filterEnabled.key }">
                        <h2>Key</h2>
                        <div>
                            <div class="key-row sharps">
                                <div>C#</div>
                                <div class="selected">D#</div>
                                <div class="key-seperator"></div>
                                <div>F#</div>
                                <div>G#</div>
                                <div>A#</div>
                            </div>
                            <div class="key-row">
                                <div>C</div>
                                <div>D</div>
                                <div>E</div>
                                <div>F</div>
                                <div>G</div>
                                <div>A</div>
                                <div>B</div>
                            </div>
                        </div>
                        <div class="button-duo"
                            @click="filterEnabled.key = false"
                        >
                            <Button
                                @click="queryInfo.key = filterValues.key;
                                filterAdded.key = true"
                            >
                                Apply
                            </Button>
                            <Button secondary @click="filterValues.key = queryInfo.key">Cancel</Button>
                        </div>
                    </div>
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
    import Button from './inputs/Button';
    export default {
        name: "TopArea",
        components: {
            VueFeather,
            VueSlider,
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
                query : {

                },
                filterEnabled: {
                    tempo: false,
                    key: false
                },
                filterAdded: {
                    tempo: false,
                    key: false
                },
                filterValues: {
                    tempoRange:          [0,200],
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
        width: calc(100% + 1px);    // TODO: Find a better alternative to this questionable hack
        box-sizing: border-box;
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
        border-radius: $radius;
        font-weight: 900;
        cursor: pointer;
        transition-duration: $animation-duration;
        transition-timing-function: $animation-timing;
        background-color: $background-100;
        &:hover{ background: $background-300; }
        &:active{ background: $background-400; }
        &.active{
            background: $accent-1;
            &:hover{ background: darken($accent-1, 10%); }
            &:active{ background: darken($accent-1, 20%); }
            color: $foreground-100;
        }
        color: $foreground-200;
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
        @include glass($background-200, false, true);
        min-width: 200px;
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
    .hidden{
        transform: translateY($item-scale + $item-gap + 100px);
        display: none;
    }
    .key-row{
        display: flex;
        justify-content: center;
        > div{
            height: $item-scale;
            aspect-ratio: 1;
            display: flex;
            justify-content: center;
            padding: $item-gap / 4;
            background-color: $foreground-100;
            border-radius: 50%;
            margin: $item-gap / 8;
            transition-duration: $animation-duration;
            transition-timing-function: $animation-timing;
            color: $inverse-foreground;
            font-size: $font-size * .85;
            &:hover{
                background: $foreground-200;
            }
            &:active{
                background: $accent-2;
            }
            &.selected{
                background: $accent-2;
            }
            &.key-seperator{
                background-color: transparent !important;
            }
        }
    }
</style>