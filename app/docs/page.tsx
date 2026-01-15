'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function DocsPage() {
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [openSection, setOpenSection] = useState<string | null>('getting-started');
  const rafRef = useRef<number>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let targetX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    let targetY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isClient) return;
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      setSmoothPosition(prev => ({
        x: prev.x + (targetX - prev.x) * 0.1,
        y: prev.y + (targetY - prev.y) * 0.1
      }));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isClient]);

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Welcome to ZenPC</h3>
            <p className="text-text-muted leading-relaxed">
              ZenPC is a comprehensive PC building platform that helps you create, validate, and optimize custom PC builds. This documentation will help you understand all features and get the most out of the platform.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Quick Start</h3>
            <ol className="list-decimal list-inside space-y-2 text-text-muted ml-4">
              <li>Create a free account or start building without one</li>
              <li>Navigate to the Builder from the homepage</li>
              <li>Select parts from each category (CPU, GPU, Motherboard, etc.)</li>
              <li>Review compatibility checks and build health analysis</li>
              <li>Save your build and export when ready</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'builder',
      title: 'Using the Builder',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Part Selection</h3>
            <p className="text-text-muted leading-relaxed mb-3">
              The builder organizes components into categories. Select one part from each category to build your PC. As you select parts, ZenPC automatically:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li>Checks compatibility between selected components</li>
              <li>Calculates estimated power requirements</li>
              <li>Updates total build cost in real-time</li>
              <li>Provides build health analysis</li>
              <li>Identifies potential bottlenecks</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Compatibility Checking</h3>
            <p className="text-text-muted leading-relaxed">
              Our compatibility system uses actual technical specifications to validate your build. Errors indicate critical incompatibilities that will prevent your build from working. Warnings suggest suboptimal configurations that may limit performance but won&apos;t prevent functionality.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Build Health</h3>
            <p className="text-text-muted leading-relaxed">
              Build Health evaluates your build across multiple dimensions: compatibility, power supply adequacy, performance balance, and upgrade flexibility. Each category receives a qualitative rating (Excellent, Good, Acceptable, Needs Attention) with detailed explanations.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Bottleneck Analysis</h3>
            <p className="text-text-muted leading-relaxed">
              The Bottleneck Analysis identifies potential performance limitations based on your component selection and use case. It provides educational insights—not fear-based warnings—to help you optimize your build.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'specs',
      title: 'Understanding Specifications',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Spec-Driven Architecture</h3>
            <p className="text-text-muted leading-relaxed">
              ZenPC uses a spec-driven architecture where all part specifications are defined in a centralized Spec Dictionary. This ensures consistency, accuracy, and automatic support for new parts and specifications.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Spec Groups</h3>
            <p className="text-text-muted leading-relaxed mb-3">
              Specifications are organized into logical groups:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li><strong>Performance:</strong> Clock speeds, core counts, memory speeds</li>
              <li><strong>Compatibility:</strong> Sockets, form factors, memory types</li>
              <li><strong>Power:</strong> TDP, wattage, efficiency ratings</li>
              <li><strong>Physical:</strong> Dimensions, weight, clearance</li>
              <li><strong>Memory:</strong> Capacity, VRAM, storage size</li>
              <li><strong>Connectivity:</strong> Ports, Wi-Fi, Bluetooth</li>
              <li><strong>Features:</strong> RGB, modular design, cooling type</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Reading Specs</h3>
            <p className="text-text-muted leading-relaxed">
              Each specification includes a human-readable label, unit (if applicable), and description. High-importance specs are emphasized, while low-importance specs can be collapsed to reduce clutter.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'compatibility',
      title: 'Compatibility Rules',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">How Compatibility Works</h3>
            <p className="text-text-muted leading-relaxed">
              Compatibility rules are stored in our database and evaluated dynamically. Each rule specifies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li>Source and target component categories</li>
              <li>Specification fields to compare</li>
              <li>Comparison operator (equals, greater than, etc.)</li>
              <li>Severity level (error, warning, info)</li>
              <li>Human-readable message and explanation</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Rule Types</h3>
            <p className="text-text-muted leading-relaxed mb-3">
              <strong>Errors:</strong> Critical incompatibilities that will prevent your build from working (e.g., socket mismatches, physical clearance issues).
            </p>
            <p className="text-text-muted leading-relaxed mb-3">
              <strong>Warnings:</strong> Suboptimal configurations that may limit performance but won&apos;t prevent functionality (e.g., RAM speed exceeding motherboard support, minimal PSU headroom).
            </p>
            <p className="text-text-muted leading-relaxed">
              <strong>Info:</strong> Informational notes about your build (e.g., confirmed compatibility, upgrade flexibility).
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'build-health',
      title: 'Build Health Analysis',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Overview</h3>
            <p className="text-text-muted leading-relaxed">
              Build Health provides a comprehensive evaluation of your build across multiple dimensions. It uses only actual specifications—no hardcoded assumptions—to provide accurate, educational feedback.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Health Categories</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Compatibility</h4>
                <p className="text-text-muted leading-relaxed">
                  Evaluates whether all selected components are compatible with each other. Checks socket matches, physical clearances, memory type compatibility, and more.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Power Supply</h4>
                <p className="text-text-muted leading-relaxed">
                  Analyzes whether your PSU provides adequate power for all components, with appropriate headroom for stability and future upgrades.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Performance Balance</h4>
                <p className="text-text-muted leading-relaxed">
                  Assesses whether your components are well-matched for your intended use case, identifying potential imbalances between CPU and GPU, RAM adequacy, and storage performance.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Upgrade Flexibility</h4>
                <p className="text-text-muted leading-relaxed">
                  Evaluates how easy it will be to upgrade your build in the future, considering socket compatibility, PSU headroom, and case clearances.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tips',
      title: 'Best Practices',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Planning Your Build</h3>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li>Start with your use case (gaming, productivity, content creation) to guide component selection</li>
              <li>Set a realistic budget and use the budget tracking feature</li>
              <li>Consider future upgrade paths when selecting core components</li>
              <li>Read compatibility warnings carefully—they often contain valuable insights</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Component Selection</h3>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li>Select CPU and motherboard first—they determine your platform</li>
              <li>Choose RAM that matches your motherboard&apos;s supported type and speed</li>
              <li>Ensure your case has adequate clearance for your GPU and CPU cooler</li>
              <li>Leave 20-30% PSU headroom for stability and future upgrades</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-text-primary">Before Purchasing</h3>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li>Double-check compatibility with manufacturer documentation</li>
              <li>Verify current pricing with retailers—prices change frequently</li>
              <li>Review Build Health and Bottleneck Analysis for optimization opportunities</li>
              <li>Export your build summary for reference</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <main className="min-h-dvh bg-bg text-text-primary relative overflow-hidden">
      <div style={{
        position: 'fixed',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)',
        left: `${smoothPosition.x}px`,
        top: `${smoothPosition.y}px`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(30px)',
        willChange: 'transform',
        transition: 'opacity 0.3s ease-out',
        opacity: 1
      }} />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors duration-base ease-premium group"
          >
            <svg className="w-4 h-4 transition-transform duration-base ease-premium group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="card p-8 md:p-12 mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            Comprehensive guides and reference materials for using ZenPC effectively.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="card overflow-hidden">
              <button
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-surface-2/30 transition-colors"
              >
                <h2 className="text-2xl font-semibold text-text-primary">{section.title}</h2>
                <svg
                  className={`w-6 h-6 text-text-muted transition-transform ${openSection === section.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openSection === section.id && (
                <div className="px-6 pb-6 border-t border-border/10 pt-6">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="card p-8 md:p-12 mt-12 bg-accent/5 border-accent/20">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">Need More Help?</h2>
          <p className="text-text-muted leading-relaxed mb-6">
            Can&apos;t find what you&apos;re looking for? Check our <Link href="/help" className="text-accent hover:underline">Help Center</Link> or <Link href="/contact" className="text-accent hover:underline">contact support</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
