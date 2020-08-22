<template>
  <div id="profile">
    <v-main>
      <v-btn id="button-edit-fab"
        @click="openDialogProfile()"
        class="mb-13"
        color="primary"
        fixed
        rounded
        bottom
        right
        >
        <v-icon v-text="'mdi-pencil'" left />
        <span v-text="'Edit'" />
      </v-btn>

      <data-list :data="userProfile" :forms="formProfile" />

      <v-layout id="button-logout"
        class="align-center mt-4"
        column>
        <v-btn
          @click="logout()"
          color="error">
          <span v-text="'Keluar'" />
        </v-btn>
      </v-layout>
    </v-main>

    
    <dialog-bottom id="dialog-profile"
      v-model="dialogProfile"
      :title="'Data diri'"
      buttonCancel="Batal"
      buttonAction="Simpan"
      @action="updateProfile()"
      persistent>
      <form-list :forms="formProfile" :data="dataProfile" />
    </dialog-bottom>

  </div>
</template>

<script>
import DialogBottom from '../../components/DialogBottom'
import FormList from '../../components/FormList'
import DataList from '../../components/DataList'
export default {
  components: {
    DialogBottom,
    FormList,
    DataList,
  },
  data: () => ({
    dialogProfile: false,
    dataProfile: {},
    formProfile: [
      { label: 'Nama', value: 'name', type: 'text' },
      { label: 'Gelar depan', value: 'prefix', type: 'text' },
      { label: 'Gelar belakang', value: 'suffix', type: 'text' },
      { label: 'NIK', value: 'nik', type: 'number' },
    ],
  }),
  computed: {
    userProfile() {
      return this.$store.state.users.profile
    }
  },
  methods: {
    async openDialogProfile() {
      const data = this.dataProfile
      const forms = this.formProfile
      const userProfile = this.userProfile

      // await this.$store.dispatch('users/get', userProfile)

      forms.forEach(form => {
        if(userProfile[form.value]) {
          data[form.value] = userProfile[form.value]
        }
      })

      this.dialogProfile = true
    },
    updateProfile() {
      delete this.dataProfile.uid
      this.$store.dispatch('users/set', this.dataProfile)
      this.dialogProfile = false
      this.dataProfile = this.userProfile
    },
    logout() {
      this.$store.dispatch('users/signout')
    }
  },
  watch: {
    userProfile: {
      immediate: true,
      handler() {
        if(this.userProfile.phoneNumber && this.userProfile.role) {
          if(!this.userProfile.name || !this.userProfile.nik) {
            this.openDialogProfile()
          }
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch('setPage', {
      back: '/app',
      title: 'Profil'
    })
  }
}
</script>

<style>

</style>