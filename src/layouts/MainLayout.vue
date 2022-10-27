<template>
  <q-layout view="lHh Lpr lFf">
    <login-page/>
  </q-layout>
</template>

<script>
import LoginPage from "pages/Login/LoginPage";
export default {
  name: 'MainLayout',
  components: {
    LoginPage
  },
  data () {
    return {
    }
  }
}
</script>
