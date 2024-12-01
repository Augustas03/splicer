import {React, useState} from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import {signInWithEmailAndPassword} from 'firebase/auth'
import {auth, db} from '../db/dbConnection'
import {getDoc, doc} from 'firebase/firestore'



function Login() {
    // Initialize router navigation
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);

    
    //Create formdata to keep user information
    const[formData, setFormData] = useState({
        email:'',
        password:''
    })

    const [error, setError] = useState(null);

   // Handle change on the input data
    function handleInputChange(e) {
        const{name, value} = e.target;

        setFormData( function(prev) {
            return {
                ...prev,
                [name]: value.trim()
            }
        })
    }

    //function to handle submit button
    async function handleSubmit(e){

        e.preventDefault();
        setIsLoading(true);
        setError(null);

        //Check user credential validity
        try{

            if(!formData.email || !formData.password){
                throw new Error('Please fill in all the mandatory fields');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

            if (!emailRegex.test(formData.email)) {
                throw new Error('Please enter a valid email address');
            }

            if(formData.password.length < 7){
                throw new Error('Please enter a valid password');
            }

            const userCredentials = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            
            //Find user in db
            const userDoc = await getDoc(doc(db, "users", userCredentials.user.uid));  
            
            if(!userDoc.exists()){
                throw new Error('User not found. Please try again.')
            }

            //Upon success navigate to home screen
            navigate('/');
        }catch(err){
            //Throw Firebase error messages
            const errorMessages = {
                'auth/user-not-found': 'Invalid email or password',
                'auth/wrong-password': 'Invalid email or password',
                'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
                'auth/user-disabled': 'This account has been disabled.',
                'auth/invalid-email': 'Please enter a valid email address'
            };
            setError(errorMessages[err.code] || err.message);
        }finally{
            setIsLoading(false);
        }

    }

    return (<main>
        <section>
            <form onSubmit={handleSubmit}>
                {error}

                <div>
                    <label htmlFor='email'>Email</label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        autoComplete="email"
                        placeholder="Enter your email:"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        autoComplete="current-password"
                        placeholder="Enter your password:"
                        disabled={isLoading}
                    />
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <NavLink to="/signup">Need an account? Sign up</NavLink>
        </section>
    </main>)
}

export default Login;