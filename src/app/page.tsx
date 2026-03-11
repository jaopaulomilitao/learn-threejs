"use client";

import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  PerspectiveCamera,
  Environment,
  Float,
  Center,
  ContactShadows,
  useAnimations,
  TransformControls,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  SMAA,
} from "@react-three/postprocessing";
import { FaGithub, FaLinkedin } from "react-icons/fa";

// é passada a função onloaded como propriedade para avisar o fim do suspense
function ClassroomScene({ onLoaded }: { onLoaded: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const sphereRef = useRef<THREE.Mesh>(null!);

  const { size } = useThree();
  const { scene, animations } = useGLTF("/3d/classroom.glb");
  const { actions } = useAnimations(animations, groupRef);
  const [isDragging, setIsDragging] = useState(false);

  const [lightColor, setLightColor] = useState("#ffcc00");
  const [lightIntensity, setLightIntensity] = useState(12);

  const movementAmplitude = 0.5;
  const basePosition = { x: 0.9, y: 1.2, z: 2.8 };

  const responsiveFov = useMemo(() => {
    return size.width < 768 ? 55 : 35;
  }, [size.width]);

  // é disparado o evento de carregamento concluído assim que o componente é montado
  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  useEffect(() => {
    if (animations.length > 0) {
      const firstAction = actions[Object.keys(actions)[0] as string];
      if (firstAction) firstAction.fadeIn(0.5).play();
    }
  }, [actions, animations]);

  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;

        if (material.emissive) {
          material.emissive.setHex(0x000000);
        }

        material.envMapIntensity = 0.4;
        material.needsUpdate = true;
      }

      if ((child as any).isLight) {
        (child as THREE.Light).intensity = 0.5;
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!cameraRef.current || isDragging) return;

    const targetX = basePosition.x + state.mouse.x * movementAmplitude;
    const targetY = basePosition.y + state.mouse.y * movementAmplitude;

    cameraRef.current.position.x = THREE.MathUtils.lerp(
      cameraRef.current.position.x,
      targetX,
      0.05,
    );
    cameraRef.current.position.y = THREE.MathUtils.lerp(
      cameraRef.current.position.y,
      targetY,
      0.05,
    );

    cameraRef.current.lookAt(0, 0.4, 0);
  });

  return (
    <>
      <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        position={[basePosition.x, basePosition.y, basePosition.z]}
        fov={responsiveFov}
      />

      <Environment preset="apartment" />

      <Html
        position={[-1, 1, -0.3]}
        center
        className="pointer-events-auto"
      >
        <div 
          className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-4 w-48"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-1">
            <label className="text-white/80 text-xs font-semibold uppercase tracking-wider">
              cor da luz
            </label>
            <input
              type="color"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              className="w-full h-8 rounded cursor-pointer bg-transparent border-0 p-0"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                intensidade
              </label>
              <span className="text-white/50 text-xs font-mono">
                {lightIntensity.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="18"
              step="0.5"
              value={lightIntensity}
              onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
              className="w-full accent-[#ffcc00] cursor-pointer"
            />
          </div>
        </div>
      </Html>

      <TransformControls
        mode="translate"
        position={[-0.2, 0.9, -0.5]}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      >
        <mesh ref={sphereRef} castShadow>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color={lightColor}
            emissive={lightColor}
            emissiveIntensity={2}
          />
          <pointLight
            castShadow
            intensity={lightIntensity}
            distance={10}
            color={lightColor}
            shadow-mapSize={[2048, 2048]}
            shadow-bias={0.0005}
            shadow-normalBias={0.02}
            shadow-radius={4}
          />
        </mesh>
      </TransformControls>

      <directionalLight
        position={[5, 10, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={0.0001}
      />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
        <Center top position={[0, -0.5, 0]}>
          <group ref={groupRef}>
            <primitive
              object={scene}
              scale={1}
              rotation={[0, -Math.PI / 12, 0]}
              position={[-0.25, 0.05, 0.25]}
            />
          </group>
        </Center>
      </Float>

      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.15}
        scale={10}
        blur={2.5}
        far={1}
      />

      <EffectComposer multisampling={0}>
        <SMAA />
        <DepthOfField
          focusDistance={0.015}
          focalLength={0.035}
          bokehScale={2}
        />
        <Bloom
          luminanceThreshold={1.2}
          mipmapBlur
          intensity={1.4}
        />
        <Vignette
          eskil={false}
          offset={0.1}
          darkness={1.1}
        />
      </EffectComposer>
    </>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  // é criado o estado para rastrear o carregamento do modelo 3d
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <main className="relative w-full h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* é renderizada a tela de loading com transição de opacidade via tailwind */}
      <div 
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#F8FAFC] transition-opacity duration-1000 ease-in-out ${
          isSceneLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4" />
        <span className="text-slate-800 font-mono text-sm tracking-widest uppercase">
          calma só um pouquinho...
        </span>
      </div>

      {/* é renderizada a interface principal separada do fundo, usando z-20 para ficar sobre a cena */}
      <div 
        className={`absolute inset-0 z-20 pointer-events-none transition-all duration-1000 delay-500 ease-out ${
          isSceneLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="absolute z-20 flex flex-col items-center gap-1 text-[10px] sm:text-xs text-slate-300 top-6 lg:top-auto lg:bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-xl w-[90%] sm:w-max text-center">
          <div className="flex items-center justify-center gap-2">
            <span>Desenvolvido por <span className="font-bold">João Paulo Militão</span></span>
            <a href="https://github.com/jaopaulomilitao" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <FaGithub size={14} />
            </a>
            <a href="https://www.linkedin.com/in/joao-paulo-militao/" target="_blank" rel="noreferrer" className="hover:text-[#0A66C2] transition-colors">
              <FaLinkedin size={14} />
            </a>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span>Orientado por <span className="font-bold">Iális Cavalcante de Paula Junior</span></span>
            <a href="https://www.linkedin.com/in/ialis-cavalcante-046b3513/" target="_blank" rel="noreferrer" className="hover:text-[#0A66C2] transition-colors">
              <FaLinkedin size={14} />
            </a>
          </div>
          <span className="font-mono text-[10px] mt-0.5 opacity-50">v0.2.0</span>
        </div>

        <section className="absolute inset-0 flex items-end justify-center md:justify-end p-8 md:p-12 pointer-events-none">
          <div className="flex flex-col items-start bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/50 shadow-2xl max-w-sm pointer-events-auto">
            <img src="/ui/logo-horizontal.svg" alt="Logo" className="h-10 mb-6" />
            <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight leading-none">
              Explore a computação gráfica.
            </h1>
            <p className="text-slate-600 mb-8 text-sm font-medium leading-relaxed">
              Domine os fundamentos da computação gráfica de um jeito prático, visual e divertido.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-700 transition-all shadow-lg active:scale-95"
            >
              Entrar na Plataforma
            </button>
          </div>
        </section>
      </div>

      {/* o fundo pontilhado é movido para cá, com z-0, garantindo que o canvas 3d renderize por cima */}
      <div
        className="absolute inset-0 z-0 opacity-[0.3] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#334155 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* é envolvido o canvas com z-10 para ter certeza da ordem de empilhamento */}
      <div className="absolute inset-0 z-10">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: false,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
          }}
        >
          <Suspense fallback={null}>
            <ClassroomScene onLoaded={() => setIsSceneLoaded(true)} />
          </Suspense>
        </Canvas>
      </div>
    </main>
  );
}

useGLTF.preload("/3d/classroom.glb");