<template>
  <v-container class="fill-height justify-center">
    <v-card
      flat
      class="pa-4"
      width="400" >
      <p class="text-h6 text-center mt-n4 mb-4">
        Selamat Datang
      </p>
      <v-card-text class="caption text-center">
        Masuk sebagai
      </v-card-text>
      <v-layout column>
        <v-btn
          rounded
          height="55"
          color="primary"
          class="my-1"
          @click="$router.push('/loginguru')" >
          Guru
        </v-btn>
        <v-btn
          outlined
          rounded
          height="55"
          color="primary"
          class="my-1" >
          Tata Usaha
        </v-btn>
        <v-btn
          rounded
          height="55"
          color="success"
          class="my-1" >
          Siswa
        </v-btn>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
export default {

}
</script>

<style>

</style>