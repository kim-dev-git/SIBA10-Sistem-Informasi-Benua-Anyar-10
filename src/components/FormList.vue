<template>
  <div id="form-list">
    <form-item v-for="form in forms" :key="form.value" :form="form" :data="data" :items="items ? items[form.value] : ''" />
  </div>
</template>

<script>

import FormItem from './FormItem'
export default {
  components: {
    FormItem
  },
  props: [
    'forms',
    'data',
    'items',
  ]
}
</script>

<style>

</style>