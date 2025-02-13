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
          background: "black",
          color: "white",
          padding: "20px",
          fontSize: "24px",
          border: "2px solid white",
          textAlign: "center",
        }}
      >
        {text}
      </div>
    )
  );
};

// 🏃‍♂️ Fully Procedural Human Model (Hero)
const Hero = ({ actionStep }) => {
  const ref = useRef();

  // 🏃 Character movement animation
  const { position } = useSpring({
    position:
      actionStep === 0
        ? [-3, 0, 0] // Starting position
        : actionStep === 1
        ? [0, 0, 0] // Walk forward
        : [1.5, 0, -1], // Dodge the object
    config: { duration: 2000 },
  });

  return (
    <animated.group ref={ref} position={position}>
      {/* Head */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="peachpuff" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 1, 16]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.5, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="peachpuff" />
      </mesh>
      <mesh position={[0.5, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="peachpuff" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.2, 0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
        <meshStandardMaterial color="brown" />
      </mesh>
      <mesh position={[0.2, 0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
        <meshStandardMaterial color="brown" />
      </mesh>
    </animated.group>
  );
};

// 🦹‍♂️ Fully Procedural Human Model (Villain)
const Villain = () => {
  return (
    <group position={[3, 0, -1]}>
      {/* Head */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 1, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.5, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <mesh position={[0.5, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.2, 0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.2, 0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
};

// 🌩️ Falling Object (Danger)
const FallingObject = ({ actionStep, setShake }) => {
  const ref = useRef();

  useFrame(() => {
    if (ref.current.position.y > 0 && actionStep >= 2) {
      ref.current.position.y -= 0.05; // Slow falling effect
    }

    if (ref.current.position.y <= 0 && actionStep >= 2) {
      setShake(true);
    }
  });

  return (
    <mesh ref={ref} position={[1.5, 4, -1]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

// 🎥 Camera Shake Effect
const CameraShake = ({ shake }) => {
  const ref = useRef();

  useFrame(({ camera }) => {
    if (shake) {
      camera.position.x += Math.sin(performance.now() * 0.01) * 0.02;
      camera.position.y += Math.sin(performance.now() * 0.01) * 0.02;
    }
  });

  return null;
};

// 🎬 Silent Movie Scene
function SilentMovie() {
  const [actionStep, setActionStep] = useState(0);
  const [showTitle, setShowTitle] = useState(true);
  const [showBoom, setShowBoom] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowTitle(false), 3000); // Hide intro text

    setTimeout(() => setActionStep(1), 4000); // Move forward
    setTimeout(() => setActionStep(2), 7000); // Object falls
    setTimeout(() => setActionStep(3), 8500); // Dodge
    setTimeout(() => setShowBoom(true), 9500); // "BOOM!" appears
    setTimeout(() => setShake(false), 11000); // Stop shaking
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <TitleCard text="Once upon a time..." show={showTitle} />
      <TitleCard text="BOOM!" show={showBoom} />
      <Canvas camera={{ position: [5, 5, 5] }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Hero actionStep={actionStep} />
        <Villain />
        <FallingObject actionStep={actionStep} setShake={setShake} />
        <CameraShake shake={shake} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default SilentMovie;
