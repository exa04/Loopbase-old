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
                            if(saveCondition){
                                $emit('save');
                                added = true;
                            }
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
            additionalInfo: String,
            saveCondition: Boolean
        },
        data() {
            return {
                opened: false,
                added: false
            }
        }
    }
</script>