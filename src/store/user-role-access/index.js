export default {
  namespaced: true,

  state: {
    userRolesId: -1,
    refreshAppActionsData: 0,
    refreshAppAccessListData: 0,
  },
  getters: {
    getUserRolesId(state) {
      return state.userRolesId;
    },

    getAppAccessListData(state) {
      return state.refreshAppAccessListData;
    },

    getAppActions(state) {
      return state.refreshAppActionsData;
    }
  },
  mutations: {
    setUserRolesId(state, val) {
      state.userRolesId = val;
    },

    incrementAppActions(state) {
      state.refreshAppActionsData++;
    },

    incrementAppAccessListData(state) {
      state.refreshAppAccessListData++;
    },

    decrementAppActions(state) {
      state.refreshAppActionsData--;
    },

    decrementAppAccessListData(state) {
      state.refreshAppAccessListData--;
    }
  }

}
