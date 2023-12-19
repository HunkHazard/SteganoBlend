import React from "react";
import { Route, Routes } from "react-router-dom";
import TinI from "./components/Text_in_image";
import IinI from "./components/Image_in_image";
import Home from "./components/Home";
export default function AppContent() {
    return (
        <>
            <div
                className="flex justify-center items-center h-[92vh]"
            >
                <Routes>
                    <Route key={"textInImage"} path={"/text-in-image"} element={<TinI />} />
                    <Route key={"imageInImage"} path={"/image-in-image"} element={<IinI />} />
                    <Route key={"home"} path={"/"} element={<Home />} />

                </Routes>
            </div>
        </>
    );
}
