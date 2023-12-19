import React from "react";
import print from "../assets/print.png";
import privates from "../assets/privates.png";
import logo from "../assets/logo.png";

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
                <div className="grid grid-rows-2 grid-flow-col gap-4 mt-4">
                    <div className="card w-[20rem] bg-base-100 shadow-xl">
                        <div className="card-body">
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                        </div>
                    </div>
                    <div className="card w-[20rem] bg-base-100 shadow-xl">
                        <div className="card-body">
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                        </div>
                    </div>
                    <div className="card w-[20rem] bg-base-100 shadow-xl">
                        <div className="card-body">
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                        </div>
                    </div>
                    <div className="card w-[20rem] bg-base-100 shadow-xl">
                        <div className="card-body">
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                        </div>
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