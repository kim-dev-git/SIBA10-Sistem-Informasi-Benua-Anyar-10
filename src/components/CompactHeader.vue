<template>
  <div id="compact-header">
    <v-list-item>
      <v-list-item-content
        v-for="header in headers"
        :key="header.text" >
        <span v-text="header.text" class="text--disabled" :class="header.align ? `text-${ header.align }` : ''" />
      </v-list-item-content>
    </v-list-item>
    <v-divider />
  </div>
</template>

<script>
export default {
  props: [ 'headers' ]
}
</script>

<style>

</style>