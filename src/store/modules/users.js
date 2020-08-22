import { auth, db, Timestamp, increment } from '../../firebase'
import router from '../../router'

const END_POINT = 'users'
const ref = db.collection(END_POINT)

const state = {
  profile: {},
}

const mutations = {
  setUserProfile(state, val) {
    state.profile = val
  }
}

const actions = {
  async get({ commit }, user) {
    commit('setLoading', 'get', { root: true })
    // fetch user profile
    const userProfile = await ref.doc(user.uid).get()

    var data = userProfile.data()

    data.uid = user.uid

    // set user profile in state
    commit('setUserProfile', data)

    commit('setLoading', null, { root: true })
    
    // change route to dashboard
    // router.push('/app')
  },
  async set({ commit, dispatch }, payload) {
    commit('setLoading', 'post', { root: true })

    const user = auth.currentUser

    await ref.doc(user.uid).set(payload, { merge: true })
      .then(() => {
        dispatch('get', user)
        commit('setLoading', null, { root: true })
        dispatch('notifications/post', {
          // title: 'Update profil berhasil.',
          body: 'Update profil berhasil.',
        }, { root: true })
      })
      .catch(err => {
        dispatch('notifications/post', {
          title: 'Update profil gagal.',
          body: err,
          timeout: 10
        }, { root: true })
        
        commit('setLoading', null, { root: true })
      })
  },
  async signin({ dispatch, commit }, form) {
    commit('setLoading', 'post', { root: true })
    // sign user in
    const { user } = await auth.signInWithEmailAndPassword(form.email, form.password)
      .catch(err => {
        const code = err.code
        const message = err.message

        const userNotFound = "auth/user-not-found"

        if(code === userNotFound) {
          dispatch('notifications/post', {
            title: 'User not found',
            body: message,
            timeout: 10
          }, { root: true })
        } else {
          dispatch('notifications/post', {
            title: code,
            body: message,
            timeout: 10
          }, { root: true })
        }
        commit('setLoading', null, { root: true })
      })

    // fetch user profile and set in state
    dispatch('get', user)
  },
  async signup({ dispatch, commit }, form) {
    commit('setLoading', 'post', { root: true })
    // sign user up
    const { user } = await auth.createUserWithEmailAndPassword(form.email, form.password)
      .catch(err => {
        const code = err.code
        const message = err.message

        dispatch('notifications/post', {
          title: code,
          body: message,
          timeout: 10
        }, { root: true })
        
        commit('setLoading', null, { root: true })
      })
  
    // create user profile object in userCollections
    await ref.doc(user.uid).set({
      name: form.name,
      email: form.email,
    })
  
    // fetch user profile and set in state
    dispatch('get', user)
  },
  async signout({ commit }) {
    await auth.signOut()
  
    // clear userProfile and redirect to /login
    commit('setUserProfile', {})
    router.push('/')
  },
  async sendOTP({ commit, dispatch }, { phoneNumber, appVerifier }) {
    commit('setLoading', 'post', { root: true })

    if(phoneNumber.length < 11) {
      dispatch('notifications/post', {
        title: 'Nomor HP tidak valid',
        body: 'Nomor HP minimal 11 angka',
        timeout: 10
      }, { root: true })
      commit('setLoading', null, { root: true })
    } else {
      auth.settings.appVerificationDisabledForTesting = true
      let countryCode = '+62' //Indonesia
      // let verifCode = '111111'
      let phoneNumberFull = countryCode + phoneNumber
      //
      await auth.signInWithPhoneNumber(phoneNumberFull, appVerifier)
        .then(confirmationResult => {

          window.confirmationResult = confirmationResult

          // confirmationResult.confirm(verifCode)

          router.push('/otp')

          commit('setLoading', null, { root: true })
        }).catch(function (error) {
          console.log('Kode OTP gagal dikirim:', error)
          
            commit('setLoading', null, { root: true })

          dispatch('notifications/post', {
            title: 'Kode OTP gagal dikirim',
            body: error,
            timeout: 10
          }, { root: true })
      });
    }
  },
  async verifyOTP({ commit, dispatch }, { otp }){
    commit('setLoading', 'post', { root: true })

    if(otp.length != 6){
      dispatch('notifications/post', {
        title: 'Kode OTP salah',
        body: 'Kode OTP harus 6 angka',
        timeout: 10
      }, { root: true })
      commit('setLoading', null, { root: true })
    }else{
      window.confirmationResult.confirm(otp).then(result => {
        // User signed in successfully.
        
        var user = result.user

        commit('setLoading', null, { root: true })
        router.push('/app')

      }).catch(function (error) {
        console.log(error)
        dispatch('notifications/post', {
          title: 'Kode OTP salah',
          body: error,
          timeout: 10
        }, { root: true })
        commit('setLoading', null, { root: true })
      });
    }
  },
  async auth({ dispatch, commit }, { user, phoneNumber }) {
    commit('setLoading', 'post', { root: true })

    let document = ref.doc(user.uid)
    await document.get().then(doc => {
      if (doc.exists) {
        // Set user
        dispatch('get', user)
        commit('setLoading', null, { root: true })
      } else {
        // Create new user
        // console.log(document)
        const data = {
          phoneNumber: `+62${ phoneNumber }`
        }
        document.set(data, { merge: true }).then(() => {
          data.uid = user.uid
          commit('setUserProfile', data)
          commit('setLoading', null, { root: true })
        })
      }
    }).catch(err => {
      console.log("Error at authUser:", err);
    })
  },
  async selectRole({ dispatch, commit }, role) {
    commit('setLoading', 'post', { root: true })

    const user = auth.currentUser

    await ref.doc(user.uid).set({
      role: role
    }, { merge: true })
      .then(() => {
        dispatch('get', user)
        commit('setLoading', null, { root: true })
      })
      .catch(err => {
        dispatch('notifications/post', {
          title: 'Gagal memilih role',
          body: err,
          timeout: 10
        }, { root: true })
        
        commit('setLoading', null, { root: true })
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
