<template>
  <div class="switch" @click="flip()">
    <div class="switch-label">{{ title }}</div>
    <div class="switch-outer" :class="{ active: value }">
      <div class="switch-inner" :class="{ active: value }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Switch",
  emits: ["update:modelValue"],
  props: {
    modelValue: Boolean,
    title: String,
  },
  data() {
    return {
      value: false,
    };
  },
  methods: {
    flip() {
      this.value = !this.value;
      this.$emit("update:modelValue", this.value);
    },
  },
  mounted() {
    this.value = this.$props.modelValue;
  },
};
</script>
