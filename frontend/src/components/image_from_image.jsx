import React, { useState } from "react";
import DragDrop from "./DragDrop3"; // Replace with your actual DragDrop component
import Multi from "../assets/multi.png"
import Variable from "../assets/variable.png"
import Lock from "../assets/lock.png"
import Auto from "../assets/auto.png"


const ImageInImageDecryption = () => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [decodedImage, setDecodedImage] = useState(null);
    const [Technique, setTechnique] = useState("");
    const [BitShift, setBitShift] = useState(null);
    const [Key, setKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const handleTechniqueChange = (e) => {
        setTechnique(e.target.value);
    };

    const handleBitShiftChange = (e) => {
        setBitShift(e.target.value);
    };
    const handleKeyChange = (e) => {
        setKey(e.target.value);
    };
    const isDecryptButtonVisible = () => {
        if (!uploadedImage || !Technique) {
            return false;
        }

        if (Technique === 'multi-bit' && BitShift === null) {
            return false;
        }

        if (Technique === 'encryption' && Key === "") {
            return false;
        }

        return true;
    };


    const handleDecodeClick = async () => {
        const formData = new FormData();
        setIsLoading(true);

        if (Technique === "multi-bit") {
            formData.append('image', uploadedImage);
            formData.append('bits', BitShift);

            try {
                const response = await fetch('http://localhost:5000/api/decode', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const jsonResponse = await response.json();
                    setDecodedImage(jsonResponse.decoded_image);
                    setIsLoading(false);
                } else {
                    console.error('Failed to decode the image', response.status);
                }
            } catch (error) {
                console.error('Error while decoding the image', error);
            }

        }
        else if (Technique === "encryption") {
            formData.append('combined_key', Key);
            formData.append('encrypted_image', uploadedImage);

            try {
                const response = await fetch('http://localhost:5000/api/randomAlgoDecrypt', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const jsonResponse = await response.json();
                    setDecodedImage(jsonResponse.decrypted_image);
                    setIsLoading(false);
                } else {
                    console.error('Failed to decode the image', response.status);
                }
            } catch (error) {
                console.error('Error while decoding the image', error);
            }


        }
    };
    const handleDownloadClick = () => {
        const link = document.createElement("a");
        link.href = `data:image/png;base64,${decodedImage}`;
        link.download = "processed-image.png";
        link.click();
    };

    return (
        <div className="flex flex-col h-full w-full py-10 px-10 items-center">
            <h1 className="text-5xl font-bold text-black mt-[2rem] font-poppins ">Decrypt Image from Image</h1>
            {!decodedImage ? (
                <>
                    <DragDrop setPicture={setUploadedImage} />

                    <div className="flex justify-center">
                        <h1 className="text-2xl font-poppins text-black mt-[2rem] mb-[1rem]">Choose the technique adopted for encryption</h1>
                    </div>
                    <ul>
                        <div className="flex justify-center mt-4">
                            {Technique === 'multi-bit' && (
                                <div className="bit-shift-options flex justify-center mt-4 absolute left-[22rem]">
                                    {[1, 2, 3, 4].map((number) => (
                                        <div key={number} className="mr-4">
                                            <input
                                                type="radio"
                                                id={`bit-shift-${number}`}
                                                name="bit-shift"
                                                value={number}
                                                className="hidden peer"
                                                checked={BitShift === `${number}`}
                                                onChange={handleBitShiftChange}
                                                disabled={isLoading}
                                            />
                                            <label
                                                htmlFor={`bit-shift-${number}`}
                                                className="inline-flex items-center border-2 border-slate-300 justify-between w-[3rem] p-2 text-slate-800 bg-white rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
                                            >
                                                <div className="flex">
                                                    <div className="w-full text-lg font-normal mt-0.5 ml-2">
                                                        {number}
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}


                            <li>
                                <input
                                    type='radio'
                                    id='multi-bit'
                                    name='radio-10'
                                    value='multi-bit'
                                    className='hidden peer'
                                    required
                                    onChange={(e) => {
                                        handleTechniqueChange(e);
                                        setKey("");
                                    }}
                                    disabled={isLoading}


                                />
                                <label
                                    htmlFor='multi-bit'
                                    className='inline-flex items-center border-2 border-slate-300 mr-10 justify-between w-[19rem] p-5 text-slate-800 bg-white rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 '
                                >
                                    <div className='flex'>
                                        <img src={Multi} alt="multi" className="h-8 w-8 inline-block mr-2" />
                                        <div className='w-full text-lg font-normal mt-0.5 ml-2'>
                                            Multi-bit Steganography
                                        </div>
                                    </div>
                                </label>
                            </li>

                            {Technique === 'encryption' && (
                                <div className="key-input mt-4">
                                    <input type="text" placeholder="Enter Encrytion Key" className="input input-bordered focus:outline-green-600 focus:border-green-600 w-full max-w-xs text-green-600  absolute right-[19rem] bottom-[10rem]" onChange={handleKeyChange} disabled={isLoading} />
                                </div>
                            )}
                            <li>
                                <input
                                    type='radio'
                                    id='encryption'
                                    name='radio-10'
                                    value='encryption'
                                    className='hidden peer'
                                    required
                                    onChange={
                                        handleTechniqueChange
                                    }
                                    disabled={isLoading}

                                />
                                <label
                                    htmlFor='encryption'
                                    className='inline-flex items-center border-2 border-slate-300 mr-10 justify-between w-[19rem] p-5 text-slate-800 bg-white rounded-lg cursor-pointer peer-checked:border-green-600 peer-checked:text-green-600 hover:text-gray-600 hover:bg-gray-100 '
                                >
                                    <div className='flex'>
                                        <img src={Lock} alt="multi" className="h-8 w-8 inline-block mr-2" />
                                        <div className='w-full text-lg font-normal mt-0.5 ml-2'>
                                            Randomized Encryption
                                        </div>
                                    </div>
                                </label>
                            </li>
                        </div>
                    </ul>

                    {isDecryptButtonVisible() && (
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 absolute right-[3rem] bottom-[2rem]"
                            onClick={handleDecodeClick}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Decrypt Image'}
                        </button>
                    )}
                </>
            ) : (
                <div className="flex justify-center items-center flex-col h-[40rem]">
                    <img src={`data:image/jpeg;base64,${decodedImage}`} alt="Processed" className="w-full h-[32rem] border-8 border-[#042249] rounded-md" />
                    <button onClick={handleDownloadClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute right-[3rem] bottom-[3rem]">
                        Download Image
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageInImageDecryption;
