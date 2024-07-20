import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios"; 
import './ManageBot.css';

const authenticateToken = async (token) => {
    try {
        const response = await axios.get(`https://api.telegram.org/bot${token}/getMe`);
        console.log(response.data);

        // this will give information about bot id, username etc
        return response.data;
    } catch (error) {
        console.error("Error: ", error);
        return null;
    }
};

const updateToken = async (token) => {
    const response = await axios.put(`https://botserver-production.up.railway.app/bot/${token}`);
    console.log(response);
};

function ManageBot() {
    const [telegramBotToken, setTelegramBotToken] = useState("");
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("user input: ", telegramBotToken);
        const response = await authenticateToken(telegramBotToken);
        console.log("response is: ", response);

        if (response) {
            if (response.ok === true) {
                console.log("Bot info: ", response);
                await updateToken(telegramBotToken);
                setAlert(
                    <div className="alert alert-success" role="alert">
                        Bot token updated. Please restart the bot server for changes to take effect.
                    </div>
                );
            }
        } else {
            console.log("telegram bot token is invalid, generate a new token and try again");
            setAlert(
                <div className="alert alert-danger" role="alert">
                    Invalid telegram bot token. Please generate a new token and try again.
                </div>
            );
        }
    };

    return (
        <div className="container mt-5">
            <div className="container-managebot-items">
                <h6>Managing Bot with a click</h6>
            </div>
            <form className="form" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input 
                        type="text" 
                        placeholder='Enter Telegram token'
                        className="form-control" 
                        id="telegramBotToken" 
                        value={telegramBotToken} 
                        onChange={(e) => setTelegramBotToken(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            {alert}
        </div>
    );
}

export default ManageBot;
