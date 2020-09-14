import { serverTimestamp } from '../../firebase'
import * as Api from '../apis'

const END_POINT = 'courses'

const state = {
  collection: [],
  document: {},
}

const mutations = {
  setCourses(state, val) {
    state.collection = val
  },
  setCourse(state, val) {
    state.document = {}
    state.document = val
  },
}

const getters = {
  courseItems(state) {
    var arr = []
    state.collection.forEach(v => {
      var obj = {
        // text: v.name,
        // value: v.abbreviation,
        value: v.name,
      }
      arr.push(obj)
    })
    return arr
  }
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
    Api.post(END_POINT, data, data.name)
    Api.get(END_POINT)
  },
  async remove({}, data) {
    Api.remove(END_POINT, data, data.name)
    Api.get(END_POINT)
  },
  async put({}, data) {
    data.editedAt = serverTimestamp()
    Api.put(END_POINT, data, data.name)
    Api.get(END_POINT)
  },
  
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
