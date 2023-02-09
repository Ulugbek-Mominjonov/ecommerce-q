<template>
  <div class="fit full-height">
    <module-header/>
    <kassa-outputs/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import KassaOutputs from "components/KassaOutputs.vue";
export default {
  name: "PageKassaOutputs",
  components: {KassaOutputs, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
