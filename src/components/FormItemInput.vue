<template>
  <div id="form-item">
    <label v-text="label" :for="value" class="subtitle-2 text--disabled" />
    <v-text-field :id="value"
      :name="value"
      v-model="data[value]"
      class="mb-n4 font-weight-bold"
      :type="type"
      :color="color"
      :prefix="prefix"
      :suffix="suffix"
      flat
      :clearable="clearable"
      dense
      solo
      outlined
    />
  </div>
</template>

<script>
export default {
  props: [
    'data',
    'value',
    'label',
    'type',
    'color',
    'prefix',
    'suffix',
    'clearable',
  ]
}
</script>

<style>
</style>
