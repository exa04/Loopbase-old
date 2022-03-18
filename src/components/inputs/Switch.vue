<template>
    <div class="switch" @click="flip()">
        <div class="switch-label"> {{title}} </div>
        <div class="switch-outer" :class="{ active: value }">
            <div class="switch-inner" :class="{ active: value }">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Switch",
    emits: ['update:modelValue'],
    props:{
        modelValue: Boolean,
        title: String
    },
    data() {
        return {
            value: false,
        }
    },
    methods: {
        flip(){
            this.value = !this.value;
            this.$emit('update:modelValue', this.value);
        }
    }
}
</script>

<style lang="scss">
    @import '../../styles/globals.scss';
    .switch{
        display: flex;
        justify-content: space-between;
        align-items: center;
        &.big{
            .switch-inner{
                width: $radius * 3;
                border-radius: $radius * 1.5;
                &.active{
                    margin-left: $radius * 3;
                }
            }
            .switch-outer{
                width: $radius * 6;
                height: $radius * 3;
                border-radius: $radius * 1.5;
            }
            :active{
                .switch-inner{
                    margin-left: $radius;
                    &.active{
                        margin-left: $radius * 2;
                    }
                }
                .switch-outer{
                    background: $background-200;
                }
            }
        }
        
    }
    .switch-inner{
        width: $radius * 2;
        aspect-ratio: 1;
        border-radius: $radius;
        background: $foreground-100;
        transition-duration: $animation-duration;
        transition-timing-function: $animation-timing-alt;
        &.active{
            margin-left: $radius * 2;
        }
    }
    .switch-outer{
        flex-shrink: 0;
        width: $radius * 4;
        height: $radius * 2;
        border-radius: $radius;
        background-color: $background-100;
        cursor: pointer;
        transition-duration: $animation-duration;
        transition-timing-function: $animation-timing;
        &.active{
            background-color: $accent-2;
        }
    }
    .switch-label{
        color: $foreground-200;
        width: calc(100% - ($radius * 4));
        flex-shrink: 1;
    }
</style>