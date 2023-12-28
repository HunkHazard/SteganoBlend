import React from "react";
import { Route, Routes } from "react-router-dom";
import TinI from "./components/Text_in_image";
import TfrI from "./components/Text_from_image";
import IfrI from "./components/image_from_image";
import IinI from "./components/Image_in_image";
import Home from "./components/Home";
export default function AppContent() {
    return (
        <>
            <div
                className="flex justify-center items-center h-[90vh]"
            >
                <Routes>
                    <Route key={"textInImage"} path={"/text-in-image"} element={<TinI />} />
                    <Route key={"textfromImage"} path={"/text-from-image"} element={<TfrI />} />
                    <Route key={"imageInImage"} path={"/image-in-image"} element={<IinI />} />
                    <Route key={"imagefromImage"} path={"/image-from-image"} element={<IfrI />} />
                    <Route key={"home"} path={"/"} element={<Home />} />

                </Routes>
            </div>
        </>
    );
}
