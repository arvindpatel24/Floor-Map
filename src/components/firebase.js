import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAO-hDvzHaIPughIvKXk6eK8glm2smnOvA",
    authDomain: "floorplan-firebase.firebaseapp.com",
    projectId: "floorplan-firebase",
    storageBucket: "floorplan-firebase.appspot.com",
    messagingSenderId: "53978119010",
    appId: "1:53978119010:web:3a8569f06cf3b5d5740a3b"
}

firebase.initializeApp(config);

export default firebase;