import React, { useState, useRef } from "react";
import DragDrop from "./DragDrop3";
import Multi from "../assets/multi.png"
import Variable from "../assets/variable.png"
import Lock from "../assets/lock.png"
import Auto from "../assets/auto.png"

const TextInImageDecryption = () => {
    const [Technique, setTechnique] = useState("");
    const [BitShift, setBitShift] = useState(null);
    const [Key, setKey] = useState("");
    const [Image, setImage] = useState(null);
    const [decryptedText, setDecryptedText] = useState("");
    const [uploadedImage, setUploadedImage] = useState(null);
    const [Original, setOriginal] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const keyInputRef = useRef(null);

    const handleCopyClick = () => {
        const key = keyInputRef.current.value;
        navigator.clipboard.writeText(key);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset tooltip after 2 seconds
    };



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
        if (!Image || !Technique) {
            return false;
        }

        if (Technique === 'multi-bit' && BitShift === null) {
            return false;
        }

        if (Technique === 'encryption' && Key === "") {
            return false;
        }

        if (Technique === 'variable' && Original === null) {
            return false;
        }

        return true;
    };



    const handleDecryptClick = async () => {
        const formData = new FormData();
        formData.append('image', Image);
        formData.append('technique', Technique);
        if (Technique === 'multi-bit') {
            formData.append('bitShift', BitShift);
        } else if (Technique === 'encryption') {
            formData.append('key', Key);
        }
        else if (Technique === 'variable') {
            formData.append('original', Original)
        }
        if (Technique === 'multi-bit' || Technique === 'encryption') {

            try {
                const response = await fetch('http://localhost:5000/text-image-decrypt', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const jsonResponse = await response.json();
                    setDecryptedText(jsonResponse.decrypted_text);
                    setUploadedImage(URL.createObjectURL(Image));
                } else {
                    console.error('Failed to decrypt the image', response.status);
                }
            } catch (error) {
                console.error('Error while decrypting the image', error);
            }
        }
        else if (Technique === 'variable') {
            try {
                const response = await fetch('http://localhost:5000/api/pvr-decrypt', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const jsonResponse = await response.json();
                    setDecryptedText(jsonResponse.decrypted_text);
                    setUploadedImage(URL.createObjectURL(Image));
                } else {
                    console.error('Failed to decrypt the image', response.status);
                }
            } catch (error) {
                console.error('Error while decrypting the image', error);
            }
        }
    };

    return (
        <div className="flex flex-col h-full w-full py-10 px-10 items-center">

            {uploadedImage && decryptedText ? (
                <>
                    <div className="flex justify-center">
                        <h1 className="text-5xl font-bold text-black mt-[2rem] font-poppins">Image Decrypted Successfully</h1>
                    </div>
                    <div className="decrypted-info flex justify-center items-center flex-col h-[40rem]">
                        <img src={uploadedImage} alt="Uploaded" className="w-full h-[32rem] border-8 border-[#042249] rounded-md" />
                        <div className="w-full flex justify-start mb-2">
                            <h1 className="mt-4 font-bold">
                                Decrypted Text
                            </h1>
                        </div>
                        <div className="flex items-center w-full">

                            <input
                                ref={keyInputRef}
                                type="text"
                                className="input input-bordered w-full"
                                value={decryptedText}
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
                    </div>
                </>
            ) : (
                <>
                    <div className="flex justify-center">
                        <h1 className="text-5xl font-bold text-black mt-[2rem] font-poppins">Decrypt Text from Image</h1>
                    </div>
                    <DragDrop setPicture={setImage} />
                    <div className="flex justify-center">
                        <h1 className="text-2xl font-bold text-black mt-[2rem] mb-[1rem] font-poppins">Choose the technique adopted for encryption</h1>
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
                                    onChange={(e) => {
                                        handleTechniqueChange(e);
                                        setKey("");
                                    }}

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

                            {Technique === 'variable' && (

                                <label className="form-control w-full max-w-xs absolute right-[19rem] bottom-[10rem]">
                                    <div className="label">
                                        <span className="label-text">Upload original image</span>
                                    </div>
                                    <input
                                        type="file"
                                        className="file-input file-input-bordered file-input-error w-full max-w-xs "
                                        onChange={(e) => setOriginal(e.target.files[0])}
                                    />
                                </label>


                            )}
                            <li>
                                <input
                                    type='radio'
                                    id='variable'
                                    name='radio-10'
                                    value='variable'
                                    className='hidden peer'
                                    required
                                    onChange={(e) => {
                                        handleTechniqueChange(e);
                                        setKey("");
                                    }}
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

                            {Technique === 'encryption' && (
                                <div className="key-input mt-4">
                                    <input type="text" placeholder="Enter Encrytion Key" className="input input-bordered focus:outline-green-600 focus:border-green-600 w-full max-w-xs text-green-600  absolute left-[27rem] bottom-10" onChange={handleKeyChange} />
                                </div>
                            )}

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
                                    onChange={
                                        handleTechniqueChange
                                    }
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
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 absolute right-[3rem] bottom-8"
                            onClick={handleDecryptClick}
                        >
                            Decrypt
                        </button>
                    )}
                </>)}
        </div>
    );
};

export default TextInImageDecryption;