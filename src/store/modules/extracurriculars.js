import { serverTimestamp } from '../../firebase'
import * as Api from '../apis'

const END_POINT = 'extracurriculars'

const state = {
  collection: [],
  document: {},
}

const getters = {
  extracurricularItems(state) {
    const items = []
    state.collection.forEach(extracurricular => {
      var obj = extracurricular

      obj.value = extracurricular.name

      items.push(obj)
    })

    function compare(a, b) {
      // Use toUpperCase() to ignore character casing
      const key = 'name'
      const itemA = a[key].toUpperCase();
      const itemB = b[key].toUpperCase();
    
      let comparison = 0;
      if (itemA > itemB) {
        comparison = 1;
      } else if (itemA < itemB) {
        comparison = -1;
      }
      return comparison;
    }

    return items.sort(compare)
  },
}

const mutations = {
  setExtracurriculars(state, val) {
    state.collection = val
  },
  setExtracurricular(state, val) {
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

  
  async addStudent({}, data) {
    var obj = {
      id: data.studentID,
      extracurricular: data.extracurricular,
      extracurricularID: data.extracurricularID,
      editedAt: serverTimestamp()
    }

    Api.put('students', obj, data.student)
    Api.get('students')
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
