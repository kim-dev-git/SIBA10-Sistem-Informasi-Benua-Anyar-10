import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import { db, Timestamp } from '../firebase'

import notifications from './modules/notifications'
import users from './modules/users'
import courses from './modules/courses'
import classrooms from './modules/classrooms'
import teachers from './modules/teachers'
import schedules from './modules/schedules'
import inventorys from './modules/inventorys'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    notifications,
    users,
    courses,
    classrooms,
    teachers,
    schedules,
    inventorys,
  },
  state: {
    error: null,
    isLoading: null,
    page: {
      back: null,
      title: ''
    },
    activeNavigation: null,
    menuNavigation: [
      { text: 'Dasbor', icon: 'mdi-view-dashboard', link: '/app', permission: ['Guru'] },
      { text: 'Jadwal', icon: 'mdi-calendar-clock', link: '/app/jadwal', permission: ['Guru', 'Tata Usaha'] },
      { text: 'Kelas', icon: 'mdi-account-group', link: '/app/kelas', permission: ['Guru', 'Tata Usaha'] },
      { text: 'Matpel', icon: 'mdi-bookmark', link: '/app/matapelajaran', permission: ['Tata Usaha'] },
      { text: 'Nilai', icon: 'mdi-counter', link: '/app/nilai', permission: ['Guru'] },
      { text: 'Inventaris', icon: 'mdi-counter', link: '/app/inventaris', permission: ['Tata Usaha'] },
      { text: 'Profil', icon: 'mdi-account', link: '/app/profil', permission: ['Guru', 'Tata Usaha'] },
    ],
    generations: []
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
    },
    generations(state) {
      const array = []
      state.generations.forEach(a => {
        const data = {
          id: a.id,
          value: a.generation
        }
        array.push(data)
      })
      return array
    }
  },
  mutations: {
    setError(state, val) {
      state.error = val
    },
    setLoading(state, val) {
      state.isLoading = val
    },
    setPage(state, val) {
      state.page = val
    },
    setNavigation(state, val) {
      state.activeNavigation = val
    },
    setGenerations(state, val) {
      state.generations = val
    },
  },
  actions: {
    setPage({ commit }, val) {
      commit('setPage', val)
    },
    setNavigation({ commit }, val) {
      commit('setNavigation', val)
    },
    async getGenerations({ commit }, id = null ) {
      commit('setLoading', 'get', { root: true })

      const ref = db.collection('generations')
  
      if(id) {
        const q = await ref.doc(id).get()
  
        var data = q.data()
        data.id = q.id
  
        commit('seGenerations', data)
        commit('setLoading', null, { root: true })
        
      } else {
        ref.orderBy('generation').get()
          .then(q => {
            let array = []
            q.forEach(doc => {
              let data = doc.data()
              data.id = doc.id
  
              array.push(data)
            })
            commit('setGenerations', array)
            commit('setLoading', null, { root: true })
          })
      }
    },
  }
})