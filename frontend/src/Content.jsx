import React from "react";
import { Route, Routes } from "react-router-dom";
import TinI from "./components/Text_in_image";
export default function AppContent() {
    return (
        <>
            <div
                className="flex justify-center items-center h-[92vh]"
            >
                <Routes>
                    <Route key={"textInImage"} path={"/text-in-image"} element={<TinI />} />

                </Routes>
            </div>
        </>
    );
}
