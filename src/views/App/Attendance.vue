<template>
  <div id="attendance"
    class="ma-n2 ml-n3">
    <v-container>

      <!-- <button-add @click="add()" /> -->
      <v-layout class="mx-3 mt-3">
        <v-spacer />
        <v-text-field
          type="date"
          v-model="filterDate"
          label="Filter berdasarkan tanggal"
          outlined
          filled
          dense
        />
      </v-layout>

      <data-list id="attendance-data"
        :headers="headers"
        :items="filteredAttendances()"
        :forms="formAttendance"
        :headersPrint="headersPrint"
        title="Absensi"
        :actionOff="true"
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
            <div id="createdAt"
              v-else-if="header.value === 'createdAt'">
              <v-layout
                v-if="value"
                class="text-no-wrap caption py-2">
                <div
                  class="text--secondary">
                  <p v-text="'Diinput'" class="mb-0" />
                  <p v-text="'Pukul'" class="text--secondary mb-0" />
                </div>
                <div
                  class="font-weight-bold">
                  <p v-text="`: ${ $options.filters.dayDate(value) }`" class="mb-0" />
                  <p v-text="`: ${ $options.filters.fullTime(value) }`" class="mb-0" />
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
              <v-list-item-title v-text="item.userName" class="font-weight-bold" />
            </div>
            <v-spacer />
            <div
              class="text-right">
              <v-list-item-subtitle>
                <span v-text="$options.filters.dayDate(item.createdAt)" />
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <span v-text="$options.filters.fullTime(item.createdAt)" />
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
        <form-list :forms="formAttendance" :data="dataAttendance" />
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
            v-html="`Yakin hapus data <b>${ dataAttendance.name }</b>?`"
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

import { Timestamp } from '../../firebase'


export default {
  components: {
    ButtonAdd,
    DialogBottom,
    FormList,
    DataList,
  },
  data: () => ({
    filterDate: null,
    dialogTitle: '',
    dialogMenu: false,
    dialogEdit: false,
    dialogDelete: false,
    dataAttendance: {},
    headers: [
      { text: 'Nama', value: 'userName' },
      { text: 'Tanggal absen', value: 'createdAt' },
      // { text: '', value: 'action', sortable: false },
    ],
    headersPrint: [
      { header: 'Nama', dataKey: 'userName' },
      { header: 'Tanggal absen', dataKey: 'createdAt' },
      // { header: 'Update terakhir', dataKey: 'editedAt' },
    ],
    formAttendance: [
      { label: 'Nama Barang', value: 'name', type: 'text' },
      { label: 'Jumlah', value: 'qty', type: 'number' },
      { label: 'Baik', value: 'good', type: 'number' },
      { label: 'Rusak', value: 'damaged', type: 'number' },
      { label: 'Keterangan', value: 'info', type: 'text' },
    ],
    actions: [
      { text: 'Edit', value: 'edit', icon: 'mdi-pencil' },
      { text: 'Hapus', value: 'remove', icon: 'mdi-delete' },
    ],
  }),
  computed: {
    attendances() {
      const items = this.$store.state.attendance.collection
      const user = this.$store.state.users.profile
      if(user.role === 'Tata Usaha') {
        return items
      } else {
        return items.filter(v => {
          return v.userID === user.uid
        })
      }
    },
    attendance() {
      return this.$store.state.attendance.document
    },
    
  },
  methods: {
    get() {
      this.$store.dispatch('attendance/get')
    },
    post() {
      var data = this.dataAttendance
      if(data.id) {
        this.$store.dispatch('attendance/put', data)
      } else {
        this.$store.dispatch('attendance/post', data)
      }
      this.dialogEdit = false
      this.dialogTitle = ''
      this.dataAttendance = {}
    },
    remove() {
      const data = this.dataAttendance
      this.$store.dispatch('attendance/remove', data)
      this.dialogDelete = false
      this.dialogTitle = ''
      this.dataAttendance = {}
    },

    add() {
      this.dataAttendance = { id: null }
      this.dialogTitle = 'Inventaris Baru'
      this.dialogEdit = true
    },

    select(data) {
      this.dataAttendance = data
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

    filteredAttendances() {
      if(!this.filterDate) {
        return this.attendances
      } else {
        const items = this.attendances
        const filterDate = this.filterDate
        const year = filterDate.substr(0, 4)
        const month = filterDate.substr(5, 2)
        const day = Number(filterDate.substr(8, 2))
        const tomorrow = Number(filterDate.substr(8, 2)) + 1
        if(day.toString().length === 1) {
          day = '0' + day
          tomorrow = '0' + tomorrow
        }

        const filtered = items.filter(v => {
          const start = Timestamp.fromDate(new Date(year + '-' + month + '-' + day))
          const end = Timestamp.fromDate(new Date(year + '-' + month + '-' + tomorrow))
          return v.createdAt > start &&
            v.createdAt < end
        })

        return filtered
      }

    }
  },
  mounted() {
    this.$store.dispatch('setPage', {
      back: null,
      title: 'Absensi'
    })

    this.get()
  }
}
</script>

<style>

</style>