'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Save } from 'lucide-react';
import PCVisualizer3D from '@/components/PCVisualizer3D';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const }
  }
};

export default function Visualizer3DPage() {
  const [gpuColor, setGpuColor] = useState('#e0700f');
  const [cpuColor, setCpuColor] = useState('#0084d1');
  const [ramColor, setRamColor] = useState('#f0ad4e');
  const [storageColor, setStorageColor] = useState('#5cb85c');
  const [autoRotate, setAutoRotate] = useState(true);

  const presets = [
    {
      name: 'Gaming Powerhouse',
      gpu: '#ff4444',
      cpu: '#0084d1',
      ram: '#f0ad4e',
      storage: '#5cb85c'
    },
    {
      name: 'Professional Workstation',
      gpu: '#ff8800',
      cpu: '#ffaa00',
      ram: '#44ff44',
      storage: '#ff44ff'
    },
    {
      name: 'Streaming Setup',
      gpu: '#00ccff',
      cpu: '#cc00ff',
      ram: '#ffff00',
      storage: '#ff0088'
    },
    {
      name: 'Budget Builder',
      gpu: '#888888',
      cpu: '#aaaaaa',
      ram: '#cccccc',
      storage: '#666666'
    }
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setGpuColor(preset.gpu);
    setCpuColor(preset.cpu);
    setRamColor(preset.ram);
    setStorageColor(preset.storage);
  };

  const resetColors = () => {
    setGpuColor('#e0700f');
    setCpuColor('#0084d1');
    setRamColor('#f0ad4e');
    setStorageColor('#5cb85c');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">3D PC Visualizer</h1>
          <div className="w-24" /> {/* Spacer for alignment */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
        >
          {/* Main Visualizer */}
          <motion.div className="lg:col-span-2">
            <div className="bg-surface-1/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">PC Build Preview</h2>
              <PCVisualizer3D
                gpuColor={gpuColor}
                cpuColor={cpuColor}
                ramColor={ramColor}
                storageColor={storageColor}
                autoRotate={autoRotate}
                height="700px"
                showControls={true}
              />
            </div>
          </motion.div>

          {/* Control Panel */}
          <motion.div className="space-y-6">
            {/* Color Customization */}
            <motion.div
              className="bg-surface-1/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6"
              variants={fadeInUp}
            >
              <h3 className="text-lg font-bold text-white mb-6">Component Colors</h3>

              <div className="space-y-4">
                {[
                  { label: 'GPU', color: gpuColor, setColor: setGpuColor },
                  { label: 'CPU', color: cpuColor, setColor: setCpuColor },
                  { label: 'RAM', color: ramColor, setColor: setRamColor },
                  { label: 'Storage', color: storageColor, setColor: setStorageColor }
                ].map((item) => (
                  <div key={item.label}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {item.label}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={item.color}
                        onChange={(e) => item.setColor(e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-orange-500/30 hover:border-orange-500/60 transition-colors"
                      />
                      <input
                        type="text"
                        value={item.color}
                        onChange={(e) => item.setColor(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg border border-orange-500/20 focus:border-orange-500/50 focus:outline-none transition-colors text-sm font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetColors}
                className="w-full mt-6 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-semibold rounded-lg transition-all border border-orange-500/30"
              >
                Reset Colors
              </motion.button>
            </motion.div>

            {/* Presets */}
            <motion.div
              className="bg-surface-1/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6"
              variants={fadeInUp}
            >
              <h3 className="text-lg font-bold text-white mb-4">Presets</h3>

              <div className="space-y-3">
                {presets.map((preset) => (
                  <motion.button
                    key={preset.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => applyPreset(preset)}
                    className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all border border-orange-500/20 hover:border-orange-500/50 flex items-center gap-2"
                  >
                    <div className="flex gap-2">
                      {[preset.gpu, preset.cpu, preset.ram, preset.storage].map((color, i) => (
                        <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    {preset.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Settings */}
            <motion.div
              className="bg-surface-1/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6"
              variants={fadeInUp}
            >
              <h3 className="text-lg font-bold text-white mb-4">Settings</h3>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="w-4 h-4 rounded border-orange-500/30 text-orange-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-300">Auto Rotate</span>
              </label>
            </motion.div>

            {/* Export Options */}
            <motion.div
              className="bg-surface-1/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6"
              variants={fadeInUp}
            >
              <h3 className="text-lg font-bold text-white mb-4">Export</h3>

              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all border border-orange-500/20"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all border border-orange-500/20"
                >
                  <Save className="w-4 h-4" />
                  Save Build
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="bg-surface-1/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">About 3D PC Visualization</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">🎨 Customize Colors</h3>
              <p className="text-sm">Choose any color for each component to match your build&apos;s aesthetics and RGB scheme.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">🔄 Rotate & Inspect</h3>
              <p className="text-sm">Rotate your PC from any angle to verify component placement, cable routing, and compatibility.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">💾 Save & Share</h3>
              <p className="text-sm">Export your 3D build preview as an image or share it with friends and the community.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
