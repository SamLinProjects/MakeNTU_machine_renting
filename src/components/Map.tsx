import React from "react";
import Image from "next/image";
import map_path from "../../public/ntumap.jpg";

export default function Map() {
    return (
        <>
        <div className="w-800 h-full p-6 flex justify-center">
            <div className="rounded border-2 border-gray-400">
                <Image src={map_path} width={2000} height={1000} loading="lazy" alt="map" className="w-full h-full rounded" />
            </div>
        </div>
        <div className="h-1"></div>
        </>
    )
}