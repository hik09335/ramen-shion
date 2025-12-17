import { cmsClient, getMenu, MenuList, MenuType, Menu, FeatureType, MainContent } from '@/libs/microcms';
import { MenuListRenderer } from './menu/page';
import SectionWrapper from './components/section_wrapper';

export default async function Home() {
	const menuList = await getMenu({menuType: MenuType.Food});
	const filter = (m:Menu, index:number) => {return index < 3};
	return (
		<SectionWrapper title='当店のおすすめ' linkInfo={{title: 'メニュー一覧へ', relativeUrl: '/menu'}}>
			<MenuListRenderer menuList={menuList} filter={filter}/>
		</SectionWrapper>
	);
}