<template>
  <div id="form-item">
    <form-item-input
      v-if="form.type !== 'combobox'
        && form.type !== 'textarea'
        && form.type !== 'file'"
      :data="data"
      :value="form.value"
      :label="form.label"
      :type="form.type"
      :prefix="form.prefix"
      :suffix="form.suffix"
      color="primary"
    />
    <form-item-combobox
      v-else-if="form.type === 'combobox'"
      :items="items"
      :data="data"
      :value="form.value"
      :label="form.label"
      :type="form.type"
      :prefix="form.prefix"
      :suffix="form.suffix"
      color="primary"
    />
    <div v-else-if="form.type === 'file'">
      <v-file-input
        v-model="data[form.value]"
        :label="form.label"
      />
    </div>
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
