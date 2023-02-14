<template>
  <div class="fit full-height">
    <module-header/>
    <store-trades/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import StoreTrades from "components/StoreTrades.vue";
export default {
  name: "PageWorkers",
  components: {StoreTrades, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  },
}
</script>

<style scoped>

</style>
