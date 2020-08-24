<template>
  <div id="schedules">
    <v-main>
      {{ classrooms }}
    </v-main>
  </div>
</template>

<script>
export default {
  computed: {
    classrooms() {
      return this.$store.state.classrooms.collection
    }
  },
  methods: {
    getClassrooms() {
      this.$store.dispatch('classrooms/get')
    }
  },
  mounted() {
    this.$store.dispatch('setPage', {
      back: '/app',
      title: 'Jadwal'
    })

    this.getClassrooms()
  }
}
</script>

<style>

</style>