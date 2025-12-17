import { cmsClient, getMenu, MenuList, Menu, FeatureType, compareFeaturesByImportance, MenuType } from '@/libs/microcms';
import Image from 'next/image';
import Link from 'next/link';
import favoriteIcon from '../../public/feature_icons/favorite.svg';
import seasonalIcon from '../../public/feature_icons/seasonal.svg';
import SectionWrapper from '../components/section_wrapper';

export default async function MenuListPage({
    params,
} :{
    params: Promise<{slug:string}>
}) {
    const {slug} = await params;
    const menuList = await getMenu();
	const foods = menuList.filter((m)=>{return m.type[0] == MenuType.Food});
	const drinks = menuList.filter((m)=>{return m.type[0] == MenuType.Drink});
    return (
		<article>
			<SectionWrapper title='お食事'>
				<MenuListRenderer menuList={foods}/>
			</SectionWrapper>
			<SectionWrapper title='飲み物'>
				<MenuListRenderer menuList={drinks}/>
			</SectionWrapper>
		</article>
    );
}

type MenuFilter = (menu:Menu, index:number) => boolean

export function MenuListRenderer({menuList, filter}:{menuList:MenuList, filter?:MenuFilter|null|undefined}) {
	const filterFn = filter ? filter : ()=>true;
	return (
		<div className='flex flex-wrap justify-center gap-y-4 gap-x-4'>
			{menuList.sort(compareFeaturesByImportance).filter(filterFn).map((m, i) => (
				<MenuRenderer menu={m} index={i} key={m.name} />
			))}
		</div>
	);
}

export function MenuRenderer({menu, index}: {menu: Menu, index:number}) {
	const menuUrl = `/menu/${menu.id}`;
	return (
		<div className={`w-80 group shadow-gray-400 shadow hover:shadow-amber-700 hover:shadow-md transition-all rounded-2xl animate-appear`}>
			<Link href={menuUrl} /*prefetch={false}*/ className='block justify-items-center size-full p-4'>
				<h3 className='text-2xl mb-2 border-b border-transparent group-hover:border-black transition-colors'>{menu.name}</h3>
				<RamenIcon  menu={menu}/>
				<p className='mt-4'>{menu.description}</p>
				<p className='mt-4 text-[20px]'>{menu.price > 0 ? `${menu.price}円` : '無料'}</p>
			</Link>
		</div>
	);
}

export function RamenIcon({menu}: {menu: Menu}) {
	const imageUrl = menu?.image?.url;
	return (
		<div className='relative w-full aspect-square shrink-0'>
			<img src={imageUrl} alt={menu.name} loading='lazy' className='w-full h-auto aspect-square' />
			{menu?.allergies && <AllergiesList	allergies	= {menu.allergies}/>}
			<FeatureIcon	featureType = {menu.featureType[0]} />
		</div>
	);
}

export function AllergiesList({allergies}: {allergies: Array<string>}) {
	if (!allergies.length) {
		return;
	}
	return (
		<ul className='flex gap-0.5 absolute right-0.5 bottom-0.5'>
			{allergies.map((a) => (
				<li className='text-neutral-50 bg-black px-1.5' key={a}>{a}</li>
			))}
		</ul>
	);
}

function FeatureIcon({featureType}: {featureType:FeatureType}) {
	if (featureType === FeatureType.None) { return };
	const icon = featureType === FeatureType.Seasonal ? seasonalIcon : favoriteIcon;
	return (
		<Image
			src={icon}
			alt='人気商品'
			width={16}
			height={16}
			className='size-15 sm:size-20 absolute top-0 left-0'
            // unoptimized={true}
		/>
	);
}