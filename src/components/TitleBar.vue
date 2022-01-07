<template>
    <div class="title-bar">
        <div class="window-btns">
            <div id="close"></div>
            <div id="min"></div>
            <div id="max"></div>
        </div>
    </div>
</template>

<script>
  export default {};
</script>

<style lang="scss">
    @import '../styles/variables.scss';
    .title-bar{
        -webkit-app-region: drag;
        background-color: $background-100;
        color: $foreground-100;
        padding: 0 21px;
        height: 52px;
        display: flex;
        align-items: center;
    }
    .window-btns {
        display: flex;
        gap: 8px;
        div{
            -webkit-app-region: no-drag;
            width: 12px;
            height: 12px;
            background-color: $foreground-100;
            border-radius: 6px;
        }
        div:active{
            background-color: $foreground-200 !important;
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
</style>