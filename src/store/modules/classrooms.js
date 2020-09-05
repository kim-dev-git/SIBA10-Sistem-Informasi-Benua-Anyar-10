import { serverTimestamp, Timestamp } from '../../firebase'
import moment from 'moment'
import * as Api from '../apis'

const END_POINT = 'classrooms'

const state = {
  collection: [],
  document: {},
}

const mutations = {
  setClassrooms(state, val) {
    state.collection = val
  },
  setClassroom(state, val) {
    state.document = {}
    state.document = val
  },
}

const actions = {
  get({}, id = null) {
    if(id !== null) {
      return Api.get(END_POINT, id)
    } else {
      return Api.get(END_POINT)
    }
  }, 
  async post({}, data) {
    data.createdAt = serverTimestamp()
    Api.post(END_POINT, data, `Kelas ${ data.name }(${ data.generation })`)
    Api.get(END_POINT)
  },
  async remove({}, data) {
    Api.remove(END_POINT, data, `Kelas ${ data.name }(${ data.generation })`)
    Api.get(END_POINT)
  },
  async put({}, data) {
    data.editedAt = serverTimestamp()
    Api.put(END_POINT, data, `Kelas ${ data.name }(${ data.generation })`)
    Api.get(END_POINT)
  },
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
