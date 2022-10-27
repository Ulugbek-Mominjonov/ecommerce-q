import Vue from 'vue'
import {Cookies} from 'quasar'


const cookieWorker = {
  setLangCode(bean) {
    Cookies.set("lang_code", JSON.stringify(bean), {expires: "1h"});
  },
  getLangCode() {
    return Cookies.get("lang_code");
  },
  setTask(bean) {
    Cookies.set("task_bean", JSON.stringify(bean),{ expires: '1h' });
  },
  getTask() {
    return Cookies.get("task_bean")
  },
  setDashboard(bean) {
    Cookies.set("dashboard_new", JSON.stringify(bean),{ expires: 365 });
  },
  getDashboard() {
    return Cookies.get("dashboard_new")
  },
  setUserLogin: function (userLogin) {
    Cookies.set("user_name", userLogin);
  },
  getUserLogin: function () {
    return Cookies.get("user_name");
  },
  isHasUserLogin: function () {
    return Cookies.has('user_name');
  },

  clearUserLogin: function () {
    Cookies.remove("user_name");
  },

};

Vue.prototype.$cookie = cookieWorker;





