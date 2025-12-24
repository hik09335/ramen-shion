import { ReactNode } from "react";
import rightArrowImage from '../../public/nav/right_arrow.svg'
import Image from "next/image";
import Link from 'next/link';

export interface LinkInfo {
    title: string,
    relativeUrl: string,
}

export default function SectionWrapper({title, linkInfo=null, children}: {title:string, children: ReactNode, linkInfo?:LinkInfo|null|undefined}) {
    return (
        <section className="mb-15 mt-15 sm:mb-30 sm:mt-30">
            <h2 className='text-4xl font-bold mb-8 sm:mb-15 flex items-center gap-x-5 whitespace-nowrap'>
                <span className='inline-block h-px w-full bg-black'/>
                <span>{title}</span>
                <span className='flex w-full items-center'>
                    <span className='inline-block h-px w-full bg-black'/>
                    {/* PCのみ表示 */}
                    {linkInfo &&
                        <Link href={linkInfo.relativeUrl} className="md:inline-block hidden group border-2 border-black rounded-md pl-2 bg-orange-700 transition-colors hover:bg-transparent">
                            <div className="flex size-max">
                                <span className='font-normal text-white text-2xl group-hover:text-orange-700 transition-colors'>{linkInfo.title}</span>
                                <Image src={rightArrowImage} alt={linkInfo.title} className='animate-right'/>
                            </div>
                        </Link>
                    }
                </span>
            </h2>
            {children}
            {/* スマホのみ表示 */}
            {linkInfo &&
                <div className='flex md:hidden items-center whitespace-nowrap mt-6'>
                    <span className='inline-block h-px w-full bg-black'/>
                    <Link href={linkInfo.relativeUrl} className="md:hidden inline-block border-2 border-black rounded-md pl-2 bg-orange-700"><div className="flex size-max text-white"><span className='font-normal text-2xl'>{linkInfo.title}</span><Image src={rightArrowImage} alt={linkInfo.title} className='animate-right'/></div></Link>
                </div>
            }
        </section>
    );
}