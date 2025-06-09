import "./GamePlatform.scss";

const GamePlatform = ({ platforms }) => {
    return (
        <>
            {platforms.map((plat, index) => (
                <div
                    key={index}
                    style={{
                        position: "absolute",
                        left: `${plat.x}px`,
                        top: `${plat.y}px`,
                        width: `${plat.width}px`,
                        height: `${plat.height}px`,
                        backgroundColor: "sienna",
                        border: "2px solid #422",
                        boxSizing: "border-box",
                    }}
                />
            ))}
        </>
    );
};

export default GamePlatform;