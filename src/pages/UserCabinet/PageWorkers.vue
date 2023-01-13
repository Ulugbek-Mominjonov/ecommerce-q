<template>
  <div class="fit full-height">
    <module-header/>
    <workers/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import WorkerTypes from "components/WorkerTypes.vue";
import Workers from "components/Workers.vue";
import Users from "components/Users.vue";
export default {
  name: "PageWorkers",
  components: {Workers, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
