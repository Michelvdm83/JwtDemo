import axios from 'axios';
import { useState } from 'react';

export default function useAuthentication() {
    const USERNAME_STORAGE_LOCATION = 'USERNAME';
    const TOKEN_STORAGE_LOCATION = 'JWT';
    const MAIN_URL_PART = 'http://localhost:8080';


    async function login(username, password){
        try {
            const response = await axios.post(MAIN_URL_PART + '/auth/login',
                {
                    username: username,
                    password: password
                }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            sessionStorage.setItem(TOKEN_STORAGE_LOCATION, response.data.token);
            sessionStorage.setItem(USERNAME_STORAGE_LOCATION, response.data.username);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    function logout(){
        sessionStorage.removeItem(TOKEN_STORAGE_LOCATION);
        sessionStorage.removeItem(USERNAME_STORAGE_LOCATION);
    }

    function register(username, password){
        axios.post(MAIN_URL_PART + '/auth/register', 
        {
            username: username,
            password: password
        }, { 
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return true;
        })
        .catch(error => {
            console.log(error);
            return false;
        });
    }

    function isLoggedIn(){
        return sessionStorage.getItem(TOKEN_STORAGE_LOCATION) !== null;
    }

    function getUsername() {
        const storedUser = sessionStorage.getItem(USERNAME_STORAGE_LOCATION);
        return storedUser === null? "" : storedUser;
    }

    return { login, logout, register, isLoggedIn, getUsername };
}