<template>
  <div class="fit full-height">
    <module-header/>
    <report-store/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import WorkerTypes from "components/WorkerTypes.vue";
import MeasureTypes from "components/MeasureTypes.vue";
import ReportUsers from "components/ReportUsers.vue";
import ReportStore from "components/ReportStore.vue";
export default {
  name: "PageReportStore",
  components: {ReportStore, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
