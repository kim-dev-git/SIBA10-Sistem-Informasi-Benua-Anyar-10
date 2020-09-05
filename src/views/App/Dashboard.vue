<template>
  <div id="dashboard">
    <div>

      <v-container>
        <v-layout column>
          <p v-text="'Jadwal hari ini'" class="mb-2 text-uppercase subtitle-2" />
          <card-list :items="items" />
        </v-layout>
      </v-container>
    </div>
    
  </div>
</template>

<script>

import { mapState } from 'vuex'
import CardList from '@/components/CardList'
export default {
  name: 'Dashboard',
  components: {
    CardList,
  },
  data: () => ({
    dialogScan: null,
    dialogGenerate: null,
    items: [
      { title: 'Matematika', subtitle: '09.00 - 10.00', icon: 'mdi-plus', color: 'blue' },
      { title: 'Bahasa Indonesia', subtitle: '10.00 - 11.00', icon: 'mdi-plus', color: 'green' },
      { title: 'IPA', subtitle: '11.00 - 12.00', icon: 'mdi-plus', color: 'orange' },
    ]
  }),
  computed: {
    ...mapState([
      'activeNavigation'
    ]),
    userProfile() {
      return this.$store.state.users.profile
    }
  },
  methods: {
    //
  },
  mounted() {
    this.$store.dispatch('setPage', {
      back: null,
      title: 'Dasbor'
    })
  }
}
</script>
