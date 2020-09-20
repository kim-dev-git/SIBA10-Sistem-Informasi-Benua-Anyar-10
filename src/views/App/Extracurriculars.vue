<template>
  <div id="extracurricular"
    class="ma-n2 ml-n3">
    <v-container>

      <button-add @click="add()" />

      <data-list id="extracurricular-data"
        :headers="headers"
        :items="extracurriculars"
        :forms="formExtracurricular"
        @edit="select($event), selectAction('edit')"
        @remove="select($event), selectAction('remove')"
        @action="select($event)"
        @click="$router.push('ekskul/' + $event.id)">

          <template #compact-content="{ item }">
            <v-layout>
              <div>
                <v-list-item-title v-text="item.name" class="font-weight-bold" />
                <v-list-item-subtitle>
                  <span v-text="'Pembina: '" />
                  <span v-text="item.teacher" class="font-weight-bold" />
                </v-list-item-subtitle>
              </div>
            </v-layout>

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
        <form-list :forms="formExtracurricular" :data="dataExtracurricular" :items="comboboxItems" />
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
            v-html="`Yakin hapus data <b>${ dataExtracurricular.name }</b>?`"
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
    dataExtracurricular: {},
    headers: [
      { text: 'Nama Ekskul', value: 'name' },
      { text: 'Pembina', value: 'teacher' },
      { text: '', value: 'action', sortable: false },
    ],
    formExtracurricular: [
      { label: 'Nama Ekskul', value: 'name', type: 'text' },
      { label: 'Pembina', value: 'teacher', type: 'combobox' },
    ],
    actions: [
      { text: 'Edit', value: 'edit', icon: 'mdi-pencil' },
      { text: 'Hapus', value: 'remove', icon: 'mdi-delete' },
    ],
  }),
  computed: {
    extracurriculars() {
      return this.$store.state.extracurriculars.collection
    },
    extracurricular() {
      return this.$store.state.extracurriculars.document
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
        teacher: this.teacherItems
      }

      return items
    }
  },
  methods: {
    get() {
      this.$store.dispatch('extracurriculars/get')
    },
    post() {
      var data = this.dataExtracurricular
      if(data.id) {
        this.$store.dispatch('extracurriculars/put', data)
      } else {
        this.$store.dispatch('extracurriculars/post', data)
      }
      this.dialogEdit = false
      this.dialogTitle = ''
      this.dataExtracurricular = {}
    },
    remove() {
      const data = this.dataExtracurricular
      this.$store.dispatch('extracurriculars/remove', data)
      this.dialogDelete = false
      this.dialogTitle = ''
      this.dataExtracurricular = {}
    },

    add() {
      this.dataExtracurricular = { id: null }
      this.dialogTitle = 'Ekstrakurikuler Baru'
      this.dialogEdit = true
    },

    select(data) {
      this.dataExtracurricular = data
      this.dialogMenu = true
    },
    selectAction(action) {
      this.dialogMenu = false

      switch (action) {
        case 'edit':
          this.dialogTitle = 'Edit Ekstrakurikuler'
          this.dialogEdit = true
          break
        case 'remove':
          this.dialogTitle = 'Hapus Ekstrakurikuler'
          this.dialogDelete = true

      }
    },
  },
  mounted() {
    this.$store.dispatch('setPage', {
      back: null,
      title: 'Ekstrakurikuler'
    })

    this.get()
  }
}
</script>

<style>

</style>