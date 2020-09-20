import Vue from 'vue'
import moment from 'moment'

Vue.filter("fullTime", value => {
  moment.locale('id')
  if(value && value.seconds) {
    return moment.unix(value.seconds).format('HH:mm')
  } else {
    return moment(value).format('HH:mm')
  }
})