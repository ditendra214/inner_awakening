import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { 
  RotateCw, ZoomIn, ZoomOut, RefreshCw, 
  Play, Pause, FastForward, User, Sparkles, Loader2, Footprints, Activity, Shield,
  Dumbbell, Zap, Award, Flame
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CharacterVisualCustomizer } from '../services/characterVisualCustomizer';
import { generateFitnessClips } from '../utils/fitnessAnimations';

// Only display Normal Man and Michelle
const AVAILABLE_MODELS = [
  { 
    id: 'normal_man', 
    name: 'Fitness Athlete', 
    icon: User, 
    path: '/assets/normal_man.glb',
    preferredOrder: ['Idle', 'Squat', 'JumpingJack', 'Victory', 'Run', 'Walk', 'TPose']
  },
  { 
    id: 'michelle', 
    name: 'Michelle Fit', 
    icon: Sparkles, 
    path: '/assets/Michelle.glb',
    preferredOrder: ['Idle', 'Squat', 'JumpingJack', 'Victory', 'SambaDance', 'TPose']
  },
];

// User-friendly animation label helper
const getAnimDisplayInfo = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('idle')) {
    return { label: 'IDLE', icon: Play };
  }
  if (lower.includes('squat')) {
    return { label: 'SQUAT', icon: Dumbbell };
  }
  if (lower.includes('jumping') || lower.includes('jack')) {
    return { label: 'JUMPING JACK', icon: Zap };
  }
  if (lower.includes('victory') || lower.includes('celebrate')) {
    return { label: 'VICTORY POSE', icon: Award };
  }
  if (lower.includes('walk')) {
    return { label: 'WALK', icon: Footprints };
  }
  if (lower.includes('run')) {
    return { label: 'RUN', icon: Activity };
  }
  if (lower.includes('dance') || lower.includes('samba')) {
    return { label: 'DANCE', icon: Sparkles };
  }
  if (lower.includes('pose') || lower.includes('tpose')) {
    return { label: 'T-POSE', icon: Shield };
  }
  return { label: name.toUpperCase(), icon: Play };
};

// ============================================================================
// COMPONENT: CharacterViewer3D
// ============================================================================
export const CharacterViewer3D = ({ 
  className = '',
  equippedOverride = null,
  selectedModelProp = null,
  onModelChange = null,
  previewAnimation = null,
  celebrateRankUp = false,
  showTopBar = true,
  showBottomBar = true
}) => {
  const mountRef = useRef(null);
  const { sound, playerEquipment } = useGame();

  // Active Equipment (authoritative or preview override)
  const effectiveEquipment = equippedOverride || playerEquipment || {};
  const currentEquipmentRef = useRef(effectiveEquipment);
  currentEquipmentRef.current = effectiveEquipment;
  const currentModelObjectRef = useRef(null);

  // Per-viewer isolated visual customizer instance
  const visualCustomizerRef = useRef(null);
  if (!visualCustomizerRef.current) {
    visualCustomizerRef.current = new CharacterVisualCustomizer();
  }
  const characterVisualCustomizer = visualCustomizerRef.current;

  // Character model selection (Only 'normal_man' & 'michelle')
  const [selectedModel, setSelectedModel] = useState(selectedModelProp || 'normal_man');
  
  // Animation state
  const [availableAnimations, setAvailableAnimations] = useState([]);
  const [activeAnimation, setActiveAnimation] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [animSpeed, setAnimSpeed] = useState(1.0);
  const [isLoadingModel, setIsLoadingModel] = useState(false);

  // Orbit & Camera Controls
  const [autoRotate, setAutoRotate] = useState(false);

  // Three.js Core References
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const characterGroupRef = useRef(null);
  const loadedModelGroupRef = useRef(null);
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const activeActionRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Drag Orbit tracking refs
  const isDraggingRef = useRef(false);
  const prevPointerPosRef = useRef({ x: 0, y: 0 });
  const rotationVelRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const animSpeedRef = useRef(animSpeed);
  animSpeedRef.current = animSpeed;

  // --- 1. INITIALIZE REAL-TIME 3D SCENE ---
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 360;
    const height = currentMount.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera framed on character
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.18, 3.8);
    cameraRef.current = camera;

    // WebGL Renderer with Tone Mapping & Soft Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 3.0);
    keyLight.position.set(2.5, 4.2, 3.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const cyanRimLight = new THREE.PointLight(0x00f5ff, 5.2, 9);
    cyanRimLight.position.set(-2.5, 1.8, -2.0);
    scene.add(cyanRimLight);

    const warmFillLight = new THREE.PointLight(0xffb703, 2.4, 8);
    warmFillLight.position.set(2.4, -0.6, 2.0);
    scene.add(warmFillLight);

    // Floor Pedestal & Cyan Glowing Ring
    const floorGeo = new THREE.CylinderGeometry(1.4, 1.48, 0.08, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x14161f,
      roughness: 0.4,
      metalness: 0.8
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -1.22;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const groundRingGeo = new THREE.TorusGeometry(1.44, 0.018, 16, 64);
    const groundRingMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
    const groundRing = new THREE.Mesh(groundRingGeo, groundRingMat);
    groundRing.rotation.x = Math.PI / 2;
    groundRing.position.y = -1.18;
    scene.add(groundRing);

    // Character Root Group
    const characterGroup = new THREE.Group();
    characterGroup.name = 'Character_Root';
    characterGroupRef.current = characterGroup;
    scene.add(characterGroup);

    // Group for loaded glTF character model
    const loadedModelGroup = new THREE.Group();
    loadedModelGroup.name = 'Loaded_Model_Group';
    loadedModelGroupRef.current = loadedModelGroup;
    characterGroup.add(loadedModelGroup);

    // Render loop
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Update AnimationMixer
      if (mixerRef.current && isPlayingRef.current) {
        mixerRef.current.update(delta * animSpeedRef.current);
      }

      // 360° Drag Inertia and Auto-Orbit Rotation
      if (characterGroupRef.current) {
        if (!isDraggingRef.current) {
          if (autoRotateRef.current) {
            characterGroupRef.current.rotation.y += 0.008;
          } else {
            characterGroupRef.current.rotation.y += rotationVelRef.current.x;
            rotationVelRef.current.x *= 0.92;
          }
        }
      }

      // Update particle auras and rotating halo
      characterVisualCustomizer.updateAnimation(delta);

      renderer.render(scene, camera);
    };
    animate();

    // Resize listener
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      cameraRef.current.aspect = nw / nh;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      if (characterGroupRef.current) {
        characterVisualCustomizer.cleanup(characterGroupRef.current);
      }
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // --- 2. LOAD 3D CHARACTER MODEL (NORMAL MAN OR MICHELLE) ---
  const loadModel = useCallback((modelKey) => {
    if (!characterGroupRef.current || !loadedModelGroupRef.current) return;

    setIsLoadingModel(true);

    // Stop and cleanup previous mixer
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }
    actionsRef.current = {};
    activeActionRef.current = null;

    // Clear previous models from group
    while (loadedModelGroupRef.current.children.length > 0) {
      loadedModelGroupRef.current.remove(loadedModelGroupRef.current.children[0]);
    }

    const modelObj = AVAILABLE_MODELS.find(m => m.id === modelKey) || AVAILABLE_MODELS[0];

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      modelObj.path,
      (gltf) => {
        const object3d = gltf.scene;

        // Auto-fit & normalize model height to human scale (~2.15 units)
        const box = new THREE.Box3().setFromObject(object3d);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const targetHeight = 2.15;
        const scale = targetHeight / (size.y || 1);

        object3d.scale.setScalar(scale);
        object3d.position.x = -center.x * scale;
        object3d.position.z = -center.z * scale;
        object3d.position.y = -1.22 - (box.min.y * scale);

        // Enable shadows on all character meshes
        object3d.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        loadedModelGroupRef.current.add(object3d);
        currentModelObjectRef.current = object3d;

        // Apply modular equipment visuals (clothing materials, hair, masks, accessories, auras)
        if (characterGroupRef.current) {
          characterVisualCustomizer.applyEquipment(
            object3d, 
            characterGroupRef.current, 
            currentEquipmentRef.current
          );
        }

        // Setup AnimationMixer
        const mixer = new THREE.AnimationMixer(object3d);
        mixerRef.current = mixer;

        const acts = {};
        const foundNames = [];

        // 1. Native GLTF animation clips
        if (gltf.animations && gltf.animations.length > 0) {
          gltf.animations.forEach((clip) => {
            const act = mixer.clipAction(clip);
            act.setLoop(THREE.LoopRepeat, Infinity);
            act.clampWhenFinished = false;
            acts[clip.name] = act;
            foundNames.push(clip.name);
          });
        }

        // 2. Procedural realistic fitness animation clips (Squat, Jumping Jack, Victory Pose)
        try {
          const fitnessClips = generateFitnessClips(object3d);
          fitnessClips.forEach(clip => {
            const act = mixer.clipAction(clip);
            act.setLoop(THREE.LoopRepeat, Infinity);
            act.clampWhenFinished = false;
            acts[clip.name] = act;
            foundNames.push(clip.name);
          });
        } catch (err) {
          console.warn('Could not generate procedural fitness clips:', err);
        }

        actionsRef.current = acts;

          // Order animations according to preferred order for clean UI presentation
          const ordered = [];
          if (modelObj.preferredOrder) {
            modelObj.preferredOrder.forEach(name => {
              if (foundNames.includes(name)) ordered.push(name);
            });
          }
          foundNames.forEach(name => {
            if (!ordered.includes(name)) ordered.push(name);
          });
          setAvailableAnimations(ordered);

          // Default animation (Idle for Normal Man, SambaDance for Michelle)
          const defaultAnim = ordered.find(n => n.toLowerCase().includes('idle')) || ordered[0];
          if (defaultAnim && acts[defaultAnim]) {
            acts[defaultAnim].reset();
            acts[defaultAnim].enabled = true;
            acts[defaultAnim].setEffectiveTimeScale(animSpeedRef.current || 1.0);
            acts[defaultAnim].setEffectiveWeight(1.0);
            acts[defaultAnim].play();
            activeActionRef.current = acts[defaultAnim];
            setActiveAnimation(defaultAnim);
          } else {
            setAvailableAnimations([]);
            setActiveAnimation('');
          }

        setIsLoadingModel(false);
      },
      undefined,
      (err) => {
        console.error('Error loading 3D character model:', err);
        setIsLoadingModel(false);
      }
    );
  }, []);

  // Reload model whenever selectedModel changes
  useEffect(() => {
    loadModel(selectedModel);
  }, [selectedModel, loadModel]);

  // Sync external selectedModelProp
  useEffect(() => {
    if (selectedModelProp && selectedModelProp !== selectedModel) {
      setSelectedModel(selectedModelProp);
    }
  }, [selectedModelProp]);

  // Re-apply equipment visuals dynamically whenever effectiveEquipment changes
  useEffect(() => {
    if (currentModelObjectRef.current && characterGroupRef.current) {
      characterVisualCustomizer.applyEquipment(
        currentModelObjectRef.current,
        characterGroupRef.current,
        effectiveEquipment
      );
    }
  }, [effectiveEquipment]);

  // Preview animation trigger (e.g. from Emote selection in Inventory)
  useEffect(() => {
    if (previewAnimation && actionsRef.current[previewAnimation]) {
      switchAnimation(previewAnimation);
    }
  }, [previewAnimation]);

  // Rank-up celebration trigger
  useEffect(() => {
    if (celebrateRankUp) {
      if (actionsRef.current['Victory']) {
        switchAnimation('Victory');
      } else if (actionsRef.current['Run']) {
        switchAnimation('Run');
      }
    }
  }, [celebrateRankUp]);

  // --- 3. SWITCH ANIMATION (FIXED CROSS-FADE WITH PLAY CALL) ---
  const switchAnimation = (animName) => {
    if (!mixerRef.current || !actionsRef.current[animName] || activeAnimation === animName) return;
    sound?.playClick();

    const prevAction = activeActionRef.current;
    const nextAction = actionsRef.current[animName];

    // Three.js requires nextAction to be playing before or during crossFadeTo
    nextAction.reset();
    nextAction.enabled = true;
    nextAction.setEffectiveTimeScale(animSpeedRef.current || 1.0);
    nextAction.setEffectiveWeight(1.0);
    nextAction.play(); // Crucial fix: must call play() for crossfade to work!

    if (prevAction && prevAction !== nextAction) {
      prevAction.crossFadeTo(nextAction, 0.35, true);
    }

    activeActionRef.current = nextAction;
    setActiveAnimation(animName);
    setIsPlaying(true);
  };

  // Play / Pause Animation
  const togglePlayPause = () => {
    sound?.playClick();
    if (!activeActionRef.current) return;
    if (isPlaying) {
      activeActionRef.current.paused = true;
      setIsPlaying(false);
    } else {
      activeActionRef.current.paused = false;
      setIsPlaying(true);
    }
  };

  // Cycle Speed Multiplier (0.5x -> 1.0x -> 1.5x)
  const cycleSpeed = () => {
    sound?.playClick();
    const speeds = [0.5, 1.0, 1.5];
    const nextIdx = (speeds.indexOf(animSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setAnimSpeed(newSpeed);
    animSpeedRef.current = newSpeed;
    if (mixerRef.current) {
      mixerRef.current.timeScale = newSpeed;
    }
  };

  // 360° Drag Orbit Handlers
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    prevPointerPosRef.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !characterGroupRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    const deltaX = clientX - prevPointerPosRef.current.x;
    const deltaY = clientY - prevPointerPosRef.current.y;

    // Horizontal 360° rotation
    const rotSpeed = 0.009;
    characterGroupRef.current.rotation.y += deltaX * rotSpeed;
    rotationVelRef.current.x = deltaX * rotSpeed;

    // Vertical camera pitch (clamped)
    if (cameraRef.current) {
      const nextY = cameraRef.current.position.y - deltaY * 0.004;
      cameraRef.current.position.y = THREE.MathUtils.clamp(nextY, -0.4, 1.6);
      cameraRef.current.lookAt(0, 0.18, 0);
    }
    prevPointerPosRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (!cameraRef.current) return;
    const nextZ = cameraRef.current.position.z + e.deltaY * 0.003;
    cameraRef.current.position.z = THREE.MathUtils.clamp(nextZ, 2.2, 5.5);
  };

  const handleZoom = (dir) => {
    if (!cameraRef.current) return;
    const step = dir === 'in' ? -0.4 : 0.4;
    const nextZ = cameraRef.current.position.z + step;
    cameraRef.current.position.z = THREE.MathUtils.clamp(nextZ, 2.2, 5.5);
  };

  const handleResetCamera = () => {
    if (characterGroupRef.current) {
      characterGroupRef.current.rotation.set(0, 0, 0);
    }
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0.18, 3.8);
      cameraRef.current.lookAt(0, 0.18, 0);
    }
  };

  return (
    <div 
      className={`relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden ${className}`}
      onWheel={handleWheel}
    >
      {/* ==================================================================== */}
      {/* 1. TOP BAR: ONLY NORMAL MAN AND MICHELLE (CLEAN & SLEEK) */}
      {/* ==================================================================== */}
      {showTopBar && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-2 bg-[#090b12]/90 border border-[#ffbe3b]/40 p-1.5 rounded-2xl shadow-neon-gold backdrop-blur-md">
          {AVAILABLE_MODELS.map(m => {
            const IconComp = m.icon;
            const isSelected = selectedModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => { 
                  sound?.playClick(); 
                  setSelectedModel(m.id);
                  onModelChange?.(m.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-cyber font-bold tracking-wider uppercase transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? m.id === 'normal_man'
                      ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,245,255,0.7)] font-black'
                      : 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.7)] font-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <IconComp size={13} />
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. 3D WEBGL VIEWPORT (360° MOUSE & TOUCH ORBIT DRAG) */}
      {/* ==================================================================== */}
      <div 
        ref={mountRef} 
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        className="w-full h-full min-h-[460px] md:min-h-[520px] cursor-grab active:cursor-grabbing flex items-center justify-center"
        title="Drag left/right to rotate character 360° | Scroll to Zoom"
      />

      {/* Loading Spinner */}
      {isLoadingModel && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
          <Loader2 size={36} className="text-cyan-400 animate-spin mb-2" />
          <span className="text-cyan-300 font-cyber text-xs tracking-wider uppercase">
            LOADING {selectedModel === 'normal_man' ? 'NORMAL MAN' : 'MICHELLE'}...
          </span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. BOTTOM CONTROL BAR: ANIMATIONS + PLAY/SPEED + 360° ORBIT */}
      {/* ==================================================================== */}
      {showBottomBar && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center space-y-2 max-w-[95%]">
          {/* Dynamic Animation Buttons for Selected Character */}
          {availableAnimations.length > 0 && (
            <div className="flex items-center space-x-1 bg-[#080b14]/95 border border-cyan-500/60 p-1.5 rounded-xl shadow-[0_0_20px_rgba(0,245,255,0.3)] backdrop-blur-md overflow-x-auto max-w-full">
              {availableAnimations.map((animName) => {
                const isActive = activeAnimation === animName;
                const { label, icon: IconComp } = getAnimDisplayInfo(animName);

                return (
                  <button
                    key={animName}
                    onClick={() => switchAnimation(animName)}
                    className={`px-3 py-1 rounded-lg text-xs font-cyber font-bold tracking-wider uppercase whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,245,255,0.8)] font-black'
                        : 'bg-[#101422] text-gray-300 hover:text-white hover:bg-cyan-950/40 border border-cyan-500/20'
                    }`}
                    title={`Switch to ${label} animation`}
                  >
                    <IconComp size={12} className={isActive ? 'fill-current' : ''} />
                    <span>{label}</span>
                  </button>
                );
              })}

              {/* Play / Pause */}
              <button
                onClick={togglePlayPause}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isPlaying 
                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300' 
                    : 'bg-amber-950/60 border-amber-400 text-amber-300'
                }`}
                title={isPlaying ? 'Pause Animation' : 'Resume Animation'}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              </button>

              {/* Speed Toggle */}
              <button
                onClick={cycleSpeed}
                className="px-2 py-1 rounded-lg bg-[#101422] border border-cyan-500/30 text-cyan-300 text-xs font-mono hover:text-white transition-colors"
                title="Cycle Speed (0.5x, 1.0x, 1.5x)"
              >
                {animSpeed}x
              </button>
            </div>
          )}

          {/* Orbit & Camera Controls */}
          <div className="flex items-center space-x-2 bg-[#080b14]/90 border border-cyan-500/40 px-3 py-1 rounded-xl shadow-[0_0_15px_rgba(0,245,255,0.2)] backdrop-blur-md text-[10px]">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-2.5 py-0.5 rounded font-cyber font-bold tracking-wider flex items-center space-x-1 transition-all ${
                autoRotate 
                  ? 'bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,245,255,0.6)]' 
                  : 'bg-[#101422] text-cyan-300 hover:text-white border border-cyan-500/30'
              }`}
              title="Toggle Auto 360° Rotation"
            >
              <RotateCw size={11} />
              <span>{autoRotate ? 'ORBIT: ON' : 'ORBIT: PAUSE'}</span>
            </button>

            <button
              onClick={handleResetCamera}
              className="p-1 rounded bg-[#101422] text-cyan-300 hover:text-white border border-cyan-500/30 transition-colors"
              title="Reset Front View"
            >
              <RefreshCw size={12} />
            </button>

            <button
              onClick={() => handleZoom('in')}
              className="p-1 rounded bg-[#101422] text-cyan-300 hover:text-white border border-cyan-500/30 transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={12} />
            </button>

            <button
              onClick={() => handleZoom('out')}
              className="p-1 rounded bg-[#101422] text-cyan-300 hover:text-white border border-cyan-500/30 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
