<template>
  <div id="schedules">
    <v-container>
      <v-layout>
        <v-spacer />
        <v-btn
          to="/app/matapelajaran"
          class="text-none"
          color="primary">
          <v-icon v-text="'mdi-bookmark'" left />
          <span v-text="'Mata Pelajaran'" />
        </v-btn>
      </v-layout>
      <div>
        <p v-text="'Collection'" />
        <v-layout v-for="data in schedules" :key="data.id">
          <span v-text="data" />
          <v-spacer />
          <v-btn @click="editSchedules(data)" color="info">Edit</v-btn>
          <v-btn @click="removeSchedules(data)" color="error">Hapus</v-btn>
        </v-layout>
      </div>
      <div>
        <p v-text="'Document'" />
        <p v-text="schedule" />
      </div>
      <v-btn @click="postSchedules()">Post</v-btn>
    </v-container>
  </div>
</template>

<script>
export default {
  computed: {
    classrooms() {
      return this.$store.state.classrooms.collection
    },
    schedules() {
      return this.$store.state.schedules.collection
    },
    schedule() {
      return this.$store.state.schedules.document
    },
  },
  methods: {
    getClassrooms() {
      this.$store.dispatch('classrooms/get')
    },
    getSchedules() {
      this.$store.dispatch('schedules/get')
      this.$store.dispatch('schedules/get', 'H3kURogEgo3tvehxwzuE')
    },
    postSchedules() {
      var data = {
        a: 'Judul',
        b: 'Deskripsi',
      }
      this.$store.dispatch('schedules/post', data)
    },
    removeSchedules(data) {
      this.$store.dispatch('schedules/remove', data)
    },
    editSchedules(data) {
      data.a = 'Edited'
      this.$store.dispatch('schedules/put', data)
    }
  },
  mounted() {
    this.$store.dispatch('setPage', {
      back: null,
      title: 'Jadwal'
    })

    this.getClassrooms()
    this.getSchedules()
  }
}
</script>

<style>

</style>