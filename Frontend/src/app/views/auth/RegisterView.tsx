import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RegisterResponse } from '../../../features/auth/auth.types';
import { register } from '../../../features/auth/auth.api';
import styles from './AuthViews.module.css';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const RegisterPage = () => {
    const {loading, user} = useCurrentUser();
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const nameRef = useRef<HTMLInputElement | null>(null);
    const lastnameRef = useRef<HTMLInputElement | null>(null);
    const birthDateRef = useRef<HTMLInputElement | null>(null);
    const [gender, setGender] = useState<string>("male");
    const countryRef = useRef<HTMLInputElement | null>(null);
    const streetNameRef = useRef<HTMLInputElement | null>(null);
    const streetNumberRef = useRef<HTMLInputElement | null>(null);
    const [feedback, setFeedback] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(!loading && user) {
            if(user.role === 'admin'){
                navigate("/users/", {replace: true});
            }else{
                navigate("/recipes/", {replace: true});
            }
        }
    }, [user, loading, navigate]);

     if(loading) return <div>Loading...</div>

    const handleSubmitClicked = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const email = emailRef.current?.value || "";
        const password = passwordRef.current?.value || "";
        const name = nameRef.current?.value || "";
        const lastname = lastnameRef.current?.value || "";
        const birthDate = birthDateRef.current?.value || "";
        const country = countryRef.current?.value || "";
        const streetName = streetNameRef.current?.value || "";
        const streetNumber = streetNumberRef.current?.value || "";
        //const image = imageRef.current?.files?.[0] || null;

        let formData:FormData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("name", name);
        formData.append("lastname", lastname);
        formData.append("birthDate", birthDate);
        formData.append("country", country);
        formData.append("streetName", streetName);
        formData.append("streetNumber", streetNumber);
        formData.append("gender", gender);
        //if(image) formData.append("image", image);
  

        const data: RegisterResponse = await register(formData);
        if(!data.status) {
            setFeedback(data.messages);
        }else{
            navigate("/auth/login");
        }
    }

    return(
        <div className={styles.root}>
            <div className={styles.main_section}>
                <div className={styles.title}>Register</div>
                <form onSubmit={handleSubmitClicked}>
                    <div>
                        <input type='email' placeholder='Email' required ref={emailRef}></input>
                    </div>
                    <div>
                        <input type='password' placeholder='Password' required ref={passwordRef}></input>
                    </div>
                    <div>
                        <input type='text' placeholder='Name' required ref={nameRef}></input>
                    </div>
                    <div>
                        <input type='text' placeholder='Last Name' required ref={lastnameRef}></input>
                    </div>
                    <div className={styles.field}>       
                        <div className={styles.field_birthdate}>
                            <input type='date' placeholder='Birth date' required ref={birthDateRef}></input>
                        </div>
                        <div className={styles.field_gender}>
                            <label>Male
                                <input type='radio' name="gender" value="male" onChange={(e) => setGender(e.target.value)} checked={gender === 'male'} required></input>
                            </label>
                            <label>Female
                                <input type='radio' value="female" onChange={(e) => setGender(e.target.value)} name="gender" checked={gender === 'female'}></input>
                            </label>
                        </div>
                    </div> 
                    <div>
                        <input type='text' placeholder='Country Name' required ref={countryRef}></input>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.field_street}>
                            <input type='text' placeholder='Street Name' required ref={streetNameRef}></input>
                        </div>
                        <div className={styles.field_number}>
                            <input type='number' placeholder='Number' required ref={streetNumberRef}></input>
                        </div>
                    </div>
                    <div>
                        <input type='submit' value="Register"></input>
                    </div>
                </form>
                <div className={styles.info}></div>
            </div>
            <div className={styles.switch_section}>
                <a href='/auth/login' className={styles.switch_link}>Login&nbsp;&nbsp;&gt;</a>
            </div>
        </div>
    );
}
export default RegisterPage;