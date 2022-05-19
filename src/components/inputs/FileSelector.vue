<template>
  <div class="fileselector">
    <div class="path">
      <span class="fs-title">
        {{ title }}
      </span>
      <span class="subtext mono-value fs-pathname">
        {{ modelValue }}
      </span>
    </div>
    <Button v-if="openBtn" class="tertiary" @click="open()"> Open </Button>
    <Button secondary @click="choose()"> Choose </Button>
  </div>
</template>

<script>
import Button from "./Button.vue";
const electron = window.require("electron");

export default {
  name: "FileSelector",
  emits: ["update:modelValue"],
  components: {
    Button,
  },
  props: {
    modelValue: String,
    title: String,
    openBtn: Boolean,
    type: String,
  },
  methods: {
    open() {
      electron.ipcRenderer.invoke("revealFile", "");
    },
    choose() {
      electron.ipcRenderer.invoke("chooseFile").then((res) => {
        if (!res.cancelled && res.filePaths[0] != undefined) {
          this.$emit("update:modelValue", res.filePaths[0]);
        }
      });
    },
  },
};
</script>
