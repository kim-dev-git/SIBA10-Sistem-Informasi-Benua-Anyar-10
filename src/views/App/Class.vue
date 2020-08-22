<template>
  <div id="class">    
    <v-main>
      <v-container>
        <v-layout column class="mt-n4">
          <p class="mb-2 mt-4 title" v-text="'Daftar siswa kelas ' + id" />
          <compact-list :items="items" :headers="headers" />
        </v-layout>
      </v-container>
    </v-main>
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
  props: [ 'id' ],
  data: () => ({
    headers: [
      { text: 'Nama', value: 'name' },
      { text: 'Jenis Kelamin', value: 'gender' },
      { text: 'Agama', value: 'religion' },
    ],
    items: [
      { name: 'Ahmad Faisal', gender: 'Laki-laki', religion: 'Islam' },
      { name: 'Bella Rahma', gender: 'Perempuan', religion: 'Islam' },
      { name: 'Christian', gender: 'Laki-laki', religion: 'Katholik' },
      { name: 'Dede Gunawan', gender: 'Laki-laki', religion: 'Islam' },
      { name: 'Eka Febrianti', gender: 'Perempuan', religion: 'Islam' },
      { name: 'Fitriani', gender: 'Perempuan', religion: 'Islam' },
    ]
  }),
  computed: {
    ...mapState([
      'activeNavigation'
    ])
  },
  methods: {
    toBack() {
      this.$router.push('/kelas')
    }
  },
  mounted() {
    this.$store.dispatch('setPage', {
      back: '/app/kelas',
      title: `Kelas ${ this.id }`
    })
  }
}
</script>
