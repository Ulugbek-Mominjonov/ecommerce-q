<template>
  <q-page
    class="window-height window-width row justify-center items-center login-bg"
  >
    <div class="column q-pa-lg login-content">
      <div class="row">
        <q-card square class="shadow-24 bordered flex column" style="width:400px;height:450px; border-radius: 20px !important;">
          <q-card-section style="background-image: linear-gradient(to right, #606c88 0%, #3f4c6b 51%, #606c88 100%);">
            <h4 class="text-h5 text-white q-my-xs text-center text-h6">{{ title }}</h4>
          </q-card-section>
          <q-card-section>
            <q-form class="q-px-sm q-pt-xl">
              <q-input
                ref="username"
                square
                v-model="username"
                lazy-rules
                :rules="[this.required,this.short]"
                type="username" label="Foydalanuvchi">
                <template v-slot:prepend>
                  <q-icon name="person" color="teal-10"/>
                </template>
                <template v-slot:append>
                  <q-icon v-if="username !== null" name="close" size="sm" @click="username = null" class="cursor-pointer"/>
                </template>
              </q-input>
              <q-input
                ref="password"
                square
                v-model="password" :type="passwordFieldType"
                lazy-rules
                :rules="[this.required,this.short]"
                label="Parol">

                <template v-slot:prepend>
                  <q-icon name="lock" color="teal-10"/>
                </template>
                <template v-slot:append>
                  <q-icon v-if="password !== null" name="close" size="sm" @click="password = null" class="cursor-pointer"/>
                  <q-icon
                    :name="visibilityIcon" @click="switchVisibility" class="cursor-pointer"/>
                </template>
              </q-input>
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-lg q-mt-auto q-mb-lg">
            <button
              @click="submit"
              class="text-white login-button">Kirish</button>
          </q-card-actions>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script>

import {urls} from "src/utils/constants";
import {mapMutations} from 'vuex';
import {mapGetters} from 'vuex';
import qs from 'qs';

export default {
  name: "LoginPage",
  data() {
    return {
      title: 'Tizimga kirish',
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
      return  (val && val.length > 0 || 'Bu maydon to\'ldirilishi kerak')
    },
    diffPassword (val) {
      const val2 = this.$refs.password.value
      return (val && (val===val2) || 'Parol mos kelmadi')
    },
    short(val) {
      return  (val && val.length > 1 || 'Parol juda qisqa')
    },
    isEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return (emailPattern.test(val) || 'To\'g\'ri email kiriting')
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
          this.$axios.post(urls.LOGIN, qs.stringify({
            username: this.username, //gave the values directly for testing
            password: this.password,
          }), {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }).then(response => {
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
              this.$q.notify({
                icon: 'done',
                caption: '',
                color: 'positive',
                message: 'Tizimga muvafiqiyatli kirildi!!!'
              })
              this.$router.push({
                path: '/worker-types',
              })
            }).catch(response => {
            console.log(response)
            // this.error = error.errorMessage === '' ? error.errorDescription : error.errorMessage
            this.showError(response)
            }).finally(() => {
          });
        }
    },
    switchTypeForm(){
      this.register = !this.register
      this.title = this.register ? 'Yangi xodim' : 'Tizimga kirish'
      this.btnLabel = this.register ? 'Ro\'yhatdan o\'tish' : 'Tizimga kirish'
    },
    switchVisibility() {
      this.visibility = !this.visibility
      this.passwordFieldType = this.visibility ? 'text' : 'password'
      this.visibilityIcon =  this.visibility ? 'visibility_off' : 'visibility'
    }
  }
}
</script>

<style lang="scss">
  .login-bg {
    position: relative;
    background: url("../../assets/login.png");
    background-size: cover;
    z-index: 1;

    .login-content {
      position: relative;
      z-index: 99;
    }

    &::before {
      display: block;
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
      z-index: 2;
    }

    .login-button {
      width: 70%;
      margin: 10px auto;
      padding: 15px 45px;
      text-align: center;
      text-transform: uppercase;
      transition: .5s;
      background-size: 200% auto;
      color: #fff;
      box-shadow: 0 0 20px #eee;
      border-radius: 10px;
      border: none;
      display: block;
      background-image: linear-gradient(to right, #606c88 0%, #3f4c6b 51%, #606c88 100%);

      &:hover {
        background-position: right center;
        color: #fff;
        text-decoration: none;
      }
    }
  }
</style>
