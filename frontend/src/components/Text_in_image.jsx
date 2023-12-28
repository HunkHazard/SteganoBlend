import React from "react";
import DragDrop from "./DragDrop";
import { useState, useEffect } from "react";
import Tick from "../assets/correct.png";
import Multi from "../assets/multi.png"
import Variable from "../assets/variable.png"
import Lock from "../assets/lock.png"
import Auto from "../assets/auto.png"

const Text_in_image = () => {
    const [Technique, setTechnique] = useState("")
    const [Text, setText] = useState("")
    const [BitShift, setBitShift] = useState(null);
    const [Image, setImage] = useState(null)
    const [processedImageData, setProcessedImageData] = useState(null);
    const [Key, setKey] = useState(null);


    const handleTechniqueChange = (e) => {
        setTechnique(e.target.value);
    };


    const handleTextChange = (e) => {
        setText(e.target.value);
    };
    const handleBitShiftChange = (e) => {
        setBitShift(e.target.value);
    };

    const handleButtonClick = async () => {
        if (!Image || !Text || !Technique) {
            alert('Please complete all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('image', Image); // Image should be a File object
        formData.append('text', Text);
        formData.append('technique', Technique);
        if (Technique === 'multi-bit' && BitShift) {
            formData.append('bitShift', BitShift);
        }

        if (Technique === "multi-bit" || Technique === "encryption") {

            try {
                const response = await fetch('http://localhost:5000/text-image-encrypt', {
                    method: 'POST',
                    body: formData, // Sending the FormData object
                });

                if (response.ok) {
                    const jsonResponse = await response.json();
                    if (jsonResponse.image) {
                        setKey(jsonResponse.key)
                        setProcessedImageData(jsonResponse.image);
                    }

                } else {
                    // Handle HTTP errors
                    console.error('Failed to send data', response.status);
                }
            } catch (error) {
                console.error('Error while sending data', error);
            }
        }
        else if (Technique === "variable") {
            try {
                const response = await fetch('http://localhost:5000/api/pvr-encrypt', {
                    method: 'POST',
                    body: formData, // Sending the FormData object
                });

                if (response.ok) {
                    const jsonResponse = await response.json();
                    console.log(jsonResponse)
                    if (jsonResponse.encrypted_image) {
                        setProcessedImageData(jsonResponse.encrypted_image);
                    }

                } else {
                    // Handle HTTP errors
                    console.error('Failed to send data', response.status);
                }
            } catch (error) {
                console.error('Error while sending data', error);
            }
        }
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
                <h1 className="text-5xl font-bold text-black mt-[2rem]">Embed Text in Image</h1>
            </div>
            {!processedImageData ? (
                <>
                    {!Image ? (
                        <div className="flex flex-col h-full w-full items-center">
                            <DragDrop setPicture={setImage} />
                            <div className="w-[70%] h-[20%] flex justify-between mt-4">
                                <h1 className="text-md font-poppins w-[60%]">
                                    Embrace the clandestine artistry of our Text in Image steganography. Concealing words within pixels, we weave hidden narratives into visual canvases. Harness the power to encode messages seamlessly into images, where every pixel holds encrypted stories. Unlock this fusion of art and security, where images become vessels for covert communication, revealing tales only to the vigilant eye that decodes them.
                                </h1>
                                <div className="flex flex-col">
                                    <h1 className="text-sm font-poppins mb-4">
                                        <img src={Tick} alt="tick" className="h-6 w-6 inline-block mr-2" />
                                        For Mac, Windows, Linux, iOS, and Android
                                    </h1>
                                    <h1 className="text-sm font-poppins mb-4">
                                        <img src={Tick} alt="tick" className="h-6 w-6 inline-block mr-2" />
                                        Seamlessly embed scanned text into images
                                    </h1>
                                    <h1 className="text-sm font-poppins mb-4">
                                        <img src={Tick} alt="tick" className="h-6 w-6 inline-block mr-2" />
                                        Effortless Hidden Message Decryption
                                    </h1>

                                </div>
                            </div>
                        </div>
                    ) : (

                        <div className="flex flex-col justify-start h-full w-[70%] mt-12">
                            <span className="text-xl font-poppins mt-12 mb-4 w-[30rem]">
                                Enter the text you want to hide:
                            </span>
                            <textarea className="textarea textarea-info textarea-bordered textarea-lg min-h-[10rem] max-h-[10rem] w-full" onChange={handleTextChange}></textarea>
                            <div className="flex justify-center">
                                <h1 className="text-2xl font-bold text-black mt-[2rem] mb-[1rem]">Choose the technique to be implemented</h1>
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
                                            onChange={handleTechniqueChange}

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
                                            onChange={handleTechniqueChange}
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
                                            onChange={handleTechniqueChange}
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
                                            onChange={handleTechniqueChange}
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
                            {Text && Technique && (
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute bottom-4 right-4"
                                    onClick={handleButtonClick}>
                                    Embed Text
                                </button>
                            )}
                        </div>
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
                            <p>Encryption Key: {Key}</p>
                        </div>
                    )}

                </div>
            )}

        </div>
    );
};
export default Text_in_image;
