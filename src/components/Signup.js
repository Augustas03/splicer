import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { doc, setDoc, collection } from 'firebase/firestore'
import { auth, db } from '../db/dbConnection'

function Signup(){
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [errors, setErrors] = useState({
        email: "",
        passwordErrors: [],
        confirmPassword: ""
    })

    const [isLoading, setIsLoading] = useState(false)

    function checkPassword(password){
        const passwordErrors = []
        const hasUpperCase = /[A-Z]/.test(password)
        const hasNumber = /[0-9]/.test(password)


        if(password.length < 7){
            passwordErrors.push("Must be atleast 7 characters")
        }
        if(!hasUpperCase){
            passwordErrors.push("Must contain an uppercase character")
        }
        if(!hasNumber){
            passwordErrors.push("Must contain a number")
        }

        return passwordErrors
    }

    function handleInputChange(event){
        const inputName = event.target.name
        const inputValue = event.target.value

        setFormData({
            ...formData,
            [inputName]: inputValue
        })

        if(inputName === 'password'){
            const passwordErrors = checkPassword(inputValue)
            setErrors({
                ...errors,
                passwordErrors: passwordErrors
            })
        }

        if(inputName === 'confirmPassword'){
            if(inputValue !== formData.password){
                setErrors({
                    ...errors,
                    confirmPassword: "Passwords do not match"
                })
            } else{
                setErrors({
                    ...errors,
                    confirmPassword: ""
                })
            }
        }
    }

    async function onSubmit(e){
        e.preventDefault()

        //check confirm password
        if(formData.password!==formData.confirmPassword){
            setErrors({
                ...errors,
                password: "Passwords do not match"
            })
            return
        } 
        //final passsword check
        const remainingPasswordErrors = checkPassword(formData.password)
        if(remainingPasswordErrors.length > 0){
            setErrors({
                ...errors,
                passwordErrors: remainingPasswordErrors
            })
            return 
        }

        setIsLoading(true)

        try{
            console.log("Attempting signup with:", formData.email);
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
            //logs strictly for testing
            console.log("Signup successful:", userCredential);
            const user = userCredential.user

            const users = collection(db, 'users')

            const userData = {
                uid: user.uid,
                email: user.email,
                createdAt: new Date().toISOString()
            }

            console.log("About to write user data:", userData)
            const myDoc = doc(users, user.uid);
            await setDoc(myDoc, userData)
            console.log("Successfully wrote to Firestore")


            await sendEmailVerification(user)
            alert("Success! Please verify email before logging in")

            navigate('users/login')

        }catch(err){
            console.error("Full error object:", err) // Log the full error
            const code = err.code
            const message = err.message
            console.log("code:",code, "message:", message)

            if(code === 'auth/email-already-in-use'){
                setErrors({
                    ...errors,
                    email: "Email already in use"
                }) 
            } else{
                alert(`Error during sign up: ${message}`)
                console.log(code,message)
            }
        }

        setIsLoading(false)

    }

    return(
        // adjust jsx as needed for better UI
        <main>
            <section>
                <div>
                    <form onSubmit={onSubmit}>

                        <div>
                            <label htmlFor='email'>
                            Email
                            </label> 
                            <input type='email' name='email' value={formData.email} onChange={handleInputChange} required></input>
                            {errors.email && (
                                <div>{errors.email}</div>
                            )}
                        </div>

                        <div>
                        <label htmlFor='password'>
                            Password
                        </label>
                            <input type='password' name ='password' value = {formData.password} onChange={handleInputChange} required></input>
                            {/* i seen some cool 'alert' ui libraries that can be used here */}
                            {errors.passwordErrors.length > 0 && (
                                <div>
                                    {errors.passwordErrors.map(function(error, index){
                                        return <div key={index}>{error}</div>
                                    })}
                                </div>
                            )}
                        </div>

                        <div>
                        <label htmlFor='confirmPassword'>
                            Confirm Password
                        </label>
                            <input type='password' name ='confirmPassword' value = {formData.confirmPassword} onChange={handleInputChange} required></input>
                        {errors.confirmPassword && (
                            <div>{errors.confirmPassword}</div>
                        )}
                        </div>

                        <div>
                        <button type='submit' disabled={isLoading}>
                            {isLoading ? 'Signing up..' : 'Sign Up'}
                            </button>
                        </div>

                        <div>
                        <NavLink to="/users/login">Already have an account?</NavLink>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default Signup