<template>
  <div id="classroom">
    <loading-state />
    <div v-if="!isLoading">
      
      <data-compact :items="formClassroom">

        <template #avatar="{ item }">
          <v-list-item-avatar
            v-if="item.icon"
            class="ml-n4 mr-0">
            <v-icon v-text="item.icon" />
          </v-list-item-avatar>
        </template>
        
        <template #content="{ item }">
          <v-list-item-content>
            <span v-text="item.label" class="text--secondary" />
          </v-list-item-content>
        </template>
        
        <template #action="{ item }">
          <span v-text="classroom[item.value]" class="font-weight-bold" />
        </template>

      </data-compact>

      <button-add @click="add()" text="Tambah Siswa" />

      <v-layout
        class="grey lighten-4 mt-n16">
        <v-card-title v-text="'Siswa'" />
      </v-layout>

      <data-list id="student-data"
        :headers="headers"
        :items="students"
        :forms="formStudent"
        sortBy="name"
        @edit="select($event), selectAction('edit')"
        @remove="select($event), selectAction('remove')"
        @action="select($event)">
        
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
              <div
                class="mt-1">
                <span v-text="item.name" class="subtitle-2 text--secondary" />
              </div>
              <v-chip :color="item.gender === 'Laki-laki' ? 'info' : 'error'" dark small>
                <span v-text="item.gender" class="caption" />
              </v-chip>
            </div>

          </template>

      </data-list>

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
        <form-list :forms="formStudent" :data="dataStudent" :items="comboboxItems" />
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
            v-html="`Yakin hapus data siswa <b>${ dataStudent.name }(Kelas ${ dataStudent.classroomName })</b>?`"
            class="text--secondary"
          />
        </v-card>
      </dialog-bottom>
      
    </div>
  </div>
</template>

<script>

import LoadingState from '../../components/LoadingState'
import DialogBottom from '../../components/DialogBottom'
import DataCompact from '../../components/DataCompact'
import ButtonAdd from '../../components/ButtonAdd'
import DataList from '../../components/DataList'
import FormList from '../../components/FormList'
export default {
  components: {
    LoadingState,
    DialogBottom,
    DataCompact,
    ButtonAdd,
    DataList,
    FormList,
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
    formStudent: [
      { label: 'Nama Siswa', value: 'name', type: 'text' },
      { label: 'Jenis Kelamin', value: 'gender', type: 'combobox' },
    ],
    headers: [
      { text: 'Nama Siswa', value: 'name' },
      { text: 'Jenis Kelamin', value: 'gender' },
      { text: '', value: 'action', sortable: false },
    ],
    dataStudent: {},
    dialogTitle: null,
    dialogMenu: false,
    dialogEdit: false,
    dialogDelete: false,
    actions: [
      { text: 'Edit', value: 'edit', icon: 'mdi-pencil' },
      { text: 'Hapus', value: 'remove', icon: 'mdi-delete' },
    ],
    gender: [
      { value: 'Laki-laki' },
      { value: 'Perempuan' },
    ]
  }),
  computed: {
    classroom() {
      return this.$store.state.classrooms.document
    },
    students() {
      return this.$store.state.students.collection
    },
    isLoading() {
      return this.$store.state.isLoading
    },
    comboboxItems() {
      
      var items = {
        gender: this.gender,
      }

      return items
    }
  },
  methods: {
    add() {
      this.dataStudent = { id: null }
      this.dialogTitle = 'Siswa Baru'
      this.dialogEdit = true
    },
    get() {
      this.$store.dispatch('students/get', this.id)
    },
    post() {
      var data = this.dataStudent
      if(data.id) {
        this.$store.dispatch('students/put', data)
      } else {
        data.classroomID = this.classroom.id
        data.classroomName = this.classroom.name
        data.generation = this.classroom.generation
        this.$store.dispatch('students/post', data)
      }
      this.dialogEdit = false
      this.dialogTitle = ''
      this.dataStudent = {}
    },
    remove() {
      const data = this.dataStudent
      this.$store.dispatch('students/remove', data)
      this.dialogDelete = false
      this.dialogTitle = ''
      this.dataStudent = {}
    },
    select(data) {
      this.dataStudent = data
      this.dialogMenu = true
    },
    selectAction(action) {
      this.dialogMenu = false

      switch (action) {
        case 'edit':
          this.dialogTitle = 'Edit Kelas'
          this.dialogEdit = true
          break
        case 'remove':
          this.dialogTitle = 'Hapus Kelas'
          this.dialogDelete = true

      }
    },
  },
  watch: {
    classroom: {
      immediate: true,
      handler() {
        if(this.classroom && this.classroom.name) {
          this.$store.dispatch('setPage', {
            back: '/app/kelas',
            title: `Kelas ${ this.classroom.name } (${ this.classroom.generation })`
          })
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch('classrooms/get', this.id)
    this.get()
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