import React from "react";

const ParallaxBackground = ({ offsetX }) => {
    const layers = [
        { src: "/parallax_background_images/city1/1.png", speed: 0.2, zIndex: 0 },
        { src: "/parallax_background_images/city1/2.png", speed: 0.4, zIndex: 1 },
        { src: "/parallax_background_images/city1/3.png", speed: 0.6, zIndex: 2 },
        { src: "/parallax_background_images/city1/4.png", speed: 0.8, zIndex: 3 },
        { src: "/parallax_background_images/city1/5.png", speed: 0.10, zIndex: 4 },
    ];

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                zIndex: 0,
            }}
        >
            {layers.map(({ src, speed, zIndex }, index) => {
                const scrollX = offsetX * speed;
                const left = -scrollX % window.innerWidth;

                return (
                    <React.Fragment key={index}>
                        <img
                            src={src}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: `${left}px`,
                                width: "100vw",
                                height: "100%",
                                objectFit: "cover",
                                zIndex,
                                pointerEvents: "none",
                                userSelect: "none",
                            }}
                            alt=""
                            draggable={false}
                        />
                        <img
                            src={src}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: `${left + window.innerWidth}px`,
                                width: "100vw",
                                height: "100%",
                                objectFit: "cover",
                                zIndex,
                                pointerEvents: "none",
                                userSelect: "none",
                            }}
                            alt=""
                            draggable={false}
                        />
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ParallaxBackground;
