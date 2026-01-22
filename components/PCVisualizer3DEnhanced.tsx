'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface ComponentData {
  type: string;
  name: string;
  color: string;
  category: 'cpu' | 'gpu' | 'ram' | 'storage' | 'psu' | 'motherboard' | 'case';
}

interface PC3DEnhancedProps {
  selectedParts?: Record<string, any>;
  autoRotate?: boolean;
  height?: string;
  showControls?: boolean;
  showLabels?: boolean;
  cameraDistance?: number;
}

export const PCVisualizer3DEnhanced: React.FC<PC3DEnhancedProps> = ({
  selectedParts = {},
  autoRotate = true,
  height = '500px',
  showControls = true,
  showLabels = true,
  cameraDistance = 12,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pcGroupRef = useRef<THREE.Group | null>(null);
  const componentsRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const animationIdRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const rotationSpeedRef = useRef(0.004);

  // Get component color from part data
  const getComponentColor = useCallback((category: string): string => {
    const part = selectedParts[category];
    if (!part) return getDefaultColor(category);

    // Try to extract color from part data
    if (part.color) return part.color;
    if (part.specs?.color) return part.specs.color;

    // Determine color by type for common components
    const name = (part.name || part.title || '').toLowerCase();
    if (name.includes('nvidia') || name.includes('rtx') || name.includes('gtx')) return '#ff4444';
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

  const createComponentMesh = (category: string, color: string): THREE.Mesh => {
    let geometry: THREE.BufferGeometry;
    let mesh: THREE.Mesh;

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.6,
      roughness: 0.4,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.15,
    });

    switch (category) {
      case 'gpu':
        geometry = new THREE.BoxGeometry(2.5, 0.8, 3.5);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(-1.5, -1.5, 1.2);
        break;

      case 'cpu':
        geometry = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(1.5, 0.5, 1.2);
        break;

      case 'ram':
        geometry = new THREE.BoxGeometry(0.6, 2.2, 0.3);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(-2, 0.8, 0.8);
        break;

      case 'storage':
        geometry = new THREE.BoxGeometry(1.5, 0.4, 0.4);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, -2.5, 1.2);
        break;

      case 'psu':
        geometry = new THREE.BoxGeometry(2, 1.5, 2.5);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, -3, -0.5);
        break;

      case 'motherboard':
        geometry = new THREE.PlaneGeometry(5, 6.5);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = 1.3;
        break;

      case 'case':
      default:
        geometry = new THREE.BoxGeometry(6, 8, 3);
        mesh = new THREE.Mesh(geometry, material);
        break;
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.category = category;

    return mesh;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f1419);
    scene.fog = new THREE.Fog(0x0f1419, 20, 100);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(cameraDistance, 6, cameraDistance);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff6b00, 0.5);
    pointLight.position.set(-10, 8, 5);
    scene.add(pointLight);

    // Create PC group
    const pcGroup = new THREE.Group();
    scene.add(pcGroup);
    pcGroupRef.current = pcGroup;

    // Create case first
    const caseColor = getComponentColor('case');
    const pcCase = createComponentMesh('case', caseColor);
    pcGroup.add(pcCase);
    componentsRef.current.set('case', pcCase);

    // Add case edge accent
    const caseGeo = new THREE.BoxGeometry(6, 8, 3);
    const edgeGeometry = new THREE.EdgesGeometry(caseGeo);
    const wireframe = new THREE.LineSegments(
      edgeGeometry,
      new THREE.LineBasicMaterial({ color: 0xff6b00, linewidth: 2 })
    );
    pcGroup.add(wireframe);

    // Add RGB lighting
    const rgbLight = new THREE.PointLight(0xff6b00, 0.8);
    rgbLight.position.set(0, 2, 4);
    pcGroup.add(rgbLight);

    // Create components - they'll be updated in the loop
    const categories = ['motherboard', 'gpu', 'cpu', 'ram', 'storage', 'psu'];
    categories.forEach((category) => {
      const color = getComponentColor(category);
      const mesh = createComponentMesh(category, color);
      pcGroup.add(mesh);
      componentsRef.current.set(category, mesh);
    });

    setIsLoading(false);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (autoRotate && pcGroup) {
        pcGroup.rotation.y += rotationSpeedRef.current;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    const containerElement = containerRef.current;

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (containerElement && renderer.domElement.parentNode === containerElement) {
        containerElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate, cameraDistance, getComponentColor, selectedParts]);

  // Update component colors when parts change
  useEffect(() => {
    const categories = ['case', 'motherboard', 'gpu', 'cpu', 'ram', 'storage', 'psu'];
    categories.forEach((category) => {
      const mesh = componentsRef.current.get(category);
      if (mesh && mesh.material instanceof THREE.MeshStandardMaterial) {
        const color = getComponentColor(category);
        const colorObj = new THREE.Color(color);
        (mesh.material as THREE.MeshStandardMaterial).color.set(colorObj);
        (mesh.material as THREE.MeshStandardMaterial).emissive.set(colorObj);
      }
    });
  }, [getComponentColor, selectedParts]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (cameraRef.current) {
      if (direction === 'in') {
        cameraRef.current.position.multiplyScalar(0.9);
      } else {
        cameraRef.current.position.multiplyScalar(1.1);
      }
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

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-orange-500/20">
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full relative"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-sm">Loading 3D Model...</div>
          </div>
        )}
      </div>

      {showControls && !isLoading && (
        <div className="absolute bottom-4 left-4 flex gap-2 z-10">
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
            className="p2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors"
            title="Reset View"
          >
            <RotateCw size={16} />
          </motion.button>
        </div>
      )}

      {showLabels && !isLoading && (
        <div className="absolute top-4 right-4 text-xs text-gray-400 pointer-events-none">
          <div className="flex flex-wrap gap-3 text-xs">
            {[
              { name: 'CPU', cat: 'cpu' },
              { name: 'GPU', cat: 'gpu' },
              { name: 'RAM', cat: 'ram' },
              { name: 'Storage', cat: 'storage' },
            ].map((item) => (
              <div key={item.cat} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getComponentColor(item.cat) }}
                ></div>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PCVisualizer3DEnhanced;
