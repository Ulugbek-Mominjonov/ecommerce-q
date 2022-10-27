<template>
  <q-page
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#8274C5, #5A4A9F);"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24 bordered" style="width:400px;height:540px;">
          <q-card-section class="bg-deep-purple-7">
            <h4 class="text-h5 text-white q-my-md">{{ title }}</h4>

          </q-card-section>
          <q-card-section>
            <q-fab
              color="primary" @click="switchTypeForm"
              icon="add"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%);"
            >
              <q-tooltip>
                Регистрация нового пользователя
              </q-tooltip>
            </q-fab>
            <q-form class="q-px-sm q-pt-xl">
              <q-input
                ref="email"
                clearable
                outlined
                v-if="register"
                v-model="email"
                type="email"
                lazy-rules
                :rules="[this.required,this.isEmail,this.short]"
                label="Email">
                <template v-slot:prepend>
                  <q-icon name="email"/>
                </template>
              </q-input>
              <q-input
                ref="username"
                square
                clearable
                v-model="username"
                lazy-rules
                :rules="[this.required,this.short]"
                type="username" label="Пользователь">
                <template v-slot:prepend>
                  <q-icon name="person"/>
                </template>
              </q-input>
              <q-input
                ref="password"
                square
                clearable
                v-model="password" :type="passwordFieldType"
                lazy-rules
                :rules="[this.required,this.short]"
                label="Пароль">

                <template v-slot:prepend>
                  <q-icon name="lock"/>
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="visibilityIcon" @click="switchVisibility" class="cursor-pointer"/>
                </template>
              </q-input>
              <q-input
                ref="repassword"
                v-if="register"
                square
                clearable
                v-model="repassword" :type="passwordFieldType"
                lazy-rules
                :rules="[this.required,this.short,this.diffPassword]"
                label="Повторить пароль">
                <template v-slot:prepend>
                  <q-icon name="lock"/>
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="visibilityIcon" @click="switchVisibility" class="cursor-pointer"/>
                </template>
              </q-input>
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-lg">
            <q-btn
              unelevated
              size="lg"
              color="secondary"
              @click="submit"
              class="full-width text-white" :label="btnLabel"/>
          </q-card-actions>
          <q-card-section
            v-if="!register"
            class="text-center q-pa-sm">
            <p class="text-grey-6">Забыли пароль?</p>
          </q-card-section>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script>

import {urls} from "src/utils/constants";
import {mapMutations} from 'vuex';
import {mapGetters} from 'vuex';

export default {
  name: "LoginPage",
  data() {
    return {
      title: 'Авторизация',
      email: '',
      username: '',
      password: '',
      repassword: '',
      register: false,
      passwordFieldType: 'password',
      btnLabel: 'Вход',
      visibility: false,
      visibilityIcon: 'visibility'
    }
  },
  methods: {
    ...mapGetters([
      'getCurrentRouteName',
      'getCurrentRouteCategoryName',
      'getUser',
    ]),
    ...mapMutations([
      'setUser',
      'clearUser',
      'setUserActions',
      'clearUserActions',
    ]),
    required (val) {
      return  (val && val.length > 0 || 'Поле должно быть заполнено')
    },
    diffPassword (val) {
      const val2 = this.$refs.password.value
      return (val && (val===val2) || 'Пароль не совпадает!')
    },
    short(val) {
      return  (val && val.length > 3 || 'Значение слишком короткое')
    },
    isEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return (emailPattern.test(val) || 'Введите корректный email')
    },
    submit () {
      if (this.register){
        this.$refs.email.validate()
        this.$refs.username.validate()
        this.$refs.password.validate()
        this.$refs.repassword.validate()
      } else {
        this.$refs.username.validate()
        this.$refs.password.validate()
      }

      if (!this.register)
        if (!this.$refs.username.hasError && (!this.$refs.password.hasError))
        {
          this.$axios.post(urls.LOGIN, {
            username: this.username,
            password: this.password
          })
            .then(response => {
              console.log(response)
              if (!response.data) {
                return;
              }
              // console.log("------1")
              // console.log(response.data.user.login)
              // if (this.loginModel.remember) {
              //   this.$cookie.setUserLogin(response.data.user.login);
              // } else {
              //   this.$cookie.clearUserLogin();
              // }
              this.setUser(response.data);
              // this.$i18n.locale = this.$store.state.lang_code;
              // this.setRouterPath('/main-user-cabinet-layout')
              // this.$emit('changeTab', '0')
              this.$router.push({
                path: '/clients',
              }).finally(() => {
              })
            }).catch(error => {
            console.log(error)
            this.error = error.errorMessage === '' ? error.errorDescription : error.errorMessage
          }).finally(() => {
          });
          this.$q.notify({
            icon: 'done',
            color: 'positive',
            message: 'Авторизация'
          })
        }
    },
    switchTypeForm(){
      this.register = !this.register
      this.title = this.register ? 'Новый пользователь' : 'Авторизация'
      this.btnLabel = this.register ? 'Регистрация' : 'Вход'
    },
    switchVisibility() {
      this.visibility = !this.visibility
      this.passwordFieldType = this.visibility ? 'text' : 'password'
      this.visibilityIcon =  this.visibility ? 'visibility_off' : 'visibility'
    }
  }
}
</script>

<style scoped>

</style>
