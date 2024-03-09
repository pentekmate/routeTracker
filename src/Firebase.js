import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

function useFirebase()
{
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_API_KEY,
        authDomain: process.env.REACT_APP_AUTHDOMAIN,
        projectId: process.env.REACT_APP_PROJECTID,
        storageBucket: process.env.REACT_APP_STORAGEBUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
        appId: process.env.REACT_APP_APPID,
        measurementId: process.env.REACT_APP_MEASUREMENTID,
        databaseURL:process.env.REACT_APP_DATABASE_URL
    };
    const app=initializeApp(firebaseConfig)
    const db = getFirestore(app);
    return db
}
export {useFirebase}