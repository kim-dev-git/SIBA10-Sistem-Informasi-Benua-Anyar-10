const state = {
  notifications: [],
}

const mutations = {
  postNotification(state, notification) {
    state.notifications.push({
      ...notification,
      id: (Math.random().toString(36) + Date.now().toString(36)).substr(2)
    })
  }
}

const actions = {
  post({ commit }, notification) {
    commit('postNotification', notification)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
