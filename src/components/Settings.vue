<template>
        <div class="settings-window settings">
            <div class="sidebar">
                <VueFeather
                    class="close-x"
                    id="sidebar-x"
                    type="x"
                    size="18"
                    @click="this.$emit('close')"
                />
                <h2>Settings</h2>
                <a>
                    <VueFeather
                        type="settings"
                        size="18"
                    />
                    <span>
                        General
                    </span>
                </a>
                <a>
                    <VueFeather
                        type="search"
                        size="18"
                    />
                    <span>
                        Search &amp; Content
                    </span>
                </a>
                <a>
                    <VueFeather
                        type="edit-2"
                        size="18"
                    />
                    <span>
                        Appearance
                    </span>
                </a>
                <a>
                    <VueFeather
                        type="code"
                        size="18"
                    />
                    <span>
                        Advanced
                    </span>
                </a>
                <div class="last">
                    <a
                        @click="openLink('https://github.com/StarburstAudio/loopbase/issues/new')"
                    >
                        <VueFeather
                            type="alert-triangle"
                            size="18"
                        />
                        <span>
                        Bugs &amp; Suggestions
                        </span>
                    </a>
                    <p id="version-string">
                        Loopbase version
                        <br>
                        {{version}}
                    </p>
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
                <div class="inner-content" v-if="prefsLoaded">
                    <h1>Settings</h1>
                    <h2>Search &amp; Content</h2>
                    <p>If you change the samples directory, your previously downloaded samples will stay in the old one. You can migrate them yourself, but you will also have to re-link them in your project files!</p>
                    <FileSelector
                        title="Samples"
                        openBtn
                        class="input-component"
                        @update:modelValue="v => prefs.dir.content = v"
                        :modelValue="prefs.dir.content"
                    ></FileSelector>
                </div>
                <div class="action-pair">
                    <div class="subtext unsaved-warn" v-if="JSON.stringify(prefs) !== JSON.stringify(originalPrefs)">
                        <VueFeather
                            type="alert-triangle"
                            class="centered il-block"
                        />
                        You have unsaved changes!
                    </div>
                    <div>
                        <Button class="il-block" secondary @click="this.$emit('close')">
                            Cancel
                        </Button>
                        <Button class="il-block" @click="savePrefs(); this.$emit('close')">
                            Apply
                        </Button>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    import Button from './inputs/Button.vue';
    import FileSelector from './inputs/FileSelector.vue';
    const electron = window.require("electron");

    export default {
        name: "Settings",
        components: {
            VueFeather,
            Button,
            FileSelector
        },
        data() {
            return {
                version: String,
                prefs: Object,
                originalPrefs: Object,
                prefsLoaded: false
            }
        },
        methods:{
            openLink(url) {
                electron.ipcRenderer.invoke('openLink', url);
            },
            savePrefs(){
                let p = JSON.parse(JSON.stringify(this.prefs));
                electron.ipcRenderer.invoke('setPrefs', p);
                this.originalPrefs = p;
            }
        },
        async beforeCreate () {
            this.version = await electron.ipcRenderer.invoke("getVersion");
            
            let prefs = await electron.ipcRenderer.invoke("getPrefs");
            this.prefs = JSON.parse(JSON.stringify(prefs));
            this.originalPrefs = JSON.parse(JSON.stringify(prefs));   

            this.prefsLoaded = true;
        }
    }
</script>

<style lang="scss">
    @import '../styles/globals.scss';

    .settings-window{
        transition-duration: $animation-duration-alt;
        transition-timing-function: $animation-timing;
        @include glass($background-200, false, true);
        background: transparent;
        width: calc(100vw - (2 * $side-padding));
        height: calc(100vh - (2 * $side-padding));
        max-width: 1000px;
        max-height: 800px;
        left: 50vw;
        top: 50vh;
        transform: translate(-50%, -50%);
        position: fixed;
        z-index: 6;
        display: flex;
        > *{
            box-shadow: 0px 0px 0px 0px transparent !important;
        }
        .sidebar{
            @include glass($background-200, false, true);
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
            border-right: none;
            padding-top: $side-padding;
            a, h2{
                display: block;
                padding-bottom: $item-gap;
                padding-left: $side-padding;
                padding-right: $side-padding;
            }
            a{
                display: flex;
                align-items: center;
                gap: $item-gap;
                cursor: pointer;
                transition-duration: $animation-duration;
                transition-timing-function: $animation-timing;
                color: $foreground-200;
                &:hover{
                    color: $foreground-100;
                }
            }
            .last{
                position: absolute;
                bottom: 0;
            }
        }
        .content{
            @include glass($background-200, true, true);
            padding-left: $side-padding;
            padding-right: $side-padding;
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
            border-left: 1px solid $seperator;
            flex: 1 1;
            padding-top: $side-padding;
            overflow: auto;
            .inner-content{
                min-height: calc(100% - ($item-scale + $item-gap + $side-padding * 2));
                > * {
                    margin-bottom: $item-gap;
                    margin-top: $item-gap;
                }
                .input-component{
                    margin-left: $side-padding;
                    width: calc(100% - $side-padding);
                }
            }
        }
        .action-pair{
            display: flex;
            flex-direction: column wrap;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: $side-padding;
            .unsaved-warn{
                flex-grow: 1;
            }
        }
    }
    .close-x{
        color: $foreground-200;
        position: fixed;
        right: $item-gap;
        top: $item-gap;
        cursor: pointer;
        transition-duration: $animation-duration;
        transition-timing-function: $animation-timing;
        :hover{
            color: $foreground-100;
        }
    }
    #sidebar-x{
        display: none;
    }
    #version-string{
        padding-left: $side-padding;
        padding-right: $side-padding;
        color: $foreground-300;
        margin-top: 0;
        font-size: $font-size * .85;
    }
</style>