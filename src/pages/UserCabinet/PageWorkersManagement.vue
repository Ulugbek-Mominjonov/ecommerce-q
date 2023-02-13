<template>
  <div class="fit full-height">
    <module-header/>
    <q-tab-panels v-model="panel" animated class="no-shadow no-border q-mt-sm">
      <q-tab-panel name="1" class="q-pa-none">
        <workers-management @goTab="goChild"/>
      </q-tab-panel>

      <q-tab-panel name="2" class="q-pa-none">
        <workers-salary :workers = "workers" @goBack="goWorkers"/>
      </q-tab-panel>

      <q-tab-panel name="3" class="q-pa-none">
        <worker-worked-days :workers = "workers" @goBack="goWorkers"/>
      </q-tab-panel>

    </q-tab-panels>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import WorkersSalary from "components/WorkersSalary.vue";
import Workers from "components/Workers.vue";
import WorkersManagement from "components/WorkersManagement.vue";
import WorkerWorkedDays from "components/WorkerWorkedDays.vue";
export default {
  name: "PageWorkersSalary",
  components: {WorkerWorkedDays, WorkersManagement, Workers, WorkersSalary, ModuleHeader},
  data() {
    return {
      panel: "1",
      workers: null,
    }
  },
  methods: {
    ...mapGetters([
      'getUser'
    ]),
    goChild(val) {
      this.workers = val.workers;
      this.panel = val.tab;
    },
    goWorkers() {
      this.panel = '1'
    }
  }
}
</script>

<style scoped>

</style>
