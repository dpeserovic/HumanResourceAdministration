var config = {
    apiKey: "AIzaSyC5jPjKuDEijBS8QK9ZIDLIFdvPIov6ETw",
    authDomain: "administracija-potencijala.firebaseapp.com",
    databaseURL: "https://administracija-potencijala.firebaseio.com",
    projectId: "administracija-potencijala",
    storageBucket: "administracija-potencijala.appspot.com",
    messagingSenderId: "597046936316"
};
firebase.initializeApp(config);
var oDb = firebase.database();
var oDbUsers = oDb.ref('users');
var oDbPersons = oDb.ref('persons');
var oDbJobCategories = oDb.ref('job_categories');