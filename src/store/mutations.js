import initState from './state'


export function resetState(state) {
  Object.keys(initState).forEach(key => {
    state[key] = initState[key]
  });
}

export function setCurrentRouteName(state, val) {
  state.currentRouteName = val;
}

export function setCurrentRouteCategoryName(state, val) {
  state.currentRouteCategoryName = val;
}

export function incrementAjaxRequestsCnt(state, val) {
  state.ajaxRequestsCnt++;
}

export function decrementAjaxRequestsCnt(state, val) {
  state.ajaxRequestsCnt--;
  console.log(val)
}

export function resetAjaxRequestsCnt(state, val) {
  state.ajaxRequestsCnt = 0;
}

export function setUser(state, val) {
  state.user = val;
  state.token = val.accessToken
}

export function clearUser(state) {
  state.user = null;
  state.path = null;
}


export function setUserActions(state, newUserActions) {
  // if (state.userActions === null) {
  //   state.userActions = newUserActions;
  //   return;
  // }
  state.userActions.splice(0, state.userActions.length, ...newUserActions);
  //state.userActions=val;
}

export function clearUserActions(state) {
  state.userActions.splice(0, state.userActions.length);

  //state.userActions=null;
}

export function clearUserSession(state) {
  state.userActions.splice(0, state.userActions.length);
  state.user = null;
  state.token = null;
}

export function setBaseLeftDrawer(state, val) {
  state.baseLeftDrawer = val;
}

export function setBaseRightDrawer(state, val) {
  state.baseRightDrawer = val;
}

export function setUserModulesCategories(state, userModulescategories) {
  state.userModulescategories = userModulescategories;
}

export function setPath(state, val) {
  state.path = val;
}

