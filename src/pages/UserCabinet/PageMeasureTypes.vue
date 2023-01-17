<template>
  <div class="fit full-height">
    <module-header/>
    <measure-types/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import WorkerTypes from "components/WorkerTypes.vue";
import MeasureTypes from "components/MeasureTypes.vue";
export default {
  name: "PageMeasureTypes",
  components: {MeasureTypes, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
