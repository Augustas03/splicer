import React, { useState } from "react";
import { createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore";
import { auth, db } from "../db/dbConnection"



export async function Auth (formData) {

  const [errors, setErrors] = useState({
    email: "",
    passwordErrors: [],
    confirmPassword: "",
  });

  console.log("Attempting signup with:", formData.email);
  try{
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    console.log("Signup successful:", userCredential);
    const user = userCredential.user;

    const users = collection(db, "users");

    const userData = {
      uid: user.uid,
      email: user.email,
      createdAt: new Date().toISOString(),
    };

    console.log("About to write user data:", userData);
    const myDoc = doc(users, user.uid);
    await setDoc(myDoc, userData);
    console.log("Successfully wrote to Firestore");

    await sendEmailVerification(user);
    alert("Success! Please verify your email before logging in.");

  }catch (err) {
    console.error("Full error object:", err);
    const code = err.code;
    const message = err.message;

    if (code === "auth/email-already-in-use") {
      setErrors({
        ...errors,
        email: "Email already in use",
      });
    } else {
      alert(`Error during sign up: ${message}`);
      console.log(code, message);
    }
  }
    
  return errors;
}

