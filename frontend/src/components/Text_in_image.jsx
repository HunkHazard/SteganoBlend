import React from "react";

const Text_in_image = () => {
    return (
        <div className="flex flex-col h-[80%] w-full py-10 px-10">
            <div className="flex justify-center">
                <h1 className="text-5xl font-bold text-black">Embed Text in Image</h1>
            </div>
            <div>
                <div className="flex">
                    <div className="flex flex-col mt-24 ml-10">
                        <div className="flex justify-center items-center h-[20rem] w-[15rem] border-2 border-black">
                            <h1 className="text-xl font-bold text-black">Image Frame</h1>
                        </div>
                        <label className="form-control w-[15rem] max-w-xs mt-4">
                            <input
                                type="file"
                                className="file-input file-input-bordered w-full max-w-xs"
                            />
                        </label>
                    </div>
                    <div>
                        <h1 className="text-5xl mt-[15rem] ml-[2rem]">+</h1>
                    </div>
                    <div className="flex flex-col mt-[8rem] ml-[2rem] w-[25rem] h-[15rem]">
                        <span className="label-text text-xl mb-2 text-black">Text to be Embeded :</span>
                        <textarea
                            placeholder="Write secret text here..."
                            className="textarea textarea-bordered textarea-lg h-full w-full min-h-full"
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Text_in_image;
