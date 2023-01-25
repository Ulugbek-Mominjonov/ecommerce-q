<template>
  <div class="fit full-height">
    <module-header/>
    <q-tab-panels v-model="panel" animated class="no-shadow no-border q-mt-sm">
      <q-tab-panel name="1" class="q-pa-none">
        <customers @goTab="goTrades"/>
      </q-tab-panel>

      <q-tab-panel name="2" class="q-pa-none">
        <customer-trades :customersId = "customerId" @goBack="goCustomers"/>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import Suppliers from "components/Suppliers.vue";
import SupplierTrades from "components/SupplierTrades";
import Customers from "components/Customers";
import CustomerTrades from "components/CustomerTrades";
export default {
  name: "PageCustomers",
  components: {CustomerTrades, Customers, SupplierTrades, Suppliers, ModuleHeader},
  data() {
    return {
      panel: "1",
      customerId: null,
    }
  },
  methods: {
    ...mapGetters([
      'getUser'
    ]),
    goTrades(id) {
      if (this.panel === "1") {
        this.customerId = id;
        this.panel = "2"
      } else {
        this.panel = "1"
      }
    },
    goCustomers() {
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
