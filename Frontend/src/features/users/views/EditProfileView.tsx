import { useEffect, useRef, useState } from "react";
import FormRow from "../../../components/form_elements/form_row/FormRow";
import type { RadioOption } from "../../../components/form_elements/radio_group/RadioGroup";
import TextInput from "../../../components/form_elements/text_input/TextInput";
import styles from "./EditProfileView.module.css";
import type { User } from "../../../lib/types/User";
import Loading from "../../../components/loading/Loading";
import { useAuth } from "../../auth/useAuth";
import DateInput from "../../../components/form_elements/date_input/DateInput";
import FormColumn from "../../../components/form_elements/form_columns/FormColumn";
import RadioGroup from "../../../components/form_elements/radio_group/RadioGroup";
import SubmitButton from "../../../components/form_elements/submit_button/SubmitButton";
import { profileUpdate } from "../users.api";
import type { ProfileUpdateResponse } from "../users.types";

type EditProfileForm = {
    name: string;
    lastname: string;
    countryName: string;
    streetName: string;
    streetNumber: string;
    gender: string;
    birthDate: string;
}

type EditProfileFormError = {
    name: boolean;
    lastname: boolean;
    countryName: boolean;
    streetName: boolean;
    streetNumber: boolean;
    gender: boolean;
    birthDate: boolean;
}

const genderOptions:RadioOption[] = [
    {title: "Male", value: "MALE"}, {title: "Female", value: "FEMALE"}
]

const EditProfileView = () => {

    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const imageRef = useRef<HTMLInputElement>(null);

    const [editProfileForm, setEditProfileForm] = useState<EditProfileForm>(
        {
            name: "",
            lastname: "",
            countryName: "",
            streetName: "",
            birthDate: "",
            streetNumber: "",
            gender: "",
        }
    );

    const [editProfileFormError, setEditProfileFormError] = useState<EditProfileFormError>(
        {
            name: false,
            lastname: false,
            countryName: false,
            streetName: false,
            birthDate: false,
            streetNumber: false,
            gender: false,
        }
    );
 
    const [errorTrigger, setErrorTrigger] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>("");
    const [waiting, setWaiting] = useState<boolean>(false);

    const  {loading} = useAuth();

    useEffect(() => {
        setWaiting(true);
        try{
            
        } catch {
            
        } finally {
            setWaiting(false);
        }
    }, []);

    // useEffect to fetch current user

    if(loading || waiting) return <Loading size="medium" theme="dark"></Loading>

    const handleErrorDetected = () => {
        setErrorTrigger(t => (t+1)%100);
    }

    const handleOnSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWaiting(true);
                
        const nameErr = editProfileForm.name.trim() === "";
        const lastnameErr = editProfileForm.lastname.trim() === "";
        const countryNameErr = editProfileForm.countryName.trim() === "";
        const streetNameErr = editProfileForm.streetName.trim() === "";
        const streetNumberErr = editProfileForm.streetNumber.trim() === "";
        const genderErr = editProfileForm.gender.trim() === "";
        const birthDateErr = editProfileForm.birthDate.trim() === "";
        
        setEditProfileFormError({
            name: nameErr,
            lastname: lastnameErr,
            countryName: countryNameErr,
            streetName: streetNameErr,
            birthDate: birthDateErr,
            streetNumber: streetNumberErr,
            gender: genderErr,
        });

        if(nameErr || lastnameErr || birthDateErr || countryNameErr || streetNameErr || streetNumberErr || genderErr)  {
            handleErrorDetected();
            const defaultMessage = "All fields, other than image, are required";
            setFeedback(defaultMessage);
            setWaiting(false);
            return;
        }
        
        let formData:FormData = new FormData();
        formData.append("first_name", editProfileForm.name);
        formData.append("last_name", editProfileForm.lastname);
        formData.append("country", editProfileForm.countryName);
        formData.append("street", editProfileForm.streetName);
        formData.append("street_number", editProfileForm.streetNumber);
        formData.append("gender", editProfileForm.gender);
        formData.append("birth_date", editProfileForm.birthDate);
        const file = imageRef.current?.files?.[0];
        if(file) {
            formData.append("profile_image", file);
        }
        

        try {
            await profileUpdate(formData);
            setFeedback("Success");
        } catch (error: any) {
            if(!error.response) {
                setFeedback("No connection to the server.");
            } else {
                const data:ProfileUpdateResponse = error.response.data;
                setFeedback(data.message);
            }
            
        } finally {
            setWaiting(false);
        }
    }

    return (
        <div className={styles.edit_profile_view}>
            <form onSubmit={(e:React.FormEvent<HTMLFormElement>) => handleOnSubmit(e)}>
                <h1>Edit Profile</h1>
                <FormRow>
                    <TextInput key={errorTrigger} type="text" value={editProfileForm.name} placeholder="Name" onChange={(value) => setEditProfileForm(prev => ({...prev, name: value}))} error={editProfileFormError.name}></TextInput>
                </FormRow>
                <FormRow>
                    <TextInput key={errorTrigger} type="text" value={editProfileForm.lastname} placeholder="Lastname" onChange={(value) => setEditProfileForm(prev => ({...prev, lastname: value}))} error={editProfileFormError.lastname}></TextInput>
                </FormRow>
                <FormRow>
                    <TextInput key={errorTrigger} type="text" value={editProfileForm.countryName} placeholder="Country Name" onChange={(value) => setEditProfileForm(prev => ({...prev, countryName: value}))} error={editProfileFormError.countryName}></TextInput>
                </FormRow>
                <FormRow gap="10px">
                    <FormColumn flex="3">
                        <TextInput key={errorTrigger} type="text" value={editProfileForm.streetName} placeholder="Street Name" onChange={(value) => setEditProfileForm(prev => ({...prev, streetName: value}))} error={editProfileFormError.streetName}></TextInput>
                    </FormColumn>
                    <FormColumn flex="2">
                        <TextInput key={errorTrigger} type="number" value={editProfileForm.streetNumber} placeholder="Street Number" onChange={(value) => setEditProfileForm(prev => ({...prev, streetNumber: value}))} error={editProfileFormError.streetNumber}></TextInput>
                    </FormColumn>
                </FormRow>
                <FormRow>
                    <DateInput key={errorTrigger} value={editProfileForm.birthDate} onChange={(value) => setEditProfileForm(prev => ({...prev, birthDate: value}))} error={editProfileFormError.birthDate}></DateInput>
                </FormRow>
                <FormRow>
                    <RadioGroup key={errorTrigger} title="Gender" options={genderOptions} name="gender" value={editProfileForm.gender} onChange={(value) => setEditProfileForm(prev => ({...prev, gender: value}))} fontColor="#33493f" color="#33493f"></RadioGroup>
                </FormRow>
                <FormRow>
                    <input style={{width: "100%"}} type="file" accept="image/*" ref={imageRef}></input>
                </FormRow>
                <FormRow>
                    <SubmitButton key={errorTrigger} title="Update"></SubmitButton>
                </FormRow>
                <div style={{display: feedback === "" ? "none" : "block", background: feedback === "Success" ? "#b0ffb4" : "#ff8181"}}>{feedback}</div>
            </form>
        </div>
    );
}
export default EditProfileView;