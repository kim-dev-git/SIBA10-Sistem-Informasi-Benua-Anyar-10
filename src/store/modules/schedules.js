import { serverTimestamp, Timestamp } from '../../firebase'
import moment from 'moment'
import * as Api from '../apis'

const END_POINT = 'schedules'

const state = {
  collection: [],
  document: {},
  studentByClass: []
}

const mutations = {
  setSchedules(state, val) {
    state.collection = val
  },
  setSchedule(state, val) {
    state.document = {}
    state.document = val
  },
  setScheduleByClass(state, val) {
    state.document = {}
    state.document = val
  },
}

const actions = {
  get({}, _id = null) {
    if(_id !== null) {
      return Api.getBy(END_POINT, 'classroomID', _id)
    } else {
      return Api.get(END_POINT)
    }
  }, 
  async post({}, data) {
    data.createdAt = serverTimestamp()
    Api.post(END_POINT, data, `Jadwal ${ data.course } Kelas ${ data.classroomName }(${ data.generation })`)
    Api.getBy(END_POINT, 'classroomID', data.classroomID)
  },
  async remove({}, data) {
    Api.remove(END_POINT, data, `Jadwal ${ data.course } Kelas ${ data.classroomName }(${ data.generation })`)
    Api.getBy(END_POINT, 'classroomID', data.classroomID)
  },
  async put({}, data) {
    data.editedAt = serverTimestamp()
    Api.put(END_POINT, data, `Jadwal ${ data.course } Kelas ${ data.classroomName }(${ data.generation })`)
    Api.getBy(END_POINT, 'classroomID', data.classroomID)
  },
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
