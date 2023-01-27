<template>
  <div class="fit full-height">
    <module-header/>
    <q-tab-panels v-model="panel" animated class="no-shadow no-border q-mt-sm">
      <q-tab-panel name="1" class="q-pa-none">
        <founders @goTab="goTransactions"/>
      </q-tab-panel>

      <q-tab-panel name="2" class="q-pa-none">
        <founders-transactions :founderId = "founderId" @goBack="goFounders"/>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import WorkerTypes from "components/WorkerTypes.vue";
import Founders from "components/Founders.vue";
import FoundersTransactions from "components/FoundersTransactions.vue";
export default {
  name: "PageFounders",
  components: {FoundersTransactions, Founders, ModuleHeader},
  data() {
    return {
      panel: "1",
      founderId: null,
    }
  },
  methods: {
    ...mapGetters([
      'getUser'
    ]),
    goTransactions(id) {
      if (this.panel === "1") {
        this.founderId = id;
        this.panel = "2"
      } else {
        this.panel = "1"
      }
    },
    goFounders() {
      if (this.panel === "2") {
        this.panel = "1"
      } else {
        this.panel = "2"
      }
    }
  }
}
</script>

<style scoped>

</style>
