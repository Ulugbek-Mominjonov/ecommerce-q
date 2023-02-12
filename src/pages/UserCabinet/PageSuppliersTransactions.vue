<template>
  <div class="fit full-height">
    <module-header/>
    <suppliers-transactions/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import SuppliersTransactions from "components/SuppliersTransactions";
export default {
  name: "PageSuppliersTransactions",
  components: {SuppliersTransactions, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
