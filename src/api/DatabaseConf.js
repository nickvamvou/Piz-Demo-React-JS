/**
 * Created by nikolasvamvou on 6/17/20.
 */
import * as firebase from 'firebase';
import "firebase/auth";

//Intialize firebase
const firebaseConfig = {

    apiKey: "AIzaSyDWEvlLNPeuz8UfETyVVM1tq-hCvFpcluw",
    authDomain: "ifrati-backend-3f3d6.firebaseapp.com",
    databaseURL: "https://ifrati-backend-3f3d6-b9264.firebaseio.com",
    projectId: "ifrati-backend-3f3d6",
    storageBucket: "ifrati-backend-3f3d6.appspot.com",
};

firebase.initializeApp(firebaseConfig);

export default firebase