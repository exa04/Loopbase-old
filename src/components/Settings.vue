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
                    <h2>Appearance</h2>
                    <Select
                        :options="[
                            ['theme-dark', 'Dark'],
                            ['theme-light', 'Light'],
                            ['theme-purple', 'Purple'],
                            ['theme-chroma', 'Chroma'],
                            ['theme-dracula', 'Dracula']
                        ]"
                        class="input-component"
                        :selected="prefs.theme"
                        @selectOption="o => prefs.theme = o"
                    >Theme</Select>
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
    import Select from './inputs/Select.vue';
    import FileSelector from './inputs/FileSelector.vue';
    const electron = window.require("electron");

    export default {
        name: "Settings",
        components: {
            VueFeather,
            Button,
            FileSelector,
            Select
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