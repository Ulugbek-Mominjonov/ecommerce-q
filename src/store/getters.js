import * as modulesCategories from '../router/categories'
import * as categories from '../router/categories'

export function getCurLocale(state) {
  return state.curLocale;
}
export function getUserCategories(state){
  const modulesArr = Object.assign({}, categories);
  return modulesArr;
}

export function getUser(state) {
  return state.user;
}

export function getLang(state) {
  return state.lang;
}

export function getCurrentRouteName(state) {
  return state.currentRouteName;
}

export function getPath(state) {
  return state.path;
}



