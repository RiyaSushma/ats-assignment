import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("https://botserver-production.up.railway.app/user")
        .then((response) => {
            console.log(response);
            setUsers(response.data);
        })
        .catch((error) => {
            console.error("Error fetching user: ", error);
        })
    }, []);

    const changeStatus = async(chatId, status) => {
        const response = await axios.put(`https://botserver-production.up.railway.app/user/${chatId}`, {
            status: status,
        });

        console.log(response);
        <div className="alert alert-success">
            User ${status}
        </div>

        setUsers((prevUser) => prevUser.map((user) => {
            if(user.chatId === chatId) {
                return { ...user, status: status };
            }
            return user;
        }));
    };

    const deleteUser = async(chatId) => {
        const response = await axios.delete(`https://botserver-production.up.railway.app/user/${chatId}`);

        console.log(response);
        <div className="alert alert-danger">
            User deleted
        </div>
        setUsers((prevUser) => prevUser.filter((user) => user.chatId !== chatId));
    };

    return (
        <div>
            {users.length > 0 ? (
                users.map((user, index) => {
                    <div key={user.chatId}>
                        <div class="card" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">Users</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Name: {user.firstName}
                                Status: {user.status}</h6>
                                <button type="button" class="btn btn-primary"
                                onClick={() => {
                                    changeStatus(user.chatId, "Active")
                                }}>Activate User</button>
                                <button type="button" class="btn btn-danger"
                                onClick={() => deleteUser(user.chatId)}>Delete User</button>
                            </div>
                            </div>
                    </div>
                })
            ): (
                <div>
                    No Subscribers
                </div>
            )}
        </div>
    )
}

export default Users