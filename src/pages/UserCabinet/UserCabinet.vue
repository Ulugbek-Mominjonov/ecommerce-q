<template>
  <div class="q-pl-md">
    <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders" style="background-color: rgb(248,249,250); height: 100vh">
      <q-header elevated class="q-px-lg project-header" style="background-color: #344767">
        <q-toolbar>
          <q-btn flat @click="leftDrawerOpen = !leftDrawerOpen" round dense icon="menu" />
          <q-toolbar-title>Дистрибуция</q-toolbar-title>

          <q-btn
            round
            dense
            size="12px"
            @click="confirm = !confirm"
            class="text-black q-mr-sm"
            style="background-color: #e9e1d3"
          >
            <q-icon name="mdi-account" size="18px"/>
          </q-btn>

          <q-btn
            round
            dense
            size="12px"
            @click="confirm = !confirm"
            class="text-black"
            style="background-color: #e9e1d3"
          >
            <q-icon name="mdi-exit-to-app" size="18px"/>
          </q-btn>

        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        :breakpoint="500"
        bordered
        :width="300"
        content-class="bg-white shadow-2"
        class="project-drawer"
      >
        <q-scroll-area class="site-main-menu" style="height: 100%; border-right: 1px solid #ddd">
          <q-list class="q-my-lg q-px-md">
            <q-item
              clickable
              v-ripple
              to="/dashboard"
              active-class="site-main-menu--item--active"
              class="site-main-menu--item"
            >
              <q-item-section avatar class="site-main-menu--icon">
                <q-icon class="icon" name="mdi-chart-box-outline" size="20px"/>
              </q-item-section>

              <q-item-section class="site-main-menu--title site-main-menu--dashboard">
                Дашбоард
              </q-item-section>
            </q-item>

            <q-item-label class="site-main-menu--heading" header>Hisobotlar</q-item-label>
            <q-item
              v-for="(module, index, arr) in reports"
              :key="module.name"
              :active="changeRouteName===module.name"
              clickable
              v-ripple
              active-class="site-main-menu--item--active"
              :to="module.path"
              class="site-main-menu--item"
            >
              <q-item-section avatar class="site-main-menu--icon">
                <q-icon class="icon" :name="module.meta.icon" size="20px"/>
              </q-item-section>

              <q-item-section class="site-main-menu--title">
                {{ $t(module.meta.title) }}
              </q-item-section>
            </q-item>

            <q-item-label class="site-main-menu--heading q-mt-md" header>Асосий бўлим</q-item-label>
            <q-item
              v-for="(module, index, arr) in main"
              :key="module.name"
              :active="changeRouteName===module.name"
              clickable
              v-ripple
              active-class="site-main-menu--item--active"
              :to="module.path"
              class="site-main-menu--item"
            >
              <q-item-section avatar class="site-main-menu--icon">
                <q-icon class="icon" :name="module.meta.icon" size="20px"/>
              </q-item-section>

              <q-item-section class="site-main-menu--title">
                {{ $t(module.meta.title) }}
              </q-item-section>
            </q-item>

            <q-item-label class="site-main-menu--heading q-mt-md" header>Транзаксиялар</q-item-label>
            <q-item
              v-for="(module, index, arr) in transactions"
              :key="module.name"
              :active="changeRouteName===module.name"
              clickable
              v-ripple
              active-class="site-main-menu--item--active"
              :to="module.path"
              class="site-main-menu--item"
            >
              <q-item-section avatar class="site-main-menu--icon">
                <q-icon class="icon" :name="module.meta.icon" size="20px"/>
              </q-item-section>

              <q-item-section class="site-main-menu--title">
                {{ $t(module.meta.title) }}
              </q-item-section>
            </q-item>

            <q-item-label class="site-main-menu--heading q-mt-md" header>Савдолар</q-item-label>
            <q-item
              v-for="(module, index, arr) in trades"
              :key="module.name"
              :active="changeRouteName===module.name"
              clickable
              v-ripple
              active-class="site-main-menu--item--active"
              :to="module.path"
              class="site-main-menu--item"
            >
              <q-item-section avatar class="site-main-menu--icon">
                <q-icon class="icon" :name="module.meta.icon" size="20px"/>
              </q-item-section>

              <q-item-section class="site-main-menu--title">
                {{ $t(module.meta.title) }}
              </q-item-section>
            </q-item>


            <q-item-label class="site-main-menu--heading" header>Тизим маълумотлари</q-item-label>
            <q-item
              v-for="(module, index, arr) in sprav"
              :key="module.name"
              :active="changeRouteName===module.name"
              clickable
              v-ripple
              active-class="site-main-menu--item--active"
              :to="module.path"
              class="site-main-menu--item"
            >
              <q-item-section avatar class="site-main-menu--icon">
                <q-icon class="icon" :name="module.meta.icon" size="20px"/>
              </q-item-section>

              <q-item-section class="site-main-menu--title">
                {{ $t(module.meta.title) }}
              </q-item-section>
            </q-item>


          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page class="q-pt-md q-pr-md" >
          <router-view/>
        </q-page>
      </q-page-container>
    </q-layout>

    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="mdi-exclamation-thick" color="negative" text-color="white" size="md"/>
          <span class="q-ml-sm">Siz kabinetdan haqiqatdan chiqmoqchimisiz!!!</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Bekor qilish" color="primary" v-close-popup />
          <q-btn flat label="Chiqish" color="primary" @click="leftCabninet" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import {main_sprav} from "src/router/categories";
export default {
  name: 'MainLayout',
  components: {
  },
  data () {
    return {
      leftDrawerOpen: false,
      sprav: [],
      main: [],
      transactions: [],
      trades: [],
      reports: [],
      routeName: "",
      confirm: false
    }
  },
  computed: {
    changeRouteName(){
      if( this.$store.getters.getCurrentRouteName==='main-user-cabinet-layout'){
        // this.$router.push("/my-facts")
        this.routeName = 'clients';
        return this.routeName;
      }
      this.routeName = this.$store.getters.getCurrentRouteName;
      return this.routeName;
    },
  },
  methods: {
    ...mapMutations([
      "setCurrentRouteName",
      "clearUser"
    ]),
    ...mapGetters([
      "getUserCategories",
      "getUser",
      "getCurrentRouteName",
    ]),

    getModules(){
      this.reports.splice(0, this.reports.length, ...this.$store.getters.getUserCategories.main_reports.children.filter(item => item.show));
      this.sprav.splice(0, this.sprav.length, ...this.$store.getters.getUserCategories.main_sprav.children.filter(item => item.show));
      this.main.splice(0, this.main.length, ...this.$store.getters.getUserCategories.main.children.filter(item => item.show));
      this.trades.splice(0, this.trades.length, ...this.$store.getters.getUserCategories.main_trades.children.filter(item => item.show));
      this.transactions.splice(0, this.transactions.length, ...this.$store.getters.getUserCategories.main_transactions.children.filter(item => item.show));
    },
    leftCabninet() {
      this.clearUser();
      this.$router.push('/')
    }

  },
  mounted() {
    this.getModules()
  }
}
</script>
