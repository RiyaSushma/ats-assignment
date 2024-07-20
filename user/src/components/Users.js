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

    const changeStatus = async(id, status) => {
        try {
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
                                    Name: {user.displayName}<br />
                                    Status: {user.status}
                                </h6>
                                <button type="button" className="btn btn-primary me-2"
                                    onClick={() => changeStatus(user.id, "active")}>Activate User</button>
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
