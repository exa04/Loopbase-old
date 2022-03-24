<template>
    <div class="fileselector">
        <div class="path">
            <span class="fs-title">
                {{title}}
            </span>
            <span class="subtext mono-value fs-pathname">
                {{modelValue}}
            </span>
        </div> 
        <Button v-if="openBtn" class="tertiary" @click="open()">
            Open
        </Button>
        <Button secondary @click="choose()">
            Choose
        </Button>
    </div>
</template>

<script>
import Button from './Button.vue';
const electron = window.require("electron");

export default {
    name: "FileSelector",
    emits: ['update:modelValue'],
    components: {
        Button
    },
    props: {
        modelValue: String,
        title: String,
        openBtn: Boolean,
        type: String
    },
    methods:{
        open(){
            electron.ipcRenderer.invoke('revealFile', '');
        },
        choose(){
            electron.ipcRenderer.invoke('chooseFile').then( res =>{
                if(!res.cancelled && res.filePaths[0] != undefined){
                    this.$emit('update:modelValue', res.filePaths[0]);
                }
            });
        }
    }
}
</script>

<style lang="scss">
    @import '../../styles/globals.scss';
    .fileselector{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: $item-gap;
        flex-flow: row wrap;
        .fs-title{
            color: $foreground-200;
        }
        .fs-pathname{
            color: $foreground-300;
        }
        .path{
            flex-grow: 1;
            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            color: $foreground-300;
        }
        input[type="file"]{
            display: none;
        }
    }
</style>