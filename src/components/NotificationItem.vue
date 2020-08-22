<template>
  <div id="notification-item">
    <v-snackbar
      v-model="snackbar"
      :timeout="notification.timeout ? notification.timeout * 1000 : 4000"
      multi-line
    >
      <v-layout
        class="align-center">
        <v-icon v-if="notification.icon" v-text="notification.icon" class="mr-4" />
        <v-layout
          column
          class="justify-center">
          <p class="title mb-n1 mt-n2" v-if="notification.title" v-text="notification.title" />
          <span class="caption" v-if="notification.body" v-text="notification.body" />
        </v-layout>
        <v-spacer />
        <v-btn
          text
          color="red darken-2"
          class="text-none mr-n4"
          @click="snackbar = false">
          <span v-text="'Tutup'" />
        </v-btn>
      </v-layout>
    </v-snackbar>
  </div>
</template>

<script>

export default {
  props: [ 'notification' ],
  data: () => ({
    snackbar: true,
  })
}
</script>

<style>

</style>