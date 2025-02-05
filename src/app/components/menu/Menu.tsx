"use client";

import {useState} from "react";

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
                <button>Today</button>
                <button>Tomorrow</button>
                <button>Page 2</button>
            </div>
        </div>
    );
};