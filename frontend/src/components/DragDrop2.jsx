// components/FileUpload.tsx
import React, { useState } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

const FileUpload = ({ setPicture }) => {
    const [tempFile, setTempFile] = useState(null); // Temporary file holder
    const [shouldHighlight, setShouldHighlight] = useState(false);

    const preventDefaultHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        preventDefaultHandler(e);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setPicture(e.dataTransfer.files[0]);
            setTempFile(e.dataTransfer.files[0]);
        }
        setShouldHighlight(false);
    };

    return (
        <div className="w-full mt-12 flex justify-center">
            <div
                className={classNames({
                    "w-[70%] h-[20rem]": true,
                    "p-4 grid place-content-center cursor-pointer": true,
                    "text-[#ac51e0] rounded-lg": true,
                    "border-4 border-dashed ": true,
                    "transition-colors": true,
                    "border-[#af5cdf] bg-[#d0a7e7]": shouldHighlight,
                    "border-[#d0a7e7] bg-[#eee2f1]": !shouldHighlight,
                })}
                onDragOver={preventDefaultHandler}
                onDragEnter={(e) => {
                    preventDefaultHandler(e);
                    setShouldHighlight(true);
                }}
                onDragLeave={(e) => {
                    preventDefaultHandler(e);
                    setShouldHighlight(false);
                }}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center">
                    {!tempFile ? (
                        <>
                            <CloudArrowUpIcon className="w-10 h-10 text-violet-500" />
                            <span className="text-violet-500">
                                <span>Choose a File</span> or drag it here
                            </span>
                        </>
                    ) : (
                        <>
                            <p>File to Upload</p>
                            <span>{tempFile.name}</span>
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="border border-violet-500 px-2 py-1 rounded-md"
                                    onClick={() => {
                                        setTempFile(null);
                                        setPicture(null)
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