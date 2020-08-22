<template>
  <v-menu
    bottom
    offset-y
    transition="slide-y-transition"
    class="pa-4" >

    <template v-slot:activator="{ on, attrs }">
      <v-avatar
        class="mr-n2"
        color="primary"
        size="32"
        v-bind="attrs"
        v-on="on">
        <span v-text="userProfile.name.substr(0, 1)" class="white--text subtitle-2" v-if="userProfile && userProfile.name" />
      </v-avatar>
    </template>

    <v-card class="pa-4 pt-0">
      <v-list class="mx-n4">
        <v-list-item
          v-for="(item, index) in menus"
          :key="index"
          @click=""
        >
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-layout
        class="jusitfy-center">
        <v-btn
          @click="logout()"
          small
          outlined
          color="error"
          class="text-none" >
          Keluar
        </v-btn>
      </v-layout>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    menus: [
      { text: 'Profil' },
    ]
  }),
  computed: {
    userProfile() {
      return this.$store.state.users.profile
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('users/signout')
    }
  }
}
</script>

<style>

</style>