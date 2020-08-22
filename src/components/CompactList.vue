<template>
  <div id="compact-list">
    <v-list class="mx-n3">
      <compact-header :headers="headers" />
      <v-list-item-group>
        <compact-item
          v-for="(item, index) in items"
          :key="index"
          :item="item"
          :headers="headers"
          @click="$emit('click', item)"
        />
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>

import CompactItem from './CompactItem'
import CompactHeader from './CompactHeader'
export default {
  components: {
    CompactItem,
    CompactHeader
  },
  props: [ 'items', 'headers' ],
  computed: {
    newItems() {

    }
  },
  methods: {
  }
}
</script>

<style>

</style>