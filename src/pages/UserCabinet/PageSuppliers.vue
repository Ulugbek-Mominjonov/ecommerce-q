<template>
  <div class="fit full-height">
    <module-header/>
    <q-tab-panels v-model="panel" animated class="no-shadow no-border q-mt-sm">
      <q-tab-panel name="1" class="q-pa-none">
        <suppliers @goTab="goTrades"/>
      </q-tab-panel>

      <q-tab-panel name="2" class="q-pa-none">
        <supplier-trades :supplierId = "supplierId" @goBack="goSuppliers"/>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import Suppliers from "components/Suppliers.vue";
import SupplierTrades from "components/SupplierTrades";
export default {
  name: "PageSuppliers",
  components: {SupplierTrades, Suppliers, ModuleHeader},
  data() {
    return {
      panel: "1",
      supplierId: null,
    }
  },
  methods: {
    ...mapGetters([
      'getUser'
    ]),
    goTrades(id) {
      if (this.panel === "1") {
        this.supplierId = id;
        this.panel = "2"
      } else {
        this.panel = "1"
      }
    },
    goSuppliers() {
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
