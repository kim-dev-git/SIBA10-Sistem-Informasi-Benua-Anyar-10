<template>
  <v-btn id="button-add-fab"
    @click="onClick()"
    class="mb-13"
    color="primary"
    fixed
    :fab="!$vuetify.breakpoint.smAndUp"
    :rounded="$vuetify.breakpoint.smAndUp"
    bottom
    right
    >
    <v-icon v-text="icon ? icon : 'mdi-plus'" :left="$vuetify.breakpoint.smAndUp" />
    <span v-if="$vuetify.breakpoint.smAndUp" v-text="text ? text : 'Tambah'" />
  </v-btn>
</template>

<script>
export default {
  props: [
    'text',
    'icon',
  ],
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style>

</style>