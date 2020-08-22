<template>
  <v-container
    class="fill-height justify-center"
    >
    <v-card
      color="transparent"
      class="pa-4"
      flat>
      <v-layout
        column
        class="align-center" >
        <img :src="require('../assets/otp.svg')" width="200" alt="login">
        <p class="text-h6 my-2">Verifikasi Kode OTP</p>
        <p class="caption text-center text--secondary">Kami telah mengirimkan SMS ke Nomor HP anda, silahkan masukkan 6 digit Kode OTP</p>
        <v-text-field
          flat
          solo
          rounded
          autofocus
          type="number"
          placeholder="Masukkan 6 digit kode OTP"
          background-color="grey lighten-2"
          style="width: 100%"
          class="centered-input"
          v-model="verifCode"
          @keyup.enter="verifyOTP()" />
        <!-- <v-layout>
          <v-text-field
            v-for="i in 6" :key="i"
            flat
            solo
            rounded
            :ref="`code${i}`"
            type="number"
            background-color="grey lighten-4"
            class="centered-input subtitle-2"
            oninput="if(this.value.length > 1) this.value = this.value[1]"
            @input="setFocus(i)"
            v-model="code[i]"
             />
        </v-layout> -->

        <v-btn
          text
          small
          :disabled="countdown > 0"
          color="primary"
          class="text-none mt-n6 mb-2" >
          Kirim Ulang
          <span v-if="countdown > 0">({{ countdown }})</span>
        </v-btn>

        <v-btn
          rounded
          depressed
          :loading="isLoading === 'post'"
          :disabled="verifCode && verifCode.length !== 6"
          color="primary"
          class="text-none"
          height="50"
          width="100%"
          @click="verifyOTP()" >
          Verifikasi
        </v-btn>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    verifCode: '',
    code: {},
    countdown: 30
  }),
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    }
  },
  methods: {
    verifyOTP() {
      this.$store.dispatch('users/verifyOTP', { otp: this.verifCode })
    },
    sleep(duration) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, duration * 1000)
      })
    },
    async verif() {
      // this.loading = true
      // await this.sleep(2)
      // this.loading = false
      // this.$router.push('/')
    },
    setFocus(id) {
      if (id < 6) {
        const ref = `code${id}` 
        const input = this.$refs['code'+String(id+1)]
        input[0].focus()
      }
    },
    async decreaseCountdown() {
      while (this.countdown > 0) {
        await this.sleep(1)
        // console.log(this.countdown)
        this.countdown--
      }
    }
  },
  mounted() {
    this.decreaseCountdown()
  }
}
</script>

<style scoped>
  .centered-input >>> input {
    text-align: center !important;
  }
</style>
