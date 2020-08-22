<template>
  <div id="card-list">
    <v-layout
      class="ma-n2 overflow-x-auto">
      <card-item
        v-for="(item, index) in items"
        :key="index"
        :item="item"
      />
    </v-layout>
  </div>
</template>

<script>

import CardItem from './CardItem'
export default {
  components: {
    CardItem
  },
  props: [ 'items' ]
}
</script>

<style>

</style>