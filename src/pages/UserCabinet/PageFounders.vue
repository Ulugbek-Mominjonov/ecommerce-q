<template>
  <div class="fit full-height">
    <module-header/>
    <founders/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import WorkerTypes from "components/WorkerTypes.vue";
import Founders from "components/Founders.vue";
export default {
  name: "PageFounders",
  components: {Founders, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
