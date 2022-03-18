<template>
    <div>
        <div class="tag"
            @click.self="opened = !opened;
                    $emit('cancel')"
            :class="{ active: added }"
        >
            <vue-feather
                :type="icon"
                size="18"
                v-if="icon"
                @click="opened = !opened;
                        $emit('cancel')"
            />
            <div
                @click="opened = !opened;
                        $emit('cancel')"
            >
                {{title}}<span
                    v-if="added"
                    class="hide-bp-300"
                >: {{additionalInfo}}</span>
            </div>
            <vue-feather
                type="x"
                size="18"
                @click="$emit('remove');
                        added = false;
                "
                :class="{hidden: !added}"
            />
        </div>
        <Transition name="tag-popup">
            <div class="tag-popout" v-if="opened">
                <VueFeather
                    class="close-x"
                    id="content-x"
                    type="x"
                    size="18"
                    @click="$emit('cancel'); opened = false"
                />
                <h2>{{title}}</h2>
                <slot></slot>
                <div class="button-duo"
                    @click="opened = false"
                >
                    <Button
                        @click="
                            $emit('save');
                            added = true;
                        "
                    >
                        Apply
                    </Button>
                    <Button secondary @click="$emit('cancel')">Cancel</Button>
                </div>
            </div>
        </Transition>
    </div>
</template>
<script>
    import VueFeather from 'vue-feather';
    import Button from './Button.vue';

    export default {
        name: "Tag",
        components: {
            VueFeather,
            Button
        },
        props: {
            icon: String,
            title: String,
            additionalInfo: String
        },
        data() {
            return {
                opened: false,
                added: false
            }
        }
    }
</script>
<style lang="scss">
    @import '../../styles/globals.scss';

    .tag-popup-enter-active,
    .tag-popup-leave-active,
    .tag-popup-l-enter-active,
    .tag-popup-l-leave-active {
        transition: all $animation-duration-alt $animation-timing-alt;
    }

    .tag-popup-enter-from, .tag-popup-leave-to{
        transform: translateY($item-scale * 2 + $item-gap) !important;
        opacity: 0;
        box-shadow: 0px 0px 0px 0px #000 !important;
    }

    .tag-popup-enter-to, .tag-popup-leave-from{
        transform: translateY($item-scale + $item-gap) !important;
        opacity: 1;
    }
    
    .tag-popup-l-enter-from, .tag-popup-l-leave-to{
        transform: translate(-$side-padding, $item-scale * 2 + $item-gap) !important;
        opacity: 0;
        box-shadow: 0px 0px 0px 0px #000 !important;
    }

    .tag-popup-l-enter-to, .tag-popup-l-leave-from{
        transform: translate(-$side-padding, $item-scale + $item-gap) !important;
        opacity: 1;
    }
    .tags-container{
        margin: auto;
        margin-top: $item-gap;
        .tag-duo{
            flex-shrink: 0;
        }
    }
    .tags-container, .tags-left{
        display: flex;
        flex-grow: 1;
        gap: $item-gap;
        flex-wrap: wrap;
    }
    .tags-left{
        overflow: auto;
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
        background: $background-300;
        &:hover{ background: $background-400; }
        &:active{ background: $background-300; }
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
        max-height: 50vh;
        overflow: auto;
        height: fit-content;
        position: absolute;
        transform: translateY($item-scale + $item-gap);
        padding: $side-padding;
        z-index: 2;
        > *{
            margin-bottom: $item-gap / 2;
            &:last-child{
                margin-bottom: 0;
            }
        }
        &.align-left{
            transform: translate(-$side-padding, $item-scale + $item-gap);
            right: 0;
        }
    }
</style>