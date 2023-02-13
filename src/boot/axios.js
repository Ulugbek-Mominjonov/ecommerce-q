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
      if (error.response.status === 401) {
        store.commit('clearUserSession');
        router.push('/');
        return Promise.reject({
          type: 'warning',
          errorCode: 401,
          errorDescription: "",
          errorMessage: app.i18n.t("http.session_timeout")
        });
      } else {
        return Promise.reject(error)
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
