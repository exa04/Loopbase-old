<template>
    <div class="top-area">
        <p ref="LibraryName" class="LibraryName">
            {{query.keys == undefined || query.keys == "" ? library_name : "Search results for:"}}</p>
        <h1>
            <span :if="query.keys == undefined || query.keys == ''">{{query.keys}}</span>
            {{section_name}}
        </h1>
        <SearchBar
            placeholder="Search for loops..."
            @submitSearch="this.$parent.$parent.search()"
            ref="SearchBar"
            id="bottomSearch"
        />
        <div class="tags-container" v-if="search_header">
            <div class="tags-left">
                <Tag
                    title="Tempo"
                    :additionalInfo="(
                        queryInfo.tempo[0] == queryInfo.tempo[1] ?
                            queryInfo.tempo[0] :
                            queryInfo.tempo[0] + ' - ' + queryInfo.tempo[1]
                    ) + 'BPM'"
                    icon="activity"
                    @cancel="filterValues.tempoRange = queryInfo.tempo"
                    @save="queryInfo.tempo = filterValues.tempoRange"
                    @remove="queryInfo.tempo = [0,200]"
                >
                    <vue-slider
                        v-model="filterValues.tempoRange"
                        id="playbackSlider"
                        ref="playbackSlider"
                        :lazy="true"
                        :min="0"
                        :max="200"
                        :interval="1"
                    />
                </Tag>
                <Tag
                    title="Key"
                    :additionalInfo="
                        queryInfo.key[0].charAt(0).toUpperCase() +
                        (queryInfo.key[0].charAt(1) == 's' ? '#' : '') + ' ' +
                        (queryInfo.key[1] == 'm' ? 'Minor' : 'Major')
                    "
                    icon="music"
                    @cancel="filterValues.key = queryInfo.key"
                    @save="queryInfo.key = filterValues.key"
                    @remove="queryInfo.key = ['','']; queryInfo.filterByKey = false"
                >
                    <Switch
                        class="keyModeSwitch"
                        @update:modelValue="v => filterValues.key[1] = (v ? 'm' : '')"
                        :title="'Mode: ' + (filterValues.key[1] == 'm' ? 'Minor' : 'Major')"
                    />
                    <div>
                        <div class="key-row sharps">
                            <div @click="filterValues.key[0] = 'cs'" :class="{selected : filterValues.key[0] == 'cs'}">C#</div>
                            <div @click="filterValues.key[0] = 'ds'" :class="{selected : filterValues.key[0] == 'ds'}">D#</div>
                            <div class="key-seperator"></div>
                            <div @click="filterValues.key[0] = 'fs'" :class="{selected : filterValues.key[0] == 'fs'}">F#</div>
                            <div @click="filterValues.key[0] = 'gs'" :class="{selected : filterValues.key[0] == 'gs'}">G#</div>
                            <div @click="filterValues.key[0] = 'as'" :class="{selected : filterValues.key[0] == 'as'}">A#</div>
                        </div>
                        <div class="key-row">
                            <div @click="filterValues.key[0] = 'c'" :class="{selected : filterValues.key[0] == 'c'}">C</div>
                            <div @click="filterValues.key[0] = 'd'" :class="{selected : filterValues.key[0] == 'd'}">D</div>
                            <div @click="filterValues.key[0] = 'e'" :class="{selected : filterValues.key[0] == 'e'}">E</div>
                            <div @click="filterValues.key[0] = 'f'" :class="{selected : filterValues.key[0] == 'f'}">F</div>
                            <div @click="filterValues.key[0] = 'g'" :class="{selected : filterValues.key[0] == 'g'}">G</div>
                            <div @click="filterValues.key[0] = 'a'" :class="{selected : filterValues.key[0] == 'a'}">A</div>
                            <div @click="filterValues.key[0] = 'b'" :class="{selected : filterValues.key[0] == 'b'}">B</div>
                        </div>
                    </div>
                </Tag>
                <div class="tag"
                    @click.self="filterEnabled.genre = !filterEnabled.genre"
                    :class="{ active: queryInfo.genre != 0 }
                ">
                        <div
                            @click="filterEnabled.genre = !filterEnabled.genre;
                                    filterValues.genre = queryInfo.genre"
                        >
                            Genre<span
                                v-if="queryInfo.genre != 0"
                                class="hide-bp-300"
                            >: {{
                                genrelist.find(e => e[0] == queryInfo.genre)[1]
                            }}</span>
                        </div>
                        <vue-feather
                            type="x"
                            size="18"
                            @click="
                                queryInfo.genre = 0;
                                this.$parent.$parent.search();
                            "
                            :class="{hidden: queryInfo.genre == 0}"
                        />
                </div>
                <Transition name="tag-popup">
                    <div class="tag-popout" v-if="filterEnabled.genre">
                        <h2>Genre</h2>
                        <div class="select">
                            <div
                                class="option"
                                v-for="genre in genrelist"
                                :key="genre[0]"
                                :class="{selected : parseInt(genre[0]) == queryInfo.genre}"
                                @click="
                                    queryInfo.genre = parseInt(genre[0]);
                                    this.$parent.$parent.search();
                                    filterEnabled.genre = false;
                                    filterAdded.genre = true;

                                "
                            >
                                {{genre[1]}}
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
            <div class="tag-duo">
                <div
                    @click="filterEnabled.sort = !filterEnabled.sort"
                >
                    Sort by {{queryInfo.order[0]}}
                </div>
                <vue-feather
                    :type="queryInfo.order[1] == 'd'? 'chevron-down' : 'chevron-up'"
                    size="18"
                    @click="
                        queryInfo.order[1] = (queryInfo.order[1] == 'd' ? 'a' : 'd')
                        this.$parent.$parent.search();
                    "
                />
            </div>
            <Transition name="tag-popup-l">
                <div
                    class="tag-popout align-left"
                    v-if="filterEnabled.sort"
                >
                    <h2>Sort by</h2>
                    <div class="select">
                        <div
                            class="option"
                            v-for="sort in [
                                ['date', 'Date'], ['name', 'Title'],
                                ['author', 'Author'],
                                ['tempo', 'Tempo'],
                                ['downloads', 'Downloads'],
                                ['comments', 'Comments']
                            ]"
                            :key="sort[0]"
                            :class="{selected : sort[0] == queryInfo.order[0]}"
                            @click="
                                queryInfo.order[0] = sort[0];
                                this.$parent.$parent.search();
                                filterEnabled.sort = false;
                            "
                        >
                            {{sort[1]}}
                        </div>
                    </div>
                </div>
            </Transition>
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
    import SearchBar from './inputs/SearchBar.vue';
    import Switch from './inputs/Switch.vue';
    import Tag from './inputs/Tag.vue';

    export default {
        name: "TopArea",
        components: {
            VueFeather,
            VueSlider,
            SearchBar,
            Switch,
            Tag
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
                    key:            ['',''],
                    date:           0,
                    genre:          0,
                    filterByKey:    false,
                },
                query : {

                },
                filterEnabled: {
                    tempo: false,
                    key: false,
                    sort: false,
                    genre: false
                },
                filterAdded: {
                    tempo: false,
                    key: false,
                    genre: false
                },
                filterValues: {
                    tempoRange:          [0,200],
                    key:                ['', false],
                },
                genrelist: [['0', 'All Genres'], ['56', '8Bit Chiptune'], ['52', 'Acid'], ['3', 'Acoustic'], ['67', 'Afrobeat'], ['2', 'Ambient'], ['66', 'Big Room'], ['33', 'Blues'], ['65', 'Boom Bap'], ['37', 'Breakbeat'], ['21', 'Chill Out'], ['36', 'Cinematic'], ['13', 'Classical'], ['51', 'Comedy'], ['44', 'Country'], ['39', 'Crunk'], ['17', 'Dance'], ['55', 'Dancehall'], ['30', 'Deep House'], ['23', 'Dirty'], ['18', 'Disco'], ['11', 'Drum And Bass'], ['5', 'Dub'], ['49', 'Dubstep'], ['64', 'EDM'], ['42', 'Electro'], ['16', 'Electronic'], ['15', 'Ethnic'], ['25', 'Folk'], ['19', 'Funk'], ['46', 'Fusion'], ['24', 'Garage'], ['31', 'Glitch'], ['43', 'Grime'], ['53', 'Grunge'], ['48', 'Hardcore'], ['61', 'Hardstyle'], ['27', 'Heavy Metal'], ['7', 'Hip Hop'], ['22', 'House'], ['63', 'Indie'], ['38', 'Industrial'], ['6', 'Jazz'], ['10', 'Jungle'], ['69', 'Latin'], ['62', 'Lo-Fi'], ['57', 'Moombahton'], ['34', 'Orchestral'], ['70', 'Phonk'], ['50', 'Pop'], ['60', 'Psychedelic'], ['14', 'Punk'], ['8', 'Rap'], ['20', 'Rave'], ['4', 'Reggae'], ['32', 'Reggaeton'], ['45', 'Religious'], ['12', 'RnB'], ['1', 'Rock'], ['29', 'Samba'], ['41', 'Ska'], ['59', 'Soul'], ['47', 'Spoken Word'], ['9', 'Techno'], ['28', 'Trance'], ['54', 'Trap'], ['58', 'Trip Hop'], ['68', 'UK Drill'], ['35', 'Weird']]
            }
        },
        methods:{
            setTempo(values){
                this.filterAdded.tempo = true;
                this.queryInfo.tempo = values;
                console.log(values);
            },
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
            margin: auto;
        }
    }
    .LibraryName{
        margin: auto;
        color: $foreground-200;
    }
    .results-header{
        display: flex;
        gap: $item-gap;
        color: $foreground-200;
        margin: auto;
        margin-top: $item-gap;
    }
    .hidden{
        transform: translateY($item-scale + $item-gap + 100px);
        display: none;
    }
    .select{
        .option{
            cursor: pointer;
            background-color: $background-300;
            padding: $item-gap / 2;
            border: 1px solid $background-300;
            border-bottom: 1px solid $background-200;
            transition-duration: $animation-duration;
            transition-timing-function: $animation-timing-alt;
            color: $foreground-200;
            &:hover:not(.selected){
                background-color: $background-400;
                border-radius: $radius;
                transform: scale(1.1);
                border: 1px solid $background-200;
                color: $foreground-100;
            }
            &:active:not(.selected){
                background-color: $background-300;
                border-radius: $radius;
                transform: scale(1.05);
                border: 1px solid $background-200;
                color: $foreground-100;
            }
            &:first-child{
                border-top-left-radius: $radius;
                border-top-right-radius: $radius;
            }
            &:last-child{
                border-bottom-left-radius: $radius;
                border-bottom-right-radius: $radius;
            }
            &.selected{
                background-color: $accent-2;
                color: $inverse-foreground;
            }
        }
    }
    .key-row{
        display: flex;
        justify-content: center;
        > div{
            cursor: pointer;
            height: $item-scale;
            aspect-ratio: 1;
            display: flex;
            justify-content: center;
            padding: $item-gap / 4;
            background-color: $background-300;
            border-radius: 50%;
            margin: $item-gap / 8;
            transition-duration: $animation-duration;
            transition-timing-function: $animation-timing;
            font-size: $font-size * .85;
            &:hover{
                background: $background-400;
            }
            &:active{
                background: $background-300;
            }
            &.selected{
                color: $inverse-foreground;
                background: $accent-2;
            }
            &.key-seperator{
                background-color: transparent !important;
                cursor: default;
            }
        }
    }
    #bottomSearch{
        width: 100%;
        background-color: $background-100;
        display: none;
        margin: $item-gap 0;
    }
</style>