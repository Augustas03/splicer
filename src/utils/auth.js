import React, { useState } from "react";
import { doc, setDoc, collection } from "firebase/firestore";
import { auth, db } from "../db/dbConnection"
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";



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

    return "200 OK"
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

  return "200 OK"
  }catch(err){
    console.error("Full error object:", err);
    const code = err.code;
    const message = err.message;

     
      alert(`Error during sign up: ${message}`);
      console.log(code, message);
    
  }
  
}
