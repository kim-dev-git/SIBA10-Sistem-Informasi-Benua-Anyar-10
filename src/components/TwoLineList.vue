<template>
  <div id="two-line-list">
    <v-list
      two-line>
      <!-- <v-list-item-group> -->
        <v-list-item
          v-for="item in items"
          :key="item.abbreviation">
          <v-list-item-content>
            <div>
              <v-list-item-title v-text="item[properties[0]]" class="font-weight-bold" />
              <v-list-item-subtitle v-text="item[properties[1]]" />
            </div>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              @click="$emit('action', item)"
              icon>
              <v-icon v-text="'mdi-dots-vertical'" />
            </v-btn>
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
  ],
  computed: {
    properties() {
      var array = []

      this.forms.forEach(form => {
        array.push(form.value)
      })

      return array
    }
  }

}
</script>

<style>

</style>