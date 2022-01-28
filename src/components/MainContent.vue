<template>
    <div class="main-content">
        <TopArea
            library_name="Public library"
            section_name="Loops"
            search_header
            ref="TopArea"
        />
        <Results ref="Results"/>
    </div>
</template>

<script>
import TopArea from './TopArea';
import Results from './Results'
export default ({
    name: 'MainContent',
    components: {
        TopArea,
        Results
    },
    setup() {

    },
})
</script>

<style lang="scss">
    .main-content{
        flex: 1 1;
        display: flex;
        flex-direction: column;
        overflow: overlay;
        padding-top: 52px;
    }
</style>