<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders">
      <q-header elevated class="bg-white text-black q-px-lg">
        <q-toolbar>
          <q-btn flat @click="leftDrawerOpen = !leftDrawerOpen" round dense icon="menu" />
          <q-toolbar-title>Mebel to'lov rejasi</q-toolbar-title>

          <q-btn
            round
            color="primary"
            dense
            @click="confirm = !confirm"
            icon="mdi-account-arrow-right-outline"
          />

        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        :breakpoint="500"
        bordered
        content-class="bg-white shadow-2"
      >
        <q-scroll-area class="fit">
          <q-list class="q-mt-lg">
            <q-item
              v-for="(module, index, arr) in userModules"
              :key="module.name"
              :active="changeRouteName===module.name"
              clickable
              v-ripple
              active-class="bg-teal-8 text-white"
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

    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="mdi-exclamation-thick" color="negative" text-color="white" size="md"/>
          <span class="q-ml-sm">Siz kabinetdan haqiqatdan chiqmoqchimisiz!!!</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Turn on Wifi" color="primary" @click="leftCabninet" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      this.userModules.splice(0, this.userModules.length, ...this.$store.getters.getUserCategories.main_user_cabinet_layout.children.filter(item => item.show));
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
