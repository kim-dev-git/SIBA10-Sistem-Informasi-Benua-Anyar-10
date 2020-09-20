import { serverTimestamp, Timestamp } from '../../firebase'
import moment from 'moment'
import * as Api from '../apis'

const END_POINT = 'scores'

const state = {
  collection: [],
  document: {},
}

const mutations = {
  setScores(state, val) {
    state.collection = val
  },
  setScore(state, val) {
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
    Api.post(END_POINT, data, `Nilai ${ data.name }`)
    Api.get(END_POINT)
  },
  async remove({}, data) {
    Api.remove(END_POINT, data, `Nilai ${ data.name }`)
    Api.get(END_POINT)
  },
  async put({}, data) {
    data.editedAt = serverTimestamp()
    Api.put(END_POINT, data, `Nilai ${ data.name }`)
    Api.get(END_POINT)
  },
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
