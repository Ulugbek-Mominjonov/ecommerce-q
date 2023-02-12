<template>
  <div class="fit full-height">
    <module-header/>
    <report-stores/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
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
