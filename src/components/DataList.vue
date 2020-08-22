<template>
  <div id="data-list">
    <v-list>
      <v-list-item
        v-for="form in forms"
        :key="form.value">
        <v-layout
          class="mx-n4"
          column>

          <v-layout
            class="pl-4 pr-6">
            <v-list-item-avatar
              v-if="form.icon"
              class="ml-n4 mr-0">
              <v-icon v-text="form.icon" />
            </v-list-item-avatar>
            <v-list-item-content>
              <span v-text="form.label" class="text--secondary" />
            </v-list-item-content>
            <v-list-item-action>
              <span v-text="data[form.value]" class="font-weight-bold" />
            </v-list-item-action>
          </v-layout>
        
        <v-divider />
        
      </v-layout>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  props: [
    'forms',
    'data'
  ]
}
</script>

<style>

</style>