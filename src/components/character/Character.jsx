import "./Character.scss";

import React, { useState, useEffect, useRef } from "react";

const runFrameCount = 24;
const jumpUpFrameCount = 6;
const fallFrameCount = 6; // количество кадров для падения (пример)
const sprintFrameCount = 12;
const idleFrameCount = 18; // количество кадров стояния (пример)

const Character = () => {
    const renderPosition = useRef({ x: 100, y: 300 });
    const [displayPos, setDisplayPos] = useState({ x: 100, y: 300 });

    const velocity = useRef({ x: 0, y: 0 });
    const keys = useRef({});
    const isJumping = useRef(false);
    const [frame, setFrame] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isSprinting, setIsSprinting] = useState(false);
    const [isFalling, setIsFalling] = useState(false);
    const [facingRight, setFacingRight] = useState(true); // направление взгляда

    const gravity = 0.6;
    const jumpPower = -12;
    const moveSpeed = 4;
    const sprintSpeed = 8;
    const groundY = 445;

    // Пути к кадрам анимаций
    const idleFrames = Array.from(
        { length: idleFrameCount },
        (_, i) => `/sprites/idle_blinking/0_Dark_Oracle_Idle Blinking_${i}.png`
    );
    const runFrames = Array.from(
        { length: runFrameCount },
        (_, i) => `/sprites/walking/0_Dark_Oracle_Walking_${i}.png`
    );
    const jumpUpFrames = Array.from(
        { length: jumpUpFrameCount },
        (_, i) => `/sprites/jump/0_Dark_Oracle_Jump Start_${i}.png`
    );
    const fallFrames = Array.from(
        { length: fallFrameCount },
        (_, i) => `/sprites/falling_down/0_Dark_Oracle_Falling Down_${i}.png`
    );
    const sprintFrames = Array.from(
        { length: sprintFrameCount },
        (_, i) => `/sprites/running/0_Dark_Oracle_Running_${i}.png`
    );

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

            // Управление скоростью и спринтом
            if (movingLeft) {
                vel.x = sprintKey && !isJumping.current ? -sprintSpeed : -moveSpeed;
            } else if (movingRight) {
                vel.x = sprintKey && !isJumping.current ? sprintSpeed : moveSpeed;
            } else {
                vel.x = 0;
            }

            // Обновление направления взгляда мгновенно
            if (vel.x > 0) {
                setFacingRight(true);
            } else if (vel.x < 0) {
                setFacingRight(false);
            }

            // Прыжок
            if (jumping && !isJumping.current) {
                vel.y = jumpPower;
                isJumping.current = true;
            }

            // Гравитация
            vel.y += gravity;

            // Обновление позиции
            pos.x += vel.x;
            pos.y += vel.y;

            // Земля
            if (pos.y >= groundY) {
                pos.y = groundY;
                vel.y = 0;
                isJumping.current = false;
                setIsFalling(false);
            } else {
                setIsFalling(vel.y > 0);
            }

            setDisplayPos({ x: pos.x, y: pos.y });

            // Флаги для анимации
            setIsSprinting(
                !isJumping.current && sprintKey && Math.abs(vel.x) > moveSpeed
            );
            setIsRunning(vel.x !== 0);

            frameId = requestAnimationFrame(loop);
        };

        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, []);

    // Анимация (бег, прыжок вверх, падение, спринт, стояние)
    useEffect(() => {
        let interval;

        if (isJumping.current) {
            if (isFalling) {
                // Падение
                interval = setInterval(() => {
                    setFrame((f) => (f + 1) % fallFrameCount);
                }, 100);
            } else {
                // Прыжок вверх
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
            // Стоячее состояние (idle)
            interval = setInterval(() => {
                setFrame((f) => (f + 1) % idleFrameCount);
            }, 300);
        }

        return () => clearInterval(interval);
    }, [isRunning, isJumping.current, isSprinting, isFalling]);

    // Выбор правильного кадра для отображения
    let currentSrc = idleFrames[frame % idleFrameCount];
    if (isJumping.current) {
        if (isFalling) {
            currentSrc = fallFrames[frame % fallFrameCount];
        } else {
            currentSrc = jumpUpFrames[frame % jumpUpFrameCount];
        }
    } else if (isSprinting) {
        currentSrc = sprintFrames[frame % sprintFrameCount];
    } else if (isRunning) {
        currentSrc = runFrames[frame % runFrameCount];
    }

    return (
        <img
            src={currentSrc}
            alt="character"
            style={{
                position: "absolute",
                left: `${displayPos.x}px`,
                top: `${displayPos.y}px`,
                width: "150px",
                height: "150px",
                imageRendering: "pixelated",
                transform: facingRight ? "scaleX(1)" : "scaleX(-1)", // мгновенный флип без transition
                userSelect: "none",
            }}
            draggable={false}
        />
    );
};

export default Character;