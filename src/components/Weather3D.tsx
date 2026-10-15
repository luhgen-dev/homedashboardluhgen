import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Cloud, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { WeatherCondition } from './AmbientWeather';

// Organic Cloud - Optimized for mobile performance
const DriftingCloud = ({ speed = 0.5, position = [0, 0, 0], segments = 15, ...props }: any) => {
  const ref1 = useRef<THREE.Group>(null);
  const ref2 = useRef<THREE.Group>(null);
  const wrapDistance = 80;
  
  const cloudSeed = useMemo(() => Math.random() * 100, []);
  
  useFrame((state, delta) => {
    if (ref1.current && ref2.current) {
      const move = delta * speed;
      ref1.current.position.x += move;
      ref2.current.position.x += move;

      if (ref1.current.position.x > position[0] + wrapDistance) ref1.current.position.x -= wrapDistance * 2;
      if (ref2.current.position.x > position[0] + wrapDistance) ref2.current.position.x -= wrapDistance * 2;
    }
  });

  return (
    <group>
      <group ref={ref1} position={position}>
        <Cloud speed={0} seed={cloudSeed} segments={segments} {...props} />
      </group>
      <group ref={ref2} position={[position[0] - wrapDistance, position[1], position[2]]}>
        <Cloud speed={0} seed={cloudSeed} segments={segments} {...props} />
      </group>
    </group>
  );
};

// Optimized Rain particles - Using simple planes for better GPU performance
const Rain = ({ count = 500, color = "#ffffff", opacity = 0.2 }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 50,
        y: Math.random() * 40,
        z: 9.5 - Math.random() * 40,
        speed: 0.6 + Math.random() * 0.4
      });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const particle = particles[i];
      particle.y -= particle.speed;
      particle.x -= particle.speed * 0.05;
      
      if (particle.y < -15) {
        particle.y = 25;
        particle.x = (Math.random() - 0.5) * 50;
      }
      
      dummy.position.set(particle.x, particle.y, particle.z);
      // Scale is constant, so we can set it once if we were smarter, 
      // but let's just keep it simple for now.
      dummy.scale.set(0.01, 1.5, 1);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
    </instancedMesh>
  );
};

// CSS-based Rain Overlay for realistic water droplets on glass
// Optimized for mobile by using a single container blur and refractive gradients
const RainOverlay = ({ heavy = false }) => {
  const staticDropsCount = heavy ? 40 : 20;
  const slidingDropsCount = heavy ? 10 : 5;
  
  const staticDrops = useMemo(() => {
    return Array.from({ length: staticDropsCount }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 2,
      opacity: Math.random() * 0.4 + 0.3,
      heightAdd: Math.random() * 1.5
    }));
  }, [staticDropsCount]);

  const slidingDrops = useMemo(() => {
    return Array.from({ length: slidingDropsCount }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * -20,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2
    }));
  }, [slidingDropsCount]);
  
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden backdrop-blur-[1px]">
      {/* Static droplets - using gradients instead of per-drop blur for performance */}
      {staticDrops.map((drop, i) => (
        <div
          key={`static-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${drop.left}%`,
            top: `${drop.top}%`,
            width: `${drop.size}px`,
            height: `${drop.size + drop.heightAdd}px`,
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(0, 0, 0, 0.1) 100%)',
            boxShadow: 'inset 0px -1px 1px rgba(255,255,255,0.3), 0px 1px 2px rgba(0,0,0,0.2)',
            opacity: drop.opacity,
          }}
        />
      ))}
      
      {/* Sliding droplets */}
      {slidingDrops.map((drop, i) => (
        <div
          key={`slide-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${drop.left}%`,
            top: `${drop.top}%`,
            width: `${drop.size}px`,
            height: `${drop.size * 1.3}px`,
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 60%, rgba(0, 0, 0, 0.2) 100%)',
            boxShadow: 'inset 0px -1px 1px rgba(255,255,255,0.4), 0px 2px 3px rgba(0,0,0,0.3)',
            animation: `glass-slide ${drop.duration}s ease-in infinite`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes glass-slide {
          0% { transform: translateY(0) scaleY(1); opacity: 0; }
          5% { opacity: 1; }
          50% { transform: translateY(40vh) scaleY(1.1); }
          80% { transform: translateY(70vh) scaleY(1.3); opacity: 1; }
          100% { transform: translateY(100vh) scaleY(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Lightning effect - Atmospheric illumination, flashes background and fog
const Lightning = () => {
  const flashOpacity = useRef(0);
  const lightRef = useRef<THREE.AmbientLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const { scene } = useThree();

  const baseColor = useMemo(() => new THREE.Color('#1a202c'), []);
  const flashColor = useMemo(() => new THREE.Color('#7a90b0'), []);

  useFrame((state, delta) => {
    if (Math.random() > 0.98) {
      flashOpacity.current = 0.8 + Math.random() * 0.5;
    } else {
      flashOpacity.current = THREE.MathUtils.lerp(flashOpacity.current, 0, 0.15);
    }
    
    // Only update if opacity is significant to save cycles
    if (flashOpacity.current > 0.01) {
      if (lightRef.current) {
        lightRef.current.intensity = 0.2 + flashOpacity.current * 3.0;
      }
      if (dirLightRef.current) {
        dirLightRef.current.intensity = flashOpacity.current * 8.0;
      }
      
      if (scene.background instanceof THREE.Color) {
        scene.background.lerpColors(baseColor, flashColor, flashOpacity.current);
      }
      if (scene.fog instanceof THREE.Fog) {
        scene.fog.color.lerpColors(baseColor, flashColor, flashOpacity.current);
      }
    } else if (flashOpacity.current > 0) {
      // Reset to base when flash is over
      if (lightRef.current) lightRef.current.intensity = 0.2;
      if (dirLightRef.current) dirLightRef.current.intensity = 0;
      if (scene.background instanceof THREE.Color) scene.background.copy(baseColor);
      if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(baseColor);
      flashOpacity.current = 0;
    }
  });

  return (
    <>
      <ambientLight ref={lightRef} intensity={0.2} color="#88aaff" />
      <directionalLight ref={dirLightRef} position={[5, 15, -5]} color="#ffffff" intensity={0} />
    </>
  );
}

// Moon component with glow
const Moon = ({ fraction = 0.5 }: { fraction?: number }) => {
  // Illumination is 0 at new moon, 1 at full moon
  const illumination = 1 - Math.abs(0.5 - fraction) * 2;
  
  // Calculate the light intensity and glow opacity based on illumination
  const lightIntensity = 0.5 + (illumination * 2.0);
  const glowOpacity1 = 0.05 + (illumination * 0.1);
  const glowOpacity2 = 0.02 + (illumination * 0.03);

  const uniforms = useMemo(() => ({
    lightDir: { value: new THREE.Vector3(0, 0, 1) },
    moonColor: { value: new THREE.Color('#eef4ff') },
    ambientColor: { value: new THREE.Color('#0f172a') }
  }), []);

  useEffect(() => {
    // Angle of the sun relative to the moon
    // We calculate this in view space so the phase always faces the camera correctly
    const angle = (0.5 - fraction) * Math.PI * 2;
    const sunX = Math.sin(angle);
    const sunZ = Math.cos(angle);
    uniforms.lightDir.value.set(sunX, 0, sunZ).normalize();
  }, [fraction, uniforms]);

  return (
    <group position={[0, 15, -60]} scale={2}>
      {/* The Moon itself */}
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <shaderMaterial 
          uniforms={uniforms}
          vertexShader={`
            varying vec3 vNormalView;
            void main() {
              // Calculate normal in view space so lighting is relative to the camera
              vNormalView = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormalView;
            uniform vec3 lightDir;
            uniform vec3 moonColor;
            uniform vec3 ambientColor;
            void main() {
              // Both normal and lightDir are in view space
              float dotNL = dot(normalize(vNormalView), normalize(lightDir));
              // Soft terminator line for realistic lunar shading
              float intensity = smoothstep(-0.1, 0.3, dotNL);
              
              // Mix ambient dark color with the lit moon color
              vec3 finalColor = mix(ambientColor, moonColor, intensity);
              
              gl_FragColor = vec4(finalColor, 1.0);
            }
          `}
        />
      </mesh>
      {/* Moon glow */}
      <mesh>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial color="#aaccff" transparent opacity={glowOpacity1} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial color="#aaccff" transparent opacity={glowOpacity2} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
      </mesh>
      {/* Moonlight emitting from the moon */}
      <pointLight intensity={lightIntensity} color="#c7d2fe" distance={150} decay={2} />
    </group>
  );
};

// Organic, zonal twinkling stars - strictly in background to preserve clouds
const OrganicZonalStars = ({ count = 3000 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const [positions, randoms] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Place stars strictly in the deep background so they never occlude clouds
      positions[i * 3] = (Math.random() - 0.5) * 400;     // X spread
      positions[i * 3 + 1] = -10 + Math.random() * 200;   // Y (mostly above horizon)
      positions[i * 3 + 2] = -80 - Math.random() * 100;   // Z (strictly deep background)
      
      randoms[i] = Math.random();
    }
    return [positions, randoms];
  }, [count]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    color: { value: new THREE.Color('#ffffff') }
  }), []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aRandom" count={count} array={randoms} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        fog={false}
        uniforms={uniforms}
        vertexShader={`
          uniform float time;
          attribute float aRandom;
          varying float vAlpha;
          
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Safe point size calculation
            gl_PointSize = (1.5 + aRandom * 2.0) * (150.0 / max(1.0, -mvPosition.z));
            
            // Zonal twinkling logic: slow spatial waves
            float waveX = sin(position.x * 0.01 + time * 0.05);
            float waveY = cos(position.y * 0.01 + time * 0.04);
            float waveZ = sin(position.z * 0.01 + time * 0.06);
            float zone = waveX * waveY * waveZ;
            
            // Individual slow pulse
            float pulse = sin(time * 0.1 + aRandom * 6.28);
            
            // Combine and map to alpha
            float combined = zone * 0.7 + pulse * 0.3;
            vAlpha = smoothstep(-0.5, 0.8, combined) * 1.2 + 0.2;
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          varying float vAlpha;
          void main() {
            // Circular particle with soft edge
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = (1.0 - dist * 2.0) * vAlpha;
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </points>
  );
};

// Shooting Star effect for cinematic night sky
const ShootingStar = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const resetStar = () => {
    if (!meshRef.current || !materialRef.current) return null;
    
    // Start position: high up, spread across X
    const startX = (Math.random() - 0.5) * 120; 
    const startY = 30 + Math.random() * 20; 
    const startZ = -50 - Math.random() * 40; // Deep background
    
    // End position: lower down, shifted X
    const endX = startX + (Math.random() - 0.5) * 80;
    const endY = startY - 40 - Math.random() * 30;
    
    const dx = endX - startX;
    const dy = endY - startY;
    
    // Calculate angle to align the streak visually
    const angle = Math.atan2(dy, dx);
    meshRef.current.rotation.z = angle - Math.PI / 2;
    
    meshRef.current.position.set(startX, startY, startZ);
    materialRef.current.uniforms.opacity.value = 0;
    
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    return {
      active: false,
      timer: Math.random() * 20 + 10, // Much slower interval: 10 to 30 seconds
      speed: 10 + Math.random() * 10, // Slower speed so it drifts elegantly
      vx: dx / distance,
      vy: dy / distance,
      life: 0
    };
  };

  const state = useRef<any>(null);

  useEffect(() => {
    state.current = resetStar();
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current || !state.current) return;

    if (!state.current.active) {
      state.current.timer -= delta;
      if (state.current.timer <= 0) {
        state.current.active = true;
        state.current.life = 1.0;
      }
    } else {
      // Move along the calculated velocity vector
      meshRef.current.position.x += state.current.vx * state.current.speed * delta;
      meshRef.current.position.y += state.current.vy * state.current.speed * delta;
      
      state.current.life -= delta * 0.7; // Fade out slower
      
      // Opacity curve: quick fade in, slower fade out
      let currentOpacity = 0;
      if (state.current.life > 0.8) {
        currentOpacity = (1 - state.current.life) * 5; // 0 to 1
      } else {
        currentOpacity = state.current.life;
      }
      materialRef.current.uniforms.opacity.value = currentOpacity;

      if (state.current.life <= 0) {
        state.current = resetStar();
      }
    }
  });

  // Custom shader for organic shooting star (bright head, fading tail)
  const uniforms = useMemo(() => ({
    opacity: { value: 0.0 }
  }), []);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[0.6, 12]} />
      <shaderMaterial 
        ref={materialRef} 
        transparent 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
        fog={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float opacity;
          void main() {
            // Center the X coordinate
            float distX = abs(vUv.x - 0.5);
            
            // Create a teardrop shape: wider at the head (vUv.y = 1.0), tapering to the tail (vUv.y = 0.0)
            float thickness = mix(0.0, 0.15, pow(vUv.y, 2.0));
            
            // Core glow of the streak
            float core = smoothstep(thickness, 0.0, distX);
            
            // Super bright head
            float head = smoothstep(0.85, 1.0, vUv.y) * smoothstep(0.2, 0.0, distX);
            
            // Combine and apply opacity
            float alpha = (core * pow(vUv.y, 1.5) + head) * opacity;
            
            // Color gradient: white head, slightly blue/cyan tail
            vec3 color = mix(vec3(0.6, 0.8, 1.0), vec3(1.0, 1.0, 1.0), vUv.y);
            
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
};

const ShootingStars = ({ count = 5 }) => {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <ShootingStar key={i} />
      ))}
    </group>
  );
};

export const Weather3D = React.memo(({ 
  condition, 
  moonFraction = 0.5,
  lowPower = false 
}: { 
  condition: WeatherCondition | 'sunset', 
  moonFraction?: number,
  lowPower?: boolean 
}) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {(condition === 'rainy' || condition === 'stormy') && (
        <RainOverlay heavy={condition === 'stormy'} />
      )}
      <Canvas 
        frameloop={lowPower ? "demand" : "always"}
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={lowPower ? [0.75, 1] : [1, 2]} // Lower dpr in screensaver/low-power mode for iPad GPU efficiency
        gl={{ antialias: false, powerPreference: "high-performance" }} // Disable expensive antialiasing
      >
        
        {/* Sunny - Soft directional light, warm haze, atmospheric depth */}
        {condition === 'sunny' && (
          <>
            <color attach="background" args={['#5a9ecf']} />
            <fog attach="fog" args={['#5a9ecf', 20, 100]} />
            <ambientLight intensity={0.6} color="#ffffff" />
            <directionalLight position={[10, 20, 10]} intensity={1.2} color="#fff4e6" />
            <Sky distance={450000} sunPosition={[10, 20, 10]} inclination={0} azimuth={0.25} rayleigh={0.5} turbidity={2} />
            <DriftingCloud speed={0.5} position={[-20, 8, -30]} opacity={0.25} scale={1.5} segments={6} />
            <DriftingCloud speed={0.3} position={[10, 12, -40]} opacity={0.2} scale={2} segments={6} />
            <DriftingCloud speed={0.4} position={[25, 15, -50]} opacity={0.15} scale={1.8} segments={6} />
            <DriftingCloud speed={0.2} position={[-10, 18, -45]} opacity={0.1} scale={2.5} segments={6} />
          </>
        )}

        {/* Sunset / Golden Hour - Warm oranges, pinks, and purples */}
        {condition === 'sunset' && (
          <>
            <color attach="background" args={['#ff8c42']} />
            <fog attach="fog" args={['#ff8c42', 10, 80]} />
            <ambientLight intensity={0.4} color="#ffb347" />
            <directionalLight position={[0, 5, -30]} intensity={1.5} color="#ff5e62" />
            <Sky distance={450000} sunPosition={[0, 2, -10]} inclination={0.49} azimuth={0.25} rayleigh={3} turbidity={10} mieCoefficient={0.005} mieDirectionalG={0.8} />
            <DriftingCloud speed={0.4} position={[-15, 8, -25]} opacity={0.4} color="#ff7b54" scale={2} segments={8} />
            <DriftingCloud speed={0.6} position={[15, 12, -20]} opacity={0.3} color="#c15c5c" scale={2.5} segments={8} />
          </>
        )}

        {/* Cloudy - Diffused cool light, soft shading, layered depth */}
        {condition === 'cloudy' && (
          <>
            <color attach="background" args={['#7a8a99']} />
            <fog attach="fog" args={['#7a8a99', 10, 60]} />
            <ambientLight intensity={0.7} color="#ffffff" />
            <directionalLight position={[5, 20, 10]} intensity={0.3} color="#e0e8f0" />
            <Sky distance={450000} sunPosition={[10, 20, 10]} inclination={0} azimuth={0.25} turbidity={15} rayleigh={3} />
            
            {/* Parallax layers of soft clouds moving slowly in one direction */}
            <DriftingCloud speed={0.8} position={[-25, 5, -20]} opacity={0.4} scale={2.5} segments={10} />
            <DriftingCloud speed={0.5} position={[5, 8, -15]} opacity={0.5} scale={2} segments={10} />
            <DriftingCloud speed={0.3} position={[-15, 12, -25]} opacity={0.3} scale={3} segments={10} />
          </>
        )}

        {/* Rainy - Muted desaturated tones, foggy distance */}
        {condition === 'rainy' && (
          <>
            <color attach="background" args={['#4a5568']} />
            <fog attach="fog" args={['#4a5568', 5, 40]} />
            <ambientLight intensity={0.5} color="#b0c4de" />
            <directionalLight position={[10, 20, 10]} intensity={0.1} />
            <DriftingCloud speed={1.0} position={[-20, 5, -20]} opacity={0.6} color="#778899" scale={2} segments={10} />
            <DriftingCloud speed={0.8} position={[10, 8, -15]} opacity={0.7} color="#607080" scale={2.5} segments={10} />
            <Rain count={600} color="#cdd5e0" opacity={0.2} />
          </>
        )}

        {/* Stormy - Deeper contrast, subtle tension, atmospheric flashes */}
        {condition === 'stormy' && (
          <>
            <color attach="background" args={['#1a202c']} />
            <fog attach="fog" args={['#1a202c', 5, 30]} />
            <ambientLight intensity={0.2} color="#708090" />
            <DriftingCloud speed={1.5} position={[-20, 5, -20]} opacity={0.8} color="#2d3748" scale={2.5} segments={10} />
            <DriftingCloud speed={1.2} position={[10, 8, -15]} opacity={0.9} color="#1a202c" scale={3} segments={10} />
            <Rain count={1000} color="#a0aec0" opacity={0.3} />
            <Lightning />
          </>
        )}

        {/* Night - Deep cool grading, faint cloud haze, subtle stars, aurora */}
        {condition === 'night' && (() => {
          const illumination = 1 - Math.abs(0.5 - moonFraction) * 2;
          const cloudOpacity = 0.7 + (illumination * 0.3); // 0.7 to 1.0
          
          return (
            <>
              {/* Deep realistic night sky background (almost black) */}
              <color attach="background" args={['#050710']} />
              <fog attach="fog" args={['#050710', 40, 140]} />
              
              {/* Ambient light increased slightly so clouds aren't pitch black */}
              <ambientLight intensity={0.2 + (illumination * 0.2)} color="#2a3b5c" />
              
              {/* Moonlight from behind the clouds */}
              <directionalLight position={[0, 20, -35]} intensity={1.0 + (illumination * 2.0)} color="#dbeafe" />
              
              {/* Front fill light to illuminate the clouds so they aren't black silhouettes */}
              <directionalLight position={[0, 10, 20]} intensity={0.6} color="#94a3b8" />
              <directionalLight position={[-10, -10, 20]} intensity={0.3} color="#64748b" />
              
              {/* Layered stars: organic zonal twinkling stars */}
              <OrganicZonalStars count={3500} />
              
              <ShootingStars count={1} />
              
              {/* Voluminous, majestic clouds framing the sky - brighter moonlit colors */}
              <DriftingCloud speed={0.15} position={[-18, 5, -25]} opacity={cloudOpacity * 0.6} color="#cbd5e1" scale={2.5} segments={8} />
              <DriftingCloud speed={0.1} position={[20, 8, -28]} opacity={cloudOpacity * 0.5} color="#94a3b8" scale={3.0} segments={8} />
              <DriftingCloud speed={0.2} position={[0, -8, -20]} opacity={cloudOpacity * 0.4} color="#e2e8f0" scale={3.5} segments={8} />
              <DriftingCloud speed={0.25} position={[-5, 18, -35]} opacity={cloudOpacity * 0.3} color="#94a3b8" scale={2.0} segments={8} />
            </>
          );
        })()}
      </Canvas>
    </div>
  );
});
