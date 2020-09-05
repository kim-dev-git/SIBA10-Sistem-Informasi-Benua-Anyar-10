<template>
  <div id="profile">
    <div>
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

      <data-compact :items="formProfile">

        <template #avatar="{ item }">
          <v-list-item-avatar
            v-if="item.icon"
            class="ml-n4 mr-0">
            <v-icon v-text="item.icon" />
          </v-list-item-avatar>
        </template>
        
        <template #content="{ item }">
          <v-list-item-content>
            <span v-text="item.label" class="text--secondary" />
          </v-list-item-content>
        </template>
        
        <template #action="{ item }">
          <span v-text="userProfile[item.value]" class="font-weight-bold" />
        </template>

      </data-compact>

      <!-- <data-list :data="userProfile" :forms="formProfile" /> -->

      <v-layout id="button-logout"
        class="align-center mt-4"
        column>
        <v-btn
          @click="logout()"
          class="mb-4"
          color="error">
          <span v-text="'Keluar'" />
        </v-btn>
      </v-layout>
    </div>

    
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
import DataCompact from '../../components/DataCompact'
export default {
  components: {
    DialogBottom,
    FormList,
    DataCompact,
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
      back: null,
      title: 'Profil'
    })
  }
}
</script>

<style>

</style>