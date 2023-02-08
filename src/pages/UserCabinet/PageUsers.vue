<template>
  <div class="fit full-height">
    <module-header/>
    <q-tab-panels v-model="panel" animated class="no-shadow no-border q-mt-sm">
      <q-tab-panel name="1" class="q-pa-none">
        <users @goTab="goTrades"/>
      </q-tab-panel>

      <q-tab-panel name="2" class="q-pa-none">
        <user-trades :usersId = "userId" @goBack="goUsers"/>
      </q-tab-panel>

      <q-tab-panel name="3" class="q-pa-none">
        <users-transactions :userId = "userId" @goBack="goUsers"/>
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
import Users from "components/Users";
import UserTrades from "components/UserTrades";
import UsersTransactions from "components/UsersTransactions";
export default {
  name: "PageUsers",
  components: {UsersTransactions, UserTrades, Users, ModuleHeader},
  data() {
    return {
      panel: "1",
      userId: null,
    }
  },
  methods: {
    ...mapGetters([
      'getUser'
    ]),
    goTrades(val) {
      this.userId = val.id;
      this.panel = val.tab;
    },
    goUsers() {
      this.panel = '1'
    }
  }
}
</script>

<style scoped>

</style>
