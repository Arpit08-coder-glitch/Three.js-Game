import React, { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

const StoryCube = () => {
  const [clicked, setClicked] = useState(false);

  // Animation for position and color
  const { position, color } = useSpring({
    position: clicked ? [0, 2, 0] : [0, 0, 0],
    color: clicked ? "red" : "blue",
    config: { mass: 1, tension: 170, friction: 26 },
  });

  return (
    <animated.mesh
      position={position}
      onClick={() => setClicked(!clicked)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <animated.meshStandardMaterial color={color} />
    </animated.mesh>
  );
};

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [5, 5, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <StoryCube />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
