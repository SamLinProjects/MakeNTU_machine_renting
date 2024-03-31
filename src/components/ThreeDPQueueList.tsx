'use client'
import React, { useContext, useEffect, useState } from "react";
import { RequestContext } from "@/context/Request";
import { AccountContext } from "@/context/Account";
import Status from "./Status";
import useRequest from "@/hooks/useThreeDPRequest";
import { usePathname } from "next/navigation";

import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { TableHead, TableRow } from "@mui/material";


type indRequest = {
    id: number
    groupname: number
    filename: string
    loadBearing: boolean
    material: string[]
    status: string
    comment: string
    timeleft: Date
}
export default function ThreeDPQueueList() {      
    const { requests, setRequests } = useContext(RequestContext);
    const { user } = useContext(AccountContext);
    const [ requestList, setRequestList ] = useState<indRequest[]>();
    const pathname = usePathname();
    const pathTemp = pathname.split("/");
    const group = pathTemp[2];
      
    const { getThreeDPRequest } = useRequest();
    // useEffect(() => {
    //     const fetchRequests = async () => {
    //         const token = localStorage.getItem("token");
    //         const response = await fetch(`api/reserve`, {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         const data = await response.json();
    //         console.log(data);
    //         if (!response.ok) {
    //             console.log(response);
    //         }
    //         setRequests(data);
    //     };
    //     fetchRequests();
    // }, []);
    
    useEffect(() => {
        const gReq = async () => {
            try{
                const requestListInit = await getThreeDPRequest();
                const requestListJson:indRequest[] = requestListInit["dbresultReq"];
                // console.log(requestListJson)
                setRequestList(requestListJson);
            }
            catch(e){
                console.log(e);
            }
        }
        gReq();
    },[]);
    const testRequest = {
        group: "team1",
        filename: "test1",
        type: "3DP",
        status: "waiting",
    };
    const testUser1 = {
        name: "team1", 
        permission: "contestant",
    }
    const testUser2 = {
        name: "team2", 
        permission: "contestant",
    }

    return (
        <>
        {/* <div className="m-2 relative flex flex-col items-center justify-start">
            <div className="max-h-[50vh] w-1/2 flex flex-col items-center justify-start bg-white rounded border-2 border-black overflow-y-auto">
                <div className="w-full sticky top-0 bg-white z-10">
                    <div className="g-4 w-full flex flex-row items-center justify-between border-b-2 border-black">
                        <p className="text-sm">預約組別</p>
                        <p className="text-sm">檔案名稱</p>
                        <p className="text-sm">使用板材</p>
                        <p className="text-sm">列印狀態</p>
                        <p className="text-sm">備註</p>
                        {/* By tim_2240 Maybe use a table?
                    </div>
                </div> */}
                {/* <RequestCard information={testRequest} isSender={testRequest.group === testUser1.name}/>
                <RequestCard information={testRequest} isSender={testRequest.group === testUser2.name}/> */}
                {/* {requests.map((request) => {
                    if (request.status !== "finished") {
                        return (
                            <RequestCard
                                key={request.id}
                                information={request}
                                isSender={request.group === user?.name}
                            />
                        )}
                    return null;
                })}
                {
                    // requestList?.map((request)=>(
                        // <RequestCard information={{
                        //     group:String(request.groupname),
                        //     filename:request.filename,
                        //     material:request.material,
                        //     status:request.status,
                        //     comment:request.comment

                        // }}></RequestCard>
                        
                    //     )
                    // )
                }
            </div>*/}
            {/* </div> 
        </div> */}
        <div className="h-10 m-2 flex items-center justify-center cursor-pointer">
            <h1 className="text-3xl font-bold text-yellow-400">3DP等候列表</h1>
        </div>
        <div className="h-3"></div>
        <div className="flex w-full justify-center">
            <TableContainer component={Paper} sx={{width: '80%', maxHeight: '400px', overflow: 'auto'}}>
                <Table aria-label="simple table" style={{tableLayout: 'fixed'}}>
                    <TableHead>
                    </TableHead>
                    <TableBody>
                        <TableRow key="head" className="bg-yellow-300">
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>預約組別</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>檔案名稱</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>承重與否</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>使用材料</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>列印狀態</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>備註</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        <div className="flex w-full justify-center">
            <TableContainer component={Paper} sx={{width: '80%', maxHeight: '400px', overflow: 'auto'}}>
                <Table aria-label="simple table" style={{tableLayout: 'fixed'}}>
                    <TableHead>
                    </TableHead>
                    <TableBody>
                        {
                            requestList?.map((request)=>(
                                // <RequestCard information={{
                                //     group:String(request.groupname),
                                //     filename:request.filename,
                                //     material:request.material,
                                //     status:request.status,
                                //     comment:request.comment

                                // }}></RequestCard>
                            <TableRow className={String(request.groupname)===group ? "bg-gray-300" : "" } key={request.id}>
                                <TableCell sx={{textAlign: 'center'}}>{String(request.groupname)}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{request.filename}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{request.loadBearing? "是" : "否"}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{request.material}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}><Status id={request.id} isAdmin={false} initialState={request.status} timeStarted={request.timeleft} type="3dp"></Status></TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{request.comment}</TableCell>
                            </TableRow>
                                )
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        <div className="h-5"></div>
        </>
    )
}