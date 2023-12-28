import React from "react";
import DragDrop3 from "./DragDrop3";
import DragDrop2 from "./DragDrop2"
import { useState, useEffect } from "react"
import Multi from "../assets/multi.png"
import Variable from "../assets/variable.png"
import Lock from "../assets/lock.png"
import Auto from "../assets/auto.png"


const Image_in_image = () => {

    // const [Upload, setUpload] = useState(true); 
    const [Original, setOriginal] = useState(null);
    const [Hidden, setHidden] = useState(null);
    const [BitShift, setBitShift] = useState(1);
    const [Technique, setTechnique] = useState();
    const [processedImageData, setProcessedImageData] = useState(null);
    const [Key, setKey] = useState(null);


    const handleTechniqueChange = (e) => {
        setTechnique(e.target.value);
    };


    const handleSubmit = async () => {
        const formData = new FormData();
        if (Technique === 'multi-bit') {
            formData.append('original', Original);
            formData.append('hidden', Hidden);
            formData.append('bits', BitShift);

            try {

                const response = await fetch('http://localhost:5000/api/encode', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const jsonResponse = await response.json();
                    setProcessedImageData(jsonResponse.encoded_image);

                    // Handle the response data
                    console.log(jsonResponse);
                } else {
                    console.error('Failed to send data', response.status);
                }
            } catch (error) {
                console.error('Error while sending data', error);
            }
        }
        else if (Technique === 'encryption') {
            formData.append('original', Original);
            formData.append('hidden', Hidden);

            try {

                const response = await fetch('http://localhost:5000/api/randomAlgoEncrypt', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const jsonResponse = await response.json();
                    setProcessedImageData(jsonResponse.encrypted_image);
                    setKey(jsonResponse.combined_key);

                    // Handle the response data
                    console.log(jsonResponse);
                } else {
                    console.error('Failed to send data', response.status);
                }
            } catch (error) {
                console.error('Error while sending data', error);
            }
        }
        else if (Technique === 'auto-pick') {
            formData.append('original', Original);
            formData.append('hidden', Hidden);

            try {

                const response = await fetch('http://localhost:5000/api/encode/auto-pick', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const jsonResponse = await response.json();
                    setProcessedImageData(jsonResponse.encoded_image);

                    // Handle the response data
                    console.log(jsonResponse);
                } else {
                    console.error('Failed to send data', response.status);
                }
            } catch (error) {
                console.error('Error while sending data', error);
            }
        }
    };
    const handleBitShiftChange = (e) => {
        setBitShift(e.target.value);
    };

    const isSubmitButtonVisible = () => {
        if (!Original || !Hidden || !Technique) {
            return false;
        }

        if (Technique === 'multi-bit' && !BitShift) {
            return false;
        }

        return true;
    };


    const handleDownloadClick = () => {
        const link = document.createElement("a");
        link.href = `data:image/png;base64,${processedImageData}`;
        link.download = "processed-image.png";
        link.click();
    };


    return (
        <div className="flex flex-col h-full w-full py-10 px-10 items-center">
            <div className="flex justify-center">
                <h1 className="text-5xl font-bold text-black mt-[0.5rem]">Embed Image into Image</h1>
            </div>
            {!processedImageData ? (
                <>
                    <div className="flex flex-col h-full w-full items-center">
                        <div className="flex w-full">
                            <DragDrop3 setPicture={setHidden} />
                            <DragDrop2 setPicture={setOriginal} />
                        </div>
                        <div className="flex justify-between mt-4">
                            <h1 className="text-md font-poppins mr-[16rem]">
                                Upload the Image to be hidden
                            </h1>
                            <h1 className="text-md font-poppins ml-[25rem] ">
                                Upload Image to be used as background
                            </h1>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start h-full w-[70%]">

                        <div className="flex justify-center">
                            <h1 className="text-2xl font-bold text-black mt-[1rem] mb-[1rem]">Choose the technique to be implemented</h1>
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
                                        onClick={handleTechniqueChange}

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
                                <li>
                                    <input
                                        type='radio'
                                        id='variable'
                                        name='radio-10'
                                        value='variable'
                                        className='hidden peer'
                                        required
                                        onClick={handleTechniqueChange}
                                    />
                                    <label
                                        htmlFor='variable'
                                        className='inline-flex items-center border-2 border-slate-300 mr-4 justify-between w-[19rem] p-5 text-slate-800 bg-white rounded-lg cursor-pointer peer-checked:border-red-600 peer-checked:text-red-600 hover:text-gray-600 hover:bg-gray-100 '
                                    >
                                        <div className='flex'>
                                            <img src={Variable} alt="multi" className="h-8 w-8 inline-block mr-2" />
                                            <div className='w-full text-lg font-normal mt-0.5 ml-2'>
                                                Variable Embedding Rate
                                            </div>
                                        </div>
                                    </label>
                                </li>

                            </div>
                            <div className="flex justify-center mt-10">
                                <li>
                                    <input
                                        type='radio'
                                        id='encryption'
                                        name='radio-10'
                                        value='encryption'
                                        className='hidden peer'
                                        required
                                        onClick={handleTechniqueChange}
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
                                <li>
                                    <input
                                        type='radio'
                                        id='auto-pick'
                                        name='radio-10'
                                        value='auto-pick'
                                        className='hidden peer'
                                        required
                                        onClick={handleTechniqueChange}
                                    />
                                    <label
                                        htmlFor='auto-pick'
                                        className='inline-flex items-center border-2 border-slate-300 mr-4 justify-between w-[19rem] p-5 text-slate-800 bg-white rounded-lg cursor-pointer peer-checked:border-purple-600 peer-checked:text-purple-600 hover:text-gray-600 hover:bg-gray-100 '
                                    >
                                        <div className='flex'>
                                            <img src={Auto} alt="multi" className="h-8 w-8 inline-block mr-2" />
                                            <div className='w-full text-lg font-normal mt-0.5 ml-2'>
                                                Auto-pick
                                            </div>
                                        </div>
                                    </label>
                                </li>

                            </div>
                        </ul>
                    </div>

                    {isSubmitButtonVisible() && (
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 absolute right-[3rem] bottom-[2rem]"
                            onClick={handleSubmit}
                        >
                            Encode Image
                        </button>
                    )}
                </>
            ) : (
                // Render Processed Image and Download Button
                <div>
                    <img src={`data:image/jpeg;base64,${processedImageData}`} alt="Processed" />
                    <button onClick={handleDownloadClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Download Image
                    </button>
                    {Key && (
                        <div className="key-display">
                            {/* <p>Encryption Key: {Key}</p> */}
                        </div>
                    )}

                </div>
            )}
        </div>


    );
};
export default Image_in_image;
