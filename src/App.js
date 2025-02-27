import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

// 🎞️ Title Card Component
const TitleCard = ({ text, show }) => {
  return (
    show && (
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "20px",
          fontSize: "32px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        {text}
      </div>
    )
  );
};

// 🦌 Bambi Model
const Bambi = ({ actionStep }) => {
  const ref = useRef();
  const { position } = useSpring({
    position:
      actionStep === 0
        ? [-2, 0, 0]
        : actionStep === 1
        ? [0, 0, 0]
        : [2, 0, 1],
    config: { duration: 2000 },
  });

  return (
    <animated.group ref={ref} position={position}>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="brown" />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.2, 0.4, 1, 16]} />
        <meshStandardMaterial color="saddlebrown" />
      </mesh>
    </animated.group>
  );
};

// 🏹 Hunter Model
const Hunter = ({ actionStep }) => {
  return (
    <group position={[3, 0, -1]}>
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 1, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
};

// 🌲 Forest Background
const Forest = () => {
  return (
    <>
      <mesh position={[-4, 0, -5]}>
        <coneGeometry args={[1, 3, 8]} />
        <meshStandardMaterial color="darkgreen" />
      </mesh>
      <mesh position={[4, 0, -5]}>
        <coneGeometry args={[1, 3, 8]} />
        <meshStandardMaterial color="darkgreen" />
      </mesh>
    </>
  );
};

// 🎥 Camera Shake Effect
const CameraShake = ({ shake }) => {
  useFrame(({ camera }) => {
    if (shake) {
      camera.position.x += Math.sin(performance.now() * 0.01) * 0.05;
      camera.position.y += Math.sin(performance.now() * 0.01) * 0.05;
    }
  });
  return null;
};

// 🎬 Bambi Story Scene
function BambiStory() {
  const [actionStep, setActionStep] = useState(0);
  const [showTitle, setShowTitle] = useState(true);
  const [showDanger, setShowDanger] = useState(false);
  const [showEscape, setShowEscape] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowTitle(false), 3000); // Hide intro text
    setTimeout(() => setActionStep(1), 4000); // Bambi plays
    setTimeout(() => setShowDanger(true), 6000); // Hunter appears
    setTimeout(() => setShake(true), 7000); // Camera shake
    setTimeout(() => setActionStep(2), 8000); // Bambi escapes
    setTimeout(() => {
      setShake(false);
      setShowDanger(false);
      setShowEscape(true);
    }, 10000); // Safe
    setTimeout(() => {
      setShowEscape(false);
      setShowEnd(true);
    }, 12000); // Happy ending
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <TitleCard text="Bambi was playing happily..." show={showTitle} />
      <TitleCard text="Danger! A hunter appears!" show={showDanger} />
      <TitleCard text="Bambi runs to safety..." show={showEscape} />
      <TitleCard text="Reunited with family, Bambi is safe!" show={showEnd} />
      <Canvas camera={{ position: [5, 5, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Forest />
        <Bambi actionStep={actionStep} />
        <Hunter actionStep={actionStep} />
        <CameraShake shake={shake} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default BambiStory;
