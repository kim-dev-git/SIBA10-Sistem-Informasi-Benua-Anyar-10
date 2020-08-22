<template>
  <v-container
    class="fill-height justify-center">
    <v-card
      class="pa-4"
      color="transparent"
      flat>
      <v-layout
        column
        class="align-center" >
        <img :src="require('../assets/login.svg')" width="120" alt="login">
        <p class="text-h6 my-2">Login Menggunakan Nomor HP</p>
        <p class="caption text-center text--secondary">Masukkan Nomor HP anda untuk login, kami akan mengirimkan Kode OTP ke Nomor HP anda</p>
        <v-text-field
          flat
          solo
          rounded
          style="width: 100%"
          background-color="grey lighten-2"
          label="Nomor HP"
          placeholder="8xx-xxxx-xxxx"
          prefix="+62" />
        <v-btn
          rounded
          depressed
          :loading="loading"
          color="primary"
          class="text-none mt-n4"
          height="50"
          width="100%"
          @click="sendOTP()" >
          Kirim
        </v-btn>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    sleep(duration) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, duration * 1000)
      })
    },
    async sendOTP() {
      this.loading = true
      await this.sleep(2)
      this.loading = false
      this.$router.push('/otp')
    }
  }
}
</script>

<style>

</style>