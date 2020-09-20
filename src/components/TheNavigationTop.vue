<template>
  <div>
  <v-app-bar
    app
    class="elevation-1"
    color="white"
  >
    <v-container class="fill-height py-0">
      <slot name="left">
        <v-btn
          v-if="page.back"
          @click="goTo(page.back)"
          class="ml-n6"
          icon>
          <v-icon large v-text="'mdi-chevron-left'"/>
        </v-btn>
        <v-btn
          v-else
          @click="goTo('/app/profil')"
          class="ml-n6"
          icon>
          <v-icon large v-text="'mdi-account-circle'"/>
        </v-btn>
        <!-- <v-btn
          v-else
          class="ml-n6"
          style="opacity: 0"
          disabled
          icon>
          <v-icon large v-text="'mdi-chevron-left'"/>
        </v-btn> -->
      </slot>

      <v-spacer />

      <slot>
        <v-toolbar-title v-if="page.title" v-text="page.title" class="font-weight-bold" />
      </slot>

      <!-- <span v-if="documentQRCode" v-text="documentQRCode.id.substr(0, 4)" /> -->

      <v-spacer />

      
      <v-btn id="button-scan"
        v-if="userProfile.role === 'Guru'"
        @click="dialogScan = true"
        color="primary"
        icon
        >
        <v-icon v-text="'mdi-qrcode-scan'" class="ml-2" left />
        <!-- <span v-text="'Absen'" class="ml-2 mr-1" /> -->
      </v-btn>

      <v-btn id="button-generate"
        v-else
        @click="dialogGenerate = true"
        color="primary"
        icon
        >
        <v-icon v-text="'mdi-qrcode'" class="ml-2" left />
        <!-- <span v-text="'Absen'" class="ml-2 mr-1" /> -->
      </v-btn>

      <div class="mr-n4">

        <dialog-bottom id="dialog-scan"
          v-model="dialogScan"
          :title="'Scan kode QR untuk absen'"
          buttonCancel="Batal">
          <qrcode-stream @init="onInit()" @decode="onScan" />
        </dialog-bottom>

        <dialog-bottom id="dialog-generate"
          v-model="dialogGenerate"
          :title="'Scan kode QR menggunakan HP anda'"
          buttonCancel="Batal"
          @close="reRender += 1">
          <v-layout
            class="align-center"
            :key="reRender"
            column>
            <qrcode v-if="documentQRCode && documentQRCode.id" :value="'BA10' + documentQRCode.id" :options="{ width: 320 }" :key="reRender" />
          </v-layout>
        </dialog-bottom>

      </div>
      
      <slot name="right">
        <!-- <the-navigation-avatar /> -->
      </slot>
    </v-container>
  </v-app-bar>
  <the-navigation-drawer />
  </div>
</template>

<script>

import { auth, db, serverTimestamp } from '../firebase'
import TheNavigationDrawer from '@/components/TheNavigationDrawer'
import TheNavigationAvatar from '@/components/TheNavigationAvatar'
import { QrcodeStream } from 'vue-qrcode-reader'
import DialogBottom from '../components/DialogBottom'
export default {
  components: {
    TheNavigationDrawer,
    TheNavigationAvatar,
    QrcodeStream,
    DialogBottom,
  },
  data: () => ({
    dialogScan: null,
    dialogGenerate: null,
    documentQRCode: null,
    reRender: 0,
  }),
  computed: {
    page() {
      return this.$store.state.page
    },
    userProfile() {
      return this.$store.state.users.profile
    },
    showNav() {
      return Object.keys(this.userProfile).length > 1
    }
  },
  methods: {
    goTo(link) {
      this.$store.dispatch('setNavigation', link)
      this.$router.push(link)
    },
    async onInit (promise) {
      let error = ''
      
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          error = "ERROR: you need to grant camera access permisson"
        } else if (error.name === 'NotFoundError') {
          error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          error = "ERROR: Stream API is not supported in this browser"
        }
      }

      if(error !== '') {
        this.$store.dispatch('notifications/post', {
          title: 'Kamera bermasalah',
          body: error,
        })
      }
    },
    onScan(result) {
      const prefix = result.substr(0, 4)
      const code = result.substr(4)

      if(prefix === 'BA10') {
        this.scanQRCode(code)
        // this.dialogScan = false
      } else {
        this.$store.dispatch('notifications/post', {
          title: 'Kode QR salah',
          body: 'Pastikan anda scan kode QR dari PC Sekolah',
        }, { root: true })

        console.log('Pastikan anda scan kode QR dari PC Sekolah')
      }

      this.reRender += 1
    },
    async getQRCode() {
      const ref = db.collection('metadata')
      // if(!this.documentQRCode.usedAt) {
      //   ref.doc(this.documentQRCode.id).delete()
      // }
      // ref.get().then(s => {
      //   s.docs.forEach(d => {
      //     if(d.id) {
      //       // ref.doc(d.id).delete()
      //       console.log('run')
      //     }
      //   })
      // })

      let generateQRCode = await ref.add({ createdAt: serverTimestamp() })
      // var documentQRCode = this.documentQRCode
      let streamQRCode = ref.doc(generateQRCode.id).onSnapshot(s => {
        var obj = s.data()
        if(!obj.id && s.id) {
          obj.id = s.id
          this.documentQRCode = obj
        }
      })

    },
    async scanQRCode(code) {
      if(!code) {
        return
      }
      var batch = db.batch()
      const ref = db.collection('attendance').doc(code)
      const refMeta = db.collection('metadata').doc(code)
      const user = this.$store.state.users.profile

      batch.set(ref, {
        userID: user.uid,
        userName: user.name,
        // userSuffix: user.suffix,
        // userPrefix: user.prefix,
        createdAt: serverTimestamp()
      })
      batch.update(refMeta, {
        usedAt: serverTimestamp(),
        userID: user.uid,
        userName: user.name,
        // userSuffix: user.suffix,
        // userPrefix: user.prefix,
      })

      batch.commit().then(() => {
        this.$store.dispatch('notifications/post', {
          // title: 'Absen berhasil',
          body: 'Anda berhasil absen',
        })
      }).catch(err => {
        this.$store.dispatch('notifications/post', {
          title: 'Absen gagal',
          body: err,
        })
      })

      this.dialogScan = false
  
    },
    async streamQRCode() {
      if(!this.documentQRCode) {
        return
      }
      var documentQRCode = this.documentQRCode
      
      this.$store.dispatch('notifications/post', {
        // title: `${ documentQRCode.userName } berhasil absen`,
        body: `${ documentQRCode.userName } berhasil absen`,
      })
      
      const ref = db.collection('metadata').doc(documentQRCode.id)
      // let remove = await ref.delete().then(() => {
      //   this.reRender += 1
      // })

      this.dialogGenerate = false

    }
  },
  watch: {
    reRender: {
      immediate: false,
      handler() {
        // const id = this.documentQRCode.id
        // if(id) {
        //   const ref = db.collection('metadata').doc(id)
        //   ref.delete()
        // }

        // const ref = db.collection('metadata')
        // if(!this.documentQRCode.usedAt) {
        //   ref.doc(this.documentQRCode.id).delete()
        // }

        // this.getQRCode()
        // console.log('reRender', this.reRender)
      }
    },
    documentQRCode(val) {
      if(val && val.usedAt) {
        this.streamQRCode()
      }
    },
    dialogGenerate(val) {
      if(val) {
        this.getQRCode()
        // console.log('reRender', this.reRender)
      } else if(!val) {
        // console.log('del')
        const ref = db.collection('metadata')
        if(!this.documentQRCode.usedAt) {
          ref.doc(this.documentQRCode.id).delete().then(() => {
            this.documentQRCode = null
          })
        }
      }
    }
  },
  mounted() {
    // this.getQRCode()
  }
}
</script>

<style>

</style>