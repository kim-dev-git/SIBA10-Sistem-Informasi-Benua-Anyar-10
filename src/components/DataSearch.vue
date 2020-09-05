<template>
  <v-text-field id="data-search"
    @input="$emit('input', model)"
    v-model="model"
    class="ma-3 mb-n4"
    background-color="grey lighten-4"
    placeholder="Cari data..."
    outlined
    dense>
    <template #prepend-inner>
      <v-icon v-text="'mdi-magnify'" left />
    </template>
  </v-text-field>
</template>

<script>
export default {
  props: [
    'value'
  ],
  data: () => ({
    model: null
  }),
  mounted() {
    this.model = this.value
  }
}
</script>

<style>

</style>