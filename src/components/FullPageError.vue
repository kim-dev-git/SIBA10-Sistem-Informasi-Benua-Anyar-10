<template>
  <div id="full-page-error">
    <p v-text="error" />
  </div>
</template>

<script>
export default {
  props: [
    'error'
  ]
}
</script>

<style>

</style>