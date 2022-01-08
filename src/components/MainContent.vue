<template>
    <div class="main-content">
        <TopArea
            library_name="Public library"
            section_name="Loops"
            search_header
        />
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