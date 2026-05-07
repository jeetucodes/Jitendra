// Using Firebase Compat SDK from index.html (Global window object)
// This fixes the "Cannot find module" errors and doesn't require npm install.

const firebase = (window as any).firebase;

const firebaseConfig = {
  apiKey: "AIzaSyANGSLeXLLxJLNHbsxFclWH7TjGbp4_akQ",
  authDomain: "myportfolio-fdfe9.firebaseapp.com",
  projectId: "myportfolio-fdfe9",
  storageBucket: "myportfolio-fdfe9.firebasestorage.app",
  messagingSenderId: "595468263428",
  appId: "1:595468263428:web:183777b22f770c042ad551",
  measurementId: "G-F8T7MPY2F5"
};

// Initialize if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
export const auth = firebase.auth();

// Exporting functions that match the expected interface for Admin.tsx and WorkSection.tsx
export const collection = (db: any, path: string) => db.collection(path);
export const query = (colRef: any, ...constraints: any[]) => {
  let q = colRef;
  constraints.forEach(c => {
    if (c.type === 'orderBy') q = q.orderBy(c.field, c.direction);
  });
  return q;
};
export const orderBy = (field: string, direction: string = 'asc') => ({ type: 'orderBy', field, direction });
export const getDocs = async (q: any) => {
  const snap = await q.get();
  return {
    docs: snap.docs.map((doc: any) => ({
      id: doc.id,
      data: () => doc.data()
    }))
  };
};
export const addDoc = (colRef: any, data: any) => colRef.add(data);
export const updateDoc = (docRef: any, data: any) => docRef.update(data);
export const deleteDoc = (docRef: any) => docRef.delete();
export const doc = (db: any, path: string, id: string) => db.collection(path).doc(id);

// Auth functions
export const signInWithEmailAndPassword = (auth: any, email: string, pass: string) => auth.signInWithEmailAndPassword(email, pass);
export const onAuthStateChanged = (auth: any, callback: any) => auth.onAuthStateChanged(callback);
export const signOut = (auth: any) => auth.signOut();
