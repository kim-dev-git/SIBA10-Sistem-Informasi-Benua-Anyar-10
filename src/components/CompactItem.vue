<template>
  <div id="compact-item">
    <v-list-item
      @click="$emit('click', item)" >
      <v-list-item-content
        v-for="header in headers"
        :key="header.value" >
        <span
          v-text="item[header.value]"
          :class="header.align ? `text-${ header.align }` : ''"
        />
      </v-list-item-content>
    </v-list-item>
    <v-divider />
  </div>
</template>

<script>
export default {
  props: [ 'item', 'headers' ]
}
</script>

<style>

</style>