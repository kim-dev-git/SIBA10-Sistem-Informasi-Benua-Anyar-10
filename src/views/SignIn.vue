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
          autofocus
          v-model="phoneNumber"
          type="number"
          style="width: 100%"
          background-color="grey lighten-2"
          label="Nomor HP"
          placeholder="8xx-xxxx-xxxx"
          prefix="+62"
          @keyup.enter="sendOTP()"
        />
        <v-btn
          rounded
          depressed
          :loading="loading === 'post'"
          color="primary"
          class="text-none mt-n4"
          height="50"
          width="100%"
          @click="sendOTP()" >
          <span v-text="'Kirim'" />
        </v-btn>
      </v-layout>
    </v-card>

    <div id="recaptcha-container" />

  </v-container>
</template>

<script>

import { RecaptchaVerifier } from '@/firebase'
export default {
  data: () => ({
    // loading: false,
    appVerifier: '',
    phoneNumber: null
  }),
  computed: {
    loading() {
      return this.$store.state.isLoading
    }
  },
  methods: {
    sendOTP() {
      this.$store.dispatch('users/sendOTP', {
        phoneNumber: this.phoneNumber,
        appVerifier: this.appVerifier
      })
    },
    sleep(duration) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, duration * 1000)
      })
    },
    async sendOTPz() {
      this.loading = true
      await this.sleep(2)
      this.loading = false
      this.$router.push('/otp')
    },
    initReCaptcha(){
      setTimeout(()=>{
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
          'size': 'invisible',
          'callback': function(response) {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            // ...
          },
          'expired-callback': function() {
            // Response expired. Ask user to solve reCAPTCHA again.
            // ...
          }
        });
        //
        this.appVerifier =  window.recaptchaVerifier
      },1000)
    },
  },
  created(){
    this.initReCaptcha()
  },
}
</script>

<style>

</style>