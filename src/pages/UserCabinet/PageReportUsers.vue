<template>
  <div class="fit full-height">
    <module-header/>
    <report-users/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import ReportUsers from "components/ReportUsers.vue";
export default {
  name: "PageReportUsers",
  components: {ReportUsers, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
