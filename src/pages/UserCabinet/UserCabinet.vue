<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders">
      <q-header elevated class="bg-primary">
        <q-toolbar>
          <q-btn flat @click="leftDrawerOpen = !leftDrawerOpen" round dense icon="menu" />
          <q-toolbar-title>Header</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        :breakpoint="500"
        bordered
        content-class="bg-secondary"
      >
        <q-scroll-area class="fit">
          <q-list class="">

            <q-item
              v-for="module in userModules"
              :key="module.name"
              clickable
              v-ripple
              active-class="bg-teal-8 text-white text-bold text-italic"
              :to="module.path"
              class="q-mb-lg"
            >
              <q-item-section avatar>
                <q-icon :name="module.meta.icon"/>
              </q-item-section>

              <q-item-section class=" text-subtitle1">
                {{ $t(module.meta.title) }}
              </q-item-section>
            </q-item>

          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <router-view/>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
export default {
  name: 'MainLayout',
  components: {
  },
  data () {
    return {
      leftDrawerOpen: false,
      userModules: [],
      routeName: "",
    }
  },
  methods: {
    ...mapMutations([
      'setUserInfo',
      'setUserLangCode',
      'setUserImg',
      "setCurLocale",
      "setCurrentRouteName",
    ]),
    ...mapGetters([
      "getUserCategories",
      "getUser",
      "getCurrentRouteName",
    ]),

    getModules(){
      this.userModules.splice(0, this.userModules.length, ...this.$store.getters.getUserCategories.main_user_cabinet_layout.children.filter(item => item.show));
    }
  },
  mounted() {
    this.getModules()
  }
}
</script>
