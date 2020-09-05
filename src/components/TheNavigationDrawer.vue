<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant.sync="mini"
    app
    :permanent="$vuetify.breakpoint.smAndUp"
  >
    <v-list-item class="px-2 py-1">
      <v-avatar
        class="mr-n2"
        color="primary"
        size="32"
        v-bind="attrs"
        v-on="on">
        <span v-text="userProfile.name.substr(0, 1)" class="white--text subtitle-2" v-if="userProfile && userProfile.name" />
      </v-avatar>

      <v-list-item-title v-text="userProfile.name" class="ml-4" />

      <v-btn
        icon
        @click.stop="mini = !mini"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item
        v-for="item in menuNavigation"
        active-class="active-navigation"
        class="my-2"
        :key="item.text"
        :to="item.link"
        link
      >
        <v-list-item-icon
          :class="item.link === activeNavigation ? 'ml-n1' : ''" >
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

import { mapState, mapGetters } from 'vuex'
export default {
  data: () => ({
    drawer: null,
    mini: true
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