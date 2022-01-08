<template>
    <div class="main-content">
        <TopArea></TopArea>
    </div>
</template>

<script>
import TopArea from './TopArea';
export default ({
    name: 'MainContent',
    components: {
        TopArea
    },
    setup() {
        
    },
})
</script>

<style lang="scss">
    .main-content{
        flex-grow: 1;
    }
</style>