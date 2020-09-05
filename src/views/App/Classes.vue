<template>
  <div id="class">
    <v-container>
      <v-layout column class="mt-n4">
        <p class="mb-2 mt-4 title" v-text="'Daftar kelas'" />
        <compact-list :items="items" :headers="headers" />
      </v-layout>
    </v-container>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import CompactList from '@/components/CompactList'
export default {
  name: 'Class',
  components: {
    CompactList,
  },
  data: () => ({
    headers: [
      { text: 'Kelas', value: 'name' },
      { text: 'Siswa', value: 'students', align: 'right' },
    ],
    items: [
      { name: '1A', students: '20' },
      { name: '1B', students: '18' },
      { name: '2A', students: '21' },
      { name: '2B', students: '19' },
      { name: '3A', students: '20' },
      { name: '2B', students: '17' },
    ]
  }),
  computed: {
    ...mapState([
      'activeNavigation'
    ])
  },
  mounted() {
    this.$store.dispatch('setPage', {
      back: '',
      title: 'Kelas'
    })
  }
}
</script>
