<template>
  <div class="fit full-height">
    <module-header/>
    <store-transactions/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import StoreTransactions from "components/StoreTransactions.vue";
export default {
  name: "PageStoreTransactions",
  components: {StoreTransactions, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
