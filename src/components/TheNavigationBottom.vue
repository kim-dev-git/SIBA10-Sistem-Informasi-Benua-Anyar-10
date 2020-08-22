<template>
    <v-bottom-navigation
      v-if="!$vuetify.breakpoint.smAndUp"
      app
      grow
      color="primary"
      v-model="activeNav"
    >
      <v-btn v-for="menu in menuNavigation"
        :key="menu.text"
        :value="menu.link"
        @click="goTo(menu.link)"
        height="55"
      >
        <span class="caption">{{ menu.text }}</span>
        <v-icon>{{ menu.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
</template>

<script>

import { mapGetters } from 'vuex'
export default {
  name: 'NavigationBottom',
  components: {
  },
  data: () => ({
    activeNav: null,
  }),
  computed: {
    ...mapGetters([
      'menuNavigation'
    ]),
    userProfile() {
      return this.$store.state.users.profile
    },
    showNav() {
      return Object.keys(this.userProfile).length > 1
    },
    currentPath() {
      return this.$route.path
    }
  },
  methods: {
    goTo(link) {
      const currentPath = this.currentPath
      if(currentPath !== link) {
        this.$router.push(link)
      }
    }
  },
  watch: {
    currentPath() {
      // console.log('change:', this.currentPath)
      this.activeNav = this.currentPath
      this.$store.dispatch('setNavigation', this.currentPath)
    }
  },
  mounted() {
    this.activeNav = this.$route.path
    // console.log(this.activeNav)
  }
}
</script>
