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

                <h1>General</h1>
                <p></p>
            </div>
        </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    const electron = window.require("electron");

    export default {
        name: "Settings",
        components: {
            VueFeather
        },
        data() {
            return {
                version: ""
            }
        },
        methods:{
            openLink(url) {
                electron.ipcRenderer.invoke('openLink', url);
            }
        },
        async mounted () {
            this.version = await electron.ipcRenderer.invoke("getVersion");
        }
    }
</script>

<style lang="scss">
    @import '../styles/globals.scss';

    .settings-window{
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
            flex: 1 1;
            padding-top: $side-padding;
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