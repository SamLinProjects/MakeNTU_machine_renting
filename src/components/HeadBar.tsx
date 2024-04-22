'use client'
import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAccount from "@/hooks/useAccount";

export type Account = {
    username: string;
    permission: string;
}

export default function HeadBar() {
    const { getAccountbyToken } = useAccount();
    const router = useRouter();
    const [user, setUser] = useState<Account>();
    const [userList, setUserList] = useState<Account[]>();

    function decodeJWT(token: string): Record<string, any> | null {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null; // Invalid JWT format
        }
        const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
        return JSON.parse(payload);
    }

    useEffect(() => {
        const token = localStorage.getItem("jwt-token: ");
        if (!token) {
            // alert("You are not logged in.");
            // router.push("/login");
        } else {
            const decodedPayload = decodeJWT(token);
            const name = decodedPayload?.username;
            const permission = decodedPayload?.permission;
            if(!name) {
                console.log("no name")
            }
            else{
                setUser({username: name, permission: permission})
            }
        }
    },[])
    
    
    return (
        <>
        <div className="bg-black">
            <div className="h-5"></div>
            <div className="h-12 m-2 flex items-center justify-center cursor-pointer">
                <h1 className="text-4xl font-bold text-blue-500" onClick={()=>router.push("/")}>MakeNTU 機台租借網站</h1>
                <div className="m-2 flex flex-row justify-end">
                    <div className="flex flex-row justify-between">
                        {(user?.permission!=='admin' && user?.permission!=='contestant') && <button
                            className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => router.push("/login")}
                        >登入</button>}
                        {(user?.permission==='admin' || user?.permission==='contestant') && <button
                            className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {router.push("/");localStorage.clear();setUser({username:"", permission:""})}}
                        >登出</button>}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}