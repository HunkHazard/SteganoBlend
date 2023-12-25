import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

const Navbar = () => {
    return (
        <div className="navbar bg-[#042249] h-[10vh] text-white drop-shadow-lg">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        <li>
                            <Link>Item 1</Link>
                        </li>
                        <li>
                            <Link>Parent</Link>
                            <ul className="p-2">
                                <li>
                                    <Link>Submenu 1</Link>
                                </li>
                                <li>
                                    <Link>Submenu 2</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link>Item 3</Link>
                        </li>
                    </ul>
                </div>
                <Link to={"/"} className="text-2xl font-normal font-poppins flex text-white justify-center items-center ml-[2rem]">
                    <img src={Logo} alt="logo" className="w-[3.5rem] h-[3.5rem] mr-[1rem]" />
                    SteganoBlend
                </Link>
            </div>
            <div className="navbar-end hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-white font-poppins text-lg font-bold">
                    <li className="mr-2 hover:text-[#1494ff]">
                        <Link to={"/"} >Home</Link>
                    </li>
                    <li className="mr-2 hover:text-[#1494ff] ">
                        <Link >Tools</Link>
                    </li>

                    <li className="mr-2 hover:text-[#1494ff]">
                        <Link >About</Link>
                    </li>
                    <li className="mr-2 hover:text-[#1494ff]">
                        <Link>Contact us</Link>
                    </li>
                </ul>
                <div className="flex">
                    <a href="#" className="rounded-full bg-[#e1f2f5] text-[#245870] font-poppins font-bold w-[5rem] flex justify-center items-center mx-[2rem] hover:bg-[#cfe4e9] active:bg-[#b7d3dc] transition duration-300 ease-in-out">
                        Start
                    </a> <a href="#" className="rounded-full bg-[#1494ff] text-white font-poppins font-bold w-[6rem] h-[2.5rem] justify-center items-center flex mr-[2rem] hover:bg-[#318a96] active:bg-[#2c7c85] transition duration-400 ease-in-out">
                        Sign In
                    </a>
                </div>
            </div>
        </div>
    );
};
export default Navbar;
