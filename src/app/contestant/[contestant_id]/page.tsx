"use client"
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import LaserCutQueueListForContestant from "@/components/LaserCutQueueListForContestant";
import ThreeDPQueueListForContestant from "@/components/ThreeDPQueueListForContestant"
import Map from "@/components/Map";
import jwt from "jsonwebtoken";
import { env } from "../../../utils/env";
import { decode } from "punycode";

export default function contestant() {
    const router = useRouter();
    const pathname = usePathname();
    const secretkey : string = process.env.PASSWORD_SECRET ? process.env.PASSWORD_SECRET : "Secret";
    const token = localStorage.getItem("jwt-token: ");
    console.log(token);
    function decodeJWT(token: string): Record<string, any> | null {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null; // Invalid JWT format
        }
    
        const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
        return JSON.parse(payload);
    }
    

    
    if (!token) {
        alert("You are not logged in.");
        router.push("/login");
    } else {
        const decodedPayload = decodeJWT(token);
        const permission = decodedPayload?.permission;
        console.log(permission);
        if(!permission || permission !== "contestant") {
            router.push("/login");
        }
    }

    return (
        <>
        <Map />
        <LaserCutQueueListForContestant/>
        <ThreeDPQueueListForContestant/>
        <div className="h-full m-2 flex flex-col items-center justify-center">
            <div className="flex flex-row justify-between">
                <button
                    className="m-1 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                    onClick={() => { router.push("/"); localStorage.clear();}}
                >登出</button>
            </div>
        </div>
        </>
    )
}