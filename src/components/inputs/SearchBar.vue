<template>
    <div class="SearchBar" ref="SearchBar">
        <div class="inner">
            <vue-feather type="search" size="12" class="search" @onclick="submit"></vue-feather>
            <input class="input"
                ref="input"
                contenteditable="true"
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
            submit(){
                this.$emit('submitSearch');
            }
        }
    }
</script>