<template>
  <div class="fit full-height">
    <module-header/>
    <workers-salary/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import WorkersSalary from "components/WorkersSalary.vue";
export default {
  name: "PageWorkersSalary",
  components: {WorkersSalary, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
