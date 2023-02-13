import Axios from 'axios'

import {cfghttp} from '../utils/constants'

export default ({app, router, store, Vue}) => {
  Axios.defaults.timeout = cfghttp.BASE_TIMEOUT;
  Axios.defaults.withCredentials = false;

  Axios.interceptors.response.use(
    (response) => {
      store.commit("decrementAjaxRequestsCnt");
      return response;
    },
    (error) => {
      store.commit("decrementAjaxRequestsCnt");
      if (error.response.status == 401) {
        store.commit('clearUserSession');
        router.push('/');
        return Promise.reject({
          type: 'warning',
          errorCode: 401,
          errorDescription: "",
          errorMessage: app.i18n.t("http.session_timeout")
        });
      } else if (error.response.status == 403) {
        this.$q.notify({
          type: 'negative',
          message: `Бу бўлимга кириш учун сизга рухсат йўқ`
        })
      } else{
        if (error.response.data.status == 409 || error.response.data.status == 410){
          this.$q.notify({
            type: 'negative',
            message: `Логин ёки парол нотўғри киритилди`
          })
          this.$q.notify({
            icon: 'done',
            caption: '',
            color: 'positive',
            message: 'Tizimga muvafiqiyatli kirildi.'
          })
        } else{
          alert(error.response.data.message)
        }
      }
    }
  );
  Axios.interceptors.request.use(
    function (request) {

      if (store.state.user !== null) {
        request.headers.Authorization = `Bearer ${store.state.token}`;
      }
      store.commit("incrementAjaxRequestsCnt");
      return request;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  Axios.prototype.sayhello=function(){
    console.log('---say hello');
  };
  Vue.prototype.$axios = Axios;
}
