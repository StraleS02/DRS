import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RegisterResponse } from '../auth.types';
import { register } from '../auth.api';
import styles from './AuthViews.module.css';
import LoadingView from '../../../components/loading/LoadingView';
import { useAuth } from '../useAuth';
import AuthForm from '../components/auth_form/AuthForm';
import FormRow from '../../../components/form_elements/form_row/FormRow';
import SubmitButton from '../../../components/form_elements/submit_button/SubmitButton';
import TextInput from '../../../components/form_elements/text_input/TextInput';
import RadioInput from '../../../components/form/RadioInput';
import RadioGroup, { type RadioOption } from '../../../components/form_elements/radio_group/RadioGroup';
import DateInput from '../../../components/form_elements/date_input/DateInput';
import FormColumn from '../../../components/form_elements/form_columns/FormColumn';

type RegisterForm = {
    email: string;
    password: string;
    name: string;
    lastname: string;
    countryName: string;
    streetName: string;
    streetNumber: string;
    birthDate: string;
    gender: string;
}

type RegisterFormError = {
    email: boolean;
    password: boolean;
    name: boolean;
    lastname: boolean;
    countryName: boolean;
    streetName: boolean;
    streetNumber: boolean;
    birthDate: boolean;
    gender?: boolean;
}

const genderOptions:RadioOption[] = [
    {title: "Male", value: "MALE"}, {title: "Female", value: "FEMALE"}
]

const RegisterView = () => {

    const [registerForm, setRegisterForm] = useState<RegisterForm>(
        {
            email: "",
            password: "",
            name: "",
            lastname: "",
            birthDate: "",
            gender: genderOptions[0].value,
            countryName: "",
            streetName: "",
            streetNumber: ""
        }
    );

    const [registerFormError, setRegisterFormError] = useState<RegisterFormError>(
        {
            email: false,
            password: false,
            name: false,
            lastname: false,
            birthDate: false,
            countryName: false,
            streetName: false,
            streetNumber: false
        }
    );
 
    const [errorTrigger, setErrorTrigger] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>("");
    const [waiting, setWaiting] = useState<boolean>(false);

    const {loading} = useAuth();

    if(loading || waiting) return <LoadingView></LoadingView>

    const handleErrorDetected = () => {
        setErrorTrigger(t => (t+1)%100);
    }

    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWaiting(true);
        
        const emailErr = registerForm.email.trim() === "";
        const passwordErr = registerForm.password.trim() === "";
        const nameErr = registerForm.name.trim() === "";
        const lastnameErr = registerForm.lastname.trim() === "";
        const birthDateErr = registerForm.birthDate.trim() === "";
        const countryNameErr = registerForm.countryName.trim() === "";
        const streetNameErr = registerForm.streetName.trim() === "";
        const streetNumberErr = registerForm.streetNumber.trim() === "";
        
        setRegisterFormError({
            email: emailErr,
            password: passwordErr,
            name: nameErr,
            lastname: lastnameErr,
            birthDate: birthDateErr,
            countryName: countryNameErr,
            streetName: streetNameErr,
            streetNumber: streetNumberErr
        });

        if(emailErr || passwordErr || nameErr || lastnameErr || birthDateErr || countryNameErr || streetNameErr || streetNumberErr)  {
            handleErrorDetected();
            const emailMessage = emailErr ? "Email needs to be in a valid form. " : "";
            const defaultMessage = "All fields are required.";
            setFeedback(emailMessage + defaultMessage);
            setWaiting(false);
            return;
        }
        
        let formData:FormData = new FormData();
        formData.append("email", registerForm.email);
        formData.append("password", registerForm.password);
        formData.append("first_name", registerForm.name);
        formData.append("last_name", registerForm.lastname);
        formData.append("date_of_birth", registerForm.birthDate);
        formData.append("country", registerForm.countryName);
        formData.append("street", registerForm.streetName);
        formData.append("street_number", registerForm.streetNumber);
        formData.append("gender", registerForm.gender);

        try {
            await register(formData);
            setFeedback("Success");
        } catch (error: any) {
            if(!error.response) {
                setFeedback("No connection to the server.");
            } else {
                const data:RegisterResponse = error.response.data;
                setFeedback(data.message);
            }
            
        } finally {
            setWaiting(false);
        }
    }

    return(
        <div className={styles.login_view}>
            <AuthForm title='Register' feedback={feedback} onSubmit={onSubmit} swapPath='/login' swapTitle='Login here'>
                {(
                    <>
                        <FormRow>
                            <TextInput key={errorTrigger} type='email' value={registerForm.email} error={registerFormError.email} placeholder='Email' onChange={(value) => setRegisterForm(prev => ({...prev, email: value}))}></TextInput>
                        </FormRow>
                        <FormRow>
                            <TextInput key={errorTrigger} type='password' value={registerForm.password} error={registerFormError.password} placeholder='Password' onChange={(value) => setRegisterForm(prev => ({...prev, password: value}))}></TextInput>
                        </FormRow>
                        <FormRow>
                            <TextInput key={errorTrigger} type='text' value={registerForm.name} error={registerFormError.name} placeholder='Name' onChange={(value) => setRegisterForm(prev => ({...prev, name: value}))}></TextInput>
                        </FormRow>
                        <FormRow>
                            <TextInput key={errorTrigger} type='text' value={registerForm.lastname} error={registerFormError.lastname} placeholder='Lastname' onChange={(value) => setRegisterForm(prev => ({...prev, lastname: value}))}></TextInput>
                        </FormRow>
                        <FormRow>
                            <RadioGroup key={errorTrigger} title='Gender' options={genderOptions} name='gender' value={registerForm.gender} onChange={(value) => setRegisterForm(prev => ({...prev, gender: value}))} color='rgb(199, 199, 199)' fontColor='black'></RadioGroup>
                        </FormRow>
                        <FormRow>
                            <DateInput key={errorTrigger} value={registerForm.birthDate} error={registerFormError.birthDate} onChange={(value) => setRegisterForm((prev) => ({...prev, birthDate: value}))}></DateInput>
                        </FormRow>
                        <FormRow>
                            <TextInput key={errorTrigger} type='text' value={registerForm.countryName} error={registerFormError.countryName} placeholder='Country' onChange={(value) => setRegisterForm(prev => ({...prev, countryName: value}))}></TextInput>
                        </FormRow>
                        <FormRow>
                            <FormColumn flex='5'>
                                <TextInput key={errorTrigger} type='text' value={registerForm.streetName} error={registerFormError.streetName} placeholder='Street Name' onChange={(value) => setRegisterForm(prev => ({...prev, streetName: value}))}></TextInput>
                            </FormColumn>
                            <FormColumn flex='3'>
                                <TextInput key={errorTrigger} type='number' value={registerForm.streetNumber} error={registerFormError.streetNumber} placeholder='Street Number' onChange={(value) => setRegisterForm(prev => ({...prev, streetNumber: value}))}></TextInput>
                            </FormColumn>
                        </FormRow>
                        <FormRow>
                            <SubmitButton title='Register'></SubmitButton>
                        </FormRow>
                    </>
                )}
            </AuthForm>
        </div>
    );
}
export default RegisterView;