<template>
  <div id="schedules">
    <v-container>
      <v-layout>
        <v-spacer />
        <v-btn
          to="/app/matapelajaran"
          class="text-none mb-3"
          color="primary">
          <v-icon v-text="'mdi-bookmark'" left />
          <span v-text="'Mata Pelajaran'" />
        </v-btn>
      </v-layout>

      <v-sheet
        color="grey lighten-5">
        <v-layout
        class="pa-4">
          <v-spacer />
          <v-btn
            @click="dialogGeneration = true"
            color="primary"
            outlined
            rounded>
            <v-icon v-text="'mdi-filter'" class="ml-1" left />
            <span v-text="filter.generation ? filter.generation : 'Angkatan'" class="text-none mr-1" />

          </v-btn>
        </v-layout>
        <v-divider />
      </v-sheet>

      <data-list id="classroom-data"
        :headers="headers"
        :items="classroomsByGeneration()"
        :forms="formClassroom"
        sortBy="name"
        @click="$router.push('jadwal/' + $event.id)">
        
          <template #column="{ value, header, item }">
            <div v-if="header.value === 'action'"></div>
            <p id="default"
              v-else
              v-text="value ? value : '-'"
              class="py-4"
              :class="header.align ? `text-${ header.align } mb-0` : 'mb-0'"
            />
          </template>

          <template #compact-content="{ item }">
            <div>
              <v-chip color="success" dark small>
                <span v-text="item.generation" class="caption" />
              </v-chip>
              <v-chip color="info" class="ml-1" dark small>
                <span v-text="'Kelas ' + item.name" class="caption" />
              </v-chip>
              <div
                class="mt-1">
                <span v-text="'Wali Kelas: '" class="subtitle-2 text--secondary" />
                <span v-text="item.homeroomName" class="subtitle-2 mt-1 mb-0" />
              </div>
            </div>

          </template>

      </data-list>
      
      <dialog-bottom id="dialog-generation"
        @close="filter = {}"
        @action="$forceUpdate(), dialogGeneration = false"
        v-model="dialogGeneration"
        :title="'Filter bedasarkan angkatan'"
        buttonCancel="Tampilkan Semua"
        buttonAction="Filter">
        <form-item-combobox
          :label="'Angkatan'"
          :data="filter"
          value="generation"
          :items="generations"
          color="primary"
        />
      </dialog-bottom>

    </v-container>
  </div>
</template>

<script>

import DialogBottom from '../../components/DialogBottom'
import DataList from '../../components/DataList'
import FormItemCombobox from '../../components/FormItemCombobox'
export default {
  components: {
    DialogBottom,
    DataList,
    FormItemCombobox,
  },
  data: () => ({
    filter: {},
    dialogTitle: '',
    dialogGeneration: false,
    dialogMenu: false,
    dialogEdit: false,
    dialogDelete: false,
    dataClassroom: {},
    headers: [
      { text: 'Kelas', value: 'name' },
      { text: 'Angkatan', value: 'generation' },
      { text: 'Wali Kelas', value: 'homeroomName' },
    ],
    formClassroom: [
      { label: 'Kelas', value: 'name', type: 'text' },
      { label: 'Angkatan', value: 'generation', type: 'combobox' },
      { label: 'Wali Kelas', value: 'homeroomName', type: 'combobox' },
    ],
  }),
  computed: {
    classrooms() {
      return this.$store.state.classrooms.collection
    },
    schedules() {
      return this.$store.state.schedules.collection
    },
    schedule() {
      return this.$store.state.schedules.document
    },
    generations() {
      return this.$store.getters.generations
    },
  },
  methods: {
    getClassrooms() {
      this.$store.dispatch('classrooms/get')
    },
    getSchedules() {
      this.$store.dispatch('schedules/get')
      this.$store.dispatch('schedules/get', 'H3kURogEgo3tvehxwzuE')
    },
    postSchedules() {
      var data = {
        a: 'Judul',
        b: 'Deskripsi',
      }
      this.$store.dispatch('schedules/post', data)
    },
    removeSchedules(data) {
      this.$store.dispatch('schedules/remove', data)
    },
    editSchedules(data) {
      data.a = 'Edited'
      this.$store.dispatch('schedules/put', data)
    },
    
    classroomsByGeneration() {
      var filter = this.filter.generation

      if(filter) {
        var filtered = this.classrooms.filter(classroom => {
          return classroom.generation == filter
        })
        return filtered
      } else {
        return this.classrooms
      }
    },
  },
  mounted() {
    this.$store.dispatch('setPage', {
      back: null,
      title: 'Jadwal'
    })

    this.getClassrooms()
    this.getSchedules()
  }
}
</script>

<style>

</style>