<template>
  <div id="form-item">
    <label v-text="label" :for="value" class="subtitle-2 text--disabled" />
    <v-text-field :id="value"
      :name="value"
      @click="showOptions = true"
      v-model="data[value]"
      class="mb-n4 font-weight-bold"
      :class="textCase ? `text-${ textCase } overline` : ''"
      :label="label"
      :color="color"
      append-icon="mdi-chevron-down"
      flat
      dense
      solo
      outlined
      :single-line="singleline"
      :rounded="rounded"
      readonly
    />
    <dialog-bottom
      v-model="showOptions"
      :title="label">
      <v-list
        class="mt-n6">
        <v-list-item-group
          v-model="selected">
          <v-list-item v-for="item in items"
            :key="item.value"
            :value="item.value"
            @click="onClick(item)"
            class="round-all grey lighten-4 my-2"
            dense>
            <v-list-item-content>
              <span v-text="item.text ? item.text : item.value" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </dialog-bottom>
  </div>
</template>

<script>

import DialogBottom from './DialogBottom'
export default {
  components: {
    DialogBottom
  },
  props: [
    'data',
    'items',
    'value',
    'label',
    'color',
    'rounded',
    'singleline',
    'textCase',
  ],
  data: () => ({
    showOptions: false,
    selected: null,
  }),
  methods: {
    onClick(item) {
      var data = this.data
      var prop = this.value
      var propID = this.value + 'ID'

      if(item.id) {
        data[prop] = item.value
        data[propID] = item.id
      } else {
        delete data[propID]
        data[prop] = item.value
      }

      this.showOptions = false
    }
  },
  mounted() {
    //
  }
}
</script>

<style lang="scss" scoped>
  // .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    
  // }
</style>
