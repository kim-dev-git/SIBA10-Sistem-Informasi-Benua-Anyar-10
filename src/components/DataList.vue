<template>
  <div id="data-list">
    <v-layout>
      <v-spacer />
      <print-table :title="title" :body="filteredItems()" :headers="headersPrint" :printOff="printOff" class="mr-3 mt-2" />
    </v-layout>
    
    
    <data-search v-model="search" />

    <data-table
      v-if="$vuetify.breakpoint.smAndUp"
      @click="onClick($event)"
      @edit="onEdit($event)"
      @remove="onRemove($event)"
      :headers="headers"
      :items="filteredItems()"
      :sortBy="sortBy"
      :desc="desc">

      <template #row="{ value, header, item }">
        <slot name="column"
          :item="item"
          :value="item[header.value]"
          :header="header"
        />
      </template>

    </data-table>

    <data-compact
      v-else
      :forms="forms"
      :items="filteredItems()"
      @click="onClick($event)"
      @action="onAction($event)">
      
      <template #content="{ item }">
        <slot name="compact-content" :item="item" />
      </template>
      <template v-if="actionOff" #action="{ item }">
        <div></div>
      </template>

    </data-compact>

  </div>
</template>

<script>

import DataSearch from './DataSearch'
import DataTable from './DataTable'
import DataCompact from './DataCompact'
import PrintTable from './PrintTable'

export default {
  components: {
    DataSearch,
    DataTable,
    DataCompact,
    PrintTable
  },
  props: [
    'forms',
    'headers',
    'items',
    'sortBy',
    'desc',
    'actionOff',
    'headersPrint',
    'title',
    'printOff',
  ],
  data: () => ({
    search: null,
  }),
  methods: {
    filteredItems() {
      var arr = this.items
      var search = this.search
      var forms = [...this.forms]

      const newArr = []

      function match(key, search) {
        arr.map(obj => {
          if (obj[key] && obj[key].toLowerCase().indexOf(search) !== -1) {
            var check = newArr.filter(v => v.id === obj.id).length > 0
            
            if(!check) {
              newArr.push(obj)
            }
          }
        })
      }

      if(!search) {
        return arr
      } else {
        var filterVal = this.search.toLowerCase()
        
        forms.forEach(form => {
          if(form.value !== 'createdAt' && form.value !== 'editedAt' && form.value !== 'enteredAt') {
            match(form.value, filterVal)
          }
        })
      }

      return newArr
    },

    onClick(item) {
      this.$emit('click', item)
    },
    onAction(item) {
      this.$emit('action', item)
    },
    onEdit(item) {
      this.$emit('edit', item)
    },
    onRemove(item) {
      this.$emit('remove', item)
    },
  }
}
</script>

<style>

</style>