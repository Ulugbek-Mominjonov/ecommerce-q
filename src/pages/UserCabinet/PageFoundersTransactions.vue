<template>
  <div class="fit full-height">
    <module-header/>
    <founders-transactions/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import WorkerTypes from "components/WorkerTypes.vue";
import Founders from "components/Founders.vue";
import FoundersTransactions from "components/FoundersTransactions.vue";
export default {
  name: "PageFoundersTransactions",
  components: {FoundersTransactions, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
