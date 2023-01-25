<template>
  <div class="fit full-height">
    <module-header/>
    <customers-transactions/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import WorkerTypes from "components/WorkerTypes.vue";
import Founders from "components/Founders.vue";
import FoundersTransactions from "components/FoundersTransactions.vue";
import SuppliersTransactions from "components/SuppliersTransactions";
import CustomersTransactions from "components/CustomersTransactions";
export default {
  name: "PageCustomersTransactions",
  components: {CustomersTransactions, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
