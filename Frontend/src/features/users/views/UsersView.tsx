import { useEffect, useState } from "react";
import styles from "./AdminViews.module.css";
import type { User } from "../../../lib/types/User";
import Loading from "../../../components/loading/Loading";
import { deleteUserById, getAllUsers } from "../users.api";
import { useAuth } from "../../auth";

const UsersView = () => {

    const [users, setUsers] = useState<User[]>([]);
    const {user} = useAuth();
    const [waiting, setWaiting] = useState<boolean>(false);

    useEffect(() => {
        if(!user) return;
        fetchAllUsers();
    }, [user]);

    const fetchAllUsers = async () => {
        setWaiting(true);

        try{
            const data = await getAllUsers();
            const filteredData = data.users.filter(entry => entry.id !== user?.id);
            console.log(filteredData);
            setUsers(filteredData);
        } catch {
            console.log('error occured');
        } finally {
            setWaiting(false);
        }
    }

    const handleDeleteClicked = async (userId: number) => {
        setWaiting(true);
        
        try{
            await deleteUserById(userId);
            handleDeletedSuccesfully(userId);
        } catch {
            console.log('error occured');
        } finally {
            setWaiting(false);
        }
    }

    const handleDeletedSuccesfully = (idDeleted:number) => {
        setUsers(prev => 
            prev.filter(user => user.id !== idDeleted)
        )
    }

    if(waiting) return <Loading size="medium" theme="dark"></Loading>

    return (
        <div className={styles.users_view}>
            <div className={`${styles.user_entry} ${styles.header}`}>
                <div className={styles.id}>ID</div>
                <div className={styles.email}>Email</div>
                <div className={styles.first_name}>First name</div>
                <div className={styles.last_name}>Last name</div>
                <div className={styles.removal}>Removal</div>
            </div>
            {users.map(user => (
                <div key={user.id} className={styles.user_entry}>
                    <div className={styles.id}>{user.id}</div>
                    <div className={styles.email}>{user.email}</div>
                    <div className={styles.first_name}>{user.first_name}</div>
                    <div className={styles.last_name}>{user.last_name}</div>
                    <div className={styles.removal}>
                        <button onClick={() => handleDeleteClicked(user.id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
export default UsersView;