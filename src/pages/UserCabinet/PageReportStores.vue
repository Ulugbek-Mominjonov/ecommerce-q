<template>
  <div class="fit full-height">
    <module-header/>
    <report-stores/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import WorkerTypes from "components/WorkerTypes.vue";
import MeasureTypes from "components/MeasureTypes.vue";
import ReportUsers from "components/ReportUsers.vue";
import ReportStore from "components/ReportStore.vue";
import ReportSupliers from "components/ReportSupliers.vue";
import ReportCustomers from "components/ReportCustomers.vue";
import ReportStores from "components/ReportStores.vue";
export default {
  name: "PageReportStores",
  components: {ReportStores, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
