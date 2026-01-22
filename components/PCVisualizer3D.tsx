'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface PC3DProps {
  gpuColor?: string;
  cpuColor?: string;
  ramColor?: string;
  storageColor?: string;
  autoRotate?: boolean;
  height?: string;
  showControls?: boolean;
}

export const PCVisualizer3D: React.FC<PC3DProps> = ({
  gpuColor = '#e0700f',
  cpuColor = '#0084d1',
  ramColor = '#f0ad4e',
  storageColor = '#5cb85c',
  autoRotate = true,
  height = '500px',
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pcGroupRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    camera.position.set(8, 6, 8);
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

    // Create PC case and components
    const pcGroup = new THREE.Group();
    scene.add(pcGroup);
    pcGroupRef.current = pcGroup;

    // PC Case (Main chassis)
    const caseGeometry = new THREE.BoxGeometry(6, 8, 3);
    const caseMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1f2e,
      metalness: 0.7,
      roughness: 0.2,
    });
    const pcCase = new THREE.Mesh(caseGeometry, caseMaterial);
    pcCase.castShadow = true;
    pcCase.receiveShadow = true;
    pcGroup.add(pcCase);

    // Case edge accent
    const edgeGeometry = new THREE.EdgesGeometry(caseGeometry);
    const wireframe = new THREE.LineSegments(
      edgeGeometry,
      new THREE.LineBasicMaterial({ color: 0xff6b00, linewidth: 2 })
    );
    pcGroup.add(wireframe);

    // Motherboard (visible inside)
    const moboGeometry = new THREE.PlaneGeometry(5, 6.5);
    const moboMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d5f2e,
      metalness: 0.3,
      roughness: 0.8,
    });
    const mobo = new THREE.Mesh(moboGeometry, moboMaterial);
    mobo.position.z = 1.3;
    mobo.castShadow = true;
    mobo.receiveShadow = true;
    pcGroup.add(mobo);

    // GPU (Dedicated graphics card)
    const gpuGeometry = new THREE.BoxGeometry(2.5, 0.8, 3.5);
    const gpuMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(gpuColor),
      metalness: 0.8,
      roughness: 0.1,
      emissive: new THREE.Color(gpuColor),
      emissiveIntensity: 0.2,
    });
    const gpu = new THREE.Mesh(gpuGeometry, gpuMaterial);
    gpu.position.set(-1.5, -1.5, 1.2);
    gpu.castShadow = true;
    gpu.receiveShadow = true;
    pcGroup.add(gpu);

    // GPU label
    const gpuLabelGeometry = new THREE.BoxGeometry(2.3, 0.2, 0.1);
    const gpuLabelMaterial = new THREE.MeshStandardMaterial({
      color: 0x222,
      metalness: 0,
      roughness: 1,
    });
    const gpuLabel = new THREE.Mesh(gpuLabelGeometry, gpuLabelMaterial);
    gpuLabel.position.set(-1.5, -0.7, 2.2);
    pcGroup.add(gpuLabel);

    // CPU (Cooler tower)
    const cpuCoolerGeometry = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
    const cpuMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(cpuColor),
      metalness: 0.6,
      roughness: 0.3,
      emissive: new THREE.Color(cpuColor),
      emissiveIntensity: 0.15,
    });
    const cpuCooler = new THREE.Mesh(cpuCoolerGeometry, cpuMaterial);
    cpuCooler.position.set(1.5, 0.5, 1.2);
    cpuCooler.castShadow = true;
    cpuCooler.receiveShadow = true;
    pcGroup.add(cpuCooler);

    // CPU heatsink fins
    const finGeometry = new THREE.BoxGeometry(0.05, 2.2, 2.2);
    const finMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(cpuColor),
      metalness: 0.7,
      roughness: 0.2,
    });
    for (let i = -3; i <= 3; i++) {
      const fin = new THREE.Mesh(finGeometry, finMaterial);
      fin.position.set(1.5 + i * 0.15, 0.5, 1.2);
      fin.castShadow = true;
      pcGroup.add(fin);
    }

    // RAM sticks
    const ramGeometry = new THREE.BoxGeometry(0.6, 2.2, 0.3);
    const ramMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(ramColor),
      metalness: 0.5,
      roughness: 0.4,
      emissive: new THREE.Color(ramColor),
      emissiveIntensity: 0.1,
    });

    // RAM 1
    const ram1 = new THREE.Mesh(ramGeometry, ramMaterial);
    ram1.position.set(-2, 0.8, 0.8);
    ram1.castShadow = true;
    ram1.receiveShadow = true;
    pcGroup.add(ram1);

    // RAM 2
    const ram2 = new THREE.Mesh(ramGeometry, ramMaterial.clone());
    ram2.position.set(-1.2, 0.8, 0.8);
    ram2.castShadow = true;
    ram2.receiveShadow = true;
    pcGroup.add(ram2);

    // SSD/Storage
    const storageGeometry = new THREE.BoxGeometry(1.5, 0.4, 0.4);
    const storageMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(storageColor),
      metalness: 0.6,
      roughness: 0.3,
      emissive: new THREE.Color(storageColor),
      emissiveIntensity: 0.1,
    });
    const storage = new THREE.Mesh(storageGeometry, storageMaterial);
    storage.position.set(0, -2.5, 1.2);
    storage.castShadow = true;
    storage.receiveShadow = true;
    pcGroup.add(storage);

    // Power Supply
    const psuGeometry = new THREE.BoxGeometry(2, 1.5, 2.5);
    const psuMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a3a,
      metalness: 0.4,
      roughness: 0.5,
    });
    const psu = new THREE.Mesh(psuGeometry, psuMaterial);
    psu.position.set(0, -3, -0.5);
    psu.castShadow = true;
    psu.receiveShadow = true;
    pcGroup.add(psu);

    // Cables (simple representation)
    const cableGeometry = new THREE.TubeGeometry(
      new THREE.LineCurve3(
        new THREE.Vector3(-1.5, -1, 1.2),
        new THREE.Vector3(0, -2, 0)
      ),
      8,
      0.08,
      4,
      false
    );
    const cableMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b00,
      metalness: 0.3,
      roughness: 0.7,
    });
    const cables = new THREE.Mesh(cableGeometry, cableMaterial);
    pcGroup.add(cables);

    // Add RGB lighting effect
    const rgbLight = new THREE.PointLight(0xff6b00, 0.8);
    rgbLight.position.set(0, 2, 4);
    pcGroup.add(rgbLight);

    setIsLoading(false);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (autoRotate && pcGroup) {
        pcGroup.rotation.y += 0.004;
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
      if (containerElement) {
        containerElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate, gpuColor, cpuColor, ramColor, storageColor]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (cameraRef.current) {
      const zoomAmount = 2;
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
      cameraRef.current.position.set(8, 6, 8);
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
            className="p-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors"
            title="Reset View"
          >
            <RotateCw size={16} />
          </motion.button>
        </div>
      )}

      <div className="absolute top-4 right-4 text-xs text-gray-400 pointer-events-none">
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: gpuColor }}></div>
            GPU
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cpuColor }}></div>
            CPU
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ramColor }}></div>
            RAM
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: storageColor }}></div>
            Storage
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCVisualizer3D;
