// Orange
import * as THREE from "three";

const shades = [
    { name: "shadeWhite", key: "white", resource: "matcapWhiteTexture" },
    { name: "shadeOrange", key: "orange", resource: "matcapOrangeTexture" },
    { name: "shadeGreen", key: "green", resource: "matcapGreenTexture" },
    { name: "shadeBrown", key: "brown", resource: "matcapBrownTexture" },
    { name: "shadeGray", key: "gray", resource: "matcapGrayTexture" },
    { name: "shadeBeige", key: "beige", resource: "matcapBeigeTexture" },
    { name: "shadeRed", key: "red", resource: "matcapRedTexture" },
    { name: "shadeBlack", key: "black", resource: "matcapBlackTexture" },
    {
        name: "shadeEmeraldGreen",
        key: "emeraldGreen",
        resource: "matcapEmeraldGreenTexture",
    },
    { name: "shadePurple", key: "purple", resource: "matcapPurpleTexture" },
    { name: "shadeBlue", key: "blue", resource: "matcapBlueTexture" },
    { name: "shadeYellow", key: "yellow", resource: "matcapYellowTexture" },
    { name: "shadeMetal", key: "metal", resource: "matcapMetalTexture" },
];

const pures = [
    {
        name: "pureRed",
        key: "red",
        resource: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    },
    {
        name: "pureWhite",
        key: "white",
        resource: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    },
    {
        name: "pureYellow",
        key: "yellow",
        resource: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    },
];
export { shades, pures };
