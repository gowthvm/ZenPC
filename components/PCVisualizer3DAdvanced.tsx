'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sun,
  Moon,
  Layers,
  Info,
  Download,
  Share2,
  Play,
  Pause,
} from 'lucide-react';

interface ComponentData {
  type: string;
  name: string;
  color: string;
  category: 'cpu' | 'gpu' | 'ram' | 'storage' | 'psu' | 'motherboard' | 'case';
}

interface PC3DAdvancedProps {
  selectedParts?: Record<string, any>;
  autoRotate?: boolean;
  height?: string;
  showControls?: boolean;
  showLabels?: boolean;
  cameraDistance?: number;
  theme?: 'dark' | 'light' | 'ambient';
  exploded?: boolean;
  showStats?: boolean;
  mouseControls?: boolean;
  quality?: 'low' | 'medium' | 'high';
}

interface Stats {
  fps: number;
  geometries: number;
  textures: number;
}

export const PCVisualizer3DAdvanced: React.FC<PC3DAdvancedProps> = ({
  selectedParts = {},
  autoRotate = true,
  height = '500px',
  showControls = true,
  showLabels = true,
  cameraDistance = 12,
  theme = 'dark',
  exploded = false,
  showStats = false,
  mouseControls = true,
  quality = 'high',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pcGroupRef = useRef<THREE.Group | null>(null);
  const componentsRef = useRef<Map<string, THREE.Group>>(new Map());
  const animationIdRef = useRef<number | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ fps: 0, geometries: 0, textures: 0 });
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [showExploded, setShowExploded] = useState(exploded);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light' | 'ambient'>(theme);

  const rotationSpeedRef = useRef(0.004);
  const lastFrameTimeRef = useRef<number>(Date.now());
  const frameCountRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Enhanced component positions for normal and exploded views
  const componentPositions = useMemo(
    () => ({
      normal: {
        gpu: { pos: [-1.5, -1.5, 1.2], scale: 1 },
        cpu: { pos: [1.5, 0.5, 1.2], scale: 1 },
        ram: { pos: [-2, 0.8, 0.8], scale: 1 },
        storage: { pos: [0, -2.5, 1.2], scale: 1 },
        psu: { pos: [0, -3, -0.5], scale: 1 },
        motherboard: { pos: [0, 0, 1.3], scale: 1 },
        case: { pos: [0, 0, 0], scale: 1 },
      },
      exploded: {
        gpu: { pos: [-4, -2, 3], scale: 1.1 },
        cpu: { pos: [4, 2, 3], scale: 1.1 },
        ram: { pos: [-5, 3, 1], scale: 1.1 },
        storage: { pos: [0, -5, 3], scale: 1.1 },
        psu: { pos: [0, -5, -2], scale: 1.1 },
        motherboard: { pos: [0, 0, 2], scale: 1.05 },
        case: { pos: [0, 0, 0], scale: 0.95 },
      },
    }),
    []
  );

  const getComponentColor = useCallback((category: string): string => {
    const part = selectedParts[category];
    if (!part) return getDefaultColor(category);

    if (part.color) return part.color;
    if (part.specs?.color) return part.specs.color;

    const name = (part.name || part.title || '').toLowerCase();
    if (name.includes('nvidia') || name.includes('rtx') || name.includes('gtx'))
      return '#ff4444';
    if (name.includes('amd') && name.includes('radeon')) return '#ff8800';
    if (name.includes('intel')) return '#0084d1';
    if (name.includes('amd') && name.includes('ryzen')) return '#ffaa00';
    if (name.includes('corsair') || name.includes('kingston')) return '#f0ad4e';
    if (name.includes('samsung') || name.includes('western')) return '#5cb85c';

    return getDefaultColor(category);
  }, [selectedParts]);

  const getDefaultColor = (category: string): string => {
    const colors: Record<string, string> = {
      gpu: '#e0700f',
      cpu: '#0084d1',
      ram: '#f0ad4e',
      storage: '#5cb85c',
      psu: '#3a3a3a',
      motherboard: '#2d5f2e',
      case: '#1a1f2e',
    };
    return colors[category] || '#888888';
  };

  const createComponentGroup = useCallback((category: string, color: string): THREE.Group => {
    const group = new THREE.Group();

    let geometry: THREE.BufferGeometry;
    const materialOptions: THREE.MeshStandardMaterialParameters = {
      color: new THREE.Color(color),
      metalness: category === 'gpu' ? 0.7 : category === 'cpu' ? 0.5 : 0.6,
      roughness: category === 'gpu' ? 0.3 : category === 'cpu' ? 0.5 : 0.4,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.2,
    };

    if (quality === 'high') {
      materialOptions.flatShading = false;
    }

    const material = new THREE.MeshStandardMaterial(materialOptions);

    switch (category) {
      case 'gpu':
        geometry = new THREE.BoxGeometry(2.5, 0.8, 3.5, 16, 8, 16);
        break;
      case 'cpu':
        geometry = new THREE.CylinderGeometry(1.2, 1.2, 2.5, quality === 'high' ? 64 : 32, 8);
        break;
      case 'ram':
        geometry = new THREE.BoxGeometry(0.6, 2.2, 0.3, 8, 16, 4);
        break;
      case 'storage':
        geometry = new THREE.BoxGeometry(1.5, 0.4, 0.4, 12, 4, 4);
        break;
      case 'psu':
        geometry = new THREE.BoxGeometry(2, 1.5, 2.5, 12, 8, 12);
        break;
      case 'motherboard':
        geometry = new THREE.PlaneGeometry(5, 6.5, 8, 8);
        break;
      case 'case':
        geometry = new THREE.BoxGeometry(6, 8, 3, 16, 20, 8);
        break;
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.category = category;
    group.add(mesh);

    // Add subtle edge highlight for better definition
    if (category !== 'case') {
      const edgeGeometry = new THREE.EdgesGeometry(geometry);
      const lines = new THREE.LineSegments(
        edgeGeometry,
        new THREE.LineBasicMaterial({
          color: new THREE.Color(color).multiplyScalar(1.5),
          linewidth: 1,
          fog: false,
        })
      );
      group.add(lines);
    }

    group.userData.category = category;
    return group;
  }, [quality]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get container dimensions with fallback
    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;
    
    if (width === 0 || height === 0) return;

    // Scene setup with enhanced rendering
    const scene = new THREE.Scene();
    const bgColor = currentTheme === 'light' ? 0xf5f5f5 : currentTheme === 'ambient' ? 0x1a1a2e : 0x0f1419;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.Fog(bgColor, 30, 100);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.set(cameraDistance, 6, cameraDistance);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Enhanced renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      precision: quality === 'high' ? 'highp' : 'mediump',
      powerPreference: quality === 'high' ? 'high-performance' : 'default',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced lighting setup
    scene.add(new THREE.AmbientLight(0xffffff, currentTheme === 'light' ? 0.8 : 0.5));

    const directionalLight = new THREE.DirectionalLight(0xffffff, currentTheme === 'light' ? 1 : 0.8);
    directionalLight.position.set(12, 16, 12);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = quality === 'high' ? 2048 : 1024;
    directionalLight.shadow.mapSize.height = quality === 'high' ? 2048 : 1024;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff6b00, 0.6);
    pointLight.position.set(-12, 8, 8);
    pointLight.decay = 2;
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x0088ff, 0.4);
    pointLight2.position.set(12, 6, -10);
    pointLight2.decay = 2;
    scene.add(pointLight2);

    // Create PC group with components
    const pcGroup = new THREE.Group();
    scene.add(pcGroup);
    pcGroupRef.current = pcGroup;

    // Create all components
    const categories: Array<'case' | 'motherboard' | 'gpu' | 'cpu' | 'ram' | 'storage' | 'psu'> = [
      'case',
      'motherboard',
      'gpu',
      'cpu',
      'ram',
      'storage',
      'psu',
    ];

    categories.forEach((category) => {
      const color = getComponentColor(category);
      const componentGroup = createComponentGroup(category, color);
      pcGroup.add(componentGroup);
      componentsRef.current.set(category, componentGroup);
    });

    // Add RGB ambient effect
    const rgbLight = new THREE.PointLight(0xff6b00, 0.5);
    rgbLight.position.set(0, 3, 5);
    pcGroup.add(rgbLight);

    setIsLoading(false);

    // Calculate and update stats
    let lastStatsTime = Date.now();
    let framesSinceLastStats = 0;

    // Animation loop with FPS counter
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (pcGroup) {
        // Apply auto-rotation when not dragging
        if (isAutoRotating && !isDraggingRef.current) {
          pcGroup.rotation.y += rotationSpeedRef.current;
        }
        
        // Apply smooth drag rotation
        if (isDraggingRef.current) {
          pcGroup.rotation.y += (targetRotationRef.current.y - pcGroup.rotation.y) * 0.1;
          pcGroup.rotation.x += (targetRotationRef.current.x - pcGroup.rotation.x) * 0.1;
        } else {
          // Ease back to zero x rotation when not dragging
          pcGroup.rotation.x *= 0.95;
        }
      }

      // Update exploded view
      if (showExploded) {
        categories.forEach((category) => {
          const group = componentsRef.current.get(category);
          if (group) {
            const targetPos = componentPositions.exploded[category as keyof typeof componentPositions.exploded];
            const targetVec = new THREE.Vector3(targetPos.pos[0], targetPos.pos[1], targetPos.pos[2]);
            group.position.lerp(targetVec, 0.1);
            group.scale.lerp(new THREE.Vector3(targetPos.scale, targetPos.scale, targetPos.scale), 0.1);
          }
        });
      } else {
        categories.forEach((category) => {
          const group = componentsRef.current.get(category);
          if (group) {
            const targetPos = componentPositions.normal[category as keyof typeof componentPositions.normal];
            const targetVec = new THREE.Vector3(targetPos.pos[0], targetPos.pos[1], targetPos.pos[2]);
            group.position.lerp(targetVec, 0.1);
            group.scale.lerp(new THREE.Vector3(targetPos.scale, targetPos.scale, targetPos.scale), 0.1);
          }
        });
      }

      renderer.render(scene, camera);
      framesSinceLastStats++;

      // Update stats every 500ms
      if (Date.now() - lastStatsTime > 500) {
        const fps = Math.round((framesSinceLastStats * 1000) / (Date.now() - lastStatsTime));
        setStats({
          fps,
          geometries: renderer.info.memory.geometries,
          textures: renderer.info.memory.textures,
        });
        framesSinceLastStats = 0;
        lastStatsTime = Date.now();
      }
    };

    animate();

    // Mouse controls
    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Drag rotation
      if (isDraggingRef.current && pcGroupRef.current) {
        const deltaX = event.clientX - previousMousePositionRef.current.x;
        const deltaY = event.clientY - previousMousePositionRef.current.y;

        targetRotationRef.current.y += deltaX * 0.01;
        targetRotationRef.current.x += deltaY * 0.01;

        previousMousePositionRef.current = { x: event.clientX, y: event.clientY };
      }

      // Hover detection
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(pcGroup.children, true);

      if (intersects.length > 0) {
        const firstObject = intersects[0].object;
        let component = firstObject;
        while (component.parent && component.parent !== pcGroup && component.userData.category === undefined) {
          component = component.parent as THREE.Object3D;
        }
        setHoveredComponent(component.userData?.category || null);
      } else {
        setHoveredComponent(null);
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const containerElement = containerRef.current;
    if (mouseControls) {
      containerElement.addEventListener('mousemove', onMouseMove);
      containerElement.addEventListener('mousedown', onMouseDown);
      containerElement.addEventListener('mouseup', onMouseUp);
      containerElement.addEventListener('mouseleave', onMouseUp);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      if (mouseControls) {
        containerElement.removeEventListener('mousemove', onMouseMove);
        containerElement.removeEventListener('mousedown', onMouseDown);
        containerElement.removeEventListener('mouseup', onMouseUp);
        containerElement.removeEventListener('mouseleave', onMouseUp);
      }
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (containerElement && renderer.domElement.parentNode === containerElement) {
        containerElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [
    currentTheme,
    showExploded,
    cameraDistance,
    quality,
    mouseControls,
    getComponentColor,
    isAutoRotating,
    componentPositions,
    createComponentGroup,
  ]);

  // Update component colors when parts change
  useEffect(() => {
    const categories = ['case', 'motherboard', 'gpu', 'cpu', 'ram', 'storage', 'psu'];
    categories.forEach((category) => {
      const group = componentsRef.current.get(category);
      if (group) {
        const mesh = group.children[0] as THREE.Mesh;
        if (mesh && mesh.material instanceof THREE.MeshStandardMaterial) {
          const color = getComponentColor(category);
          const colorObj = new THREE.Color(color);
          (mesh.material as THREE.MeshStandardMaterial).color.set(colorObj);
          (mesh.material as THREE.MeshStandardMaterial).emissive.set(colorObj);

          // Update edge lines color
          const lines = group.children[1] as THREE.LineSegments;
          if (lines && lines.material instanceof THREE.LineBasicMaterial) {
            (lines.material as THREE.LineBasicMaterial).color.set(colorObj.multiplyScalar(1.5));
          }
        }
      }
    });
  }, [getComponentColor, selectedParts]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (cameraRef.current) {
      const factor = direction === 'in' ? 0.85 : 1.15;
      const currentDistance = cameraRef.current.position.length();
      const targetDistance = currentDistance * factor;
      cameraRef.current.position.normalize().multiplyScalar(targetDistance);
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const handleReset = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(cameraDistance, 6, cameraDistance);
      cameraRef.current.lookAt(0, 0, 0);
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const handleExport = () => {
    if (!rendererRef.current) return;
    const canvas = rendererRef.current.domElement as HTMLCanvasElement;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `pc-build-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-orange-500/20">
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full relative cursor-grab active:cursor-grabbing select-none"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="text-white text-sm text-center">
              <div className="text-lg mb-2">⚙️</div>
              Loading 3D Model...
            </motion.div>
          </div>
        )}

        {/* Hovered component indicator */}
        <AnimatePresence>
          {hoveredComponent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-4 left-4 px-3 py-2 bg-accent/90 rounded-lg text-white text-xs font-bold"
            >
              {hoveredComponent.toUpperCase()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showControls && !isLoading && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleZoom('in')}
              className="p-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleZoom('out')}
              className="p-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleReset()}
              className="p-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors"
              title="Reset View"
            >
              <RotateCw size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExploded(!showExploded)}
              className={`p-2 rounded-lg text-white transition-colors ${
                showExploded ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-600 hover:bg-orange-700'
              }`}
              title="Toggle Exploded View"
            >
              <Layers size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`p-2 rounded-lg text-white transition-colors ${
                isAutoRotating ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'
              }`}
              title="Toggle Auto Rotate"
            >
              {isAutoRotating ? <Pause size={16} /> : <Play size={16} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentTheme(currentTheme === 'dark' ? 'light' : currentTheme === 'light' ? 'ambient' : 'dark')}
              className="p-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors"
              title="Change Theme"
            >
              {currentTheme === 'dark' ? <Sun size={16} /> : currentTheme === 'light' ? <Moon size={16} /> : <Volume2 size={16} />}
            </motion.button>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="p-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
              title="Download Image"
            >
              <Download size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
              title="Share"
            >
              <Share2 size={16} />
            </motion.button>
          </div>
        </div>
      )}

      {showLabels && !isLoading && (
        <div className="absolute top-4 right-4 text-xs text-gray-400 pointer-events-none">
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'CPU', cat: 'cpu' },
              { name: 'GPU', cat: 'gpu' },
              { name: 'RAM', cat: 'ram' },
              { name: 'Storage', cat: 'storage' },
            ].map((item) => (
              <div key={item.cat} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full shadow-lg"
                  style={{
                    backgroundColor: getComponentColor(item.cat),
                    boxShadow: `0 0 8px ${getComponentColor(item.cat)}`,
                  }}
                ></div>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {showStats && !isLoading && (
        <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-black/50 p-3 rounded-lg backdrop-blur-sm border border-border/20">
          <div>FPS: {stats.fps}</div>
          <div>Geometries: {stats.geometries}</div>
          <div>Textures: {stats.textures}</div>
        </div>
      )}
    </div>
  );
};

export default PCVisualizer3DAdvanced;
