<template>
  <div id="inventory"
    class="ma-n2 ml-n3">
    <v-container>

      <button-add @click="add()" />

      <data-list id="inventory-data"
        :headers="headers"
        :items="inventorys"
        :forms="formInventory"
        :headersPrint="headersPrint"
        title="Inventaris"
        @edit="select($event), selectAction('edit')"
        @remove="select($event), selectAction('remove')"
        @action="select($event)">
        
          <template #column="{ value, header, item }">
            <div v-if="header.value === 'action'"></div>
            <div id="name"
              v-else-if="header.value === 'name'">
              <v-layout
                class="text-no-wrap caption py-2">
                <div>
                  <p v-text="item.name" class="font-weight-bold mb-0" />
                  <p v-html="`Jumlah <b>${item.qty}</b>`" class="text--secondary mb-0" />
                </div>
              </v-layout>
            </div>
            <div id="condition"
              v-else-if="header.value === 'condition'">
              <v-layout
                class="text-no-wrap caption py-2">
                <div
                  class="text--secondary">
                  <p v-text="'Baik'" class="mb-0" />
                  <p v-if="item.damaged" v-text="'Rusak'" class="text--secondary mb-0" />
                </div>
                <div
                  class="font-weight-bold">
                  <p v-text="`: ${ item.good }`" class="mb-0" />
                  <p v-if="item.damaged" v-text="`: ${ item.damaged }`" class="mb-0" />
                </div>
              </v-layout>
            </div>
            <div id="photo"
              v-else-if="header.value === 'photo'"
            >
              <v-btn v-if="item.photoURL"
                @click="photoURL = item.photoURL, dialogPhoto = true"
                color="primary"
                small
                text
              >
                <v-icon v-text="'mdi-image'" left />
                <span v-text="'Tampilkan Foto'" class="text-none" />
              </v-btn>
            </div>
            <div
              v-else-if="header.value === 'getAt'"
            >
              <v-layout>
                <span v-text="value ? $options.filters.fullDate(value) : '-'" />
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

          <template #compact-content="{ item }">
            <v-layout>
            <div>
              <v-list-item-title v-text="item.name" class="font-weight-bold" />
              <v-list-item-subtitle v-text="'Jumlah ' + item.qty" />
            </div>
            <v-spacer />
            <div
              class="text-right">
              <v-list-item-subtitle>
                <span v-text="item.good ? item.good : '-'" class="font-weight-bold" />
                <span v-text="' Baik'" />
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <span v-text="item.damaged ? item.damaged : '-'" class="font-weight-bold" />
                <span v-text="' Rusak'" />
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
        <form-list :forms="formInventory" :data="dataInventory" />
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
            v-html="`Yakin hapus data <b>${ dataInventory.name }</b>?`"
            class="text--secondary"
          />
        </v-card>
      </dialog-bottom>

      <dialog-bottom id="dialog-photo"
        v-model="dialogPhoto"
        buttonCancel="Tutup"
      >
        <v-layout class="justify-center pb-2">
          <img v-if="photoURL" :src="photoURL" width="440" />
        </v-layout>
        
      </dialog-bottom>

    </v-container>
  </div>
</template>

<script>

import ButtonAdd from '../../components/ButtonAdd'
import DialogBottom from '../../components/DialogBottom'
import FormList from '../../components/FormList'
import DataList from '../../components/DataList'

import { storage } from '../../firebase'


export default {
  components: {
    ButtonAdd,
    DialogBottom,
    FormList,
    DataList,
  },
  data: () => ({
    photoURL: null,
    dialogTitle: '',
    dialogPhoto: false,
    dialogMenu: false,
    dialogEdit: false,
    dialogDelete: false,
    dataInventory: {},
    headers: [
      { text: 'Barang', value: 'name' },
      { text: 'Kondisi', value: 'condition' },
      { text: 'Keterangan', value: 'info' },
      { text: 'Tanggal Perolehan', value: 'getAt' },
      { text: 'Tanggal', value: 'createdAt' },
      { text: 'Foto', value: 'photo' },
      { text: '', value: 'action', sortable: false },
    ],
    headersPrint: [
      { header: 'Barang', dataKey: 'name' },
      { header: 'Jumlah', dataKey: 'qty' },
      { header: 'Baik', dataKey: 'good' },
      { header: 'Rusak', dataKey: 'damaged' },
      { header: 'Keterangan', dataKey: 'info' },
      // { header: 'Update terakhir', dataKey: 'editedAt' },
    ],
    formInventory: [
      { label: 'Nama Barang', value: 'name', type: 'text' },
      { label: 'Jumlah', value: 'qty', type: 'number' },
      { label: 'Baik', value: 'good', type: 'number' },
      { label: 'Rusak', value: 'damaged', type: 'number' },
      { label: 'Keterangan', value: 'info', type: 'text' },
      { label: 'Tanggal Diperoleh', value: 'getAt', type: 'date' },
      { label: 'Foto', value: 'photo', type: 'file' },
    ],
    actions: [
      { text: 'Edit', value: 'edit', icon: 'mdi-pencil' },
      { text: 'Hapus', value: 'remove', icon: 'mdi-delete' },
    ],
  }),
  computed: {
    inventorys() {
      return this.$store.state.inventorys.collection
    },
    inventory() {
      return this.$store.state.inventorys.document
    },
  },
  methods: {
    get() {
      this.$store.dispatch('inventorys/get')
      this.$store.dispatch('inventorys/get', 'H3kURogEgo3tvehxwzuE')
    },
    async post() {
      var data = this.dataInventory

      if(data && data.getAt) {
        data.getAt = new Date(data.getAt)
      }

      if(data.photo) {
        const storageRef = storage
          .ref('inventory')
          .child(data.photo.name)

          await storageRef.put(data.photo)

        data.photoURL = await storageRef.getDownloadURL()
        
        delete data.photo
      }

      if(data.id) {
        this.$store.dispatch('inventorys/put', data)
      } else {
        this.$store.dispatch('inventorys/post', data)
      }
      this.dialogEdit = false
      this.dialogTitle = ''
      this.dataInventory = {}
    },
    remove() {
      const data = this.dataInventory
      this.$store.dispatch('inventorys/remove', data)
      this.dialogDelete = false
      this.dialogTitle = ''
      this.dataInventory = {}
    },

    add() {
      this.dataInventory = { id: null }
      this.dialogTitle = 'Inventaris Baru'
      this.dialogEdit = true
    },

    select(data) {
      this.dataInventory = data
      this.dialogMenu = true
    },
    selectAction(action) {
      this.dialogMenu = false

      switch (action) {
        case 'edit':
          this.dialogTitle = 'Edit Inventaris'
          this.dialogEdit = true
          break
        case 'remove':
          this.dialogTitle = 'Hapus Inventaris'
          this.dialogDelete = true

      }
    },
  },
  mounted() {
    this.$store.dispatch('setPage', {
      back: null,
      title: 'Inventaris'
    })

    this.get()
  }
}
</script>

<style>

</style>