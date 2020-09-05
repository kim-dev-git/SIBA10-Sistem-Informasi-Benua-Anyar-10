<template>
  <div id="two-line-list"
    class="mb-15">
    <v-list
      two-line>
      <!-- <v-list-item-group> -->
        <v-list-item
          v-for="(item, idx) in items"
          :key="`${ idx }`"
          @click="onClick(item)">
          <v-layout
            class="mx-n4"
            column>
            <v-layout
              class="px-4">
              <slot name="avatar" :item="item" />
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

                <slot name="action" :item="item">
                  <v-btn
                    @click.stop="onAction(item)"
                    class="mr-n4"
                    icon>
                    <v-icon v-text="'mdi-dots-vertical'" />
                  </v-btn>
                </slot>
                
              </v-list-item-action>
            </v-layout>

            <v-divider />

          </v-layout>

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
    'data',
    'title',
    'subtitle',
  ],
  computed: {
    properties() {
      var array = []

      var forms = this.forms

      if(forms !== undefined) {
        forms.forEach(form => {
          array.push(form.value)
        })
      } else {
        return this.items
      }

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