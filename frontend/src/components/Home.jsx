import React from "react";
import print from "../assets/print.png";
import privates from "../assets/privates.png";
import logo from "../assets/logo.png";
import decIm from "../assets/decrypt-image.png";
import encIm from "../assets/encrypt-image.png";
import dectext from "../assets/decrypt-text.png";
import entext from "../assets/encrypt-text.png";
const Home = () => {
    return (
        <div className="flex h-full w-screen">
            <div className="flex flex-col items-center justify-center w-[50%]">
                <div className="flex items-center">
                    <img src={logo} alt="logo" className="h-[6rem] w-[6rem] mx-4" />
                    <h1 className="text-6xl font-bold font-poppins">SteganoBlend</h1>
                </div>
                <p className="text-xl font-roboto font-bold mt-4 w-[60%] mb-12">
                    Unlock hidden messages within pixels with SteganoBlend, mastering the art of digital concealment.
                </p>
                <p className="text-2xl font-bold font-poppins mt-12 w-[70%] text-center">
                    Our most famous tools
                </p>
                <div className="grid grid-rows-2 grid-flow-col gap-4 mt-4 font-poppins">
                    <div className="card w-[21rem] bg-base-100 shadow-xl ">
                        <a href="/text-in-image" className="card-body text-center border-2 rounded-lg hover:border-purple-500 duration-500 cursor-pointer">
                            <img src={entext} alt="ecrypt text" className="h-[4rem] w-[4rem] mx-auto mb-2" />
                            <p className="font-semibold text-lg">Encrypt Text into Image</p>
                        </a>

                    </div>

                    <div className="card w-[21rem] bg-base-100 shadow-xl">
                        <a href="/image-in-image" className="card-body text-center border-2 rounded-lg hover:border-red-500 duration-500 cursor-pointer">
                            <img src={encIm} alt="Embed Image" className="h-[4rem] w-[4rem] mx-auto mb-2" />
                            <p className="font-semibold text-lg">Embed Image into Image</p>
                        </a>

                    </div>
                    <div className="card w-[21rem] bg-base-100 shadow-xl ">
                        <a href="/text-from-image" className="card-body text-center border-2 rounded-lg hover:border-blue-500 duration-500 cursor-pointer">
                            <img src={dectext} alt="decrypt text" className="h-[4rem] w-[4rem] mx-auto mb-2" />
                            <p className="font-semibold text-lg">Decrypt Text from Image</p>
                        </a>

                    </div>
                    <div className=" flex card w-[21rem] bg-base-100 shadow-xl ">
                        <a href="/image-from-image" className="flex card-body text-center border-2 rounded-lg hover:border-green-500 duration-500 cursor-pointer">
                            <img src={decIm} alt="decrypt Image" className="h-[4rem] w-[4rem] mx-auto mb-2" />
                            <p className="font-semibold text-lg">Decrypt Image From Image</p>
                        </a>

                    </div>

                </div>
            </div>
            <div className="flex flex-col items-center justify-center w-[50%]">
                <img src={privates} alt="private" className="h-[23rem] w-[23rem]" />
                <img src={print} alt="print" className="h-[18rem] w-[18rem] relative bottom-[4rem] right-[10rem]" />
            </div>

        </div>
    );
}
export default Home;