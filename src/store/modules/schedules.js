import { Timestamp } from '../../firebase'
import * as Api from '../apis'

const END_POINT = 'schedules'

const state = {
  collection: [],
  document: {},
}

const mutations = {
  setSchedules(state, val) {
    state.collection = val
  },
  setSchedule(state, val) {
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
    Api.post(END_POINT, data, 'Jadwal')
    Api.get(END_POINT)
  },
  async remove({}, data) {
    Api.remove(END_POINT, data, 'Jadwal')
    Api.get(END_POINT)
  },
  async put({}, data) {
    Api.put(END_POINT, data, data.a)
    Api.get(END_POINT)
  },
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
