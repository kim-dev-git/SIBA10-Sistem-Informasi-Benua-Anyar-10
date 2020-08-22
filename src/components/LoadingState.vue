<template>
  <div id="loading-state"
    v-if="isLoading === 'get'">
    <v-layout
      class="align-center justify-center fill-height"
      column>
      <p v-text="'Loading...'" class="mb-0 text-h6" />
    </v-layout>
  </div>
</template>

<script>
export default {
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    }
  }
}
</script>

<style lang="scss" scoped>
  #loading-state {
    height: 90vh !important;
    width: 100vw;
  }
</style>