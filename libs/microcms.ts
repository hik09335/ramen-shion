import { createClient, GetListRequest } from "microcms-js-sdk";

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
    throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}
if (!process.env.MICROCMS_API_KEY) {
    throw new Error('MICROCMS_API_KEY is required');
}

export const cmsClient = createClient({
    serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: process.env.MICROCMS_API_KEY,
});

export interface CmsImage {
    url: string,
    height: number;
    width: number;
}

export interface Topping {
    name: string;
    price: number;
};

export enum MenuType {
    Food = '食べ物',
    Drink = '飲み物',
};

export enum FeatureType {
    None = 'なし',
    Favorite = '人気',
    Seasonal = '期間限定',
}

const featureTypeOrderMap = new Map<FeatureType, number>([
	[FeatureType.Seasonal, 0],
	[FeatureType.Favorite, 1],
	[FeatureType.None, 2],
]);

export function compareFeaturesByImportance(a:Menu, b:Menu){
    let x = featureTypeOrderMap.get( a.featureType[0] ) ?? Infinity;
    let y = featureTypeOrderMap.get( b.featureType[0] ) ?? Infinity;
    return x - y
}

export interface MainContent {
	id: string,
	content: string,
	title: string,
}

export interface Menu {
    id: string;
    name: string;
    image: CmsImage;
    description: string,
    allergies?: Array<string>;
    price: number;
    type: Array<MenuType>;
    toppings?: Array<Topping>;
    featureType: Array<FeatureType>;
};

export type MenuList = Array<Menu>;

export interface MenuQuery {
    menuType?: MenuType,
    featureType?: FeatureType,
    maxCount?: number,
}

export async function getMenu({menuType, featureType, maxCount}: Partial<MenuQuery> = {}):Promise<MenuList> {
    const data = await cmsClient.getList({
        endpoint: 'menu',
        queries: {
            filters: menuType ? `type[contains]${menuType}` : undefined,
            limit: maxCount ? maxCount : undefined,
        }
    });
    return data.contents;
};