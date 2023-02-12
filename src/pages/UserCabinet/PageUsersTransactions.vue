<template>
  <div class="fit full-height">
    <module-header/>
    <users-transactions/>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import ModuleHeader from "components/ModuleHeader.vue";
import UsersTransactions from "components/UsersTransactions";
export default {
  name: "PageUsersTransactions",
  components: {UsersTransactions, ModuleHeader},
  methods: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>

</style>
