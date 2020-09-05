<template>
  <v-app>
    <notification-list />
    <v-main class="base">
      <transition name="fade" mode="out-in">
        <FullPageError v-if="error" :error="error" />
        <router-view v-else />
      </transition>
    </v-main>
  </v-app>
</template>

<script>

import NotificationList from './components/NotificationList'
import FullPageError from './components/FullPageError'
export default {
  name: 'App',

  components: {
    NotificationList,
    FullPageError,
  },

  data: () => ({
    //
  }),
  computed: {
    error() {
      return this.$store.state.error
    }
  }
};
</script>

<style lang="scss">

  $base: #F2F3F5;
  $primary: #5987D6;
  $radius: .9rem;

  #app {
    overflow: hidden;
    width: 100vw;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
    transform: translateX(2em);
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .2s ease;
  }

  .base-background {
    background-color: $base !important;
  }

  #sheet {
    border-top-left-radius: $radius;
    border-top-right-radius: $radius;
    padding: 12px;
  }

  .round-top {
    border-top-left-radius: $radius !important;
    border-top-right-radius: $radius !important;
  }

  .round-bot {
    border-bottom-left-radius: $radius !important;
    border-bottom-right-radius: $radius !important;
  }

  .round-all {
    border-radius: $radius !important;
    ::before {
      opacity: 0;
    }
    ::after {
      opacity: 0;
    }
  }

  #menu-btn {
    background-color: hsla(0,0%,100%,0.2) !important;
  }

  .landing-hero {
    position: absolute;
    right: 0;
  }
</style>
