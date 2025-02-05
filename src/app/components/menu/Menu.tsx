"use client";

import {useState} from "react";
import Link from "next/link";

export interface MenuProps {
    defaultOpenState: boolean;
}

export const Menu = (props: MenuProps) => {

    const { defaultOpenState } = props;

    const [isOpen, setIsOpen] = useState(defaultOpenState);

    const toggleOpen = () => {
        setIsOpen(curOpen => !curOpen);
    };

    return (
        <div>
            <button className="bg-green-500 rounded-md p-[4px]" onClick={toggleOpen}>MENU</button>
            <div className={"flex justify-center gap-[10px] underline transition-opacity duration-1000 ease-in-out " + (isOpen ? "opacity-100" : "opacity-0")}>
                <Link href={"/"}>Today</Link>
                <Link href={"/tomorrow"}>Tomorrow</Link>
                <button>Page 2</button>
            </div>
        </div>
    );
};