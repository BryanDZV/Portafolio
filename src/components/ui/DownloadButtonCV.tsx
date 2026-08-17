import { DownloadButtonProps } from "@/types/downloadButtonCV";
import React from "react";

export default function DownloadButtonCV({label,fileUrl}:DownloadButtonProps){
    return(
        <a href={fileUrl} download="CV_Bryan_Zavala_FullStack.pdf" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80">
            {label}
        </a>
    )
}