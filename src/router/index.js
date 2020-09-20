import Vue from 'vue'
import VueRouter from 'vue-router'

function lazyLoad(view){
  return() => import(`@/views/${view}.vue`)
}

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: lazyLoad('Home'),
  },
  {
    path: '/app',
    name: 'Application',
    component: lazyLoad('Application'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: lazyLoad('App/Dashboard'),
      },
      {
        path: 'profil',
        name: 'Profile',
        component: lazyLoad('App/Profile'),
      },
      {
        path: 'matapelajaran',
        name: 'Courses',
        component: lazyLoad('App/Courses'),
      },
      {
        path: 'kelas',
        name: 'Classrooms',
        component: lazyLoad('App/Classrooms'),
      },
      {
        path: 'kelas/:id',
        name: 'Classroom',
        component: lazyLoad('App/Classroom'),
        props: true
      },
      {
        path: 'jadwal',
        name: 'Schedules',
        component: lazyLoad('App/Schedules'),
      },
      {
        path: 'jadwal/:id',
        name: 'Schedule',
        component: lazyLoad('App/Schedule'),
        props: true
      },
      {
        path: 'inventaris',
        name: 'Inventory',
        component: lazyLoad('App/Inventory'),
      },
      {
        path: 'danabos',
        name: 'Funds',
        component: lazyLoad('App/Funds'),
      },
      {
        path: 'ekskul',
        name: 'Extracurriculars',
        component: lazyLoad('App/Extracurriculars'),
      },
      {
        path: 'ekskul/:id',
        name: 'Extracurricular',
        component: lazyLoad('App/Extracurricular'),
        props: true
      },
    ]
  },
  {
    path: '/mulai',
    name: 'Start',
    component: lazyLoad('Start'),
  },
  {
    path: '/login',
    name: 'SignIn',
    component: lazyLoad('SignIn'),
  },
  {
    path: '/loginguru',
    name: 'LoginTeacher',
    component: lazyLoad('LoginTeacher'),
  },
  {
    path: '/otp',
    name: 'OTP',
    component: lazyLoad('OTP'),
  },
  // {
  //   path: '/kelas',
  //   name: 'Classes',
  //   component: lazyLoad('Classes'),
  // },
  // {
  //   path: '/kelas/:id',
  //   name: 'Class',
  //   component: lazyLoad('Class'),
  //   props: true
  // },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
