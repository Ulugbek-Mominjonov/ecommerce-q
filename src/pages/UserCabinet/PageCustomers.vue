<template>
  <div class="fit full-height">
    <module-header/>
    <q-tab-panels v-model="panel" animated class="no-shadow no-border q-mt-sm">
      <q-tab-panel name="1" class="q-pa-none">
        <customers @goTab="goTrades"/>
      </q-tab-panel>

      <q-tab-panel name="2" class="q-pa-none">
        <customer-trades :customersId = "customerId" :balance = "balance" @goBack="goCustomers"/>
      </q-tab-panel>

      <q-tab-panel name="3" class="q-pa-none">
        <customers-transactions :customerId = "customerId" @goBack="goCustomers"/>
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
import CustomersTransactions from "components/CustomersTransactions.vue";
export default {
  name: "PageCustomers",
  components: {CustomersTransactions, CustomerTrades, Customers, ModuleHeader},
  data() {
    return {
      panel: "1",
      customerId: null,
      balance: null,
    }
  },
  methods: {
    ...mapGetters([
      'getUser'
    ]),
    goTrades(val) {
      this.customerId = val.id;
      this.balance = val.balance;
      this.panel = val.tab;
    },
    goCustomers() {
      this.panel = '1'
    }
  }
}
</script>

<style scoped>

</style>
