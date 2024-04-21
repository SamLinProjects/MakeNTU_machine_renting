import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import useLaserCutRequest from "@/hooks/useLaserCutRequest";
import useThreeDPRequest from "@/hooks/useThreeDPRequest";
import { useRef } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { setFips } from "crypto";
import io from "socket.io-client";

type StatusProps = {
    id:number;
    isAdmin:boolean;
    initialState:string;
    timeStarted: Date;
    type:string;
}

type indRequestForStatus = {
    id: number
    timeleft: Date
    status: string
}

type broadcastRequest = {
    id: number
    status: string
}

export default function Status( {id, isAdmin, initialState, timeStarted, type}: StatusProps ){
    const router = useRouter();
    const [ timer, setTimer ] = useState<NodeJS.Timeout>();
    const statusArray = ['等','到','過','切','完'];
    const { getLaserCutRequest, putLaserCutRequestStatus, putLaserCutRequestTimeLeft } = useLaserCutRequest();
    const { getThreeDPRequest, putThreeDPRequestStatus, putThreeDPRequestTimeLeft } = useThreeDPRequest();
    const [ requestList, setRequestList ] = useState<indRequestForStatus[]>();
    const select = useRef<HTMLDivElement>();
    const [ current, setCurrent ] = useState("");//now status
    const [ timeCreated, setTimeCreated] = useState<Date>(new Date())//the latest time switched to "到"
    const [ countdown, setCountdown ] = useState(false);//whether counting down or not
    const [ timeLeft, setTimeLeft ] = useState(0);//left time
    const [ wrong, setWrong ] = useState(false);//pass number or not
    const [ flag, setFlag ] = useState(false);
    
    function checkID(req:indRequestForStatus){
        return req.id === id
    }

    const gReq = async () => {
        try{
            const requestListLaserInit = await getLaserCutRequest();
            const requestListLaserJson:indRequestForStatus[] = requestListLaserInit["dbresultReq"];
            const requestListTDPInit = await getThreeDPRequest();
            const requestListTDPJson:indRequestForStatus[] = requestListTDPInit["dbresultReq"];
            const requestListJson = requestListLaserJson.concat(requestListTDPJson)
            setRequestList(requestListJson);
            if (requestListJson.find(checkID) !== undefined) {
                setTimeCreated(requestListJson.find(checkID)?.timeleft);
            }
            else{
                setTimeCreated(new Date(0));
            }   
        }
        catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        if (statusArray.includes(initialState)){
            setCurrent(initialState)
        }
        setFlag(true);
        if (initialState === "到"){
            setCountdown(true)
            setTimeLeft(Math.trunc(20-(new Date().getTime()-new Date(timeStarted).getTime())/1000))
        }
    },[initialState])
    
    useEffect(() => {
        if ( flag === true ){
            if(countdown === true){
                gReq();
                const countDownByState = () => {
                    setTimeLeft((prev)=>(prev-1))
                }
                setTimer(setInterval(countDownByState, 1000));
            }
            else{
                clearInterval(timer);
            }
        }
    },[countdown])

    useEffect(()=>{
        if( flag === true ){
            console.log(timeLeft);
            if(timeLeft <= 0){
                clearInterval(timer);
                setCountdown(false);
                setWrong(true);
                setCurrent("過")
                handleStatusChange(id, "過")
            }
        }
    },[timeLeft])

    const handleStatusChange = async(id: number, newStatus: string) => {

        const socket = io();

        if (type === "laser"){
            try{
                await putLaserCutRequestStatus({
                    id,
                    newStatus
                })
                const broadcastChange: broadcastRequest = {
                    id: id,
                    status: newStatus
                }
                socket.emit('laserCutQueue', broadcastChange);
            }catch(e){
                console.error(e);
            }
        }
        else{
            try{
                await putThreeDPRequestStatus({
                    id,
                    newStatus
                })
                const broadcastChange: broadcastRequest = {
                    id: id,
                    status: newStatus
                }
                socket.emit('threeDPQueue', broadcastChange);
            }catch(e){
                console.error(e);
            }
        }
        router.refresh();

        return () => {
            socket.disconnect();
        }
    }

    const handleTimeChange = async(id: number, newTimeLeft: Date) => {
        if(type === "laser"){
            try{
                await putLaserCutRequestTimeLeft({
                    id,
                    newTimeLeft
                })
            }catch(e){
                console.error(e);
            }
        }
        else{
            try{
                await putThreeDPRequestTimeLeft({
                    id,
                    newTimeLeft
                })
            }catch(e){
                console.error(e);
            }
        }
        router.refresh();
    }

    return(
        <>
            {isAdmin === true ? 
            <>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">狀態</InputLabel>
                        <Select
                            ref={select}
                            value={current}
                            label="狀態"
                            onChange={(e)=>{
                                setCurrent(e.target.value);
                                handleStatusChange(id, e.target.value);
                                if(e.target.value === "到"){
                                    setCountdown(true);
                                    setTimeLeft(20);
                                    handleTimeChange(id, new Date())
                                }
                                else{
                                    setCountdown(false);
                                }
                            }}>
                            <MenuItem value="等">等</MenuItem>
                            <MenuItem value="到">到</MenuItem>
                            <MenuItem value="切">切</MenuItem>
                            <MenuItem value="完">完</MenuItem>
                            <MenuItem value="過">過</MenuItem>
                        </Select>
                </FormControl>
                <p className={countdown? "block" : "hidden"}>{timeLeft}</p>
            </> :
            <>
                <div className="inline-flex flex-row">
                    {current}
                </div>
                <p className={countdown? "block" : "hidden"}>{timeLeft}</p>
            </>
            }
        </>
    )
}