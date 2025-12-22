import type { Metadata } from "next";
import { Yuji_Syuku } from "next/font/google";
import "./globals.css";
import logoImage from '../public/logo.svg';
import { MainContent, cmsClient } from "@/libs/microcms";
import Image from "next/image";
import TopHeadingText from "./components/top_heading";
import SectionWrapper from "./components/section_wrapper";
import GlobalNavigation from "./components/navigations/global_navigation";
import Link from "next/link";

const yuji = Yuji_Syuku({
	variable: "--font-yuji-syuku",
	weight: "400",
});

export const metadata: Metadata = {
	title: "らーめん紫苑",
	description: "あっさり魚介豚骨らーめんの紫苑",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const shopInfoRes = await cmsClient.get({endpoint: 'pages', queries: {ids: ['top', 'about'], fields: ['title', 'id', 'content']}});
	const shopInfo:MainContent[]|null = shopInfoRes?.contents;
	const topPage = shopInfo?.find(e=>e.id == 'top');
	const aboutPage = shopInfo?.find(e=>e.id == 'about');

	return (
		<html lang="ja">
			<body
				className={`${yuji.className} antialiased bg-[#fafafa]`}
				suppressHydrationWarning
			>
				<header className="justify-items-center sticky top-0 bg-[#fafafa] z-50 overflow-x-clip">
					<div className="absolute drop-shadow-md drop-shadow-zinc-500 size-full bg-white -z-10"></div>
					<div className="flex items-center justify-between px-4 container">
						<Link href={'/'} className="block">
							<Image
								src={logoImage}
								alt='らーめん紫苑'
								loading='eager'
								className='w-30 sm:w-40 mb-2'
							/>
						</Link>
						<GlobalNavigation/>
					</div>
				</header>
				<main className=''>
					{
						topPage && <TopHeadingText htmlText={topPage.content}/>
					}
					<div className="container">
						{children}
					</div>
				</main>

				<footer className="justify-items-center">
					{aboutPage &&
						<div className="main__about mb-15 container">
							<SectionWrapper title={aboutPage.title}>
								<div className="flex gap-x-10 max-sm:flex-col-reverse max-sm:text-center">
									<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d103707.63186087763!2d139.76014300000003!3d35.680363!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188c0d02d8064d%3A0xd11a5f0b379e6db7!2z55qH5bGF!5e0!3m2!1sja!2sus!4v1765045150820!5m2!1sja!2sus" className="w-full max-h-[450px] h-[450px] border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
									<div className="sm:w-6/12">
										<div dangerouslySetInnerHTML={{__html: aboutPage.content}} className='fetched-content'></div>
										<address className="mt-4 mb-2 not-italic"><span>&#12306;</span>000-000 東京都千代田区千代田0-0</address>
									</div>
								</div>
							</SectionWrapper>
						</div>
					}
				</footer>
			</body>
		</html>
	);
}
