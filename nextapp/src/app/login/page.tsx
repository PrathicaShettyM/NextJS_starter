"use client"; // decorator

import Link from "next/link";
import React , { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage(){
    const router = useRouter();
    // collect these data from the user
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    });

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // handles the signup login(also communicates with the backend for the same)
    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log(response.data);
            toast.success("Login success");
            router.push("/profile");
        } catch (error: any) {
            console.log("Login failed", error.message);
            // toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0){
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-center text-white text-2xl">{loading ? "Processing":"Login"}</h1>
            <hr/>

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
            onClick={onLogin}
            className="p-1 border border-green-400 rounded-lg mb-4 hover:bg-green-400 hover:text-black cursor-pointer"
            >Login</button>
            
            <Link href="/signup">Visit SignUp Page</Link>
        </div>
    );
}


// create a folder for every single route
// meaning: if u want /login route create a folder in tht name and it shd always be in page.tsx(compulsorily)