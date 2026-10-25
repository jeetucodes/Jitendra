// Using Firebase Compat SDK from index.html (Global window object)
// This fixes the "Cannot find module" errors and doesn't require npm install.

const firebase = (window as any).firebase;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyANGSLeXLLxJLNHbsxFclWH7TjGbp4_akQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "myportfolio-fdfe9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "myportfolio-fdfe9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "myportfolio-fdfe9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "595468263428",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:595468263428:web:183777b22f770c042ad551",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-F8T7MPY2F5"
};

// Initialize if not already initialized
if (firebase && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase ? firebase.firestore() : null;
export const auth = firebase ? firebase.auth() : null;

// Exporting functions that match the expected interface for Admin.tsx and WorkSection.tsx
export const collection = (db: any, path: string) => db?.collection(path);
export const query = (colRef: any, ...constraints: any[]) => {
  let q = colRef;
  if (!q) return q;
  constraints.forEach(c => {
    if (c.type === 'orderBy') q = q.orderBy(c.field, c.direction);
  });
  return q;
};
export const orderBy = (field: string, direction: string = 'asc') => ({ type: 'orderBy', field, direction });
export const getDocs = async (q: any) => {
  if (!q) return { docs: [] };
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
export const onAuthStateChanged = (auth: any, callback: any) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return auth.onAuthStateChanged(callback);
};
export const signOut = (auth: any) => {
  if (!auth) return Promise.resolve();
  return auth.signOut();
};
