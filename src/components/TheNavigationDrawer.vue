<template>
  <v-navigation-drawer
    app
    :mini-variant="$vuetify.breakpoint.sm"
    :permanent="$vuetify.breakpoint.smAndUp"
    v-model="active" >
    <v-list-item
      class="pt-2">
      <v-list-item-content>
        <v-layout>
        
        <v-app-bar-nav-icon v-if="!$vuetify.breakpoint.smAndUp" class="mr-4 ml-n1" @click="active = !active" />

        <img src="../assets/logo.png" width="24" />

        <v-list-item-title v-if="!$vuetify.breakpoint.sm" class="title ml-8" v-text="'SIBA-10'" />

      </v-layout>
      </v-list-item-content>
    </v-list-item>

    <!-- <v-divider /> -->

    <v-list
      dense
      nav
    >
      <v-list-item
        v-for="item in menuNavigation"
        :key="item.text"
        :to="item.link"
        active-class="info white--text"
        link
      >
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item-icon
              v-bind="attrs"
              v-on="on">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <span v-text="item.text" />

        </v-tooltip>
      </v-list-item>
    </v-list>
    <template #append>
      <v-layout column class="pa-4">
        <v-btn v-if="!$vuetify.breakpoint.sm" outlined color="error" class="text-none" @click="signOut()">Keluar</v-btn>

        <v-tooltip right v-else>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              class="ml-n1 error"
              color="white"
              icon>
              <v-icon @click="signOut()" v-text="'mdi-logout'" />
            </v-btn>
          </template>
          <span v-text="'Keluar'" />
        </v-tooltip>
      </v-layout>
    </template>
  </v-navigation-drawer>
</template>

<script>

import { mapState, mapGetters } from 'vuex'
export default {
  props: [ 'value' ],
  data: () => ({
    active: null
  }),
  computed: {
    ...mapState([
      'activeNavigation'
    ]),
    ...mapGetters([
      'menuNavigation',
    ]),
    userProfile() {
      return this.$store.state.users.profile
    }
  }
}
</script>

<style lang="scss" scoped>
  $primary: #1976D2;
  .active-navigation {
    border-left: 4px solid $primary;
    color: $primary;
  }
  .active-navigation::before {
    opacity: 0;
  }
</style>>

</style>