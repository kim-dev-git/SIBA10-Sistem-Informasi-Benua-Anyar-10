<template>
  <div id="two-line-list">
    <v-list
      two-line>
      <!-- <v-list-item-group> -->
        <v-list-item
          v-for="item in items"
          :key="`${ item[properties[0]] }-${ item[properties[1]] }`"
          @click="onClick(item)">
          <v-list-item-content>

            <slot name="content"
              :item="item">
              <div>
                <v-list-item-title v-text="title ? title : item[properties[0]]" class="font-weight-bold" />
                <v-list-item-subtitle v-text="subtitle ? subtitle : item[properties[1]]" />
              </div>
            </slot>

          </v-list-item-content>
          <v-list-item-action>

            <slot />

            <slot name="action">
              <v-btn
                @click.stop="onAction(item)"
                icon>
                <v-icon v-text="'mdi-dots-vertical'" />
              </v-btn>
            </slot>
            
          </v-list-item-action>
        </v-list-item>
      <!-- </v-list-item-group> -->
    </v-list>
  </div>
</template>

<script>
export default {
  props: [
    'items',
    'forms',
    'title',
    'subtitle',
  ],
  computed: {
    properties() {
      var array = []

      this.forms.forEach(form => {
        array.push(form.value)
      })

      return array
    }
  },
  methods: {
    onClick(item) {
      this.$emit('click', item)
    },
    onAction(item) {
      this.$emit('action', item)
    },
  }

}
</script>

<style>

</style>