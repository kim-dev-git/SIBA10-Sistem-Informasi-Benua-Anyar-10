<template>
  <div id="classroom">
    <loading-state />
    <v-main v-if="!isLoading">
      <data-list :data="classroom" :forms="formClassroom" />
      
      <v-layout class="py-2 grey lighten-3">
        <div
          class="scroll py-2 px-4">
          <v-btn
            v-for="i in 32"
            :key="i"
            class="mr-2"
            color="primary"
            outlined
            rounded>
            <span v-text="'Kelas'" class="mx-2" />
          </v-btn>
        </div>
      </v-layout>
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

<style lang="scss" scoped>
  .scroll {
    overflow: auto;
    white-space: nowrap;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scroll::-webkit-scrollbar {
    display: none;  /* Chrome */
  }
</style>