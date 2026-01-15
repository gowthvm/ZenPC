'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function HelpPage() {
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [openSection, setOpenSection] = useState<string | null>(null);
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

  const faqSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      questions: [
        {
          q: 'How do I start building a PC?',
          a: 'Click "Start Building" on the homepage or navigate to the Builder. You\'ll see categories for each component type (CPU, GPU, Motherboard, etc.). Select parts from each category, and ZenPC will automatically check compatibility and provide real-time feedback on your build.'
        },
        {
          q: 'Do I need an account to use ZenPC?',
          a: 'You can browse parts and use the builder without an account, but creating a free account lets you save your builds, access build history, and receive personalized recommendations. Your data is always private and secure.'
        },
        {
          q: 'How accurate are the compatibility checks?',
          a: 'Our compatibility system uses actual technical specifications from manufacturers and industry-standard compatibility rules. We check socket types, physical dimensions, power requirements, and more. However, we always recommend double-checking with manufacturer documentation for critical builds.'
        },
        {
          q: 'Can I import parts from other PC builders?',
          a: 'Currently, ZenPC uses its own database of parts. However, you can manually add parts by selecting from our curated catalog. We\'re working on import features for future releases.'
        }
      ]
    },
    {
      id: 'builder',
      title: 'Using the Builder',
      questions: [
        {
          q: 'What does Build Health mean?',
          a: 'Build Health analyzes your selected components across multiple dimensions: compatibility, power supply adequacy, performance balance, and upgrade flexibility. It provides qualitative ratings (Excellent, Good, Acceptable, Needs Attention) with detailed explanations to help you understand your build\'s strengths and potential improvements.'
        },
        {
          q: 'How does Bottleneck Analysis work?',
          a: 'Bottleneck Analysis evaluates your CPU-GPU balance, RAM adequacy, storage performance, and resolution targets. It identifies potential performance limitations and provides educational insights—not fear-based warnings—to help you optimize your build for your specific use case.'
        },
        {
          q: 'Can I compare different parts?',
          a: 'Yes! When you have a part selected, you\'ll see a "Compare" button. This opens a comparison view where you can see side-by-side specifications of different parts in the same category, helping you make informed decisions.'
        },
        {
          q: 'How do I save my build?',
          a: 'If you\'re logged in, your build is automatically saved as you make changes. You can also give your build a custom name. All saved builds are accessible from your account dashboard.'
        },
        {
          q: 'What if a part I want isn\'t in the database?',
          a: 'We continuously update our parts database. If you need a specific part that\'s not listed, please contact us with the part details, and we\'ll prioritize adding it. You can also use similar parts as placeholders while planning your build.'
        }
      ]
    },
    {
      id: 'compatibility',
      title: 'Compatibility & Specifications',
      questions: [
        {
          q: 'Why does my RAM show a warning about motherboard speed?',
          a: 'If your selected RAM speed exceeds your motherboard\'s maximum supported speed, the RAM will run at the motherboard\'s maximum instead of its rated speed. This isn\'t a critical issue, but you won\'t get the full performance benefit of faster RAM. Consider either faster-compatible RAM or a motherboard that supports higher speeds.'
        },
        {
          q: 'What does "TDP" mean and why does it matter?',
          a: 'TDP (Thermal Design Power) indicates how much heat a component generates under typical load, measured in watts. It helps estimate power consumption and cooling requirements. Higher TDP components need more power and better cooling. Our system uses TDP to estimate total power needs for your build.'
        },
        {
          q: 'How do I know if my GPU will fit in my case?',
          a: 'ZenPC automatically checks GPU length against your case\'s maximum GPU clearance. If there\'s a mismatch, you\'ll see a clear error message. Always leave some headroom (10-20mm) for easier installation and better airflow.'
        },
        {
          q: 'What\'s the difference between DDR4 and DDR5?',
          a: 'DDR5 is the newer memory standard, offering higher speeds and better power efficiency than DDR4. However, DDR5 requires a compatible motherboard and CPU. Our compatibility system ensures your RAM type matches your motherboard\'s support. DDR4 is still excellent for most builds and often more affordable.'
        },
        {
          q: 'Do I need to match CPU and motherboard sockets exactly?',
          a: 'Yes, absolutely. The CPU socket must exactly match the motherboard socket (e.g., AM5, LGA1700). This is a physical requirement—different sockets are incompatible. Our system flags any mismatches as critical errors.'
        }
      ]
    },
    {
      id: 'power',
      title: 'Power Supply & Cooling',
      questions: [
        {
          q: 'How much wattage do I need?',
          a: 'Power needs depend on all your components. As a rough guide: entry-level builds need 450-550W, mid-range gaming builds need 650-750W, and high-end builds need 850W+. ZenPC calculates estimated power draw and recommends appropriate PSU wattage with headroom for stability and future upgrades.'
        },
        {
          q: 'What\'s PSU headroom and why does it matter?',
          a: 'Headroom is the difference between your estimated power needs and your PSU\'s capacity. Having 20-30% headroom is ideal—it ensures stable operation under load, supports future upgrades, and improves efficiency. Running a PSU near its maximum capacity can reduce lifespan and cause instability.'
        },
        {
          q: 'Do I need a modular PSU?',
          a: 'Modular PSUs let you connect only the cables you need, improving cable management and airflow. They\'re especially valuable in smaller cases. Non-modular PSUs are more affordable but can create cable clutter. It\'s a preference and budget decision, not a compatibility requirement.'
        },
        {
          q: 'What about CPU cooling?',
          a: 'Most CPUs come with stock coolers that work for basic use, but aftermarket coolers provide better temperatures, quieter operation, and overclocking headroom. Air coolers are reliable and affordable; liquid coolers offer superior performance but at higher cost. Check your case\'s CPU cooler height clearance.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Data',
      questions: [
        {
          q: 'Is my build data private?',
          a: 'Yes. Your builds are private by default and only accessible to you. You can optionally make builds public to share with the community, but this is always your choice. We never share your data with third parties, and we don\'t use it for advertising.'
        },
        {
          q: 'Can I export my build?',
          a: 'Yes! Use the "Summary & Export" feature in the builder to copy or download your build details as text. This includes all parts, prices, compatibility notes, and performance insights.'
        },
        {
          q: 'How do I delete my account?',
          a: 'You can delete your account and all associated data from your account settings. This action is permanent and cannot be undone. If you need help, contact our support team.'
        },
        {
          q: 'Do you store payment information?',
          a: 'ZenPC doesn\'t process payments or store payment information. We provide build lists and recommendations—you purchase parts directly from retailers. This keeps your financial data secure and gives you flexibility in where you shop.'
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      questions: [
        {
          q: 'The builder isn\'t loading parts. What should I do?',
          a: 'First, check your internet connection. If parts still don\'t load, try refreshing the page. If the issue persists, check our status page for service updates, or contact support with details about what you\'re seeing.'
        },
        {
          q: 'Compatibility checks seem incorrect. How do I report this?',
          a: 'We take accuracy seriously. If you believe a compatibility check is wrong, please contact us with: the specific parts involved, the error or warning message, and any relevant manufacturer documentation. We\'ll investigate and update our rules if needed.'
        },
        {
          q: 'Can I use ZenPC on mobile?',
          a: 'ZenPC is optimized for desktop and tablet use. While the site works on mobile, the builder experience is best on larger screens where you can see all information clearly. We recommend using a desktop or tablet for the best experience.'
        },
        {
          q: 'My saved build disappeared. What happened?',
          a: 'Builds are saved automatically when you\'re logged in. If a build is missing, check that you\'re logged into the correct account. If you still can\'t find it, contact support—we can help recover your data.'
        }
      ]
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
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
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
            Help Center
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            Find answers to common questions about using ZenPC, building PCs, and understanding compatibility. Can&apos;t find what you&apos;re looking for? <Link href="/contact" className="text-accent hover:underline">Contact our support team</Link>.
          </p>
        </div>

        <div className="space-y-4">
          {faqSections.map((section) => (
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
                <div className="px-6 pb-6 space-y-6 border-t border-border/10 pt-6">
                  {section.questions.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-lg font-semibold text-text-primary">{item.q}</h3>
                      <p className="text-text-muted leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="card p-8 md:p-12 mt-12 bg-accent/5 border-accent/20">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">Still Need Help?</h2>
          <p className="text-text-muted leading-relaxed mb-6">
            Our support team is here to help. Reach out through our contact form, and we&apos;ll get back to you as soon as possible.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Contact Support
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
