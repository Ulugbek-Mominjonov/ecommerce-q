<template>
  <div class="fit full-height">
    <module-header/>
    <stores/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import WorkerTypes from "components/WorkerTypes.vue";
import Workers from "components/Workers.vue";
import Users from "components/Users.vue";
import Stores from "components/Stores";
export default {
  name: "PageStores",
  components: {Stores, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
