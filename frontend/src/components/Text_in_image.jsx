import React from "react";
import DragDrop from "./DragDrop";
import { useState } from "react";
import Tick from "../assets/correct.png";

const Text_in_image = () => {

    const [Upload, setUpload] = useState(false);

    return (
        <div className="flex flex-col h-full w-full py-10 px-10 items-center">
            <div className="flex justify-center">
                <h1 className="text-5xl font-bold text-black mt-[3rem]">Embed Text in Image</h1>
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
                    <span className="text-xl font-poppins mt-8 mb-4 w-[30rem]">
                        Choose the technique you want to implement:
                    </span>
                </div>
            )}


        </div>
    );
};
export default Text_in_image;
