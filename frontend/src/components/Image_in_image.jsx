import React from "react";
import DragDrop3 from "./DragDrop3";
import DragDrop2 from "./DragDrop2"
import { useState, useRef } from "react"
import Multi from "../assets/multi.png"
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
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const keyInputRef = useRef(null);
    const [usedTechnique, setUsedTechnique] = useState('');


    const handleCopyClick = () => {
        const key = keyInputRef.current.value;
        navigator.clipboard.writeText(key);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset tooltip after 2 seconds
    };



    const handleTechniqueChange = (e) => {
        setTechnique(e.target.value);
    };


    // const handleSubmit = async () => {
    //     setIsLoading(true); // Start loading
    //     const formData = new FormData();
    //     let selectedTechnique = Technique;
    //     if (Technique === 'multi-bit') {
    //         formData.append('original', Original);
    //         formData.append('hidden', Hidden);
    //         formData.append('bits', BitShift);

    //         try {

    //             const response = await fetch('http://localhost:5000/api/encode', {
    //                 method: 'POST',
    //                 body: formData,
    //             });

    //             if (response.ok) {
    //                 const jsonResponse = await response.json();
    //                 setProcessedImageData(jsonResponse.encoded_image);
    //                 setIsLoading(false);

    //                 // Handle the response data
    //                 console.log(jsonResponse);
    //             } else {
    //                 console.error('Failed to send data', response.status);
    //             }
    //         } catch (error) {
    //             console.error('Error while sending data', error);
    //         }
    //     }
    //     else if (Technique === 'encryption') {
    //         formData.append('original', Original);
    //         formData.append('hidden', Hidden);

    //         try {

    //             const response = await fetch('http://localhost:5000/api/randomAlgoEncrypt', {
    //                 method: 'POST',
    //                 body: formData,
    //             });

    //             if (response.ok) {
    //                 const jsonResponse = await response.json();
    //                 setProcessedImageData(jsonResponse.encrypted_image);
    //                 setKey(jsonResponse.combined_key);
    //                 setIsLoading(false);

    //                 // Handle the response data
    //                 console.log(jsonResponse);
    //             } else {
    //                 console.error('Failed to send data', response.status);
    //             }
    //         } catch (error) {
    //             console.error('Error while sending data', error);
    //         }
    //     }
    //     else if (Technique === 'auto-pick') {
    //         const techniques = ['multi-bit', 'encryption'];
    //         const randomIndex = Math.floor(Math.random() * techniques.length);
    //         setChosenTechnique(techniques[randomIndex]);

    //         if (chosenTechnique === 'multi-bit') {
    //             const randomBitShift = Math.floor(Math.random() * 4) + 1; // Random number between 1 and 4
    //             setBitShift(randomBitShift);
    //             formData.append('original', Original);
    //             formData.append('hidden', Hidden);
    //             formData.append('bits', BitShift);
    //             setUsedTechnique(`Multi-bit with ${BitShift} BitShift`);
    //             try {
    //                 const response = await fetch('http://localhost:5000/api/encode', {
    //                     method: 'POST',
    //                     body: formData,
    //                 });
    //                 if (response.ok) {
    //                     const jsonResponse = await response.json();
    //                     setProcessedImageData(jsonResponse.encoded_image);
    //                     setIsLoading(false);

    //                     // Handle the response data
    //                     console.log(jsonResponse);
    //                 } else {
    //                     console.error('Failed to send data', response.status);
    //                 }
    //             }
    //             catch (error) {
    //                 console.error('Error while sending data', error);
    //             }


    //         }
    //         else if (chosenTechnique === 'encryption') {
    //             formData.append('original', Original);
    //             formData.append('hidden', Hidden);
    //             setUsedTechnique('Random Encryption');
    //             try {

    //                 const response = await fetch('http://localhost:5000/api/randomAlgoEncrypt', {
    //                     method: 'POST',
    //                     body: formData,
    //                 });

    //                 if (response.ok) {
    //                     const jsonResponse = await response.json();
    //                     setProcessedImageData(jsonResponse.encrypted_image);
    //                     setKey(jsonResponse.combined_key);
    //                     setIsLoading(false);

    //                     // Handle the response data
    //                     console.log(jsonResponse);
    //                 } else {
    //                     console.error('Failed to send data', response.status);
    //                 }
    //             } catch (error) {
    //                 console.error('Error while sending data', error);
    //             }
    //         }
    //     };
    // }
    const handleSubmit = async () => {
        setIsLoading(true); // Start loading
        const formData = new FormData();
        let selectedTechnique = Technique;
        let selectedBitShift = BitShift;

        if (Technique === 'auto-pick') {
            const techniques = ['multi-bit', 'encryption'];
            const randomIndex = Math.floor(Math.random() * techniques.length);
            selectedTechnique = techniques[randomIndex];

            if (selectedTechnique === 'multi-bit') {
                selectedBitShift = Math.floor(Math.random() * 4) + 1; // Random number between 1 and 4
            }
        }

        formData.append('original', Original);
        formData.append('hidden', Hidden);

        if (selectedTechnique === 'multi-bit') {
            formData.append('bits', selectedBitShift);
            try {
                const response = await fetch('http://localhost:5000/api/encode', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    const jsonResponse = await response.json();
                    setProcessedImageData(jsonResponse.encoded_image);
                    setIsLoading(false);

                    // Handle the response data
                    console.log(jsonResponse);
                } else {
                    console.error('Failed to send data', response.status);
                }
            } catch (error) {
                console.error('Error while sending data', error);
            }
        } else if (selectedTechnique === 'encryption') {
            try {
                const response = await fetch('http://localhost:5000/api/randomAlgoEncrypt', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    const jsonResponse = await response.json();
                    setProcessedImageData(jsonResponse.encrypted_image);
                    setKey(jsonResponse.combined_key);
                    setIsLoading(false);

                    // Handle the response data
                    console.log(jsonResponse);
                } else {
                    console.error('Failed to send data', response.status);
                }
            } catch (error) {
                console.error('Error while sending data', error);
            }
        }

        setUsedTechnique(selectedTechnique === 'multi-bit' ? `Multi-bit with ${selectedBitShift} BitShift` : 'Random Encryption');
        setIsLoading(false);
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

            {!processedImageData ? (
                <>
                    <div className="flex justify-center">
                        <h1 className="text-5xl font-bold text-black mt-[0.5rem] font-poppins">Embed Image into Image</h1>
                    </div>
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
                            <h1 className="text-2xl font-bold text-black mt-[1rem] mb-[1rem] font-poppins">Choose the technique to be implemented</h1>
                        </div>
                        <ul>
                            <div className="flex justify-center mt-4">

                                {Technique === 'multi-bit' && (
                                    <div className="bit-shift-options flex justify-center mt-4 absolute left-[32rem]">
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
                                        onClick={handleTechniqueChange}
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
                                <li>
                                    <input
                                        type='radio'
                                        id='auto-pick'
                                        name='radio-10'
                                        value='auto-pick'
                                        className='hidden peer'
                                        required
                                        onClick={handleTechniqueChange}
                                        disabled={isLoading}
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
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 absolute right-[3rem] bottom-[2rem] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Encrypt Image'}
                        </button>
                    )}
                </>
            ) : (
                // Render Processed Image and Download Button
                <>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-5xl font-bold text-black mt-[0.5rem] font-poppins">Image Embedded Successfully</h1>

                        {usedTechnique && (
                            <div className="w-full flex justify-center">
                                <h1 className="text-2xl font-bold text-black mt-[0.5rem] font-poppins ml-4">Technique used: {usedTechnique}</h1>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center items-center flex-col h-[40rem]">
                        <img src={`data:image/jpeg;base64,${processedImageData}`} alt="Processed" className="w-full h-[32rem] border-8 border-[#042249] rounded-md" />
                        <button onClick={handleDownloadClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute right-[3rem] bottom-[3rem]">
                            Download Image
                        </button>
                        {Key && (
                            <div className="flex items-center mt-4 w-full">
                                <input
                                    ref={keyInputRef}
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={Key}
                                    disabled
                                />
                                <button
                                    onClick={handleCopyClick}
                                    className="btn btn-square ml-2"
                                >
                                    Copy
                                </button>
                                {isCopied && (
                                    <span className="tooltip absolute right-[40rem]">Text copied</span>
                                )}
                            </div>
                        )}

                    </div>
                </>
            )}
        </div>


    );
};
export default Image_in_image;
