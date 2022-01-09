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
        />
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
    @import '../styles/globals.scss';
    .title-bar{
        -webkit-app-region: drag;
        justify-content: space-between;
        background-color: $titlebar-background;
        color: $foreground-100;
        padding: 0 $side-padding;
        height: 52px;
        display: flex;
        align-items: center;
        gap: $item-gap;
        border-bottom: 1px solid $seperator;
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
            background-color: transparent;
            border-radius: 6px;
        }
    }
    .actions{
        display: flex;
        gap: $item-gap;
        height: 18px;
        svg{
            stroke: $foreground-200;
            stroke-width: 2.5;
        }
    }
</style>