<template>
    <div class="title-bar">
        <div class="window-btns">
            <div></div>
            <div></div>
            <div></div>
        </div>
        <SearchBar
            placeholder="Search for loops..."
            @submitSearch="this.$parent.search()"
            ref="SearchBar"
            id="topSearch"
        />
        <div class="actions">
            <vue-feather size="24" type="folder"  @click="revealFile('')"></vue-feather>
            <vue-feather size="24" type="settings" @click="this.$emit('settingsOpen')"></vue-feather>
        </div>
    </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    import SearchBar from './inputs/SearchBar';
    const electron = window.require("electron");

    export default {
        components: {
            VueFeather,
            SearchBar
        },
        methods: {
            revealFile(f){
                electron.ipcRenderer.invoke('revealFile', f);
            }
        },
    };
</script>