import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/messaging'
import 'firebase/storage'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyAaGigMfe47eEkgoCZtWhSOYK1Pk_NmNK8",
  authDomain: "kim-client-1.firebaseapp.com",
  databaseURL: "https://kim-client-1.firebaseio.com",
  projectId: "kim-client-1",
  storageBucket: "kim-client-1.appspot.com",
  messagingSenderId: "343528793753",
  appId: "1:343528793753:web:fb1fdbd77d9322ddaafa08"
}
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
const RecaptchaVerifier = firebase.auth.RecaptchaVerifier
let messaging
if(firebase.messaging.isSupported()) {
  messaging = firebase.messaging()
}
const { Timestamp, GeoPoint } = firebase.firestore
const { increment } = firebase.firestore.FieldValue

// Offline support
db.enablePersistence()

// export utils/refs
export {
  db,
  auth,
  storage,
  RecaptchaVerifier,
  messaging,
  Timestamp,
  GeoPoint,
  increment
}