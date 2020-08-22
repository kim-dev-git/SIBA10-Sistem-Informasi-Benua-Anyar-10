import Vue from 'vue'
import Vuex from 'vuex'

import notifications from './modules/notifications'
import users from './modules/users'
import courses from './modules/courses'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    notifications,
    users,
    courses,
  },
  state: {
    isLoading: null,
    page: {
      back: null,
      title: ''
    },
    activeNavigation: null,
    menuNavigation: [
      { text: 'Dasbor', icon: 'mdi-view-dashboard', link: '/app', permission: ['Guru', 'Tata Usaha'] },
      { text: 'Jadwal', icon: 'mdi-calendar-clock', link: '/app/jadwal', permission: ['Guru', 'Tata Usaha'] },
      { text: 'Kelas', icon: 'mdi-account-group', link: '/app/kelas', permission: ['Guru', 'Tata Usaha'] },
      { text: 'Matpel', icon: 'mdi-bookmark', link: '/app/matapelajaran', permission: ['Tata Usaha'] },
      { text: 'Nilai', icon: 'mdi-counter', link: '/app/nilai', permission: ['Guru'] },
      { text: 'Profil', icon: 'mdi-account', link: '/app/profil', permission: ['Guru', 'Tata Usaha'] },
    ]
  },
  getters: {
    menuNavigation(state) {
      const menus = state.menuNavigation

      const role = state.users.profile.role

      const filteredMenus = []

      menus.forEach(menu => {
        menu.permission.forEach(p => {
          if(p === role) {
            filteredMenus.push(menu)
          }
        })
      })

      return filteredMenus
    }
  },
  mutations: {
    setLoading(state, val) {
      state.isLoading = val
    },
    setPage(state, val) {
      state.page = val
    },
    setNavigation(state, val) {
      state.activeNavigation = val
    },
  },
  actions: {
    setPage({ commit }, val) {
      commit('setPage', val)
    },
    setNavigation({ commit }, val) {
      commit('setNavigation', val)
    },
  }
})
