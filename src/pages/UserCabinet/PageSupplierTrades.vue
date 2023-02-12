<template>
  <div class="fit full-height">
    <module-header/>
    <supplier-trades/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import SupplierTrades from "components/SupplierTrades.vue";
export default {
  name: "PageWorkers",
  components: {SupplierTrades, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
