import { serverTimestamp, Timestamp } from '../../firebase'
import moment from 'moment'
import * as Api from '../apis'

const END_POINT = 'funds'

const state = {
  collection: [],
  document: {},
}

const mutations = {
  setFunds(state, val) {
    state.collection = val
  },
  setFund(state, val) {
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
    moment.locale('id')
    data.createdAt = serverTimestamp()
    if(data.enteredAt) {
      var date = moment(data.enteredAt)
      data.enteredAt = Timestamp.fromDate(date._d)
    }
    Api.post(END_POINT, data, data.type)
    Api.get(END_POINT)
  },
  async remove({}, data) {
    Api.remove(END_POINT, data, data.type)
    Api.get(END_POINT)
  },
  async put({}, data) {
    moment.locale('id')
    data.createdAt = serverTimestamp()
    if(data.enteredAt) {
      var date = moment(data.enteredAt)
      data.enteredAt = Timestamp.fromDate(date._d)
    }

    data.editedAt = serverTimestamp()
    Api.put(END_POINT, data, data.type)
    Api.get(END_POINT)
  },
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
