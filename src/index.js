import "./style/main.css";

import source from "./sourceList";

import { shades, pures } from "./material.js";
import { sound } from "./music";
import {
    Application,
    Tiles,
    Wall,
    Dom,
    Rader,
    Fly,
    steam,
    Areas,
    Physics,
    Debug,
    Reveal,
    Car,
} from "./javascript/index";
import Intro from "./javascript/World/Sections/IntroSection";
let application = new Application({
    $canvas: document.querySelector(".js-canvas"),
    pre: [new Car()],
    plugins: [
        new Wall(),
        new Rader(),
        new Fly(),
        new steam(),
        new Tiles(),
        new Dom(),
        new Debug(),
        new Areas(),
    ],
    sections: [Intro],
    physics: new Physics(),
    reveal: new Reveal(),
    controls: true,
    media: sound,
    shades: shades,
    pures: pures,
    resources: source,
    useComposer: true,
    colors: { topLeft: "#795ee5" },
});

application.build();
application.start();
