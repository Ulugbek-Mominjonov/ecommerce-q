<template>
  <div className="fit full-height">
    <module-header/>
    <products/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import Products from "components/Products.vue";

export default {
  name: "PageProdutcs",
  components: {Products, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
