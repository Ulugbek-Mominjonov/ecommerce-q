<template>
  <div class="fit full-height">
    <module-header/>
    <report-customers/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import ReportCustomers from "components/ReportCustomers.vue";
export default {
  name: "PageReportCustomers",
  components: {ReportCustomers, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
