import Axios from 'axios'

import {cfghttp} from '../utils/constants'

export default ({app, router, store, Vue}) => {
  Axios.defaults.timeout = cfghttp.BASE_TIMEOUT;
// для передачи coockie и Authorization
  Axios.defaults.withCredentials = false;

  Axios.interceptors.response.use(
    (response) => {
      store.commit("decrementAjaxRequestsCnt");
      return response;
    },
    (error) => {
      store.commit("decrementAjaxRequestsCnt");
      if (!error.response) {
        return Promise.reject({
          type: 'warning',
          errorCode: -200,
          errorDescription: "",
          errorMessage: app.i18n.t("http.base_error")
        });
      }
      if (!error.response.data) {
        return Promise.reject({
          type: 'warning',
          errorCode: -200,
          errorDescription: "",
          errorMessage: app.i18n.t("http.base_error")
        });
      }
      if (error.response.data.ERROR.status === 401) {
        store.commit('clearUserSession');
        router.push('/');
        return Promise.reject({
          type: 'warning',
          errorCode: 401,
          errorDescription: "",
          errorMessage: app.i18n.t("http.session_timeout")
        });
      }
      if (error.response.data.ERROR.status === 403) {
        return Promise.reject({
          type: 'warning',
          errorCode: error.response.data.ERROR.code,
          errorDescription: error.response.data.ERROR.description,
          errorMessage: error.response.data.ERROR.message
        });
      }
      return Promise.reject({
        type: 'error',
        errorCode: error.response.data.ERROR.code,
        errorDescription: error.response.data.ERROR.description,
        errorMessage: error.response.data.ERROR.message
      });

    }
  );
  Axios.interceptors.request.use(
    function (request) {

      if (store.state.user !== null) {
        request.headers.Authorization = `Bearer ${store.state.user.accessToken}`;
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



