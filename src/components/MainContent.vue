<template>
  <div class="main-content">
    <TopArea
      library_name="Public library"
      section_name="Loops"
      search_header
      ref="TopArea"
    />
    <ResultList ref="Results" />
  </div>
</template>

<script>
import TopArea from "./TopArea";
import ResultList from "./ResultList";

export default {
  name: "MainContent",
  components: {
    TopArea,
    ResultList,
  },
  setup() {},
};
</script>
