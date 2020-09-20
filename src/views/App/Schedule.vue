<template>
  <div id="schedule">
    <loading-state />
    <div v-if="!isLoading">

      <button-add @click="add()" text="Tambah Jadwal" />

        
        <v-sheet
            color="grey lighten-5">
            <v-layout
                class="pa-4">
                <v-spacer />
                <v-btn
                    @click="dialogDay = true"
                    color="primary"
                    outlined
                    rounded>
                    <v-icon v-text="'mdi-filter'" class="ml-1" left />
                    <span v-text="filter.day ? filter.day : 'Filter berdasarkan hari'" class="text-none mr-1" />

                </v-btn>
            </v-layout>
            <v-divider />
        </v-sheet>
        

        <data-list id="student-data"
            :headers="headers"
            :items="scheduleByDay()"
            :forms="formSchedule"
            :sortBy="['day', 'from']"
            :headersPrint="headersPrint"
            :title="`Jadwal Kelas ${ classroom.name }(${ classroom.generation })`"
            @edit="select($event), selectAction('edit')"
            @remove="select($event), selectAction('remove')"
            @action="select($event)">
            
            <template #column="{ value, header, item }">
                <div v-if="header.value === 'action'" />
                <v-layout v-else-if="header.value === 'time'">
                    <!-- <v-icon v-text="'mdi-clock'" class="mr-1" /> -->
                    <span v-text="item.from + ' - ' + item.to" class="subtitle-2 font-weight-bold" />
                </v-layout>
                <p id="default"
                    v-else
                    v-text="value ? value : '-'"
                    class="py-4"
                    :class="header.align ? `text-${ header.align } mb-0` : 'mb-0'"
                />
            </template>

            <template #compact-content="{ item }">
                <div>
                    <v-layout
                        class="align-center">
                        <v-chip color="info" dark small>
                            <span v-text="item.day" class="caption" />
                        </v-chip>
                        <v-spacer />
                        <v-icon v-text="'mdi-clock'" class="mr-1" />
                        <span v-text="item.from + ' - ' + item.to" class="subtitle-2 font-weight-bold" />
                    </v-layout>
                    <div
                        class="mt-1">
                        <span v-text="item.course" class="subtitle-2 text--secondary" />
                    </div>
                </div>

            </template>

        </data-list>

    </div>

    
    

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
                @click="selectAction(action.value)"
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
        @action="post()"
        v-model="dialogEdit"
        :title="dialogTitle"
        buttonCancel="Batal"
        buttonAction="Simpan"
        persistent>
        <form-list :forms="formSchedule" :data="dataSchedule" :items="comboboxItems" />
      </dialog-bottom>

      <dialog-bottom id="dialog-delete"
        @action="remove()"
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
            v-html="`Yakin hapus jadwal <b>${ dataSchedule.course }(Kelas ${ dataSchedule.classroomName })</b>?`"
            class="text--secondary"
          />
        </v-card>
      </dialog-bottom>
      
      <dialog-bottom id="dialog-day"
        @close="filter = {}"
        @action="$forceUpdate(), dialogDay = false"
        v-model="dialogDay"
        :title="'Filter bedasarkan hari'"
        buttonCancel="Tampilkan Semua"
        buttonAction="Filter">
        <form-item-combobox
          :label="'Pilih hari'"
          :data="filter"
          value="day"
          :items="days"
          color="primary"
        />
      </dialog-bottom>

  </div>
</template>

<script>

import LoadingState from '../../components/LoadingState'
import DialogBottom from '../../components/DialogBottom'
import DataList from '../../components/DataList'
import FormList from '../../components/FormList'
import ButtonAdd from '../../components/ButtonAdd'
import FormItemCombobox from '../../components/FormItemCombobox'
export default {
    components: {
        LoadingState,
        DialogBottom,
        DataList,
        FormList,
        ButtonAdd,
        FormItemCombobox,
    },
    props: [ 'id' ],
    data: () => ({
        headers: [
            { text: 'Hari', value: 'day' },
            { text: 'Mata Pelajaran', value: 'course' },
            { text: 'Pengajar', value: 'teacher' },
            { text: 'Waktu', value: 'time', align: 'right' },
            { text: '', value: 'action', sortable: false },
        ],
        headersPrint: [
            { header: 'Hari', dataKey: 'day' },
            { header: 'Mata Pelajaran', dataKey: 'course' },
            { header: 'Pengajar', dataKey: 'teacher' },
            { header: 'Dari Jam', dataKey: 'from' },
            { header: 'Sampai Jam', dataKey: 'to' },
        ],
        formSchedule: [
            { label: 'Hari', value: 'day', type: 'combobox' },
            { label: 'Mata Pelajaran', value: 'course', type: 'combobox' },
            { label: 'Pengajar', value: 'teacher', type: 'combobox' },
            { label: 'Mulai', value: 'from', type: 'time' },
            { label: 'Sampai', value: 'to', type: 'time' },
        ],
        filter: {},
        dataSchedule: {},
        dialogTitle: null,
        dialogMenu: false,
        dialogEdit: false,
        dialogDelete: false,
        dialogDay: false,
        actions: [
            { text: 'Edit', value: 'edit', icon: 'mdi-pencil' },
            { text: 'Hapus', value: 'remove', icon: 'mdi-delete' },
        ],
    }),
    computed: {
        isLoading() {
            return this.$store.state.isLoading
        },
        schedules() {
            return this.$store.state.schedules.collection
        },
        classroom() {
            return this.$store.state.classrooms.document
        },
        courseItems() {
            return this.$store.getters['courses/courseItems']
        },
        teacherItems() {
            return this.$store.getters['teachers/teacherItems']
        },
        days() {
            return [
                { value: 'Senin' },
                { value: 'Selasa' },
                { value: 'Rabu' },
                { value: 'Kamis' },
                { value: 'Jumat' },
                { value: 'Sabtu' },
            ]
        },
        dayItems() {
            const days = [
                'Senin',
                'Selasa',
                'Rabu',
                'Kamis',
                'Jumat',
                'Sabtu',
            ]
            const arr = []
            days.forEach((v, i) => {
                var obj = {
                    // text: v,
                    // value: i,
                    value: v,
                }
                arr.push(obj)
            })
            return arr
        },
        
        comboboxItems() {
        
        var items = {
            course: this.courseItems,
            teacher: this.teacherItems,
            day: this.dayItems,
        }

        return items
        }
    },
    methods: {
        get() {
            this.$store.dispatch('schedules/get', this.id)
        },
        post() {
            var data = this.dataSchedule
            if(data.id) {
                this.$store.dispatch('schedules/put', data)
            } else {
                data.classroomID = this.classroom.id
                data.classroomName = this.classroom.name
                data.generation = this.classroom.generation
                this.$store.dispatch('schedules/post', data)
            }
            this.dialogEdit = false
            this.dialogTitle = ''
            this.dataSchedule = {}
        },
        
        remove() {
            const data = this.dataSchedule
            this.$store.dispatch('schedules/remove', data)
            this.dialogDelete = false
            this.dialogTitle = ''
            this.dataSchedule = {}
        },
        
        select(data) {
            this.dataSchedule = data
            this.dialogMenu = true
        },
        selectAction(action) {
            this.dialogMenu = false

            switch (action) {
                case 'edit':
                    this.dialogTitle = 'Edit Kelas'
                    this.dialogEdit = true
                break
                case 'remove':
                    this.dialogTitle = 'Hapus Kelas'
                    this.dialogDelete = true
            }
        },
        
        add() {
            this.dataSchedule = { id: null }
            this.dialogTitle = 'Jadwal Baru'
            this.dialogEdit = true
        },
        
        scheduleByDay() {
            const schedules = [...this.schedules]
            const filter = this.filter.day
            if(!filter) {
                return schedules
            } else {
                var filtered = schedules.filter(v => {
                return v.day === filter
            })
                return filtered
            }
        }
    },
    watch: {
        classroom: {
        immediate: true,
        handler() {
            if(this.classroom && this.classroom.name) {
            this.$store.dispatch('setPage', {
                back: '/app/jadwal',
                title: `Jadwal Kelas ${ this.classroom.name } (${ this.classroom.generation })`
            })
            }
        }
        }
    },
    mounted() {
        this.$store.dispatch('classrooms/get', this.id)
        this.get()
    }
}
</script>

<style>

</style>