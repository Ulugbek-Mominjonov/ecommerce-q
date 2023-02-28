<template>
  <div class="fit full-height">
    <module-header/>
    <customer-trades/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import CustomerTrades from "components/CustomerTrades";
export default {
  name: "PageCustomerTrades",
  components: {CustomerTrades, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
