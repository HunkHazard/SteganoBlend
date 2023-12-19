// components/FileUpload.tsx
import React, { useRef, useState } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
const FileUpload = () => {
    const [fileList, setFileList] = useState(null);
    const [shouldHighlight, setShouldHighlight] = useState(false);

    const preventDefaultHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    return (
        <div className="w-full mt-12 flex justify-center">
            <div
                className={classNames({
                    "w-[70%] h-[20rem]": true,
                    "p-4 grid place-content-center cursor-pointer": true,
                    "text-[#1494ff] rounded-lg": true,
                    "border-4 border-dashed ": true,
                    "transition-colors": true,
                    "border-[#1494ff] bg-[#a7c9e7]": shouldHighlight,
                    "border-[#a7c9e7] bg-[#e2eaf1]": !shouldHighlight,
                })}
                onDragOver={(e) => {
                    preventDefaultHandler(e);
                    setShouldHighlight(true);
                }}
                onDragEnter={(e) => {
                    preventDefaultHandler(e);
                    setShouldHighlight(true);
                }}
                onDragLeave={(e) => {
                    preventDefaultHandler(e);
                    setShouldHighlight(false);
                }}
                onDrop={(e) => {
                    preventDefaultHandler(e);
                    const files = Array.from(e.dataTransfer.files);
                    setFileList(files);
                    setShouldHighlight(false);
                }}
            >
                <div className="flex flex-col items-center">
                    {!fileList ? (
                        <>
                            <CloudArrowUpIcon className="w-10 h-10" />
                            <span>
                                <span>Choose a File</span> or drag it here
                            </span>
                        </>
                    ) : (
                        <>
                            <p>Files to Upload</p>
                            {fileList.map((file, i) => {
                                return <span key={i}>{file.name}</span>;
                            })}
                            <div className="flex gap-2 mt-2">
                                <button className="bg-violet-500 text-violet-50 px-2 py-1 rounded-md">
                                    Upload
                                </button>
                                <button
                                    className="border border-violet-500 px-2 py-1 rounded-md"
                                    onClick={() => {
                                        setFileList(null);
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUpload;

