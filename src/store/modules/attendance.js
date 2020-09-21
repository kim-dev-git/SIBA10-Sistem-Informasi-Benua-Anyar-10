import { serverTimestamp } from '../../firebase'
import * as Api from '../apis'

const END_POINT = 'attendance'

const state = {
  collection: [],
  document: {},
}

const mutations = {
  setAttendances(state, val) {
    state.collection = val
  },
  setAttendance(state, val) {
    state.document = {}
    state.collection = val
  },
}

const actions = {
  get({}, id = null) {
    if(id !== null) {
      // console.log('id', id)
      return Api.get(END_POINT, id)
    } else {
      // console.log('all')
      return Api.get(END_POINT)
    }
  }, 
  async post({}, data) {
    data.createdAt = serverTimestamp()
    Api.post(END_POINT, data, 'Absensi ' + data.userName)
    Api.get(END_POINT)
  },
  async remove({}, data) {
    Api.remove(END_POINT, data, 'Absensi ' + data.userName)
    Api.get(END_POINT)
  },
  async put({}, data) {
    data.editedAt = serverTimestamp()
    Api.put(END_POINT, data, 'Absensi ' + data.userName)
    Api.get(END_POINT)
  },
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
