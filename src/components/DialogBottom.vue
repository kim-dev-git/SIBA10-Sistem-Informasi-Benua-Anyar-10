<template>
  <v-bottom-sheet v-model="dialog" :persistent="persistent" :max-width="$vuetify.breakpoint.smAndUp ? '480px' : '100vw'">
    <v-sheet id="sheet">
      <p class="subtitle-1 font-weight-bold" v-text="title" />
      <slot />
      <v-layout
        v-if="buttonCancel || buttonAction"
        class="pb-2 pt-3">
        <v-spacer />
        <v-btn
          v-if="buttonCancel"
          @click="dialog = false, $emit('close')"
          color="grey lighten-4"
          depressed>
          <span class="overline font-weight-bold" v-text="buttonCancel" />
        </v-btn>
        <v-btn
          v-if="buttonAction"
          @click="$emit('action')"
          :color="buttonActionColor ? buttonActionColor : 'primary'"
          class="ml-4"
          :loading="isLoading === 'post'"
          depressed
          dark>
          <span class="overline font-weight-bold" v-text="buttonAction" />
        </v-btn>
      </v-layout>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
export default {
  props: [
    'value',
    'title',
    'persistent',
    'buttonCancel',
    'buttonAction',
    'buttonActionColor',
  ],
  data: () => ({
    dialog: false,
  }),
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    }
  },
  mounted() {
    this.dialog = this.value
  },
  watch: {
    dialog() {
      this.$emit('input', this.dialog)
    },
    value() {
      this.dialog = this.value
    }
  }
}
</script>
