'use client';
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import menuIconImage from '@/public/nav/menu_icon.svg'
import Image from "next/image";

interface NavMenu {
    title:string,
    url: string,
    isExternalLink: boolean,
}

const NAV_MENU:NavMenu[] = [
    {
        title: 'TOP',
        url: '/',
        isExternalLink: false,
    },
    {
        title: 'メニュー',
        url: '/menu',
        isExternalLink: false,
    },
    {
        title: 'Instagram',
        url: 'https://google.com',
        isExternalLink: true,
    }
];

enum Days {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
}

interface ShopState {
    text: string[],
    color: string,
}

interface ShopStates {
    [key: string]: ShopState
}

const ShopStates:ShopStates = {
    OpenAM: {
        text: ['営業中', '(14:00まで)'],
        color: 'bg-green-700',
    },
    OpenPM: {
        text: ['営業中', '(22:00まで)'],
        color: 'bg-green-700',
    },
    PreparingAM: {
        text: ['準備中', '(11:00開店)'],
        color: 'bg-green-900',
    },
    PreparingPM: {
        text: ['準備中','(17:00開店)'],
        color: 'bg-green-900',
    },
    Off: {
        text: ['休店日'],
        color: 'bg-orange-900',
    },
    Close: {
        text: ['本日の営業終了'],
        color: 'bg-orange-900',
    }
}

function getShopState(): ShopState {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const mins = now.getMinutes();
    let state = ShopStates.Off;
    if (day !== Days.Thursday) {
        if (hours < 11) {
            state = ShopStates.PreparingAM;
        }
        else if (22 <= hours) {
            state = ShopStates.Close;
        }
        else if (14 <= hours && hours < 17 ) {
            state = ShopStates.PreparingPM;
        }
        else if (11 <= hours && hours < 15) {
            state = ShopStates.OpenAM;
        }
        else if (17 <= hours && hours < 22) {
            state = ShopStates.OpenPM
        }
    }
    return state;
}

export default function GlobalNavigation({}: {}){
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    }
    
    const [shopState, setShopState] = useState(getShopState());
    setInterval(()=>{setShopState(getShopState())}, 1000);

    useEffect(()=>{
        window.addEventListener("resize", ()=>{
            setIsOpen(false);
        });
    }, []);

    return (
        <nav className="flex place-items-center place-content-center gap-4 h-full">
            <div className={`${shopState.color} rounded-md text-white px-1.5 flex flex-col place-items-center`}>
                {shopState.text.map((t)=>{
                    return <span className="block -mt-1" key={t}>{t}</span>
                })}
            </div>
            <ol className={`
                flex max-md:-z-10
                max-md:absolute max-md:top-0 max-md:flex-col
                max-md:w-screen max-md:h-screen max-md:place-content-center max-md:place-items-center max-md:gap-y-10 h-full
                transition-all ${isOpen ? 'right-0' : 'right-[-100vw]'}
            `}>
                {/* BG */}
                <div onClick={()=>setIsOpen(false)} className="hidden absolute inset-0 max-md:block bg-white/50 backdrop-blur-md" />
                {NAV_MENU.map((m)=>{
                    return <NavMenuItem navMenu={m} key={m.url} onClick={()=>setIsOpen(false)}/>
                })}
            </ol>
            <MenuToggleIcon isOpen={isOpen} onClick={toggleOpen}/>
        </nav>
    );
}

function MenuToggleIcon({isOpen, onClick}: {isOpen:Boolean, onClick?:MouseEventHandler}) {
    return (
        <button className="cursor-pointer md:hidden size-6 place-items-center" onClick={onClick}>
            <div className="w-5 h-4 flex flex-col justify-between">
                <p className={`w-full h-0.5 bg-black transition-all ${isOpen ? 'translate-y-1.75 scale-x-144 rotate-45' : ''}`}></p>
                <p className={`w-full h-0.5 bg-black transition-all ${isOpen ? 'opacity-0' : ''}`}></p>
                <p className={`w-full h-0.5 bg-black transition-all ${isOpen ? '-translate-y-1.75 scale-x-144 -rotate-45' : ''}`}></p>
            </div>
        </button>
    );
}

function NavMenuItem({navMenu, onClick}: {navMenu:NavMenu, onClick?:MouseEventHandler}){
    const currentRoute = usePathname();
    const isCurrentPage = navMenu.url === '/' ? currentRoute === navMenu.url : currentRoute.startsWith(navMenu.url);
    return (
        <li className={`relative text-2xl group max-md:w-3/4 md:pr-3 md:pl-3 max-md:min-w-max min-h-15 max-md:bg-white rounded-2xl md:rounded-b-none max-md:border-2 max-md:drop-shadow-2xl ${isCurrentPage ? 'border-gray-700 bg-gray-200' : 'border-gray-300 bg-transparent'}`}>
            <Link href={navMenu.url} onClick={onClick} className="block w-full h-full place-content-center text-center" /*prefetch={false}*/>
                <span className={`text-2xl ${isCurrentPage ? 'font-bold' : ''}`}>{navMenu.title}</span>
                <span className={`absolute left-[50%] -translate-x-6/12 bottom-0 transition-all h-0.5 bg-gray-700 group-hover:w-full ${isCurrentPage ? 'md:w-full' : 'w-0'}`}></span>
            </Link>
        </li>
    );
}