<template>
    <div class="title-bar">
        <div class="window-btns">
            <div id="close"></div>
            <div id="min"></div>
            <div id="max"></div>
        </div>
        <SearchBar placeholder="Search for loops..."></SearchBar>
        <div class="actions">
            <vue-feather type="folder" size="18"></vue-feather>
            <vue-feather type="settings" size="18"></vue-feather>
        </div>
    </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    import SearchBar from './inputs/SearchBar';
    export default {
        components: {
            VueFeather,
            SearchBar
        }
    };
</script>

<style lang="scss">
    @import '../styles/variables.scss';
    @import '../styles/icons.scss';
    .title-bar{
        -webkit-app-region: drag;
        justify-content: space-between;
        background-color: $titlebar-background;
        color: $foreground-100;
        padding: 0 21px;
        height: 52px;
        display: flex;
        align-items: center;
        gap: $titlebar-gap;
        >*{
            -webkit-app-region: no-drag;
        }
    }
    .window-btns {
        display: flex;
        gap: 8px;
        div{
            width: 12px;
            height: 12px;
            background-color: $foreground-200;
            border-radius: 6px;
        }
        div:active{
            background-color: $foreground-100 !important;
        }
        #close:hover{
            background-color: $accent-1;
        }
        #max:hover{
            background-color: $accent-2;
        }
        #min:hover{
            background-color: $accent-3;
        }
    }
    .actions{
        display: flex;
        gap: $titlebar-gap;
        height: 18px;
        svg{
            stroke: $foreground-200;
            stroke-width: 2.5;
        }
    }
</style>