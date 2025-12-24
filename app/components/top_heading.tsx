'use client';
import { usePathname } from "next/navigation";
import Image from "next/image";
import bgImage from '../../public/bg/ramen.jpg';
import bgBigImage from '../../public/bg/ramen_big.jpg';
import { useEffect, useState } from "react";

export default function TopHeadingText({htmlText}: {htmlText: string}) {
    const isVisible = ['', '/'].includes(usePathname());
    const [isSM, setIsSM] = useState(true);
    useEffect(()=>{
        setIsSM(window.innerWidth < 640);
        window.addEventListener("resize", ()=>{setIsSM(window.innerWidth < 640)})
    }, []);
    return (
        <div className={`flex flex-col place-items-center relative mb-15 sm:h-[calc(100vh-4rem)] w-full ${isVisible ? 'block' : 'hidden'}`}>
            <Image
                src={isSM ? bgImage : bgBigImage}
                alt="ラーメンの背景"
                loading="eager"
                placeholder="blur"
                className="sm:absolute h-[50vh] sm:h-full object-cover"
            />
            <div className="w-[min(90%,var(--container-5xl))] relative sm:top-[50%] sm:-translate-y-[50%]">
                <div dangerouslySetInnerHTML={{__html: htmlText}}
                    className={`
                        fetched-content w-full
                        sm:backdrop-blur-sm sm:w-100 pt-10 pb-10 rounded-2xl leading-loose max-sm:text-center
                    `}
                />
            </div>
        </div>
    );
}