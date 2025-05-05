"use client"; // decorator

import Link from "next/link";
import React , { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignUpPage(){
    const router = useRouter();

    // collect these data from the user
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: ""
    });

    const [buttonDisabled, setButtonDisabled] = React.useState(false);


    // handles the signup login(also communicates with the backend for the same)
    const [loading, setLoading] = React.useState(false);
    const onSignUp = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("SignUp success", response.data);
            router.push("/login");

        } catch (error: any) {
            console.log("SignUp failed", error.message);
            //toast.error(error.message);
        } finally {
            // whtevr happens, loading needs to go away
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0){
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-center text-white text-2xl">{loading ? "Processing": "SignUp"}</h1>
            <hr/>

            <label htmlFor="username">Username</label>
            <input
            className="p-1 border border-gray-300 rounded-lg mb-2"
                id="username"
                type="text"
                value={user.username}
                onChange={(e) => setUser({...user, username: e.target.value})}
                placeholder="username"
            />

            <label htmlFor="email">Email</label>
            <input
            className="p-1 border border-gray-300 rounded-lg mb-2"
                id="email"
                type="text"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
                placeholder="email"
            />

            <label htmlFor="password">Password</label>
            <input
            className="p-1 border border-gray-300 rounded-lg mb-2"
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
                placeholder="password"
            />

            <button
            onClick={onSignUp}
            className="p-1 border border-green-400 rounded-lg mb-4 hover:bg-green-400 hover:text-black cursor-pointer"
            >{buttonDisabled ? "No Signup" : "Signup"}</button>
            
            <Link href="/login">Visit Login Page</Link>
        </div>
    );
}
