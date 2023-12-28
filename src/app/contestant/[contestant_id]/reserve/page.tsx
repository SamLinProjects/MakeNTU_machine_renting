"use client"
import React, { useState, useRef, useContext } from "react";
import InputArea from "@/app/ui/InputArea";
import { useRouter, usePathname } from "next/navigation";
import { UserContext } from "@/context/user";

export default function reserve() {
    const { user } = useContext(UserContext);
    const fileRef = useRef<HTMLInputElement>(null);
    const noteRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [falseTitle, setFalseTitle] = useState(false);
    const [tooLong, setTooLong] = useState(false);
    const [NoteTooLong, setNoteTooLong] = useState(false);
    const [unselected, setUnselected] = useState(false);
    if(user?.permission!=='admin' && user?.permission!=='contestant'){
        if(!tooLong) {
            alert("Please login first!");
            setTooLong(true);
        }
        router.push('/');
    }

    const handleSubmit = async () => {
        if(!title) setFalseTitle(true) ;else setFalseTitle(false);
        if(title.length > 15) setTooLong(true) ;else setTooLong(false);
        if(note.length > 60) setNoteTooLong(true); else setNoteTooLong(false);
        if(type === "") setUnselected(true) ;else setUnselected(false);
        if(falseTitle || tooLong || NoteTooLong || unselected)return;
        const pathTemp = pathname.split("/");
        const teamName = pathTemp[2];
        const request = {teamName, title, type, note};
        console.log(request);
        
        try {
            const response = await fetch('api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });
            if (!response.ok) {
                alert("Sorry, something rong happened. Please try again later.");
                console.log(response);
                return;
            }
        } catch (error) {
            alert("Sorry, something rong happened. Please try again later.");
            console.log(error);
            return;
        }
        router.push(`/contestant/${teamName}`);
    }

    return (<div className="flex justify-around">
        <div className="m-5 p-3 flex flex-col items-center text-lg justify-between border-0 rounded-2xl bg-gray-400 md:max-w-screen-sm min-w-[550px]">
            <div className="m-3 flex gap-2 border-0 min-w-[220px] max-w-[768px]">
                <p className="font-bold w-1/4 text-right">隊伍編號：</p>
                <InputArea
                    editable={false}
                    value={"TEST"}
                    />
            </div>
            <div className="m-3 mb-0.5 w-4/5 flex gap-2 border-0 min-w-[220px] max-w-[768px]">
                <p className="font-bold w-1/4 text-right">機台類型：</p>
                <select 
                    className="p-1 border-gray-300 border-2 text-gray-800 rounded-lg bg-white focus:outline-none"
                    value={type}
                    onChange={(e)=>setType(e.target.value)}
                    defaultValue="">
                    <option value="">--Select--</option>
                    <option value="3DP">3D列印機</option>
                    <option value="LCM">雷射切割機</option>
                </select>
            </div>
            <div className="flex items-end w-1/2 h-5">
                <div className="w-1/4"></div>
                <p className="w-3/4 pl-5 text-sm text-red-500 ">{unselected?"Please select machine type.": ""}</p>
            </div>
            <div className="m-3 mb-0.5 flex gap-2 border-0 min-w-[220px] max-w-[768px]">
                <p className="font-bold w-1/4 text-right">檔案名稱：</p>
                <InputArea
                    ref={fileRef}
                    placeHolder={"file name"}
                    editable={true}
                    value={title}
                    onChange={(e) => setTitle(e)}
                />
            </div>
            <div className="flex items-end w-1/2 h-5">
                <div className="w-1/4"></div>
                <p className="w-3/4  pl-5 text-sm text-red-500 ">{falseTitle?"Please enter file title.": ""}{tooLong?"Title must be less than 15 words.":""}</p>
            </div>
            <div className="m-2 w-4/5 flex gap-2 border-0 min-w-[220px] max-w-[768px]">
                <p className="font-bold w-1/4 text-right">備註：</p>
                <textarea
                    ref={noteRef}
                    className="resize-none p-1 border-2 text-gray-800 border-gray-300 rounded-lg focus:border-gray-600 focus:outline-none"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </div>
            <div className="flex items-end w-1/2 h-5">
                <div className="w-1/4"></div>
                <p className="w-3/4  pl-5 text-sm text-red-500 ">{NoteTooLong?"Note must be less than 60 words.": ""}{tooLong?"Title must be less than 60 chars.":""}</p>
            </div>
            <div className="m-2 flex gap-2 border-0">
                <button
                    className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={() => router.back()}
                >取消</button>
                <button
                    className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={handleSubmit}>登記</button>
            </div>
        </div>
        </div>
    )
}