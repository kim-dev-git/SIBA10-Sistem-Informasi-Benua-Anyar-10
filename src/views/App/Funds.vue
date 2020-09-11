<template>
  <div id="fund"
    class="ma-n2 ml-n3">

    <v-container>
      
      <v-layout row class="mx-3 mt-2">
        <v-flex xs12 md4>
          <v-card
            class="pa-4"
            color="grey lighten-3"
            flat>
            <v-layout
              class="align-center">
              <v-sheet
                class="pa-1 mr-3"
                color="info"
                rounded>
                <v-icon v-text="'mdi-call-received'" color="white" />
              </v-sheet>
              <div>
                <span v-text="'Pemasukan'" class="text--secondary caption" />
                <p v-text="toCurrency(fundIn)" class="font-weight-bold mb-0 mt-n1" />
              </div>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex xs12 md4 :class="$vuetify.breakpoint.mdAndUp ? 'px-2' : 'py-2'">
          <v-card
            class="pa-4"
            color="grey lighten-3"
            flat>
            <v-layout
              class="align-center">
              <v-sheet
                class="pa-1 mr-3"
                color="error"
                rounded>
                <v-icon v-text="'mdi-call-made'" color="white" />
              </v-sheet>
              <div>
                <span v-text="'Pengeluaran'" class="text--secondary caption" />
                <p v-text="toCurrency(fundOut)" class="font-weight-bold mb-0 mt-n1" />
              </div>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex xs12 md4>
          <v-card
            class="pa-4"
            color="grey lighten-3"
            flat>
            <v-layout
              class="align-center">
              <v-sheet
                class="pa-1 mr-3"
                color="success"
                rounded>
                <v-icon v-text="'mdi-currency-usd-circle'" color="white" />
              </v-sheet>
              <div>
                <span v-text="'Sisa Dana'" class="text--secondary caption" />
                <p v-text="toCurrency(fundBalance)" class="font-weight-bold mb-0 mt-n1" />
              </div>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>

      <button-add @click="add()" />

      <data-list id="fund-data"
        :headers="headers"
        :items="funds"
        :forms="formFund"
        sortBy="enteredBy"
        @edit="select($event), selectAction('edit')"
        @remove="select($event), selectAction('remove')"
        @action="select($event)">
        
          <template #column="{ value, header, item }">
            <div v-if="header.value === 'action'"></div>
            <div id="type"
              v-else-if="header.value === 'type'"
              class="py-2">
              <p v-text="item.info" class="mb-0" />
              <v-chip v-if="value === 'pemasukan'" color="info" dark small>
                <v-icon v-text="'mdi-call-received'" left small />
                <span v-text="'Pemasukan'" />
              </v-chip>
              <v-chip v-else color="error" dark small>
                <v-icon v-text="'mdi-call-made'" left small />
                <span v-text="'Pengeluaran'" />
              </v-chip>
            </div>
            <div id="nominal"
              v-else-if="header.value === 'nominal'">
              <span v-text="toCurrency(value)" class="font-weight-bold" />
            </div>
            <div id="enteredAt"
              v-else-if="header.value === 'enteredAt'">
              <span v-text="$options.filters.fullDate(value)" />
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
                <v-chip v-if="item.type === 'pemasukan'" color="info" dark small>
                  <v-icon v-text="'mdi-call-received'" left small />
                  <span v-text="'Pemasukan'" />
                </v-chip>
                <v-chip v-else color="error" dark small>
                  <v-icon v-text="'mdi-call-made'" left small />
                  <span v-text="'Pengeluaran'" />
                </v-chip>
                <v-list-item-title v-text="item.info" class="mb-0 pb-0" />
              </div>
              <v-spacer />
              <div
                class="text-right align-center pt-1">
                  <p v-text="item.nominal ? toCurrency(item.nominal) : 'Rp -'" class="font-weight-bold mb-0" />
                  <p v-text="item.enteredAt ? $options.filters.dayDate(item.enteredAt) : '-'" class="text--secondary caption mb-0" />
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
        @close="get()"
        v-model="dialogEdit"
        :title="dialogTitle"
        buttonCancel="Batal"
        buttonAction="Simpan"
        persistent>
        <form-list :forms="formFund" :data="dataFund" :items="comboboxItems" />
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
            v-html="`Yakin hapus data <b>${ dataFund.name }</b>?`"
            class="text--secondary"
          />
        </v-card>
      </dialog-bottom>

    </v-container>
  </div>
</template>

<script>

import moment from 'moment'

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
    dataFund: {},
    headers: [
      { text: 'Keterangan', value: 'type' },
      { text: 'Nominal', value: 'nominal' },
      { text: 'Tanggal', value: 'enteredAt' },
      { text: '', value: 'action', sortable: false },
    ],
    formFund: [
      { label: 'Keterangan', value: 'info', type: 'text' },
      { label: 'Tipe', value: 'type', type: 'combobox' },
      { label: 'Nominal', value: 'nominal', type: 'number', prefix: 'Rp. ' },
      { label: 'Tanggal', value: 'enteredAt', type: 'date' },
    ],
    actions: [
      { text: 'Edit', value: 'edit', icon: 'mdi-pencil' },
      { text: 'Hapus', value: 'remove', icon: 'mdi-delete' },
    ],
  }),
  computed: {
    funds() {
      return this.$store.state.funds.collection
    },
    fund() {
      return this.$store.state.funds.document
    },
    comboboxItems() {
      
      var items = {
        type: [
          { text: 'Pemasukan', value: 'pemasukan' },
          { text: 'Pengeluaran', value: 'pengeluaran' },
        ],
      }

      return items
    },
    fundIn() {
      if(!this.funds.length > 1) {
        return 0
      } else {
        var total = 0
        this.funds.forEach(v => {
          if(v.type === 'pemasukan') {
            total = total + Number(v.nominal)
          }
        })
        return total
      }
    },
    fundOut() {
      if(!this.funds.length > 1) {
        return 0
      } else {
        var total = 0
        this.funds.forEach(v => {
          if(v.type === 'pengeluaran') {
            total = total + Number(v.nominal)
          }
        })
        return total
      }
    },
    fundBalance() {
      const fundIn = this.fundIn
      const fundOut = this.fundOut
      return fundIn - fundOut
    }
  },
  methods: {
    get() {
      this.$store.dispatch('funds/get')
      this.$store.dispatch('funds/get', 'H3kURogEgo3tvehxwzuE')
    },
    post() {
      var data = this.dataFund
      if(data.id) {
        this.$store.dispatch('funds/put', data)
      } else {
        this.$store.dispatch('funds/post', data)
      }
      this.dialogEdit = false
      this.dialogTitle = ''
      this.dataFund = {}
    },
    remove() {
      const data = this.dataFund
      this.$store.dispatch('funds/remove', data)
      this.dialogDelete = false
      this.dialogTitle = ''
      this.dataFund = {}
    },

    add() {
      this.dataFund = { id: null }
      this.dialogTitle = 'Dana BOS Baru'
      this.dialogEdit = true
    },

    select(data) {
      this.dataFund = data
      
      moment.locale('id')
      var date = this.dataFund.enteredAt
      if(date && date.seconds) {
        this.dataFund.enteredAt = moment.unix(date.seconds).format('YYYY-MM-DD')
      } else {
        this.dataFund.enteredAt = moment(date).format('DD MM YYYY')
      }

      this.dialogMenu = true
    },
    selectAction(action) {
      this.dialogMenu = false

      switch (action) {
        case 'edit':
          this.dialogTitle = 'Edit Dana BOS'
          this.dialogEdit = true
          break
        case 'remove':
          this.dialogTitle = 'Hapus Dana BOS'
          this.dialogDelete = true

      }
    },
    toCurrency(value) {
      var formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      })
      return formatter.format(value)
    }
  },
  mounted() {
    this.$store.dispatch('setPage', {
      back: null,
      title: 'Dana BOS'
    })

    this.get()
  }
}
</script>

<style>

</style>