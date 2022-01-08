<template>
    <div class="top-area">
        <p ref="LibraryName" class="LibraryName">Public library</p>
        <h1>Loops</h1>
        <div class="tags-container">
            <div class="tags-left">
                <div class="tag active">
                    <vue-feather type="activity" size="18"/>
                    <div>Tempo</div>
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
        <div class="results-header">
            <div style="width: 52px">User</div>
            <div style="flex-grow: 1">Title</div>
            <div style="width: 68px">Key</div>
            <div style="width: 183px">Tempo</div>
        </div>
    </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    export default {
        name: "TopArea",
        components: {
            VueFeather
        }
    }
</script>

<style lang="scss">
    @import '../styles/globals.scss';

    .top-area{
        padding: $side-padding;
        padding-bottom: $item-gap;
        border-bottom: 1px solid $background-300;
    }
    .LibraryName{
        margin: 0;
        color: $foreground-200;
    }
    .tags-container{
        margin-top: $item-gap;
    }
    .tags-container, .tags-left{
        display: flex;
        flex-grow: 1;
        gap: $item-gap;
    }
    .tag, .tag-duo > *{
        display: flex;
        gap: 8px;
        height: 18px;
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
    .results-header{
        display: flex;
        gap: $item-gap;
        margin-top: $item-gap;
        color: $foreground-200;
    }
</style>