import { useEffect, useState } from "react";
import styles from "./AdminViews.module.css";
import type { User } from "../../../lib/types/User";
import Loading from "../../../components/loading/Loading";
import { answerRoleRequest, deleteUserById, getAllUserRequests, getAllUsers } from "../users.api";
import { useAuth } from "../../auth";
import type { UserRequests } from "../users.types";

const UsersView = () => {

    const [userRequests, setUserRequests] = useState<UserRequests[]>([]);
    //const {user} = useAuth();
    const [waiting, setWaiting] = useState<boolean>(false);

    const [reason, setReason] = useState<string>("");

    useEffect(() => {
        fetchAllUserRequests();
    }, []);

    const fetchAllUserRequests = async () => {
        setWaiting(true);

        try{
            const data = await getAllUserRequests();
            console.log(data);
            setUserRequests(data);
        } catch {
            console.log('error occured');
        } finally {
            setWaiting(false);
        }
    }

    const handleDeclined = async (requestId: number) => {
        setWaiting(true);

        try{
            await answerRoleRequest(requestId, "rejected", reason);
            setUserRequests(prev => (
                prev.filter(req => req.id !== requestId)
            ))
        } catch {
            console.log('error occured');
        } finally {
            setWaiting(false);
        }
    }

    const handleAccepted = async (requestId: number) => {
        setWaiting(true);

        try{
            await answerRoleRequest(requestId, "approved", reason);
            setUserRequests(prev => (
                prev.filter(req => req.id !== requestId)
            ))
        } catch {
            console.log('error occured');
        } finally {
            setWaiting(false);
        }
    }

    if(waiting) return <Loading size="medium" theme="dark"></Loading>

    return (
        <div className={styles.user_requests_view}>
            {userRequests.length === 0 ? (
                <h3 style={{color: "#074f5a"}}>Zero pending requests</h3>
            ) : 
                userRequests.map(request => (
                    <div key={request.id} className={styles.request_entry}>
                        <div className={styles.request_header}>
                            <div className={styles.email}>
                                {request.user_email}
                            </div>

                            <div className={styles.actions}>
                                <button className={styles.decline} onClick={() => handleDeclined(request.id)} disabled={reason === ""} style={{opacity: reason === "" ? 0.6 : 1.0}}>Decline</button>
                                <button className={styles.accept} onClick={() => handleAccepted(request.id)}>Accept</button>
                            </div>
                        </div>

                        <div className={styles.text}>
                            <textarea placeholder="Reason or message..." onChange={(e) => setReason(e.target.value)}></textarea>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}
export default UsersView;