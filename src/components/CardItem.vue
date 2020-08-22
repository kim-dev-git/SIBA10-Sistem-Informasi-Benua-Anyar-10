<template>
  <div id="card-item">
    <v-card
      height="120"
      width="240"
      class="ma-2 mb-4" >
      <v-layout
        class="pa-4 align-center"
        :style="leftBorder(item.color)"  >
        <div style="position: absolute; bottom: 1;">
          <p class="mb-n1 title" v-text="item.title" />
          <v-icon
            small
            left
            class="text--secondary"
            v-text="item.icon"
          />
          <span
            class="caption text--secondary"
            v-text="item.subtitle"
          />
        </div>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
export default {
  props: [ 'item' ],
  methods: {
    leftBorder(color) {
      var style = ''
      const thick = 6
      style = `border-left: ${ thick }px solid ${ color } !important; height: 100%;`
      return style
    }
  }
}
</script>

<style>
  .bLeft {
    border-left: 4px solid red;
  }
</style>