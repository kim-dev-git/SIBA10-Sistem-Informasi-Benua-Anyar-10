<template>
  <div id="course"
    class="ma-n2 ml-n3">
    <v-container>

      <button-add @click="add()" />

      <data-list id="course-data"
        :headers="headers"
        :items="courses"
        :forms="formCourse"
        :headersPrint="headersPrint"
        title="Daftar Mata Pelajaran"
        @edit="select($event), selectAction('edit')"
        @remove="select($event), selectAction('remove')"
        @action="select($event)">
        
          <template #column="{ value, header, item }">
            <div v-if="header.value === 'action'"></div>
            <div id="name"
              v-else-if="header.value === 'name'">
              <v-layout
                class="text-no-wrap py-2">
                <div>
                  <p v-text="item.name" class="font-weight-bold mb-0" />
                  <!-- <p v-text="item.abbreviation" class="text--secondary mb-0" /> -->
                </div>
              </v-layout>
            </div>
            <div id="createdAt"
              v-else-if="header.value === 'createdAt'">
              <v-layout
                v-if="value"
                class="text-no-wrap caption py-2">
                <div
                  class="text--secondary">
                  <p v-text="'Diinput'" class="mb-0" />
                  <p v-if="item.editedAt" v-text="'Diedit'" class="text--secondary mb-0" />
                </div>
                <div
                  class="font-weight-bold">
                  <p v-text="`: ${ $options.filters.dayDate(value) }`" class="mb-0" />
                  <p v-if="item.editedAt" v-text="`: ${ $options.filters.dayDate(item.editedAt) }`" class="mb-0" />
                </div>
              </v-layout>
            </div>
            <p id="default"
              v-else
              v-text="value ? value : '-'"
              class="py-4"
              :class="header.align ? `text-${ header.align } mb-0` : 'mb-0'"
            />
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
        <form-list :forms="formCourse" :data="dataCourse" />
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
            v-html="`Yakin hapus data <b>${ dataCourse.name }</b>?`"
            class="text--secondary"
          />
        </v-card>
      </dialog-bottom>

    </v-container>
  </div>
</template>

<script>

import ButtonAdd from '../../components/ButtonAdd'
import DialogBottom from '../../components/DialogBottom'
import FormList from '../../components/FormList'
import DataList from '../../components/DataList'

export default {
  components: {
    ButtonAdd,
    DialogBottom,
    FormList,
    DataList,
  },
  data: () => ({
    dialogTitle: '',
    dialogMenu: false,
    dialogEdit: false,
    dialogDelete: false,
    dataCourse: {},
    headers: [
      { text: 'Mata Pelajaran', value: 'name' },
      { text: 'Singkatan', value: 'abbreviation' },
      { text: '', value: 'action', sortable: false },
    ],
    headersPrint: [
      { header: 'Mata Pelajaran', dataKey: 'name' },
      { header: 'Singkatan', dataKey: 'abbreviation' },
    ],
    formCourse: [
      { label: 'Mata Pelajaran', value: 'name', type: 'text' },
      { label: 'Singkatan', value: 'abbreviation', type: 'text' },
    ],
    actions: [
      { text: 'Edit', value: 'edit', icon: 'mdi-pencil' },
      { text: 'Hapus', value: 'remove', icon: 'mdi-delete' },
    ],
  }),
  computed: {
    courses() {
      return this.$store.state.courses.collection
    },
    course() {
      return this.$store.state.courses.document
    },
  },
  methods: {
    get() {
      this.$store.dispatch('courses/get')
    },
    post() {
      var data = this.dataCourse
      if(data.id) {
        this.$store.dispatch('courses/put', data)
      } else {
        this.$store.dispatch('courses/post', data)
      }
      this.dialogEdit = false
      this.dialogTitle = ''
      this.dataCourse = {}
    },
    remove() {
      const data = this.dataCourse
      this.$store.dispatch('courses/remove', data)
      this.dialogDelete = false
      this.dialogTitle = ''
      this.dataCourse = {}
    },

    add() {
      this.dataCourse = { id: null }
      this.dialogTitle = 'Mata Pelajaran Baru'
      this.dialogEdit = true
    },

    select(data) {
      this.dataCourse = data
      this.dialogMenu = true
    },
    selectAction(action) {
      this.dialogMenu = false

      switch (action) {
        case 'edit':
          this.dialogTitle = 'Edit Mata Pelajaran'
          this.dialogEdit = true
          break
        case 'remove':
          this.dialogTitle = 'Hapus Mata Pelajaran'
          this.dialogDelete = true

      }
    },
  },
  mounted() {
    this.$store.dispatch('setPage', {
      back: '/app/jadwal',
      title: 'Mata Pelajaran'
    })

    this.get()
  }
}
</script>

<style>

</style>