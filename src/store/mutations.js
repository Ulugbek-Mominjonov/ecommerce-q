import initState from './state'


export function resetState(state) {
  Object.keys(initState).forEach(key => {
    state[key] = initState[key]
  });
}

export function setCurrentRouteName(state, val) {
  state.currentRouteName = val;
}

export function setUser(state, val) {
  state.user = val;
  state.token = val.accessToken
}

export function clearUser(state) {
  state.user = null;
  state.path = null;
}

export function clearUserSession(state) {
  state.userActions.splice(0, state.userActions.length);
  state.user = null;
  state.token = null;
}

export function setPath(state, val) {
  state.path = val;
}

