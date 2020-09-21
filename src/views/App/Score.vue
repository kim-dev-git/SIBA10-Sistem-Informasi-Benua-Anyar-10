<template>
  <div id="score">
    <loading-state />
    <div v-if="!isLoading">

      <button-add @click="add()" text="Tambah Nilai" />

      <v-sheet
        color="grey lighten-5">
        <v-layout
          class="pa-4">
          <v-spacer />
          <v-btn
            @click="dialogCourse = true"
            color="primary"
            outlined
            rounded>
            <v-icon v-text="'mdi-filter'" class="ml-1" left />
            <span v-text="filter.course ? filter.course : 'Pilih mata pelajaran'" class="text-none mr-1" />

          </v-btn>
        </v-layout>
        <v-divider />
      </v-sheet>
      

      <data-list id="student-data"
          :headers="headers"
          :items="scoreByCourse()"
          :forms="formScore"
          :sortBy="['day', 'from']"
          :headersPrint="headersPrint"
          :title="`Nilai Kelas ${ classroom.name }(${ classroom.generation })`"
          @edit="select($event), selectAction('edit')"
          @remove="select($event), selectAction('remove')"
          @action="select($event)">
          
          <template #column="{ value, header, item }">
              <div v-if="header.value === 'action'" />
              <v-layout v-else-if="header.value === 'time'">
                  <!-- <v-icon v-text="'mdi-clock'" class="mr-1" /> -->
                  <span v-text="item.from + ' - ' + item.to" class="subtitle-2 font-weight-bold" />
              </v-layout>
              <p id="default"
                  v-else
                  v-text="value ? value : '-'"
                  class="py-4"
                  :class="header.align ? `text-${ header.align } mb-0` : 'mb-0'"
              />
          </template>

          <template #compact-content="{ item }">
              <div>
                  <v-layout
                      class="align-center">
                      <v-chip color="info" dark small>
                          <span v-text="item.day" class="caption" />
                      </v-chip>
                      <v-spacer />
                      <v-icon v-text="'mdi-clock'" class="mr-1" />
                      <span v-text="item.from + ' - ' + item.to" class="subtitle-2 font-weight-bold" />
                  </v-layout>
                  <div
                      class="mt-1">
                      <span v-text="item.course" class="subtitle-2 text--secondary" />
                  </div>
              </div>

          </template>

      </data-list>

    </div>

      <dialog-bottom id="dialog-menu"
        v-model="dialogMenu"
        :title="'Aksi'"
        buttonCancel="Batal">
          <v-list
            class="mt-n4">
            <v-list-item-group>
              <v-list-item
                v-for="(action, index) in actions"
                :key="index"
                @click="selectAction(action.value)"
                class="mx-n3"
                color="primary">
                <v-list-item-avatar>
                  <v-icon v-text="action.icon" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <span v-text="`${ action.text }`" />
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
      </dialog-bottom>

      <dialog-bottom id="dialog-edit"
        @action="post()"
        v-model="dialogEdit"
        :title="dialogTitle"
        buttonCancel="Batal"
        buttonAction="Simpan"
        persistent>
        <form-list :forms="formScore" :data="dataScore" :items="comboboxItems" />
      </dialog-bottom>

      <dialog-bottom id="dialog-delete"
        @action="remove()"
        v-model="dialogDelete"
        :title="dialogTitle"
        buttonCancel="Batal"
        buttonAction="Hapus"
        buttonActionColor="error"
        persistent>
        <v-card
          class="pa-4"
          color="grey lighten-3"
          flat>
          <span
            v-html="`Yakin hapus nilai <b>${ dataScore.course }(Nilai ${ dataScore.classroomName })</b>?`"
            class="text--secondary"
          />
        </v-card>
      </dialog-bottom>
      
      <dialog-bottom id="dialog-day"
        @close="filter = {}"
        @action="$forceUpdate(), dialogCourse = false"
        v-model="dialogCourse"
        :title="'Pilih mata pelajaran'"
        buttonCancel="Tampilkan Semua"
        buttonAction="Filter">
        <form-item-combobox
          :label="'Pilih mata pelajaran'"
          :data="filter"
          value="course"
          :items="courseItems"
          color="primary"
        />
      </dialog-bottom>

  </div>
</template>

<script>

import LoadingState from '../../components/LoadingState'
import DialogBottom from '../../components/DialogBottom'
import DataList from '../../components/DataList'
import FormList from '../../components/FormList'
import ButtonAdd from '../../components/ButtonAdd'
import FormItemCombobox from '../../components/FormItemCombobox'
export default {
    components: {
        LoadingState,
        DialogBottom,
        DataList,
        FormList,
        ButtonAdd,
        FormItemCombobox,
    },
    props: [ 'id' ],
    data: () => ({
        headers: [
          { text: 'Siswa', value: 'student' },
          { text: 'Mata Pelajaran', value: 'course' },
          { text: 'Tugas', value: 'assignment' },
          { text: 'UTS', value: 'mid' },
          { text: 'UAS', value: 'final' },
          { text: '', value: 'action', sortable: false },
        ],
        headersPrint: [
          { header: 'Siswa', dataKey: 'student' },
          { header: 'Mata Pelajaran', dataKey: 'course' },
          { header: 'Tugas', dataKey: 'assignment' },
          { header: 'UTS', dataKey: 'mid' },
          { header: 'UAS', dataKey: 'final' },
        ],
        formScore: [
          { label: 'Siswa', value: 'student', type: 'combobox' },
          { label: 'Nilai Tugas', value: 'assignment', type: 'number' },
          { label: 'Nilai UTS', value: 'mid', type: 'number' },
          { label: 'Nilai UAS', value: 'final', type: 'number' },
        ],
        filter: {},
        dataScore: {},
        dialogTitle: null,
        dialogMenu: false,
        dialogEdit: false,
        dialogDelete: false,
        dialogCourse: false,
        actions: [
          { text: 'Edit', value: 'edit', icon: 'mdi-pencil' },
          { text: 'Hapus', value: 'remove', icon: 'mdi-delete' },
        ],
    }),
    computed: {
      isLoading() {
        return this.$store.state.isLoading
      },
      scores() {
        const items = this.$store.state.scores.collection
        const id = this.id
        return items.filter(v => {
          return v.classroomID === id
        })
      },
      classroom() {
        return this.$store.state.classrooms.document
      },
      courseItems() {
        return this.$store.getters['courses/courseItems']
      },
      teacherItems() {
        return this.$store.getters['teachers/teacherItems']
      },
      days() {
        return [
          { value: 'Senin' },
          { value: 'Selasa' },
          { value: 'Rabu' },
          { value: 'Kamis' },
          { value: 'Jumat' },
          { value: 'Sabtu' },
        ]
      },
      dayItems() {
        const days = [
          'Senin',
          'Selasa',
          'Rabu',
          'Kamis',
          'Jumat',
          'Sabtu',
        ]
        const arr = []
        days.forEach((v, i) => {
          var obj = {
            // text: v,
            // value: i,
            value: v,
          }
          arr.push(obj)
        })
        return arr
      },
      studentItems() {
        const items = this.$store.getters['students/studentItems']
        const classroomID = this.classroom.id
        const filtered = items.filter(v => {
          return v.classroomID === classroomID
        })
        return filtered
      },
      comboboxItems() {
        var items = {
          course: this.courseItems,
          student: this.studentItems
        }
        return items
      }
    },
    methods: {
      get() {
        this.$store.dispatch('scores/get', this.id)
      },
      post() {
        var data = this.dataScore
        if(data.id) {
          this.$store.dispatch('scores/put', data)
        } else {
          data.classroomID = this.classroom.id
          data.classroomName = this.classroom.name
          data.generation = this.classroom.generation
          data.course = this.filter.course
          data.courseID = this.filter.courseID
          console.log(data)
          this.$store.dispatch('scores/post', data)
        }
        this.dialogEdit = false
        this.dialogTitle = ''
        this.dataScore = {}
      },
      
      remove() {
        const data = this.dataScore
        this.$store.dispatch('scores/remove', data)
        this.dialogDelete = false
        this.dialogTitle = ''
        this.dataScore = {}
      },
      
      select(data) {
        this.dataScore = data
        this.dialogMenu = true
      },
      selectAction(action) {
        this.dialogMenu = false

        switch (action) {
          case 'edit':
            this.dialogTitle = 'Edit Nilai'
            this.dialogEdit = true
          break
          case 'remove':
            this.dialogTitle = 'Hapus Nilai'
            this.dialogDelete = true
        }
      },
      
      add() {
        this.dataScore = { id: null }
        this.dialogTitle = 'Nilai Baru'
        this.dialogEdit = true
      },
      
      scoreByCourse() {
        const scores = [...this.scores]
        const filter = this.filter.courseID
        if(!filter) {
          return scores
        } else {
          var filtered = scores.filter(v => {
          return v.courseID === filter
        })
          return filtered
        }
      }
    },
    watch: {
      classroom: {
        immediate: true,
        handler() {
          if(this.classroom && this.classroom.name) {
            this.$store.dispatch('setPage', {
              back: '/app/nilai',
              title: `Nilai Kelas ${ this.classroom.name } (${ this.classroom.generation })`
            })
          }
        }
      }
    },
    mounted() {
      this.$store.dispatch('classrooms/get', this.id)
      this.$store.dispatch('students/get', this.id)
      this.get()
    }
}
</script>

<style>

</style>