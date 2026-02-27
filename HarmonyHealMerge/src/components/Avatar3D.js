import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, MeshDistortMaterial, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// --- Organs ---
const Heart = ({ hitEvent }) => {
    const meshRef = useRef();
    // Load from the public directory as a static HTTP asset string
    const { scene } = useGLTF('/a_voxel_heart.glb');
    const [heartColor, setHeartColor] = useState("#dd2222"); // Deep fleshy red
    const [heartIntensity, setHeartIntensity] = useState(1);

    useFrame((state) => {
        // Complex double-beat rhythm
        if (meshRef.current) {
            const t = state.clock.elapsedTime * 3;
            const pulse = 1 + Math.pow(Math.sin(t), 12) * 0.08 + Math.pow(Math.sin(t + 0.5), 12) * 0.04;
            meshRef.current.scale.set(pulse, pulse, pulse);
        }
    });

    useEffect(() => {
        if (hitEvent && hitEvent.hit === 'Heart') {
            setHeartColor('#00ff00'); // Neon green on heal
            setHeartIntensity(4);     
            setTimeout(() => {
                setHeartColor('#dd2222');
                setHeartIntensity(1);
            }, 1000);
        }
    }, [hitEvent]);

    // Apply dynamic glowing material to the imported 3D artist mesh
    const heartMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: heartColor, 
        emissive: heartColor, 
        emissiveIntensity: heartIntensity, 
        roughness: 0.4 
    }), [heartColor, heartIntensity]);

    const clonedScene = useMemo(() => {
        if (!scene) return null;
        const clone = scene.clone(true);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = heartMaterial;
            }
        });
        return clone;
    }, [scene, heartMaterial]);

    return (
        // Heart nested absolutely in chest center (y=0.55, w=0.05)
        <group ref={meshRef} position={[0, 0.55, 0.05]} name="Heart">
            {clonedScene && (
                <primitive 
                    object={clonedScene} 
                    scale={0.001} 
                    position={[0, -0.1, 0]} 
                    rotation={[0, Math.PI, 0]}
                />
            )}
        </group>
    );
};

const Brain = ({ hitEvent }) => {
    const meshRef = useRef();
    const [color, setColor] = useState("#8a2be2"); // Neural purple
    const [intensity, setIntensity] = useState(1.5);

    // Neural pulsing animation
    useFrame((state) => {
        if (meshRef.current) {
            // Slow, deliberate throb
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
            meshRef.current.scale.set(pulse, pulse, pulse);
        }
    });

    useEffect(() => {
        if (hitEvent && hitEvent.hit === 'Brain') {
            setColor('#2ecc71'); // Neon Green
            setIntensity(6);     
            setTimeout(() => {
                setColor('#8a2be2');
                setIntensity(1.5);
            }, 1000);
        }
    }, [hitEvent]);

    return (
        // Brain sits absolutely in the cranium (y=1.05) scaled tightly
        <group ref={meshRef} position={[0, 1.05, 0.03]} name="Brain" rotation={[0.1, 0, 0]} scale={[0.1, 0.1, 0.1]}>
            {/* Left Hemisphere - Wraps slightly forward and back */}
            <mesh position={[-0.14, 0.05, 0]} rotation={[0, 0, 0.1]}>
                <sphereGeometry args={[0.22, 32, 32]} />
                <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={intensity} distort={0.4} speed={1.5} roughness={0.6} />
            </mesh>
            
            {/* Right Hemisphere */}
            <mesh position={[0.14, 0.05, 0]} rotation={[0, 0, -0.1]}>
                <sphereGeometry args={[0.22, 32, 32]} />
                <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={intensity} distort={0.4} speed={1.5} roughness={0.6} />
            </mesh>

            {/* Cerebellum (Bottom Rear) */}
            <mesh position={[0, -0.1, -0.15]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.8} distort={0.5} speed={3} roughness={0.7} />
            </mesh>
            
            {/* Frontal Lobe Extrusion */}
            <mesh position={[0, 0.05, 0.12]}>
                <sphereGeometry args={[0.18, 24, 24]} />
                <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={intensity * 1.2} distort={0.3} speed={1} roughness={0.5} />
            </mesh>

            {/* Brain Stem */}
            <mesh position={[0, -0.25, -0.05]} rotation={[-0.2, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.03, 0.2, 16]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.5} roughness={0.8} />
            </mesh>
        </group>
    );
};

const Lungs = ({ hitEvent }) => {
    const meshRef = useRef();
    // Load from the public directory as a static HTTP asset string
    const { scene } = useGLTF('/voxel_lungs.glb');
    const [color, setColor] = useState("#ff99cc"); // Pale pink
    const [intensity, setIntensity] = useState(1.5);

    useFrame((state) => {
        if (meshRef.current) {
            // Breathing animation (syncs with body breath)
            const breath = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
            meshRef.current.scale.set(breath, breath, breath);
        }
    });

    useEffect(() => {
        if (hitEvent && hitEvent.hit === 'Lungs') {
            setColor('#2ecc71'); // Neon Green
            setIntensity(6);     
            setTimeout(() => {
                setColor('#ff99cc');
                setIntensity(1.5);
            }, 1000);
        }
    }, [hitEvent]);

    const lungMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: color, 
        emissive: color, 
        emissiveIntensity: intensity, 
        roughness: 0.6,
        transparent: true,
        opacity: 0.8
    }), [color, intensity]);

    const clonedScene = useMemo(() => {
        if (!scene) return null;
        const clone = scene.clone(true);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = lungMaterial;
            }
        });
        return clone;
    }, [scene, lungMaterial]);

    return (
        // Lungs perfectly frame the heart
        <group ref={meshRef} name="Lungs" position={[0, 0.55, -0.03]}>
            {clonedScene && (
                <primitive 
                    object={clonedScene} 
                    scale={0.006} 
                    position={[0, -0.08, 0]}
                    rotation={[0, Math.PI, 0]}
                />
            )}
        </group>
    );
};

const Digestion = ({ hitEvent }) => {
    const meshRef = useRef();
    const [color, setColor] = useState("#f39c12"); // Golden Yellow
    const [intensity, setIntensity] = useState(1.5);

    useFrame((state) => {
        if (meshRef.current) {
            // Slow digestive churning animation
            const churn = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
            meshRef.current.scale.set(1, churn, 1);
        }
    });

    useEffect(() => {
        if (hitEvent && hitEvent.hit === 'Digestion') {
            setColor('#2ecc71'); // Neon Green
            setIntensity(6);     
            setTimeout(() => {
                setColor('#f39c12');
                setIntensity(1.5);
            }, 1000);
        }
    }, [hitEvent]);

    // Complex Esophagus curve
    const esophagusCurve = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.6, 0.05),
        new THREE.Vector3(0, 0.2, 0.05),
        new THREE.Vector3(-0.05, 0.1, 0.08)
    ]), []);

    // Large Intestine (Outer frame)
    const largeIntestineCurve = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.12, -0.15, 0.15),
        new THREE.Vector3(0.15, -0.3, 0.12),
        new THREE.Vector3(-0.15, -0.35, 0.12),
        new THREE.Vector3(-0.12, -0.7, 0.1),
        new THREE.Vector3(0, -0.85, 0.1),
    ]), []);

    // Small Intestine (Tightly coiled inner path)
    const smallIntestineCurve = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.1, 0, 0.12),
        new THREE.Vector3(0, -0.1, 0.15),
        new THREE.Vector3(-0.08, -0.15, 0.16),
        new THREE.Vector3(0.08, -0.2, 0.14),
        new THREE.Vector3(-0.05, -0.25, 0.16),
        new THREE.Vector3(0.05, -0.3, 0.15),
        new THREE.Vector3(0, -0.35, 0.14),
    ]), []);

    return (
        // Digestion scaled down cleanly and sits precisely below chest
        <group ref={meshRef} position={[0, 0.25, -0.02]} name="Digestion" scale={[0.2, 0.2, 0.2]}>
            {/* Stomach */}
            <mesh position={[-0.1, 0.05, 0.12]} rotation={[0, 0, 0.3]}>
                <capsuleGeometry args={[0.08, 0.15, 16, 16]} />
                <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={intensity} distort={0.2} speed={1} roughness={0.5} />
            </mesh>
            
            {/* Esophagus Tube */}
            <mesh>
                <tubeGeometry args={[esophagusCurve, 16, 0.02, 8, false]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.8} />
            </mesh>

            {/* Small Intestines (Coiled) */}
            <mesh>
                <tubeGeometry args={[smallIntestineCurve, 64, 0.04, 8, false]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 1.2} roughness={0.4} />
            </mesh>

            {/* Large Intestines (Outer) */}
            <mesh>
                <tubeGeometry args={[largeIntestineCurve, 32, 0.06, 8, false]} />
                <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.9} distort={0.15} speed={0.5} roughness={0.6} />
            </mesh>
        </group>
    );
};

const ReproductiveSystem = ({ hitEvent, gender }) => {
    const meshRef = useRef();
    const [color, setColor] = useState(gender === 'female' ? "#e056fd" : "#4834d4"); // Pinkish vs Deep Blue
    const [intensity, setIntensity] = useState(1.5);

    useFrame((state) => {
        if (meshRef.current) {
            const throb = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
            meshRef.current.scale.set(throb, throb, throb);
        }
    });

    useEffect(() => {
        if (hitEvent && hitEvent.hit === 'Reproductive') {
            setColor('#2ecc71'); // Neon Green
            setIntensity(6);     
            setTimeout(() => {
                setColor(gender === 'female' ? "#e056fd" : "#4834d4");
                setIntensity(1.5);
            }, 1000);
        }
    }, [hitEvent, gender]);

    // Female parts
    const fallopianLeft = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.35, 0),
        new THREE.Vector3(-0.08, -0.3, 0),
        new THREE.Vector3(-0.15, -0.35, 0.02)
    ]), []);
    
    const fallopianRight = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.35, 0),
        new THREE.Vector3(0.08, -0.3, 0),
        new THREE.Vector3(0.15, -0.35, 0.02)
    ]), []);

    // Male parts
    const vasLeft = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.4, 0),
        new THREE.Vector3(-0.05, -0.38, 0.03),
        new THREE.Vector3(-0.06, -0.5, 0.05)
    ]), []);
    
    const vasRight = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.4, 0),
        new THREE.Vector3(0.05, -0.38, 0.03),
        new THREE.Vector3(0.06, -0.5, 0.05)
    ]), []);

    return (
        // Repro system sits absolutely in the pelvis cavity
        <group ref={meshRef} position={[0, -0.05, 0]} name="Reproductive" scale={[0.2, 0.2, 0.2]}>
            {gender === 'female' ? (
                <>
                    {/* Uterus */}
                    <mesh position={[0, -0.4, 0.02]} rotation={[0, 0, Math.PI]}>
                        <coneGeometry args={[0.08, 0.15, 16]} />
                        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={intensity} distort={0.1} speed={2} roughness={0.4} />
                    </mesh>
                    {/* Fallopian Tubes */}
                    <mesh>
                        <tubeGeometry args={[fallopianLeft, 16, 0.015, 8, false]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.8} />
                    </mesh>
                    <mesh>
                        <tubeGeometry args={[fallopianRight, 16, 0.015, 8, false]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.8} />
                    </mesh>
                    {/* Ovaries */}
                    <mesh position={[-0.16, -0.38, 0.03]}>
                        <sphereGeometry args={[0.03, 16, 16]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 1.2} />
                    </mesh>
                    <mesh position={[0.16, -0.38, 0.03]}>
                        <sphereGeometry args={[0.03, 16, 16]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 1.2} />
                    </mesh>
                </>
            ) : (
                <>
                    {/* Prostate/Base */}
                    <mesh position={[0, -0.45, 0.02]}>
                        <sphereGeometry args={[0.05, 16, 16]} />
                        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={intensity} distort={0.1} speed={2} roughness={0.4} />
                    </mesh>
                    {/* Vas Deferens */}
                    <mesh>
                        <tubeGeometry args={[vasLeft, 16, 0.01, 8, false]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.8} />
                    </mesh>
                    <mesh>
                        <tubeGeometry args={[vasRight, 16, 0.01, 8, false]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.8} />
                    </mesh>
                    {/* Testes */}
                    <mesh position={[-0.06, -0.55, 0.05]} rotation={[0, 0, 0.2]}>
                        <capsuleGeometry args={[0.025, 0.04, 16, 16]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 1.2} />
                    </mesh>
                    <mesh position={[0.06, -0.55, 0.05]} rotation={[0, 0, -0.2]}>
                        <capsuleGeometry args={[0.025, 0.04, 16, 16]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 1.2} />
                    </mesh>
                </>
            )}
        </group>
    );
};

const Ribcage = () => {
    // Math-generated skeleton wrapping the organs
    const ribs = useMemo(() => {
        const curves = [];
        const numRibs = 8;
        for (let i = 0; i < numRibs; i++) {
            // Absolute ribcage placement spanning upper chest
            const y = 0.8 - (i * 0.09); 
            // The rib cage gets slightly narrower towards the bottom
            const width = 0.23 - (i * 0.01);
            const drop = 0.06; // Ribs slope downwards towards the front
            const frontZ = 0.16 - (i * 0.005);
            
            // Left rib
            curves.push(new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, y, -0.12),           // Spine attachment
                new THREE.Vector3(-width, y - drop/2, 0),  // Curving around the side
                new THREE.Vector3(-0.04, y - drop, frontZ), // Attached to sternum
            ]));
            
            // Right rib
            curves.push(new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, y, -0.12),
                new THREE.Vector3(width, y - drop/2, 0),
                new THREE.Vector3(0.04, y - drop, frontZ),
            ]));
        }
        return curves;
    }, []);

    // Ghostly blue-grey bone material
    const boneMaterialParams = { color: "#88ccff", emissive: "#112233", roughness: 0.8, transparent: true, opacity: 0.5 };

    return (
        // Skeleton maps absolutely to upper chest framing heart and lungs
        <group name="Skeleton" position={[0, 0.35, 0]} scale={[0.4, 0.4, 0.4]}>
            {/* Spine */}
            <mesh position={[0, 0.5, -0.15]}>
                <cylinderGeometry args={[0.04, 0.03, 0.8, 16]} />
                <meshStandardMaterial {...boneMaterialParams} />
            </mesh>
            
            {/* Sternum (breastbone) */}
            <mesh position={[0, 0.5, 0.16]} rotation={[0.1, 0, 0]}>
                <capsuleGeometry args={[0.03, 0.5, 8, 8]} />
                <meshStandardMaterial {...boneMaterialParams} />
            </mesh>

            {/* Ribs loops */}
            {ribs.map((curve, index) => (
                <mesh key={index}>
                    <tubeGeometry args={[curve, 16, 0.015, 8, false]} />
                    <meshStandardMaterial {...boneMaterialParams} />
                </mesh>
            ))}
        </group>
    );
};


// --- Outer Body ---
const ProceduralBody = React.forwardRef(({ hitEvent, gender, forwardedRef }, ref) => {
    const groupRef = useRef();
    // Extract the full character scene graph
    const { scene: rawHumanScene } = useGLTF('/HumanModels.glb');

    // Animations
    useFrame((state, delta) => {
        if (groupRef.current) {
            // Hovering
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 0.5;
            // Breathing (scale chest slightly)
            const breath = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
            groupRef.current.scale.set(breath, 1, breath);
            // Slow rotation to show off 3D
            groupRef.current.rotation.y += delta * 0.2;
        }
    });

    React.useImperativeHandle(forwardedRef, () => groupRef.current);

    // Advanced X-Ray/Glass Material
    const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#00ffff", 
        transmission: 0.95, // Glass effect
        opacity: 1,
        metalness: 0.1,
        roughness: 0.1,
        ior: 1.2,
        thickness: 0.5,
        transparent: true,
        side: THREE.BackSide, // Show inner walls
        depthWrite: false // Helps see organs inside
    }), []);

    // Clone only ONE human mesh (NonRigged versions) from the 6-body pack
    const glassHuman = useMemo(() => {
        if (!rawHumanScene) return null;
        
        let targetMesh = null;
        const searchName = gender === 'female' ? 'Woman' : 'Man';
        
        // Find the specific mesh in the scene hierarchy
        rawHumanScene.traverse((child) => {
            if (child.name.includes(searchName) && child.name.includes('NonRig')) {
                targetMesh = child;
            }
        });

        if (!targetMesh) return null;

        const clone = targetMesh.clone(true);
        // Reset its massive local translation so it centers at (0,0,0)
        clone.position.set(0, 0, 0);

        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = bodyMaterial;
            }
        });
        return clone;
    }, [rawHumanScene, bodyMaterial, gender]);

    return (
        <group ref={groupRef}>
            {/* --- SKIN LYAER --- */}
            <group name="Body">
                {glassHuman ? (
                    <primitive 
                        object={glassHuman} 
                        // Restoring to 0.65 perfectly fits it in viewport bounding box
                        scale={0.65} 
                        // Bringing up from -2.4 because origin is centered, not feet
                        position={[0, -0.2, 0]} 
                    />
                ) : (
                    <mesh position={[0, 0.6, 0]} material={bodyMaterial}>
                        <capsuleGeometry args={[0.4, 1.0, 32, 32]} />
                    </mesh>
                )}
            </group>

            {/* --- INTERNAL ORGANS --- */}
            {/* Master offset removed, absolute coordinates reinstated natively */}
            <Ribcage />
            <Lungs hitEvent={hitEvent} />
            <Heart hitEvent={hitEvent} />
            <Brain hitEvent={hitEvent} />
            <Digestion hitEvent={hitEvent} />
            <ReproductiveSystem hitEvent={hitEvent} gender={gender} />

        </group>
    );
});

// ---------------------------------------------------------
// Raycasting System: Calculates 2D Screen Drop to 3D Space
// ---------------------------------------------------------
const DropRaycaster = ({ dropCoords, targetGroupRef, onHit }) => {
    const { camera, raycaster } = useThree();

    useEffect(() => {
        if (dropCoords && targetGroupRef.current) {
            raycaster.setFromCamera({ x: dropCoords.x, y: dropCoords.y }, camera);
            const intersects = raycaster.intersectObject(targetGroupRef.current, true);

            if (intersects.length > 0) {
                // Priority: Inner Organs always win over outer skin.
                const organNames = ['Heart', 'Brain', 'Digestion', 'Lungs', 'Reproductive'];
                let hitMeshName = 'Body';
                
                // Find if an organ was hit anywhere in the ray
                for (let intersect of intersects) {
                    // Travel up the parent chain to find the named group
                    let currentObj = intersect.object;
                    while (currentObj && currentObj !== targetGroupRef.current) {
                        if (organNames.includes(currentObj.name)) {
                            hitMeshName = currentObj.name;
                            break;
                        }
                        currentObj = currentObj.parent;
                    }
                    if (hitMeshName !== 'Body') break;
                }
                
                console.log(`[RAYCAST 3D] Hit target: ${hitMeshName} with item: ${dropCoords.remedyId}`);
                onHit(hitMeshName);
            } else {
                console.log("[RAYCAST 3D] Missed the 3D Avatar entirely.");
            }
        }
    }, [dropCoords]);

    return null; 
};

export default function Avatar3D({ dropCoords, gender, onHealSuccess }) {
    const groupRef = useRef();
    const [hitEvent, setHitEvent] = useState(null);

    const handleHit = (meshName) => {
        // Trigger visual ping on the hologram
        setHitEvent({ hit: meshName, timestamp: Date.now() });
        
        // Example Physics Rules
        if (meshName === 'Heart' && dropCoords?.remedyId === 'garlic') {
            onHealSuccess?.();
        } else if (meshName === 'Brain' && dropCoords?.remedyId === 'lavender') {
            onHealSuccess?.();
        } else if (meshName === 'Digestion' && dropCoords?.remedyId === 'ginger') {
            onHealSuccess?.();
        } else if (meshName === 'Lungs' && dropCoords?.remedyId === 'chamomile') {
            onHealSuccess?.();
        }
    };
    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
            <Canvas style={styles.canvas}>
                <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={40} />
                
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <pointLight position={[-5, 5, -5]} color="#ffddaa" intensity={0.8} />
                
                <DropRaycaster 
                    dropCoords={dropCoords} 
                    targetGroupRef={groupRef} 
                    onHit={handleHit} 
                />
                
                {/* The Rotating Body and Organs */}
                <ProceduralBody 
                    forwardedRef={groupRef} 
                    hitEvent={hitEvent} 
                    gender={gender} 
                />

                <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    canvas: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1
    }
});
