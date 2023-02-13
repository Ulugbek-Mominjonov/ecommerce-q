import Axios from 'axios'

import {cfghttp} from '../utils/constants'

export default ({app, router, store, Vue}) => {
  Axios.defaults.timeout = cfghttp.BASE_TIMEOUT;
  Axios.defaults.withCredentials = false;

  Axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        store.commit('clearUserSession');
        router.push('/');
        return Promise.reject(error)
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
      return request;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  Vue.prototype.$axios = Axios;
}
