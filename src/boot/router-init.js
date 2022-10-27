import {setPath} from "src/store/mutations";

export default ({app, router, store, Vue}) => {
  router.beforeEach((to, from, next) => {
    // if (store.state.user === null && to.path !== '/' && to.path !== '/login-page' ) {
    //   setPath(store.state, to.path);
    //   next('/');
    //   return;
    // }
    next();
  });

  router.afterEach((to, from) => {
    // alert("beforeEach");
    store.commit('setCurrentRouteName', to.name ? to.name : '');
    // store.commit('setCurrentRouteCategoryName', to.matched[0] ? to.matched[0].name : '');

  });
  router.onReady(() => {

  });
}
