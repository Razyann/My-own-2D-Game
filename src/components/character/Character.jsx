import "./Character.scss";
import React, { useState, useEffect, useRef } from "react";

const runFrameCount = 24;
const jumpUpFrameCount = 6;
const fallFrameCount = 6;
const sprintFrameCount = 12;
const idleFrameCount = 18;

const characterWidth = 100;
const characterHeight = 100;

const Character = ({ platforms, onPositionChange }) => {
    const renderPosition = useRef({ x: 100, y: 300 });
    const [displayPos, setDisplayPos] = useState({ x: 100, y: 300 });

    const velocity = useRef({ x: 0, y: 0 });
    const keys = useRef({});
    const isJumping = useRef(false);
    const [frame, setFrame] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isSprinting, setIsSprinting] = useState(false);
    const [isFalling, setIsFalling] = useState(false);
    const [facingRight, setFacingRight] = useState(true);

    const gravity = 0.6;
    const jumpPower = -12;
    const moveSpeed = 4;
    const sprintSpeed = 8;
    const groundY = 445;

    const idleFrames = Array.from({ length: idleFrameCount }, (_, i) => `/sprites/idle_blinking/0_Dark_Oracle_Idle Blinking_${i}.png`);
    const runFrames = Array.from({ length: runFrameCount }, (_, i) => `/sprites/walking/0_Dark_Oracle_Walking_${i}.png`);
    const jumpUpFrames = Array.from({ length: jumpUpFrameCount }, (_, i) => `/sprites/jump/0_Dark_Oracle_Jump Start_${i}.png`);
    const fallFrames = Array.from({ length: fallFrameCount }, (_, i) => `/sprites/falling_down/0_Dark_Oracle_Falling Down_${i}.png`);
    const sprintFrames = Array.from({ length: sprintFrameCount }, (_, i) => `/sprites/running/0_Dark_Oracle_Running_${i}.png`);

    useEffect(() => {
        const handleKeyDown = (e) => {
            keys.current[e.key.toLowerCase()] = true;
        };
        const handleKeyUp = (e) => {
            keys.current[e.key.toLowerCase()] = false;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useEffect(() => {
        let frameId;

        const loop = () => {
            const pos = renderPosition.current;
            const vel = velocity.current;

            const movingLeft = keys.current["a"] || keys.current["arrowleft"];
            const movingRight = keys.current["d"] || keys.current["arrowright"];
            const jumping = keys.current["w"] || keys.current[" "];
            const sprintKey = keys.current["shift"];

            if (movingLeft) {
                vel.x = sprintKey && !isJumping.current ? -sprintSpeed : -moveSpeed;
            } else if (movingRight) {
                vel.x = sprintKey && !isJumping.current ? sprintSpeed : moveSpeed;
            } else {
                vel.x = 0;
            }

            if (vel.x > 0) setFacingRight(true);
            else if (vel.x < 0) setFacingRight(false);

            if (jumping && !isJumping.current) {
                vel.y = jumpPower;
                isJumping.current = true;
            }

            vel.y += gravity;

            pos.x += vel.x;

            platforms.forEach((plat) => {
                const charLeft = pos.x;
                const charRight = pos.x + characterWidth;
                const charTop = pos.y;
                const charBottom = pos.y + characterHeight;

                const platLeft = plat.x;
                const platRight = plat.x + plat.width;
                const platTop = plat.y;
                const platBottom = plat.y + plat.height;

                const horizontalOverlap =
                    charRight > platLeft &&
                    charLeft < platRight &&
                    charBottom > platTop &&
                    charTop < platBottom;

                if (horizontalOverlap) {
                    if (vel.x > 0) {
                        pos.x = platLeft - characterWidth;
                    } else if (vel.x < 0) {
                        pos.x = platRight;
                    }
                    vel.x = 0;
                }
            });

            pos.y += vel.y;

            let onPlatform = false;

            platforms.forEach((plat) => {
                const withinX = pos.x + characterWidth > plat.x && pos.x < plat.x + plat.width;
                const touchingTop =
                    pos.y + characterHeight >= plat.y &&
                    pos.y + characterHeight <= plat.y + 10;

                if (withinX && touchingTop && vel.y >= 0) {
                    pos.y = plat.y - characterHeight;
                    vel.y = 0;
                    isJumping.current = false;
                    onPlatform = true;
                }
            });

            if (pos.y >= groundY) {
                pos.y = groundY;
                vel.y = 0;
                isJumping.current = false;
                setIsFalling(false);
            } else if (!onPlatform) {
                setIsFalling(vel.y > 0);
            } else {
                setIsFalling(false);
            }

            setDisplayPos({ x: pos.x, y: pos.y });
            setIsSprinting(!isJumping.current && sprintKey && Math.abs(vel.x) > moveSpeed);
            setIsRunning(vel.x !== 0);

            if (onPositionChange) {
                onPositionChange(pos);
            }

            frameId = requestAnimationFrame(loop);
        };

        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [platforms]);

    useEffect(() => {
        let interval;

        if (isJumping.current) {
            if (isFalling) {
                interval = setInterval(() => {
                    setFrame((f) => (f + 1) % fallFrameCount);
                }, 100);
            } else {
                interval = setInterval(() => {
                    setFrame((f) => (f + 1) % jumpUpFrameCount);
                }, 100);
            }
        } else if (isSprinting) {
            interval = setInterval(() => {
                setFrame((f) => (f + 1) % sprintFrameCount);
            }, 25);
        } else if (isRunning) {
            interval = setInterval(() => {
                setFrame((f) => (f + 1) % runFrameCount);
            }, 50);
        } else {
            interval = setInterval(() => {
                setFrame((f) => (f + 1) % idleFrameCount);
            }, 300);
        }

        return () => clearInterval(interval);
    }, [isRunning, isSprinting, isFalling]);

    let currentSrc = idleFrames[frame % idleFrameCount];
    if (isJumping.current) {
        currentSrc = isFalling
            ? fallFrames[frame % fallFrameCount]
            : jumpUpFrames[frame % jumpUpFrameCount];
    } else if (isSprinting) {
        currentSrc = sprintFrames[frame % sprintFrameCount];
    } else if (isRunning) {
        currentSrc = runFrames[frame % runFrameCount];
    }

    return (
        <img
            className="character"
            src={currentSrc}
            alt="character"
            style={{
                position: "absolute",
                left: `${displayPos.x}px`,
                top: `${displayPos.y}px`,
                width: `${characterWidth}px`,
                height: `${characterHeight}px`,
                imageRendering: "pixelated",
                transform: facingRight ? "scaleX(1)" : "scaleX(-1)",
                zIndex: 10,
                userSelect: "none",
            }}
            draggable={false}
        />
    );
};

export default Character;
