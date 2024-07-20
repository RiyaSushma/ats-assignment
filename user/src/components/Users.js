import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Users() {
    const [users, setUsers] = useState([]);
    const [alert, setAlert] = useState('');

    useEffect(() => {
        axios.get("https://ats-assignment-1.onrender.com/user")
        .then((response) => {
            console.log(response);
            setUsers(response.data);
        })
        .catch((error) => {
            console.error("Error fetching user: ", error);
        });
    }, []);

    const changeStatus = async(id) => {
        try {
            const response = axios.get("https://ats-assignment-1.onrender.com/user");
            
            const users = (await response).data;
            const user = users.find((user) => user.id === id);
            let status;

            if(user.status === "active") {
                status = "inactive";
            }
            else {
                status =" active";
            }

            console.log("status is: ", status, id);

            await axios.put(`https://ats-assignment-1.onrender.com/user/${id}`, {
                status: status,
            });

            setUsers((prevUser) => prevUser.map((user) => {
                if(user.id === id) {
                    return { ...user, status: status };
                }
                return user;
            }));

            setAlert(`User ${status}`);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const deleteUser = async(id) => {
        try {
            await axios.delete(`https://ats-assignment-1.onrender.com/user/${id}`);

            setUsers((prevUser) => prevUser.filter((user) => user.id !== id));

            setAlert('User deleted');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="container">
            {alert && <div className={`alert ${alert.includes('deleted') ? 'alert-danger' : 'alert-success'}`}>
                {alert}
            </div>}

            {users.length > 0 ? (
                users.map((user) => (
                    <div key={user.id} className="row mb-3">
                        <div className="col">
                            <div className="border p-3">
                                <h5>Users</h5>
                                <h6 className="text-muted">
                                    Name: {user.name}<br />
                                    Status: {user.status}
                                </h6>
                                <button type="button" className="btn btn-primary me-2"
                                    onClick={() => changeStatus(user.id)}>Change Status</button>
                                <button type="button" className="btn btn-danger"
                                    onClick={() => deleteUser(user.id)}>Delete User</button>
                            </div>
                        </div>
                    </div>
                ))
            ): (
                <div>No Subscribers</div>
            )}
        </div>
    );
}

export default Users;
