<template>
  <div class="fit full-height">
    <module-header/>
    <report-supliers/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import ReportSupliers from "components/ReportSupliers.vue";
export default {
  name: "PageReportSupliers",
  components: {ReportSupliers, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
