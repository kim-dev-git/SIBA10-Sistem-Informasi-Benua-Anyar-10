<template>
  <div id="courses">
    <v-main>
      <v-btn id="button-edit-fab"
        @click="newCourse()"
        class="mb-13"
        color="primary"
        fixed
        fab
        bottom
        right
        >
        <v-icon v-text="'mdi-plus'" />
        <!-- <span v-text="'Tambah'" /> -->
      </v-btn>
      
      <two-line-list id="courses-list"
        :items="courses"
        :forms="formCourse"
        @action="selectCourse($event)"
      />

      <dialog-bottom id="dialog-menu"
        v-model="dialogMenu"
        :title="'Aksi'"
        buttonCancel="Batal">
          <v-list
            class="mt-n4">
            <v-list-item-group>
              <v-list-item
                v-for="(action, index) in actions"
                :key="index"
                @click="selectAction(action.text)"
                class="mx-n3"
                color="primary">
                <v-list-item-avatar>
                  <v-icon v-text="action.icon" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <span v-text="`${ action.text }`" />
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
      </dialog-bottom>

      <dialog-bottom id="dialog-edit"
        @action="saveCourse()"
        v-model="dialogEdit"
        :title="dialogTitle"
        buttonCancel="Batal"
        buttonAction="Simpan"
        persistent>
        <form-list :forms="formCourse" :data="dataCourse" />
      </dialog-bottom>

      <dialog-bottom id="dialog-delete"
        @action="deleteCourse()"
        v-model="dialogDelete"
        :title="dialogTitle"
        buttonCancel="Batal"
        buttonAction="Hapus"
        buttonActionColor="error"
        persistent>
        <v-card
          class="pa-4"
          color="grey lighten-3"
          flat>
          <span
            v-html="`Yakin hapus mata pelajaran <b>${ dataCourse.name }</b>?`"
            class="text--secondary"
          />
        </v-card>
      </dialog-bottom>

    </v-main>
  </div>
</template>

<script>

import DialogBottom from '../../components/DialogBottom'
import FormList from '../../components/FormList'
import TwoLineList from '../../components/TwoLineList'
export default {
  components: {
    DialogBottom,
    FormList,
    TwoLineList,
  },
  data: () => ({
    dialogTitle: '',
    dialogMenu: false,
    dialogEdit: false,
    dialogDelete: false,
    dataCourse: {},
    formCourse: [
      { label: 'Mata Pelajaran', value: 'name', type: 'text' },
      { label: 'Singkatan', value: 'abbreviation', type: 'text' },
    ],
    actions: [
      { text: 'Edit', icon: 'mdi-pencil' },
      { text: 'Hapus', icon: 'mdi-delete' },
    ],
  }),
  computed: {
    courses() {
      return this.$store.state.courses.collection
    },
    course() {
      return this.$store.state.courses.document
    },
  },
  methods: {
    getCourses() {
      this.$store.dispatch('courses/get')
    },
    getCourse() {
      let id = 'YnwMCvyau7eVe7l3IwuS'
      this.$store.dispatch('courses/get', id)
    },
    selectCourse(course) {
      this.dataCourse = course
      this.dialogMenu = true
    },
    selectAction(action) {
      this.dialogMenu = false
      if(action === 'Edit') {
        this.dialogTitle = 'Edit Mata Pelajaran'
        this.dialogEdit = true
      } else {
        this.dialogTitle = 'Hapus Mata Pelajaran'
        this.dialogDelete = true
      }
    },
    newCourse() {
      this.dataCourse = { id: null }
      this.dialogTitle = 'Mata Pelajaran Baru'
      this.dialogEdit = true
    },
    saveCourse() {
      const data = this.dataCourse
      if(data.id) {
        this.$store.dispatch('courses/put', data)
      } else {
        this.$store.dispatch('courses/post', data)
      }
      this.dialogEdit = false
      this.dialogTitle = ''
      this.dataCourse = {}
    },
    deleteCourse() {
      const data = this.dataCourse
      this.$store.dispatch('courses/remove', data)
      this.dialogDelete = false
      this.dialogTitle = ''
      this.dataCourse = {}
    }
  },
  mounted() {
    this.$store.dispatch('setPage', {
      back: '/app',
      title: 'Mata Pelajaran'
    })

    this.getCourses()
    this.getCourse()
  }
}
</script>

<style>

</style>