<template>
  <div id="classrooms">
    <div>
      <v-btn id="button-edit-fab"
        @click="newClassroom()"
        class="mb-13"
        color="primary"
        fixed
        fab
        bottom
        right
        >
        <v-icon v-text="'mdi-plus'" />
        <!-- <span v-text="'Tambah'" /> -->
      </v-btn>
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
      
      <two-line-list id="classrooms-list"
        :items="classroomsByGeneration()"
        :forms="formClassroom"
        @action="selectClassroom($event)"
        @click="$router.push('kelas/' + $event.id)"
      />

      <dialog-bottom id="dialog-generation"
        @close="filter = {}"
        @action="$forceUpdate(), dialogGeneration = false"
        v-model="dialogGeneration"
        :title="'Filter bedasarkan angkatan'"
        buttonCancel="Tampmilkan Semua"
        buttonAction="Filter">
        <form-item-combobox
          :label="'Angkatan'"
          :data="filter"
          value="generation"
          :items="generations"
          color="primary"
        />
      </dialog-bottom>

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
                @click="selectAction(action.text)"
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
        @action="saveClassroom()"
        v-model="dialogEdit"
        :title="dialogTitle"
        buttonCancel="Batal"
        buttonAction="Simpan"
        persistent>
        <form-list :forms="formClassroom" :data="dataClassroom" :items="items" />
      </dialog-bottom>

      <dialog-bottom id="dialog-delete"
        @action="deleteClassroom()"
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
            v-html="`Yakin hapus Kelas <b>${ dataClassroom.name }</b>?`"
            class="text--secondary"
          />
        </v-card>
      </dialog-bottom>

    </div>
  </div>
</template>

<script>

import DialogBottom from '../../components/DialogBottom'
import FormList from '../../components/FormList'
import TwoLineList from '../../components/TwoLineList'
import FormItemCombobox from '../../components/FormItemCombobox'
export default {
  components: {
    DialogBottom,
    FormList,
    TwoLineList,
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
    formClassroom: [
      { label: 'Kelas', value: 'name', type: 'text' },
      { label: 'Angkatan', value: 'generation', type: 'combobox' },
      { label: 'Wali Kelas', value: 'homeroomName', type: 'combobox' },
    ],
    actions: [
      { text: 'Edit', icon: 'mdi-pencil' },
      { text: 'Hapus', icon: 'mdi-delete' },
    ],
  }),
  computed: {
    classrooms() {
      return this.$store.state.classrooms.collection
    },
    classroom() {
      return this.$store.state.classrooms.document
    },
    generations() {
      return this.$store.getters.generations
    },
    teacherItems() {
      return this.$store.getters['teachers/teacherItems']
    },
    items() {
      
      var items = {
        generation: this.generations,
        homeroomName: this.teacherItems
      }
      return items
    }
  },
  methods: {
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
    getClassrooms() {
      this.$store.dispatch('classrooms/get')
    },
    getClassroom() {
      // let id = 'tJtU0y6zOPJi1t8Ohjl7'
      // this.$store.dispatch('classrooms/get', id)
    },
    selectClassroom(classroom) {
      this.dataClassroom = classroom
      this.dialogMenu = true
    },
    selectAction(action) {
      this.dialogMenu = false
      if(action === 'Edit') {
        this.dialogTitle = 'Edit Kelas'
        this.dialogEdit = true
      } else {
        this.dialogTitle = 'Hapus Kelas'
        this.dialogDelete = true
      }
    },
    newClassroom() {
      this.dataClassroom = { id: null }
      this.dialogTitle = 'Kelas Baru'
      this.dialogEdit = true
    },
    saveClassroom() {
      const data = this.dataClassroom
      if(data.id) {
        this.$store.dispatch('classrooms/put', data)
      } else {
        this.$store.dispatch('classrooms/post', data)
      }
      this.dialogEdit = false
      this.dialogTitle = ''
      this.dataClassroom = {}
    },
    deleteClassroom() {
      const data = this.dataClassroom
      this.$store.dispatch('classrooms/remove', data)
      this.dialogDelete = false
      this.dialogTitle = ''
      this.dataClassroom = {}
    }
  },
  mounted() {
    this.$store.dispatch('setPage', {
      back: '/app',
      title: 'Kelas'
    })

    this.getClassrooms()
    this.getClassroom()
  }
}
</script>

<style>

</style>