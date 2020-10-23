<template>
  <div>
    <v-layout
      class="pt-2"
    >
      <v-btn
        @click="$router.push('/app/danabos')"
        text
      >
        <v-icon v-text="'mdi-arrow-left'" left />
        <span v-text="'Kembali'" />
      </v-btn>

      <v-spacer />

      <v-btn
        @click="print()"
        class="mr-4"
        color="primary"
      >
        <v-icon v-text="'mdi-printer'" left />
        <span v-text="'Print'" />
      </v-btn>
    </v-layout>

    <v-divider class="mt-2" />

    <v-layout v-if="!fund"
      class="align-center"
      column
    >
      Loading...
    </v-layout>
    <v-layout v-else
      class="pa-4"
      column
    >
      <v-layout
        class="align-center"
      >
        <span v-text="'Dana Masuk'" />
        <v-chip v-text="toCurrency(fund.nominal)" color="info" class="subtitle-2 ml-2" />
        <v-divider vertical class="mx-4" />
        <span v-text="'Total Pembelian'" />
        <v-chip v-text="toCurrency(String(totalPurchase()))" color="error" class="subtitle-2 ml-2" />
        <v-divider vertical class="mx-4" />
        <span v-text="'Sisa'" />
        <v-chip v-text="toCurrency(String(fund.nominal - totalPurchase()))" color="success" class="subtitle-2 ml-2" />
        <v-divider vertical class="mx-4" />
        <v-spacer />
        <v-btn
          @click="dialogAdd = true"
          color="primary"
        >
          <v-icon v-text="'mdi-plus'" left />
          <span v-text="'Tambah Pembelian'" />
        </v-btn>
      </v-layout>

      <v-divider class="my-4" />

      <v-data-table
        :headers="headers"
        :items="purchases"
        :sort-by="['buyAt', 'createdAt']"
        :sort-desc="[true, true]"
      >
        <template #item.cost="{ value }">
          <span v-text="toCurrency(String(value))" class="font-weight-bold" />
        </template>
        <template #item.buyAt="{ value }">
          <span v-text="toDate(value.toDate())" />
        </template>
        <template #item.createdAt="{ value }">
          <span v-text="toDate(value.toDate())" />
        </template>
        <template #item.action="{ item }">
          <v-layout
            class="justify-end"
          >
            <v-btn
              @click="selected = item, dialogRemove = true"
              color="error"
              icon
            >
              <v-icon v-text="'mdi-delete-outline'" />
            </v-btn>
          </v-layout>
        </template>
      </v-data-table>
    </v-layout>

    <v-dialog id="dialog-add"
      v-model="dialogAdd"
      width="400"
    >
      <v-card
        class="pa-4"
      >
        <h3 v-text="'Tambah Pembelian'" />
        <v-layout
          class="mt-4"
          column
        >
          <v-text-field
            v-model="dataPurchase.desc"
            label="Keterangan"
            outlined
            dense
          />
          <v-text-field
            class="mt-n2"
            v-model.number="dataPurchase.cost"
            type="number"
            label="Biaya"
            outlined
            dense
          />
          <v-text-field
            class="mt-n2"
            v-model="dataPurchase.buyAt"
            type="date"
            label="Tanggal Pembelian"
            outlined
            dense
          />
        </v-layout>
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="dialogAdd = false"
            outlined
          >
            <span v-text="'Batal'" class="mx-2" />
          </v-btn>
          <v-btn
            @click="postPurchase()"
            color="primary"
          >
            <span v-text="'Simpan'" class="mx-2" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog id="dialog-remove"
      v-model="dialogRemove"
      width="480"
    >
      <v-card
        v-if="selected"
        class="pa-4"
      >
        <h3 v-text="'Hapus Pembelian'" />
        <v-sheet
          class="pa-4 my-4"
          color="error lighten-5"
        >
          <v-icon v-text="'mdi-alert'" color="error" left />
          <span v-text="'Data yang dihapus tidak dapat dikembalikan.'" class="error--text subtitle-2" />
        </v-sheet>
        <v-layout
          column
        >
          <span v-text="'Data yang dihapus'" class="caption mb-2" />
          <v-layout>
            <span v-text="`${ selected.desc } - ${ toCurrency(String(selected.cost)) }`" class="font-weight-bold" />
            <v-spacer />
            <span v-text="toDate(selected.buyAt.toDate())" class="text--secondary" />
          </v-layout>
        </v-layout>

        <v-card-actions
          class="mt-4 mr-n2"
        >
          <v-spacer />
          <v-btn
            @click="dialogRemove = false"
            outlined
          >
            <span v-text="'Batal'" class="mx-2" />
          </v-btn>
          <v-btn
            @click="removePurchase()"
            color="error"
          >
            <span v-text="'Hapus'" class="mx-2" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>

import { db, serverTimestamp } from '../../firebase'
import moment from 'moment'
moment.locale('id')

import jsPDF from 'jspdf'
import 'jspdf-autotable'
import headerPrint from '@/assets/header-print.js'

export default {
  props: ['id'],
  data: () => ({
    fund: null,
    purchases: [],
    headers: [
      { text: 'Keterangan', value: 'desc' },
      { text: 'Biaya', value: 'cost', align: 'right' },
      { text: 'Tanggal Pembelian', value: 'buyAt', align: 'right' },
      { text: 'Tanggal Input', value: 'createdAt', align: 'right' },
      { text: '', value: 'action' }
    ],
    headersPrint: [
      { header: 'Keterangan', dataKey: 'desc' },
      { header: 'Biaya', dataKey: 'cost' },
      { header: 'Dibeli Tanggal', dataKey: 'buyAt' },
    ],
    dataPurchase: {},
    dialogAdd: null,
    dialogRemove: null,
    selected: null,
  }),
  methods: {
    toDate (date) {
      return moment(date).format('dddd, DD MMMM yyyy')
    },
    toCurrency(val) {
      return 'Rp ' + val.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1.")
    },
    async getFund(fund_id) {
      const data = (await db.collection('funds').doc(fund_id).get()).data()
      if(data) {
        this.fund = data
      }
    },
    async getPurchases(fund_id) {
      const docs = (await db.collection('funds').doc(fund_id).collection('purchases').get()).docs
      if(docs) {
        const array = []
        docs.map(doc => {
          var data = doc.data()
          data.id = doc.id
          array.push(data)
        })
        this.purchases = array
      }
    },
    async postPurchase() {
      const ref = db.collection('funds')
        .doc(this.id)
        .collection('purchases')
      this.dataPurchase.createdAt = serverTimestamp()
      if(this.dataPurchase && this.dataPurchase.buyAt) {
        this.dataPurchase.buyAt = new Date(this.dataPurchase.buyAt)
      }
      await ref.add(this.dataPurchase)
      this.getPurchases(this.id)
      this.dialogAdd = false
    },
    async removePurchase() {
      const ref = db.collection('funds')
        .doc(this.id)
        .collection('purchases')
        .doc(this.selected.id)
      await ref.delete()
      this.getPurchases(this.id)
      this.dialogRemove = false
    },
    totalPurchase () {
      var total = 0
      this.purchases.map(v => {
        total += v.cost
      })
      return total
    },
    print () {
      const vm = this
      const fund = vm.fund
      const fundIn = vm.toCurrency(String(fund.nominal))
      const fundOut = vm.toCurrency(String(vm.totalPurchase()))
      const fundRemain = vm.toCurrency(String(fund.nominal - vm.totalPurchase()))
      const purchases = JSON.parse(JSON.stringify(vm.purchases))
      purchases.sort((a, b) => b.buyAt - a.buyAt)
      purchases.map(v => {

        if(v.buyAt) {
          v.buyAt = vm.toDate(new Date(v.buyAt.seconds * 1000))
        }
        if(v.cost) {
          v.cost = vm.toCurrency(String(v.cost))
        }
      })
      const columns = vm.headersPrint

      var doc = new jsPDF()
      const imgData = headerPrint
      
      doc.addImage(imgData, "JPEG", 5, 5, 200, 20)

      doc.setFontSize("14")

      var posX = 14
      var posY = 40
      var middle = 105

      doc.text('Laporan Dana BOS - ' + vm.toDate(fund.enteredAt.toDate()), middle, posY, null, null, "center" )

      posY += 12
      
      doc.setFontSize("10")

      doc.text(`Dana Masuk`, posX, posY)
      doc.text(`: ${fundIn}`, posX + 70, posY, null, null, 'right')
      posY += 4
      doc.text(`Dana Keluar`, posX, posY)
      doc.text(`: ${fundOut}`, posX + 70, posY, null, null, 'right')
      posY += 4
      doc.text(`Sisa Dana`, posX, posY)
      doc.text(`: ${fundRemain}`, posX + 70, posY, null, null, 'right')
      posY += 4

      posY += 4

      doc.autoTable({
        startY: posY,
        columns: columns,
        body: purchases
      })

      var finalY = doc.previousAutoTable.finalY
      var docWidth = doc.internal.pageSize.getWidth()
      var leader = 'Ahmad Dzaki Hafizhi, M.Pd'
      var textWidth = doc.getTextWidth(leader)

      doc.setFontSize("12")

      
      doc.text(leader, docWidth - 50, finalY + 50, null, null, "center" )
      doc.line(docWidth - 80, finalY + 1 + 50, docWidth - 80 + textWidth, finalY + 1 + 50, null, null, "center")
      doc.text('Kepala Sekolah', docWidth - 50, finalY + 56, null, null, "center" )

      doc.save(`Laporan Dana BOS - ${ vm.toDate(fund.enteredAt.toDate()) }.pdf`)
      doc.autoPrint()

      // vm.purchases = purchasesCopy
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(v) {
        if(v) {
          this.getFund(v)
          this.getPurchases(v)
        }
      }
    },
    dialogAdd: {
      immediate: false,
      handler(v) {
        if(!v) {
          this.dataPurchase = {}
        }
      }
    },
    dialogRemove: {
      immediate: false,
      handler(v) {
        if(!v) {
          this.selected = null
        }
      }
    }
  }
}
</script>

<style>

</style>