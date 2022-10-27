import {urls} from '../utils/constants'


export function loadUserModules({commit}) {
  return new Promise((resolve, reject) => {
    this._vm.$axios.get(urls.USER_CATEGORIES + "?orderby_=ordering")
      .then(response => {
        const categories = response.data.rows;
        this._vm.$axios.get(urls.USER_MODULES + "?orderby_=ordering")
          .then(response => {
            const modules = response.data.rows;
            commit('setUserModulesCategories', getFilledModulesCategories(categories, modules));
            resolve();
          }).catch(e => {
          reject(e);
        });
      }).catch(e => {
      reject(e);
    });

  });
}


