<template>
  <div id="form-item">
    <form-item-input
      v-if="form.type !== 'combobox'
        && form.type !== 'textarea'"
      :data="data"
      :value="form.value"
      :label="form.label"
      :type="form.type"
      color="primary"
    />
    <form-item-combobox
      v-if="form.type === 'combobox'"
      :items="items"
      :data="data"
      :value="form.value"
      :label="form.label"
      :type="form.type"
      color="primary"
    />
  </div>
</template>

<script>

import FormItemInput from './FormItemInput'
import FormItemCombobox from './FormItemCombobox'
export default {
  components: {
    FormItemInput,
    FormItemCombobox
  },
  props: [
    'form',
    'data',
    'items'
  ]
}
</script>

<style>
</style>
