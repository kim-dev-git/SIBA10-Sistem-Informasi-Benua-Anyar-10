<template>
  <div id="home">
    <v-app-bar id="app-bar"
      class="px-0 px-sm-0 pt-2"
      color="transparent"
      dark
      absolute
      flat>
      <v-container>
        <v-layout
          class="align-center">
          <!-- <img src="../assets/logo.png" height="32" class="mr-4" /> -->
          <v-toolbar-title v-text="'SDN Benua Anyar 10'" class="text-h6 ml-0" />
          <v-spacer />

          <v-layout id="menu-navigation"
            v-if="$vuetify.breakpoint.mdAndUp">
            <v-btn
              v-text="'Tentang Kami'"
              class="text-none"
              color="white"
              text
              rounded
            />
            <v-btn
              v-text="'Tentang Kami'"
              class="text-none"
              color="white"
              text
              rounded
            />
            <v-btn
              v-text="'Tentang Kami'"
              class="text-none"
              color="white"
              text
              rounded
            />
          </v-layout>

          <v-spacer />

          <v-btn id="menu-btn"
            v-if="!$vuetify.breakpoint.mdAndUp"
            @click="menuActive = true"
            color="white"
            width="48"
            height="32"
            small
            depressed
            dark
            rounded>
            <v-icon v-text="'mdi-menu'" />
          </v-btn>

          <v-btn id="menu-btn"
            v-else
            @click="goTo('/login')"
            depressed
            rounded>
            <span v-text="'Login'" class="text-none" />
            <v-icon v-text="'mdi-chevron-right'" right />
          </v-btn>

          <v-menu id="menu-btn-mobile"
            v-model="menuActive"
            transition="slide-y-transition"
            :min-width="$vuetify.breakpoint.mdAndUp ? '200px' : '94vw'"
            bottom
            :close-on-content-click="false"
            :close-on-click="false">

            <v-layout
              class="align-center white pa-4 pb-0">
              <p v-text="'Website'" class="text--disabled mb-0" />
              <v-spacer />
              <v-icon v-text="'mdi-close'" @click="menuActive = false" />
            </v-layout>
            <v-list>
              <v-list-item
                dense
                v-for="(item, i) in items"
                :key="i"
                @click="menuActive = false"
              >
                <v-icon v-text="item.icon" left />
                <v-list-item-title v-text="item.text" />
              </v-list-item>
            </v-list>
            <v-layout
              class="base align-center py-6"
              column>
              <v-btn id="menu-btn-mobile-login"
                @click="goTo('/login')"
                color="primary"
                depressed
                rounded>
                <span v-text="'Login'" class="text-none" />
                <v-icon v-text="'mdi-chevron-right'" right />
              </v-btn>
            </v-layout>
          </v-menu>
        </v-layout> 
      </v-container>

    </v-app-bar>

    <v-main>

      <v-layout id="section-hero"
        class="white align-center mt-12"
        :style="$vuetify.breakpoint.mdAndUp ? 'height: 87vh;' : 'height: 83vh;'">
        <background-fill
          :height="$vuetify.breakpoint.mdAndUp ? '320' : '35vh'"
          color="primary"
        />
        <v-container
          style="postion: relative; z-index: 2;">
          <v-layout class="align-center">
            <v-flex xs12 md6
              class="pr-0 pr-md-4 ml-0 ml-md-n4">
              <p
                v-text="page.title"
                class="font-weight-bold mx-5"
                :class="$vuetify.breakpoint.mdAndUp ? 'text-h2' : 'text-h3'"
              />
              <v-card
                class="pa-4 mt-8 mx-2 transparent">
                <p
                  v-text="page.subtitle"
                  class="text-h6 font-weight-regular text--secondary"  
                />
              </v-card>
            </v-flex>
            <v-flex xs12 md6
              v-if="$vuetify.breakpoint.mdAndUp"
              class="landing-hero">
              <v-card class="elevation-12 pa-1 pb-0">
                <img src="../assets/img_1.jpg" width="100%" />
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
        
      <v-layout id="section-scroll-down"
        class="grey lighten-2 align-center py-2"
        column>
        <p v-text="'Geser kebawah'" class="mb-0 text--secondary" />
        <v-icon large v-text="'mdi-chevron-down'" class="mt-n2" />
      </v-layout>
        
      <v-container id="section-about-us"
        style="height: 100vh">
        <v-layout column>
          <p v-text="'Profile sekolah'" class="mb-2 text-uppercase subtitle-2" />

        </v-layout>
      </v-container>
    </v-main>
  </div>
</template>

<script>

import BackgroundFill from '../components/BackgroundFill'
import { mapState } from 'vuex'
export default {
  name: 'Home',
  components: {
    BackgroundFill,
  },
  data: () => ({
    menuActive: false,
    page: {
      title : 'Sekolah Dasar Negeri dengan akreditasi A',
      subtitle: 'Mengoptimalkan proses pembelajaran yang berwawasan lingkungan, mengembangkan IPTEK yang berwawasan lingkungan, dan membudayakan cinta lingkungan'
    },
    items: [
      { text: 'Tentang Kami', icon: 'mdi-plus' },
      { text: 'Tentang Kami', icon: 'mdi-plus' },
      { text: 'Tentang Kami', icon: 'mdi-plus' },
    ],
  }),
  computed: {
  },
  methods: {
    goTo(link) {
      this.$router.push(link)
    }
  },
  mounted() {
  }
}
</script>
