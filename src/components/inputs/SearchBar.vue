<template>
    <div class="SearchBar" ref="SearchBar" onclick="document.querySelector('.input').focus()">
        <div class="inner">
            <vue-feather type="search" size="12" class="search"></vue-feather>
            <input class="input"
                ref="input"
                contenteditable="true"
                @focusout="onUnfocus"
                @focus="onFocus"
                @keypress="resizeInput"
                v-bind:placeholder="placeholder"
                v-model="value"
                v-on:keyup.enter="submit"
            >
        </div>
    </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    export default {
        name: 'SearchBar',
        components: {
            VueFeather
        },
        data() {
            return {value: ""};
        },
        props: {
            placeholder: String
        },
        methods: {
            onUnfocus(){
                this.$refs.SearchBar.className = "SearchBar";
                if((this.$refs.input.value).length == 0) this.$refs.input.style.width = '';
                else this.$refs.input.style.width = (((this.$refs.input.value).length) + 1) + 'ch';
            },
            onFocus(){
                this.$refs.SearchBar.className = "SearchBar active";
            },
            resizeInput(){
                if((this.$refs.input.value).length == 0) this.$refs.input.style.width = '';
                else this.$refs.input.style.width = (((this.$refs.input.value).length) + 1) + 'ch';
            },
            submit(){
                this.$emit('submitSearch');
            }
        }
    }
</script>

<style lang="scss">
@import "../../styles/globals.scss";

::-webkit-input-placeholder{
    color: $foreground-200;
}

.SearchBar{
    flex-shrink: 1;
    flex-grow: 0;
    width: 437px;
    .inner svg{
        stroke: $foreground-200;
        stroke-width: 3.5;
    }
    background-color: $background-200;
    border-radius: $radius;
    height: 26px;
    transition-duration: $animation-duration;
    transition-timing-function: $animation-timing;
    cursor: text;
}
.SearchBar.active{
    .inner{
        margin-left: $item-gap;
        transform: translateX(0);
        svg{
            stroke: $foreground-100;
        }
    }
    .input{
        color: $foreground-100;
    }
}
.inner{
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: 50%;
    height: 100%;
    transform: translateX(-50%);
    width: min-content;
    min-width: 20px;
    max-width: 100%;
    transition-duration: $animation-duration;
    transition-timing-function: $animation-timing;
}
.input{
    background: transparent;
    border: 0px;
    outline: 0px;
    outline: none;
    display: inline-block;
    white-space: nowrap;
    color: $foreground-200;
    overflow: visible;
    width: 110px;
    padding: 0;
    margin: 0;
}
</style>