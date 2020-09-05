<template>
  <div id="main" class="pr-sm-4">
    <the-navigation-top />
    <the-navigation-bottom />
      <v-card
        class="ma-sm-4 mt-sm-6"
        tile>
        <transition name="fade" mode="out-in">
            <router-view />
        </transition>
      </v-card>

    <dialog-bottom id="dialog-select-role"
      v-model="dialogSelectRole"
      :title="'Pilih posisi'"
      persistent>
        <v-list>
          <v-list-item-group>
            <v-list-item
              v-for="(role, index) in roles"
              :key="index"
              @click="selectRole(role.name)"
              class="mx-n3"
              color="primary">
              <v-list-item-avatar>
                <v-icon v-text="role.icon" />
              </v-list-item-avatar>
              <v-list-item-content>
                <span v-text="`Saya adalah ${ role.name }`" class="" />
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
    </dialog-bottom>

  </div>
</template>

<script>

import { mapState } from 'vuex'
import { auth } from '../firebase'
import TheNavigationTop from '@/components/TheNavigationTop'
import TheNavigationBottom from '@/components/TheNavigationBottom'
import DialogBottom from '../components/DialogBottom'
export default {
  name: 'Main',
  components: {
    TheNavigationTop,
    TheNavigationBottom,
    DialogBottom,
  },
  data: () => ({
    dialogSelectRole: false,
    roles: [
      { name: 'Guru', icon: 'mdi-account-tie' },
      { name: 'Tata Usaha', icon: 'mdi-account-settings' },
    ],
  }),
  computed: {
    userProfile() {
      return this.$store.state.users.profile
    }
  },
  methods: {
    selectRole(role) {
      this.$store.dispatch('users/selectRole', role)
      this.dialogSelectRole = false
    },
  },
  watch: {
    userProfile: {
      immediate: true,
      handler() {
        
        const currentUser = auth.currentUser

        if(!this.userProfile.phoneNumber) {
          this.$store.dispatch('users/get', currentUser)
        }

        if(this.userProfile.phoneNumber) {
          const user = this.userProfile
          const currentRoute = this.$route.path


          if(!user.name || !user.nik) {
            if(currentRoute !== '/app/profil') {
              this.$router.push('/app/profil')
            }
          }

          if(!user.role) {
            this.dialogSelectRole = true
          }
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch('getGenerations')
  }
}
</script>
