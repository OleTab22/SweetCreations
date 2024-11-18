import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from './firebase-config';

// Firestore database setup
const db = getFirestore(app);

async function fetchCollectionData(collectionName) {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
        });
    } catch (error) {
        console.error('Error fetching collection data:', error);
    }
}

export default db;
