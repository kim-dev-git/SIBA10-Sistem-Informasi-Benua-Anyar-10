<template>
  <div id="dashboard">
    <div>
      <v-container>
        <v-layout column>
          <p v-text="`Jadwal hari ini (${ currentDay() })`" class="mb-2 text-uppercase subtitle-2" />
          <!-- <card-list :items="items" /> -->
          <card-list v-if="filteredSchedules.length > 0" :items="filteredSchedules">
            <template #card="{ item }">
              <v-layout
                class="pa-4"
                :style="leftBorder('blue')"
                column>
                <v-layout
                  class="align-center">
                  <h3 v-text="item.course" />
                  <v-spacer />
                  <v-chip
                    v-text="'Kelas ' + item.classroomName"
                    class="mx-1"
                    color="info"
                    small
                  />
                  <v-chip
                    v-text="item.generation"
                    color="success"
                    small
                  />
                </v-layout>
                <v-layout
                  class="align-center">
                  <v-icon v-text="'mdi-clock'" left />
                  <span v-text="time(item)" />
                </v-layout>
              </v-layout>
            </template>
          </card-list>
          <v-card
            v-else
            :style="leftBorder('grey')"
            class="pa-4 grey lighten-4"
            width="320"
          >
            <span v-text="'Tidak ada jadwal untuk hari ini'" class="text--secondary" />
          </v-card>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>

import moment from 'moment'
import { mapState } from 'vuex'
import { auth } from '../../firebase'
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
    ],
    days: [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ]
  }),
  computed: {
    ...mapState([
      'activeNavigation'
    ]),
    userProfile() {
      return this.$store.state.users.profile
    },
    mySchedules() {
      return this.$store.state.mySchedules
    },
    filteredSchedules() {
      const currentDay = this.currentDay()
      const items = [...this.mySchedules]
      let filtered = items.filter(v => {
        return v.day === currentDay
      })
      if(filtered) {
        return filtered
      } else {
        return []
      }
    }
  },
  methods: {
    time(item) {
      return item.from + '-' + item.to
    },
    leftBorder(color) {
      var style = ''
      const thick = 6
      style = `border-left: ${ thick }px solid ${ color } !important; height: 100%;`
      return style
    },
    currentDay() {
      const date = moment(new Date())
      const dow = date.day()
      return this.days[dow]
    },
  },
  async mounted() {
    this.$store.dispatch('setPage', {
      back: null,
      title: 'Dasbor'
    }),
    this.$store.dispatch('getMySchedules')
  },
  watch: {
    userProfile: {
      immediate: true,
      handler() {
        const user = this.userProfile
        if(user && user.role === 'Tata Usaha') {
          this.$router.replace('/app/danabos')
        }
      }
    }
  }
}
</script>
