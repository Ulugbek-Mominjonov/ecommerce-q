<template>
  <div class="fit full-height">
    <module-header/>
    <user-trades/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import UserTrades from "components/UserTrades";
export default {
  name: "PageUserTrades",
  components: {UserTrades, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
