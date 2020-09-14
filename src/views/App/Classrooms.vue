<template>
  <div id="classroom"
    class="ma-n2 ml-n3">
    <v-container>

      <button-add @click="add()" />

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
        @edit="select($event), selectAction('edit')"
        @remove="select($event), selectAction('remove')"
        @action="select($event)"
        @click="$router.push('kelas/' + $event.id)">
        
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
        @close="get()"
        v-model="dialogEdit"
        :title="dialogTitle"
        buttonCancel="Batal"
        buttonAction="Simpan"
        persistent>
        <form-list :forms="formClassroom" :data="dataClassroom" :items="comboboxItems" />
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
            v-html="`Yakin hapus data <b>Kelas ${ dataClassroom.name }(${ dataClassroom.generation })</b>?`"
            class="text--secondary"
          />
        </v-card>
      </dialog-bottom>

      
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

import ButtonAdd from '../../components/ButtonAdd'
import DialogBottom from '../../components/DialogBottom'
import FormList from '../../components/FormList'
import DataList from '../../components/DataList'
import FormItemCombobox from '../../components/FormItemCombobox'

export default {
  components: {
    ButtonAdd,
    DialogBottom,
    FormList,
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
      { text: '', value: 'action', sortable: false },
    ],
    formClassroom: [
      { label: 'Kelas', value: 'name', type: 'text' },
      { label: 'Angkatan', value: 'generation', type: 'combobox' },
      { label: 'Wali Kelas', value: 'homeroomName', type: 'combobox' },
    ],
    actions: [
      { text: 'Edit', value: 'edit', icon: 'mdi-pencil' },
      { text: 'Hapus', value: 'remove', icon: 'mdi-delete' },
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
    comboboxItems() {
      
      var items = {
        generation: this.generations,
        homeroomName: this.teacherItems
      }

      return items
    }
  },
  methods: {
    get() {
      this.$store.dispatch('classrooms/get')
      // this.$store.dispatch('classrooms/get', 'H3kURogEgo3tvehxwzuE')
    },
    post() {
      var data = this.dataClassroom
      if(data.id) {
        this.$store.dispatch('classrooms/put', data)
      } else {
        this.$store.dispatch('classrooms/post', data)
      }
      this.dialogEdit = false
      this.dialogTitle = ''
      this.dataClassroom = {}
    },
    remove() {
      const data = this.dataClassroom
      this.$store.dispatch('classrooms/remove', data)
      this.dialogDelete = false
      this.dialogTitle = ''
      this.dataClassroom = {}
    },

    add() {
      this.dataClassroom = { id: null }
      this.dialogTitle = 'Kelas Baru'
      this.dialogEdit = true
    },

    select(data) {
      this.dataClassroom = data
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
    toCurrency(value) {
      var formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      })
      return formatter.format(value)
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
      title: 'Kelas'
    })

    this.get()
  }
}
</script>

<style>

</style>