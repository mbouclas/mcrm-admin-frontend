<script lang="ts">
import { Heading, Input, Label, AccordionItem } from 'flowbite-svelte';
import { onMount } from 'svelte';
import { useParams } from "svelte-navigator";
import Fields from "../../DynamicFields/Renderer.svelte";

    import type { IEditableRegion } from '../models';

export let region: IEditableRegion;
const params = useParams();

if ($params.name !== "new") {
    console.log('edit', $params.name)
} else {
    console.log('new')
}
let model: any = {};


let models = [
    {
        "layout": "homepage",
        "settings": {},
        "created": 1686652223531,
        "region": "slider",
        "uuid": "d461f3ae-8bb4-4d09-b653-0028b58448fe",
        "items": [
            {
                "model": "Product",
                "item": {
                    "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/955D/DC2E/BFDF/376F/0A6E/0397/4C79/1031-019-P.jpg",
                    "quantity": 0,
                    "fromImport": true,
                    "description_long": "Nature line sunglasses with UV400 protection and black lenses. Wheat straw frame and legs, with Wheat Straw label to encourage the use of natural raw materials and reduce pollutant emissions. Available in a wide range of colours and presented in an attractive eco-design case.",
                    "length": 0,
                    "description": "Nature line sunglasses with UV400 protection and black lenses. Wheat straw frame and legs, with Wheat Straw label to encourage the use of natural raw materials and reduce pollutant emissions. Available in a wide range of colours and presented in an attractive eco-design case.",
                    "weight": 18,
                    "active": true,
                    "title": "Mirfat",
                    "uuid": "a03f3e4e-f053-4531-b96c-f5e4a3e4d1da",
                    "pieces": 300,
                    "createdAt": "2023-05-22T07:49:47.199Z",
                    "diameter": null,
                    "price": 1.66,
                    "width": null,
                    "categories": [
                        "cab0c9bd-e2ce-4b91-8631-51fafc007d34"
                    ],
                    "sku": "1031",
                    "slug": "mirfat",
                    "updatedAt": "2023-05-23T08:14:34.846Z",
                    "height": 0,
                    "thumb": null,
                    "variants": [
                        {
                            "createdAt": "2023-05-22T07:52:51.468Z",
                            "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/955D/DC2E/BFDF/376F/0A6E/0397/4C79/1031-019-P.jpg",
                            "material": "wheat-straw-pp",
                            "color": "004",
                            "price": 1.66,
                            "name": "1031 ::: Green ::: pp",
                            "variantId": "1031.1",
                            "sku": "1031",
                            "uuid": "3319be03-9b06-4123-98d3-1ac5b516ce9f",
                            "slug": "mirfat",
                            "updatedAt": "2023-05-23T08:14:52.642Z",
                            "active": false
                        },
                        {
                            "createdAt": "2023-05-22T07:52:51.468Z",
                            "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/955D/DC2E/BFDF/376F/0A6E/0397/4C79/1031-019-P.jpg",
                            "material": "wheat-straw-pp",
                            "color": "013",
                            "price": 1.66,
                            "name": "1031 ::: Natural ::: pp",
                            "variantId": "1031.2",
                            "sku": "1031",
                            "uuid": "c6a12480-31e1-4797-939f-5ac8bad030b8",
                            "slug": "mirfat",
                            "updatedAt": "2023-05-23T08:14:52.642Z",
                            "active": false
                        },
                        {
                            "createdAt": "2023-05-22T07:52:51.468Z",
                            "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/955D/DC2E/BFDF/376F/0A6E/0397/4C79/1031-019-P.jpg",
                            "material": "wheat-straw-pp",
                            "color": "019",
                            "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740630/products/125b5964-172e-49c2-8ede-7c029ee80ef0.jpg",
                            "price": 1.66,
                            "name": "1031 ::: Blue ::: pp",
                            "variantId": "1031.0",
                            "sku": "1031",
                            "uuid": "12f56b12-81d0-4397-b284-64784e0e081a",
                            "slug": "mirfat",
                            "updatedAt": "2023-05-23T08:14:52.642Z",
                            "active": false
                        },
                        {
                            "createdAt": "2023-05-22T07:52:51.468Z",
                            "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/955D/DC2E/BFDF/376F/0A6E/0397/4C79/1031-019-P.jpg",
                            "material": "wheat-straw-pp",
                            "color": "011",
                            "price": 1.66,
                            "name": "1031 ::: Fuchia ::: pp",
                            "variantId": "1031.3",
                            "sku": "1031",
                            "uuid": "e9f7842d-84a2-41e7-b5a4-6e557f9b253b",
                            "slug": "mirfat",
                            "updatedAt": "2023-05-23T08:14:52.642Z",
                            "active": false
                        }
                    ],
                    "images": []
                },
                "modelSettings": {
                    "filterKey": "slug",
                    "rels": [
                        "variants"
                    ]
                }
            },
            {
                "model": "ProductCategory",
                "item": {
                    "createdAt": "2023-05-22T01:27:35.045Z",
                    "importName": "MASKS AND HYGIENE",
                    "title": "Masks & Hygiene",
                    "uuid": "cd3300b7-83f2-4658-840c-fb9c096c917d",
                    "slug": "masks-hygiene"
                }
            }
        ]
    },
    {
        "layout": "homepage",
        "settings": {},
        "created": 1686681791879,
        "region": "hero",
        "uuid": "af53e41d-83a3-4369-90e3-b79adb0f64da",
        "items": [
            {
                "model": null,
                "item": {
                    "title": "Your logo.Endless Possibilities",
                    "subTitle": "Discover the promotional products to set your business apart",
                    "cta": {
                        "url": "/products/all",
                        "title": "Shop Now",
                        "image": {
                            "url": "https://res.cloudinary.com/promotique/image/upload/c_scale,dpr_auto,f_auto,fl_progressive,w_auto:50:1920/site%20images/homepage/home-page-marquee-2",
                            "caption": "Shop Now",
                            "alt": "Shop Now"
                        }
                    }
                }
            }
        ]
    },
    {
        "layout": "homepage",
        "settings": {
            "limit": 10,
            "rels": [
                "variants"
            ]
        },
        "executor": "LatestProductsExecutor",
        "created": 1686657181061,
        "region": "latest-products",
        "uuid": "806e3a59-fcb3-4b93-be01-afccd93b1536",
        "items": [
            {
                "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/944F/8B74/B04A/01FB/0A6E/0397/C088/1012-000-P.jpg",
                "fromImport": true,
                "quantity": 0,
                "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740570/products/05819975-7920-406f-a174-fe27bb79f458.jpg",
                "description_long": "m2 laminated recycled paper. RPET polyester inside, made from recycled plastic, to encourage the reuse of plastic waste and help the sustainability of the planet. Suitable for solids and liquids.",
                "length": null,
                "description": "Foldable pet bowl 1.3l capacity, outside in durable 270g/m2 laminated recycled paper. RPET polyester inside, made from recycled plastic, to encourage the reuse of plastic waste and help the sustainability of the planet. Suitable for solids and liquids.",
                "weight": 28,
                "active": true,
                "title": "Poppy",
                "uuid": "75342920-a45c-403a-a320-8c748dfc1b26",
                "pieces": 200,
                "createdAt": "2023-05-22T07:49:47.199Z",
                "diameter": 17,
                "price": 3.85,
                "width": null,
                "categories": [
                    "93a10c2f-041d-40b8-83c0-fac455ca006a"
                ],
                "sku": "1012",
                "slug": "poppy",
                "updatedAt": "2023-05-23T08:14:34.846Z",
                "height": 10,
                "variants": [
                    {
                        "createdAt": "2023-05-22T07:52:51.468Z",
                        "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/944F/8B74/B04A/01FB/0A6E/0397/C088/1012-000-P.jpg",
                        "material": "laminated-recycled-paper-polyester-rpet",
                        "color": "013",
                        "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740570/products/05819975-7920-406f-a174-fe27bb79f458.jpg",
                        "price": 3.85,
                        "name": "1012 ::: Natural ::: polyester-rpet",
                        "variantId": "1012.0",
                        "sku": "1012",
                        "uuid": "e0b54877-8e6f-4975-a47b-1f280a28daa4",
                        "slug": "poppy",
                        "updatedAt": "2023-05-23T08:14:52.642Z",
                        "active": false
                    }
                ]
            },
            {
                "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FA/E66A/5FAE/B0FB/0A6E/0397/F7B4/1014-000-P.jpg",
                "quantity": 0,
                "fromImport": true,
                "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740573/products/731a6ebb-e997-4879-a1ec-db21b0fc282c.jpg",
                "description_long": "Key ring in a combination of glossy metal and varnished beech wood. With a wide surface for branding and presented in an individual bag with kraft card.",
                "length": 2,
                "description": "Key ring in a combination of glossy metal and varnished beech wood. With a wide surface for branding and presented in an individual bag with kraft card.",
                "weight": 23,
                "active": true,
                "title": "Ranigang",
                "uuid": "c903a109-d85e-403b-ba01-35239ce6025f",
                "pieces": 300,
                "createdAt": "2023-05-22T07:49:47.199Z",
                "diameter": null,
                "price": 2.35,
                "width": 0,
                "categories": [
                    "cab0c9bd-e2ce-4b91-8631-51fafc007d34"
                ],
                "sku": "1014",
                "slug": "ranigang",
                "updatedAt": "2023-05-23T08:14:34.846Z",
                "height": 7,
                "variants": [
                    {
                        "createdAt": "2023-05-22T07:52:51.468Z",
                        "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FA/E66A/5FAE/B0FB/0A6E/0397/F7B4/1014-000-P.jpg",
                        "material": "metal-wood",
                        "color": "013",
                        "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740573/products/731a6ebb-e997-4879-a1ec-db21b0fc282c.jpg",
                        "price": 2.35,
                        "name": "1014 ::: Natural ::: wood",
                        "variantId": "1014.0",
                        "sku": "1014",
                        "uuid": "9d100346-cc17-46ab-8767-6d98b16953d0",
                        "slug": "ranigang",
                        "updatedAt": "2023-05-23T08:14:52.642Z",
                        "active": false
                    }
                ]
            },
            {
                "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FB/DCBF/34AD/9CF0/0A6E/0397/F759/1015-000-P.jpg",
                "quantity": 0,
                "fromImport": true,
                "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740599/products/5be7aa72-b831-44b0-bbf8-c0938ed27264.jpg",
                "description_long": "m2 recycled cardboard, with rounded corners.",
                "length": 6,
                "description": "6x6cm magnet in 185g/m2 recycled cardboard, with rounded corners.",
                "weight": 4,
                "active": true,
                "title": "Dashin",
                "uuid": "d1f8c8f7-45fb-4d21-a07c-531a4fc09f82",
                "pieces": 3000,
                "createdAt": "2023-05-22T07:49:47.199Z",
                "diameter": null,
                "price": 0.17,
                "width": 0,
                "categories": [
                    "cab0c9bd-e2ce-4b91-8631-51fafc007d34"
                ],
                "sku": "1015",
                "slug": "dashin",
                "updatedAt": "2023-05-23T08:14:34.846Z",
                "height": 6,
                "variants": [
                    {
                        "createdAt": "2023-05-22T07:52:51.468Z",
                        "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FB/DCBF/34AD/9CF0/0A6E/0397/F759/1015-000-P.jpg",
                        "material": "recycled-cardboard",
                        "color": "013",
                        "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740599/products/5be7aa72-b831-44b0-bbf8-c0938ed27264.jpg",
                        "price": 0.17,
                        "name": "1015 ::: Natural ::: recycled-cardboard",
                        "variantId": "1015.0",
                        "sku": "1015",
                        "uuid": "ca9534da-5e28-406f-afbf-c8eae3489481",
                        "slug": "dashin",
                        "updatedAt": "2023-05-23T08:14:52.642Z",
                        "active": false
                    }
                ]
            },
            {
                "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FB/3743/0C26/AEBE/0A6E/0397/F72B/1016-000-P.jpg",
                "fromImport": true,
                "quantity": 0,
                "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740601/products/ec2d83e9-6173-4c06-98f2-5984f2aa4655.jpg",
                "description_long": "m2 recycled cardboard, for photos in size 8,5x9 cm.",
                "length": 11,
                "description": "Magnetized photo frame made in 185g/m2 recycled cardboard, for photos in size 8,5x9 cm.",
                "weight": 23,
                "active": true,
                "title": "Tunip",
                "uuid": "1def8947-111f-4505-869e-d99ec4ed6248",
                "pieces": 500,
                "createdAt": "2023-05-22T07:49:47.199Z",
                "diameter": null,
                "price": 0.7,
                "width": 0,
                "categories": [
                    "cab0c9bd-e2ce-4b91-8631-51fafc007d34"
                ],
                "sku": "1016",
                "slug": "tunip",
                "updatedAt": "2023-05-23T08:14:34.846Z",
                "height": 14,
                "variants": [
                    {
                        "createdAt": "2023-05-22T07:52:51.468Z",
                        "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FB/3743/0C26/AEBE/0A6E/0397/F72B/1016-000-P.jpg",
                        "material": "recycled-cardboard",
                        "color": "013",
                        "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740601/products/ec2d83e9-6173-4c06-98f2-5984f2aa4655.jpg",
                        "price": 0.7,
                        "name": "1016 ::: Natural ::: recycled-cardboard",
                        "variantId": "1016.0",
                        "sku": "1016",
                        "uuid": "d2866c27-963e-434b-a4c7-707e5bd8bb7a",
                        "slug": "tunip",
                        "updatedAt": "2023-05-23T08:14:52.642Z",
                        "active": false
                    }
                ]
            },
            {
                "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FB/75FB/6675/5AAD/0A6E/0397/F753/1017-000-P.jpg",
                "quantity": 0,
                "fromImport": true,
                "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740602/products/ebc7ac40-ce3b-4a6c-a184-f23d8453fc52.jpg",
                "description_long": "m2 recycled cardboard, with a wide branding surface and in natural tone.",
                "length": null,
                "description": "Nature line fan made of resistant 430g/m2 recycled cardboard, with a wide branding surface and in natural tone.",
                "weight": 17,
                "active": true,
                "title": "Bilsom",
                "uuid": "577afab6-88d2-489a-92ff-d5a66421910b",
                "pieces": 500,
                "createdAt": "2023-05-22T07:49:47.199Z",
                "diameter": 0,
                "price": 0.34,
                "width": null,
                "categories": [
                    "cab0c9bd-e2ce-4b91-8631-51fafc007d34"
                ],
                "sku": "1017",
                "slug": "bilsom",
                "updatedAt": "2023-05-23T08:14:34.846Z",
                "height": 17,
                "variants": [
                    {
                        "createdAt": "2023-05-22T07:52:51.468Z",
                        "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FB/75FB/6675/5AAD/0A6E/0397/F753/1017-000-P.jpg",
                        "material": "recycled-cardboard",
                        "color": "013",
                        "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740602/products/ebc7ac40-ce3b-4a6c-a184-f23d8453fc52.jpg",
                        "price": 0.34,
                        "name": "1017 ::: Natural ::: recycled-cardboard",
                        "variantId": "1017.0",
                        "sku": "1017",
                        "uuid": "1c9e6bce-d815-4fb4-8a58-9bb5c13895aa",
                        "slug": "bilsom",
                        "updatedAt": "2023-05-23T08:14:52.642Z",
                        "active": false
                    }
                ]
            },
            {
                "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FC/0F31/9DD4/D58E/0A6E/0397/F761/1018-000-P.jpg",
                "fromImport": true,
                "quantity": 0,
                "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740605/products/af2268c7-eee8-4234-8201-952dae6e8e37.jpg",
                "description_long": "m2 recycled cardboard. Supplied folded, with assembly instructions at the base.",
                "length": 9,
                "description": "Nature line pencil holder, made of durable 430g/m2 recycled cardboard. Supplied folded, with assembly instructions at the base.",
                "weight": 21,
                "active": true,
                "title": "Davor",
                "uuid": "c0b3b5b2-8a2e-4e38-b9bc-db0c8537a50b",
                "pieces": 500,
                "createdAt": "2023-05-22T07:49:47.199Z",
                "diameter": null,
                "price": 0.44,
                "width": 9,
                "categories": [
                    "5689395f-9229-475c-ba5c-0a39f5eb085f"
                ],
                "sku": "1018",
                "slug": "davor",
                "updatedAt": "2023-05-23T08:14:34.846Z",
                "height": 9,
                "variants": [
                    {
                        "createdAt": "2023-05-22T07:52:51.468Z",
                        "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FC/0F31/9DD4/D58E/0A6E/0397/F761/1018-000-P.jpg",
                        "material": "recycled-cardboard",
                        "color": "013",
                        "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740605/products/af2268c7-eee8-4234-8201-952dae6e8e37.jpg",
                        "price": 0.44,
                        "name": "1018 ::: Natural ::: recycled-cardboard",
                        "variantId": "1018.0",
                        "sku": "1018",
                        "uuid": "69f045c7-9c7f-47d6-87cf-bd9db400e96f",
                        "slug": "davor",
                        "updatedAt": "2023-05-23T08:14:52.642Z",
                        "active": false
                    }
                ]
            },
            {
                "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FC/9E84/3CDD/294B/0A6E/0397/F711/1020-019-P.jpg",
                "quantity": 0,
                "fromImport": true,
                "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740606/products/a33019b6-ac70-4fa2-a0e3-0abcabc10e49.jpg",
                "description_long": "Sunscreen SPF 30. Presented in a practical 30ml jar with frosted finish. Available in a wide range of colours, with matching carabiner.",
                "length": 4,
                "description": "Sunscreen SPF 30. Presented in a practical 30ml jar with frosted finish. Available in a wide range of colours, with matching carabiner.",
                "weight": 54,
                "active": true,
                "title": "Cretus",
                "uuid": "73fc945e-7d13-485a-abd8-4714ab05ec8b",
                "pieces": 200,
                "createdAt": "2023-05-22T07:49:47.199Z",
                "diameter": null,
                "price": 2.05,
                "width": 2,
                "categories": [
                    "c102faca-f403-4e84-8692-d1056fa39037"
                ],
                "sku": "1020",
                "slug": "cretus",
                "updatedAt": "2023-05-23T08:14:34.846Z",
                "height": 9,
                "variants": [
                    {
                        "createdAt": "2023-05-22T07:52:51.468Z",
                        "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FC/9E84/3CDD/294B/0A6E/0397/F711/1020-019-P.jpg",
                        "color": "019",
                        "material": "0",
                        "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740606/products/a33019b6-ac70-4fa2-a0e3-0abcabc10e49.jpg",
                        "price": 2.05,
                        "name": "1020 ::: Blue ::: ",
                        "variantId": "1020.0",
                        "sku": "1020",
                        "uuid": "5f59596d-0549-43a8-8656-082ce05a8b87",
                        "slug": "cretus",
                        "updatedAt": "2023-05-23T08:14:52.642Z",
                        "active": false
                    },
                    {
                        "createdAt": "2023-05-22T07:52:51.468Z",
                        "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FC/9E84/3CDD/294B/0A6E/0397/F711/1020-019-P.jpg",
                        "color": "001",
                        "material": "0",
                        "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740609/products/b5ca8b37-c97d-40be-9b00-04a73a364f2f.jpg",
                        "price": 2.05,
                        "name": "1020 ::: White ::: ",
                        "variantId": "1020.2",
                        "sku": "1020",
                        "uuid": "6d24edb3-268b-4157-a6ed-5cc05b3d7751",
                        "slug": "cretus",
                        "updatedAt": "2023-05-23T08:14:52.642Z",
                        "active": false
                    },
                    {
                        "createdAt": "2023-05-22T07:52:51.468Z",
                        "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FC/9E84/3CDD/294B/0A6E/0397/F711/1020-019-P.jpg",
                        "color": "005",
                        "material": "0",
                        "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740611/products/2eca592f-1905-4af6-bbe6-d19498c33274.jpg",
                        "price": 2.05,
                        "name": "1020 ::: Yellow ::: ",
                        "variantId": "1020.3",
                        "sku": "1020",
                        "uuid": "86272f1b-8c22-442c-bb2e-af74b061928b",
                        "slug": "cretus",
                        "updatedAt": "2023-05-23T08:14:52.642Z",
                        "active": false
                    },
                    {
                        "createdAt": "2023-05-22T07:52:51.468Z",
                        "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FC/9E84/3CDD/294B/0A6E/0397/F711/1020-019-P.jpg",
                        "color": "003",
                        "material": "0",
                        "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740608/products/8226e9e7-fe38-4755-824c-053aaa16c398.jpg",
                        "price": 2.05,
                        "name": "1020 ::: Red ::: ",
                        "variantId": "1020.1",
                        "sku": "1020",
                        "uuid": "93fa2287-c104-48f0-8fce-635251d3fb7c",
                        "slug": "cretus",
                        "updatedAt": "2023-05-23T08:14:52.642Z",
                        "active": false
                    }
                ]
            },
            {
                "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FC/FC13/AFE3/7F4A/0A6E/0397/F717/1021-000-P.jpg",
                "quantity": 0,
                "fromImport": true,
                "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740612/products/34b05cdd-9ffe-46a9-8212-43d2b128d5d5.jpg",
                "description_long": "French playing cards of nature line, made of solid recycled cardboard. Including 54 cards, presented in an individual recycled cardboard box.",
                "length": 5,
                "description": "French playing cards of nature line, made of solid recycled cardboard. Including 54 cards, presented in an individual recycled cardboard box.",
                "weight": 60,
                "active": true,
                "title": "Trebol",
                "uuid": "ffbdd826-fa42-440c-a162-f53f9a0c2b26",
                "pieces": 200,
                "createdAt": "2023-05-22T07:49:47.199Z",
                "diameter": null,
                "price": 1.3,
                "width": 1,
                "categories": [
                    "cab0c9bd-e2ce-4b91-8631-51fafc007d34"
                ],
                "sku": "1021",
                "slug": "trebol",
                "updatedAt": "2023-05-23T08:14:34.846Z",
                "height": 8,
                "variants": [
                    {
                        "createdAt": "2023-05-22T07:52:51.468Z",
                        "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FC/FC13/AFE3/7F4A/0A6E/0397/F717/1021-000-P.jpg",
                        "material": "recycled-cardboard",
                        "color": "013",
                        "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740612/products/34b05cdd-9ffe-46a9-8212-43d2b128d5d5.jpg",
                        "price": 1.3,
                        "name": "1021 ::: Natural ::: recycled-cardboard",
                        "variantId": "1021.0",
                        "sku": "1021",
                        "uuid": "eea0aecf-d4e7-4bb3-b992-96c763263ee9",
                        "slug": "trebol",
                        "updatedAt": "2023-05-23T08:14:52.642Z",
                        "active": false
                    }
                ]
            },
            {
                "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FD/BB14/B09A/2648/0A6E/0397/F780/1022-000-P.jpg",
                "fromImport": true,
                "quantity": 0,
                "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740615/products/f4ad3f71-2af2-4ddc-b09e-8931b140ff3b.jpg",
                "description_long": "French playing cards made of strong laminated paper. Including 54 cards, presented in an individual case with translucent finish and security lock.",
                "length": 7,
                "description": "French playing cards made of strong laminated paper. Including 54 cards, presented in an individual case with translucent finish and security lock.",
                "weight": 108,
                "active": true,
                "title": "Picas",
                "uuid": "1f5e84ff-f34f-4ef4-9531-c28d3d29ba53",
                "pieces": 100,
                "createdAt": "2023-05-22T07:49:47.199Z",
                "diameter": null,
                "price": 1.77,
                "width": 2,
                "categories": [
                    "cab0c9bd-e2ce-4b91-8631-51fafc007d34"
                ],
                "sku": "1022",
                "slug": "picas",
                "updatedAt": "2023-05-23T08:14:34.846Z",
                "height": 10,
                "variants": [
                    {
                        "createdAt": "2023-05-22T07:52:51.468Z",
                        "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FD/BB14/B09A/2648/0A6E/0397/F780/1022-000-P.jpg",
                        "material": "laminated-paper",
                        "color": "003",
                        "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740615/products/f4ad3f71-2af2-4ddc-b09e-8931b140ff3b.jpg",
                        "price": 1.77,
                        "name": "1022 ::: Red ::: laminated-paper",
                        "variantId": "1022.0",
                        "sku": "1022",
                        "uuid": "db98590f-d473-420f-88df-c00db17a0b62",
                        "slug": "picas",
                        "updatedAt": "2023-05-23T08:14:52.642Z",
                        "active": false
                    }
                ]
            },
            {
                "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FD/E0D7/87F1/FA6F/0A6E/0397/F7AD/1023-000-P.jpg",
                "quantity": 0,
                "fromImport": true,
                "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740617/products/33fbb380-9079-4bfc-aa76-d5c02eba82cc.jpg",
                "description_long": "Spanish playing cards made of strong laminated paper. Including 50 cards, presented in an individual case with translucent finish and security lock.",
                "length": 7,
                "description": "Spanish playing cards made of strong laminated paper. Including 50 cards, presented in an individual case with translucent finish and security lock.",
                "weight": 100,
                "active": true,
                "title": "Tute",
                "uuid": "9d179625-b523-4ef0-a585-0c77633a8d47",
                "pieces": 100,
                "createdAt": "2023-05-22T07:49:47.199Z",
                "diameter": null,
                "price": 1.63,
                "width": 2,
                "categories": [
                    "cab0c9bd-e2ce-4b91-8631-51fafc007d34"
                ],
                "sku": "1023",
                "slug": "tute",
                "updatedAt": "2023-05-23T08:14:34.846Z",
                "height": 10,
                "variants": [
                    {
                        "createdAt": "2023-05-22T07:52:51.468Z",
                        "image": "http://makito.es/WebRoot/Store/Shops/Makito/634A/94FD/E0D7/87F1/FA6F/0A6E/0397/F7AD/1023-000-P.jpg",
                        "material": "laminated-paper",
                        "color": "003",
                        "thumb": "https://res.cloudinary.com/dqehxczmc/image/upload/v1684740617/products/33fbb380-9079-4bfc-aa76-d5c02eba82cc.jpg",
                        "price": 1.63,
                        "name": "1023 ::: Red ::: laminated-paper",
                        "variantId": "1023.0",
                        "sku": "1023",
                        "uuid": "449a805b-ef53-4a35-977e-188692a20517",
                        "slug": "tute",
                        "updatedAt": "2023-05-23T08:14:52.642Z",
                        "active": false
                    }
                ]
            }
        ]
    }
];

onMount(async () => {
    models.forEach(m => {
        if (m.region === 'hero') {
            model = m.items[0].item;
        }
        
    })
});

function getModelByRegion(region: string) {
    return models.find((item) => item.region === region);
}
let test = {};
</script>

<Heading tag="h3" class="mb-4">{region.label}</Heading>
<div class="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
    <div>
        <Label for="label" class="mb-2">Label</Label>
        <Input type="text" id="label" placeholder="Label" bind:value={region.label} required  />
      </div>
      <div>
        <Label for="name" class="mb-2">Name</Label>
        <Input type="text" id="name" placeholder="Name" bind:value={region.name} required  />
      </div>
</div>

{#each region.regions as item, idx}
<AccordionItem isOpen={idx === 0}>
    <span slot="header">{item.label}</span>
    <div slot="body">
        
        
        {JSON.stringify(item.fields)}
        <br>-------<br>
{#if item.fields && item.name === 'hero' && Object.keys(model).length > 0}
{JSON.stringify(model)}
<Fields
fields={item.fields}
bind:model={model}
module="Product"
itemId={item.name}
/>
{JSON.stringify(test)}
{/if}
        </div>
</AccordionItem>
{/each}