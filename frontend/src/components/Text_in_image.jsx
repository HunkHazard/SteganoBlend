import React from "react";
import DragDrop from "./DragDrop";
import { useState } from "react";
import Tick from "../assets/correct.png";
import Multi from "../assets/multi.png"
import Variable from "../assets/variable.png"
import Lock from "../assets/lock.png"
import Auto from "../assets/auto.png"

const Text_in_image = () => {

    const [Upload, setUpload] = useState(false);

    return (
        <div className="flex flex-col h-full w-full py-10 px-10 items-center">
            <div className="flex justify-center">
                <h1 className="text-5xl font-bold text-black mt-[2rem]">Embed Text in Image</h1>
            </div>
            {Upload ? (
                <div className="flex flex-col h-full w-full items-center">
                    <DragDrop />
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
                    <textarea className="textarea textarea-info textarea-bordered textarea-lg min-h-[10rem] max-h-[10rem] w-full" ></textarea>
                    <div className="flex justify-center">
                        <h1 className="text-2xl font-bold text-black mt-[2rem] mb-[1rem]">Choose the technique to be implemented</h1>
                    </div>
                    <ul>
                        <div className="flex justify-center mt-4">
                            <li>
                                <input
                                    type='radio'
                                    id='multi-bit'
                                    name='radio-10'
                                    value='multi-bit'
                                    className='hidden peer'
                                    required
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
            )}


        </div>
    );
};
export default Text_in_image;
