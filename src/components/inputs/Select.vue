<template>
    <div>
        <div class="select-layout">
            <div class="title"><slot/></div>
            <Button
                secondary
                class="il-container centered select-btn"
                @click="open = !open"
                :class="{expanded: open}"
            >
                <span >{{
                    options.find(o => o[0] == selected)[1]
                }}</span>
                <VueFeather
                    :type="'chevron-down'"
                    :class="{rotated180: open}"
                    class="select-chevron"
                />
            </Button>
        </div>
        <Transition name="select-popup">
            <div class="select-container" v-if="open">
                <div class="select">
                    <div
                        class="option"
                        v-for="o in options"
                        :key="o[0]"
                        :class="{selected : o[0] == selected}"
                        @click="this.$emit('selectOption', o[0]); open = false"
                    >
                        {{o[1]}}
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
import Button from './Button.vue';
import VueFeather from 'vue-feather';

export default {
    name: "Select",
    components: {
        Button,
        VueFeather
    },
    data() {
        return{
            open: false
        }
    },
    props: {
        options: {
            type: Array,
            required: true
        },
        selected: String
    }
}
</script>