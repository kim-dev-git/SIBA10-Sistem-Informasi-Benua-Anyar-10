<template>
  <div id="print-table">
    <v-btn
      v-if="!printOff"
      color="primary"
      class="text-none"
      @click="print()" >
      <v-icon left class="ml-0" v-text="'mdi-printer'" />
      <span class="mr-2" v-text="'Print'" />
    </v-btn>
  </div>
</template>

<script>

import jsPDF from 'jspdf'
import 'jspdf-autotable'
import headerPrint from '@/assets/header-print.js'
export default {
  props: [
    'title',
    'body',
    'document',
    'forms',
    'headers',
    'printOff',
    'tableTitle',
  ],
  data: () => ({
  }),
  methods: {
    print() {
      var vm = this
      const item = JSON.parse(JSON.stringify(this.body))
      if(item.length === 0) {
        this.$store.dispatch('notifications/post', {
          title: 'Data tidak ada.',
          body: `Print gagal karena data tidak ada.`,
        })
        return
      }
      var doc = new jsPDF()
      const imgData = headerPrint
      
      doc.addImage(imgData, "JPEG", 5, 5, 200, 20)

      doc.setFontSize("14")

      var posX = 14
      var posY = 40
      var middle = 105

      doc.text('Laporan ' + this.title, middle, posY, null, null, "center" )

      posY = posY + 5
      
      const body = []

      this.headers.forEach(header => {
        const array = []
        array.push(header.header)
        if(header.dataKey === 'createdAt' || header.dataKey === 'editedAt' || header.dataKey === 'enteredAt') {
          array.push(vm.$options.filters.fullDate(item[0][header.dataKey]))
        } else {
          array.push(item[0][header.dataKey])
        }
        array.push(item[header.dataKey])
        body.push(array)
      })

      const items = []

      this.body.forEach(data => {
        const arr = []
        this.headers.forEach(header => {
          if(header.dataKey === 'createdAt' || header.dataKey === 'editedAt' || header.dataKey === 'enteredAt') {
            arr.push(vm.$options.filters.fullDate(data[header.dataKey]))
          } else {
            arr.push(data[header.dataKey])
          }
        })
        items.push(arr)
      })

      const forms = this.forms
      const document = this.document
      var docWidth = doc.internal.pageSize.getWidth()

      posY += 10

      forms.forEach(f => {
        var label = f.label
        var val = document[f.value]
        doc.text(label, 15, posY, null, null, "left" )
        doc.text(val, docWidth - 15 ,posY, null, null, "right" )
        posY = posY + 6
      })
      
      posY += 10

      doc.text('Tabel ' + this.tableTitle, 15, posY)

      posY += 2

      doc.autoTable({
        startY: posY,
        columns: this.headers,
        body: items
      })

      var finalY = doc.previousAutoTable.finalY
      var leader = 'Ahmad Dzaki Hafizhi, M.Pd'
      var textWidth = doc.getTextWidth(leader)

      doc.setFontSize("12")

      
      doc.text(leader, docWidth - 50, finalY + 50, null, null, "center" )
      doc.line(docWidth - 80, finalY + 1 + 50, docWidth - 80 + textWidth, finalY + 1 + 50, null, null, "center")
      doc.text('Kepala Sekolah', docWidth - 50, finalY + 56, null, null, "center" )

      doc.save(`Laporan ${ this.title }.pdf`)
      doc.autoPrint()
    }
  }
}
</script>

<style>

</style>