<template>
  <div id="classroom">
    <loading-state />
    <v-main v-if="!isLoading">
      <data-list :data="classroom" :forms="formClassroom" />
    </v-main>
  </div>
</template>

<script>

import LoadingState from '../../components/LoadingState'
import DialogBottom from '../../components/DialogBottom'
import FormList from '../../components/FormList'
import DataList from '../../components/DataList'
export default {
  components: {
    LoadingState,
    DialogBottom,
    FormList,
    DataList,
  },
  props: [
    'id'
  ],
  data: () => ({
    formClassroom: [
      { label: 'Wali Kelas', value: 'homeroomName', type: 'text' },
      { label: 'Angkatan', value: 'generation', type: 'number' },
      { label: 'Kelas', value: 'name', type: 'number' },
    ],
  }),
  computed: {
    classroom() {
      return this.$store.state.classrooms.document
    },
    isLoading() {
      return this.$store.state.isLoading
    }
  },
  watch: {
    classroom: {
      immediate: true,
      handler() {
        if(this.classroom && this.classroom.name) {
          this.$store.dispatch('setPage', {
            back: '/app/kelas',
            title: `Detail Kelas ${ this.classroom.name } (${ this.classroom.generation })`
          })
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch('classrooms/get', this.id)
  }
}
</script>

<style>

</style>