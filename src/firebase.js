import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/messaging'
import 'firebase/storage'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyAhWeQ0o0Q4hKub8Zwp7r-h83FPgZSkpQk",
  authDomain: "rizky-na.firebaseapp.com",
  databaseURL: "https://rizky-na.firebaseio.com",
  projectId: "rizky-na",
  storageBucket: "rizky-na.appspot.com",
  messagingSenderId: "903799187284",
  appId: "1:903799187284:web:f36396cb68306cebfa4ac1"
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
const { increment, serverTimestamp } = firebase.firestore.FieldValue

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
  increment,
  serverTimestamp
}