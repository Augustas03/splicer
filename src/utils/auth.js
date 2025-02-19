import { doc, setDoc, collection } from "firebase/firestore";
import { auth, db } from "../db/dbConnection"
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";

export async function passwordValidation (formData) {

  if(formData.password == formData.confirmPassword){
    return true;
  }else{
    return false;
  }
}

export async function login (formData) {

  try{
    const userCredential = await signInWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    localStorage.setItem('lastLoginTime', Date.now().toString());
    

  }catch(err){
    console.error("Full error object:", err);
        const code = err.code;
        const message = err.message;

        alert(`Error during sign up: ${message}`);
        console.log(code, message);
  }
}

export async function signup (formData) {
  try{
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    const user = userCredential.user;

  const users = collection(db, "users");

  const userData = {
    uid: user.uid,
    email: user.email,
    createdAt: new Date().toISOString(),
  };

  
  const myDoc = doc(users, user.uid);
  await setDoc(myDoc, userData);
  console.log("Successfully wrote to Firestore");

  await sendEmailVerification(user);
  alert("Success! Please verify your email before logging in.");

  }catch(err){
    console.error("Full error object:", err);
    const code = err.code;
    const message = err.message;
 
    alert(`Error during sign up: ${message}`);
    console.log(code, message);
  }
  
}

export async function logout() {
  try {
    await signOut(auth);
    localStorage.removeItem('lastLoginTime'); // Clear the login time
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error; // Propagate the error to be handled by the calling component
  }
}
