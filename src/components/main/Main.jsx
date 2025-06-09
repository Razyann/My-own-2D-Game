import './Main.scss';
import Character from "../character/Character";
import GamePlatform from "../game_platform/GamePlatform";
import { useState } from "react";
import ParallaxBackground from "../parallax_background/ParallaxBackground";

const platforms = [
    { x: 300, y: 500, width: 150, height: 20 },
    { x: 500, y: 400, width: 200, height: 20 },
];

const Main = () => {
    const [characterX, setCharacterX] = useState(100);

    return (
        <div className="main_area" style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
            <ParallaxBackground offsetX={characterX} />
            <Character platforms={platforms} onPositionChange={(pos) => setCharacterX(pos.x)} />
            <GamePlatform platforms={platforms} />
        </div>
    );
};

export default Main;
