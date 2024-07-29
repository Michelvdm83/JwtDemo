import { useState } from "react";
import "./AuthForm.css";

export default function AuthForm( { onSubmitClick, title } ){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function submit(event) {
        event.preventDefault();
        console.log("hi");
        let errors = "";
        if(!validateUsername()){
            errors += "username is required\n";
        }
        if(!validatePassword()){
            errors += "password is required\n";
        }

        if(errors.length > 1){
            alert(errors);
        } else {
            onSubmitClick(username, password);
            setUsername('');
            setPassword('');
        }
    }

    function validateUsername() {
        setUsername(username.trim());
        if (username === undefined || username === null || username.length === 0) {
            return false;//'username is required';
        }

        return true;
    }

    function validatePassword() {
        if (password === undefined || password === null || password.length === 0) {
            return false;//'password is required';
        }

        return true;
    }

    return (
        <form className="auth-form" onSubmit={(event) => submit(event)}>
            <h1>{title}</h1>
            <input
                onChange={(event) => setUsername(event.target.value)}
                value={username}
                placeholder="enter username"
                spellCheck="false"
            />
            <input
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                placeholder="enter password"
                spellCheck="false"
            />
            <button type="submit" >submit</button>
        </form>
    );
}