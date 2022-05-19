<template>
  <div class="button" :class="{ secondary: secondary, tertiary: tertiary }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Button",
  props: {
    secondary: Boolean,
    tertiary: Boolean,
  },
};
</script>
