import { getMenu, cmsClient, Menu, Topping } from "@/libs/microcms";
import { RamenIcon } from "../page";
import SectionWrapper from "@/app/components/section_wrapper";
import Image from "next/image";

export default async function MenuDetailPage({
    params,
} :{
    params: Promise<{slug:string}>
}) {
    const {slug} = await params;
    const food:Menu = await cmsClient.get({endpoint: 'menu', contentId: slug});
    return (
        <SectionWrapper title={food.name}>
            <MenuDetail menu={food}/>
        </SectionWrapper>
    );
}

function MenuDetail({menu}: {menu: Menu}) {
    const isFree = menu.price <= 0
	return (
		<div className='flex flex-wrap justify-center md:flex-nowrap gap-x-4'>
            <Image
                src={menu?.image?.url}
                alt={menu.name}
                width={200}
                height={200}
                className="aspect-square w-11/12 max-w-120"
            />
            <div className="flex flex-col justify-between mt-5">
                <div className="flex flex-col gap-4 max-md:place-items-center">
                    <p className='w-fit break-all text-xl'>{menu.description}</p>
                    {menu?.toppings && <ToppingDetailsList toppings={menu.toppings}/>}
                    <p className="text-3xl">{isFree ? '無料' : `${menu.price}`}<span className="text-lg">円(税込)</span></p>
                </div>
                {menu?.allergies && <AllergyDetailsList allergies={menu.allergies}/>}
            </div>
            
		</div>
	);
}

function AllergyDetailsList({allergies}: {allergies: Array<string>}) {
	if (!allergies.length) {
		return;
	}
	return (
        <div className="flex mt-8 items-center gap-2 max-md:place-content-center">
            <p className="font-bold">アレルギー(特定原材料)</p>
            <ul className='flex gap-0.5 right-0.5 bottom-0.5'>
                {allergies.join('、')}
            </ul>
        </div>
	);
}

function ToppingDetailsList({toppings}: {toppings: Topping[]}) {
	if (!toppings.length) {
		return;
	}
	return (
        <dl className='flex gap-0.5 right-0.5 bottom-0.5 items-center flex-wrap max-md:place-content-center'>
            {toppings.sort((a,b)=>a.price - b.price).map((a) => (
                <div className="border rounded-md px-1.5" key={a.name}>
                    <dt className='' key={a.name}>{a.name}</dt>
                    <dd className="text-sm text-nowrap">{a.price > 0 ? `(+${a.price}円)` : '(無料)'}</dd>
                </div>
            ))}
        </dl>
	);
}

export async function generateStaticParams() {
    const menuList = await cmsClient.getAllContentIds({ endpoint: 'menu' });
    return menuList.map((menu) => ({
        slug: menu,
    }))
}