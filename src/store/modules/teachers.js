import { db, Timestamp } from '../../firebase'

const END_POINT = 'users'
const ref = db.collection(END_POINT)

const state = {
  collection: [],
  document: {},
}

const mutations = {
  setTeachers(state, val) {
    state.collection = val
  },
  setTeacher(state, val) {
    state.document = {}
    state.document = val
  },
}

const getters = {
  teacherItems(state) {
    const items = []
    state.collection.forEach(teacher => {
      var obj = teacher
      // obj.value = teacher.id
      // obj.id = teacher.id
      obj.value = teacher.name
      obj.text = ''
      if(teacher.prefix) {
        obj.text += teacher.prefix
      }
      if(teacher.name) {
        obj.text += teacher.name + ' '
      }
      if(teacher.suffix) {
        obj.text += teacher.suffix
      }

      items.push(obj)
    })
    return items
  },
}

const actions = {
  async get({ commit }, id = null ) {
    commit('setLoading', 'get', { root: true })

    if(id) {
      const q = await ref.doc(id).get()

      var data = q.data()
      data.id = q.id

      commit('setTeacher', data)
      commit('setLoading', null, { root: true })
      
    } else {
      ref.where('role', '==', 'Guru').get()
        .then(q => {
          let array = []
          q.forEach(doc => {
            let data = doc.data()
            data.id = doc.id

            array.push(data)
          })
          commit('setTeachers', array)
          commit('setLoading', null, { root: true })
        })
    }
  },
  async post({ commit, dispatch }, data) {
    commit('setLoading', 'post', { root: true })

    delete data.id

    await ref.add(data)
      .then(() => {
        dispatch('get')
        commit('setLoading', null, { root: true })
        dispatch('notifications/post', {
          // title: 'Update profil berhasil.',
          body: `${ data.name } berhasil ditambahkan.`,
        }, { root: true })
      })
      .catch(err => {
        dispatch('notifications/post', {
          title: `${ data.name } gagal ditambahkan.`,
          body: err,
          timeout: 10
        }, { root: true })
        
        commit('setLoading', null, { root: true })
      })
  },
  async put({ commit, dispatch }, data) {
    commit('setLoading', 'post', { root: true })

    const id = data.id

    delete data.id

    await ref.doc(id).set(data, { merge: true })
      .then(() => {
        dispatch('get')
        commit('setLoading', null, { root: true })
        dispatch('notifications/post', {
          // title: 'Update profil berhasil.',
          body: 'Update mata pelajaran berhasil.',
        }, { root: true })
      })
      .catch(err => {
        dispatch('notifications/post', {
          title: 'Update mata pelajaran gagal.',
          body: err,
          timeout: 10
        }, { root: true })
        
        commit('setLoading', null, { root: true })
      })
  },
  async remove({ commit, dispatch }, data) {
    commit('setLoading', 'post', { root: true })

    await ref.doc(data.id).delete()
      .then(() => {
        dispatch('get')
        commit('setLoading', null, { root: true })
        dispatch('notifications/post', {
          // title: 'Update profil berhasil.',
          body: `${ data.name } dihapus.`,
        }, { root: true })
      })
      .catch(err => {
        dispatch('notifications/post', {
          title: `${ data.name } gagal dihapus.`,
          body: err,
          timeout: 10
        }, { root: true })
        
        commit('setLoading', null, { root: true })
      })
  },
  
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
