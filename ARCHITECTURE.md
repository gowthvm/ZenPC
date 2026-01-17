# 🏗️ Unified Builder Architecture Guide

## Overview

The ZenPC Unified Builder consolidates all app functionality into a single, elegant interface at `/builder`. This document explains the architecture, component relationships, and how to extend the system.

---

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    UnifiedBuilder.tsx                    │
│                  (Main Orchestrator)                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐          ┌──────────────────────┐ │
│  │ BuilderSidebar   │          │   Active Panel       │ │
│  │                  │          │   (Rendered Below)   │ │
│  │ • Nav Modes      │          │                      │ │
│  │ • Build History  │          │ • BuildFlowPanel     │ │
│  │ • Quick Actions  │          │ • GuidePanel         │ │
│  │ • User Profile   │          │ • InsightsPanel      │ │
│  │ • New Build CTA  │          │ • ProfilePanel       │ │
│  │                  │          │                      │ │
│  └──────────────────┘          └──────────────────────┘ │
│        ↑                               ↑                 │
│        │                               │                 │
│        └───────────────┬───────────────┘                 │
│                        │                                 │
│              State Management:                           │
│              • activeMode                                │
│              • builds[]                                  │
│              • currentBuildId                            │
│              • user                                      │
│              • Zustand store (parts)                     │
│                                                           │
│              Data Persistence:                           │
│              • Supabase (builds table)                   │
│              • Zustand (in-memory)                       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Responsibilities

### UnifiedBuilder.tsx
**Purpose**: Main orchestrator component  
**Responsibilities**:
- Manage active mode (build/guide/insights/profile/history)
- Load and persist builds from Supabase
- Handle user authentication
- Coordinate between sidebar and content panels
- Support query parameter navigation (`?tab=guide`)

**Key State**:
```typescript
activeMode: BuilderMode                    // Current tab
builds: SavedBuild[]                       // User's saved builds
currentBuildId: string | null              // Currently editing
user: AuthUser | null                      // Authenticated user
loading: boolean                           // Data loading state
```

**Key Methods**:
- `handleNewBuild()` - Reset and start fresh
- `handleLoadBuild()` - Restore from Supabase
- `handleSaveBuild()` - Persist to Supabase
- `handleDeleteBuild()` - Remove from Supabase
- `handleDuplicateBuild()` - Copy with new name

---

### BuilderSidebar.tsx
**Purpose**: Premium navigation sidebar with glassmorphism  
**Responsibilities**:
- Display navigation modes (5 tabs)
- Show recent builds (8 most recent)
- Provide quick actions (duplicate, delete)
- Display user authentication status
- Toggle collapse/expand

**Key Props**:
```typescript
interface BuilderSidebarProps {
  user: any                                      // Auth user
  builds: SavedBuild[]                          // Recent builds
  onNewBuild: () => void                        // Click handler
  onLoadBuild: (build: SavedBuild) => void      // Load handler
  onDeleteBuild: (buildId: string) => void      // Delete handler
  onDuplicateBuild: (build: SavedBuild) => void // Duplicate handler
  activeMode: BuilderMode                       // Current tab
  onModeChange: (mode: BuilderMode) => void     // Tab change handler
}
```

**Design**:
- Glassmorphic background with blur effect
- Smooth collapse/expand animation
- Hover-reveal quick actions on builds
- Color-coded active tab state
- Responsive design (collapses to icons on small screens)

---

### BuildFlowPanel.tsx
**Purpose**: Core part selection interface  
**Responsibilities**:
- Display part categories in build order
- Filter and search parts
- Show current selection for active category
- Display build summary with pricing
- Handle part selection and removal
- Trigger build saves

**Key Features**:
- Virtual scrolling for large part lists
- Real-time search filtering
- Progress tracking (X of 7 components)
- Current selection display panel
- Build summary with total price
- Save build with custom name

**Dependencies**:
- Zustand store (`useBuilderStore`)
- Supabase parts table
- BuildFlowPanel props: `{ onSave, buildName }`

---

### GuidePanel.tsx
**Purpose**: Step-by-step build guidance  
**Responsibilities**:
- Display 7 comprehensive build steps
- Show tips and best practices for each step
- Allow navigation between steps
- Provide visual step indicators

**Structure**:
```
Step 1: Planning & Preparation (4 tips)
Step 2: CPU Selection (4 tips)
Step 3: Motherboard & Power (4 tips)
Step 4: Memory & Storage (4 tips)
Step 5: GPU & Performance (4 tips)
Step 6: Cooling & Case (4 tips)
Step 7: Assembly & Testing (5 tips)
```

**Navigation**:
- Previous/Next buttons
- Visual step indicators (emoji icons)
- Step counter (Step X of 7)
- All steps always accessible

---

### InsightsPanel.tsx
**Purpose**: Build analysis and compatibility checking  
**Responsibilities**:
- Calculate build completion percentage
- Estimate total cost
- Calculate power draw
- Recommend PSU wattage
- Validate component compatibility
- Display detailed component specs
- Show warnings and confirmations

**Key Metrics**:
- Build Completion (%)
- Total Estimated Cost ($)
- Power Draw (W)
- Recommended PSU (W)

**Validation Checks**:
- Socket compatibility (CPU ↔ Motherboard)
- PSU wattage adequacy
- RAM capacity recommendations
- Memory compatibility
- Complete component list validation

---

### ProfilePanel.tsx
**Purpose**: User account management  
**Responsibilities**:
- Display user profile information
- Allow profile editing
- Show account preferences
- Handle email notification settings
- Provide sign out functionality
- Manage account security

**Features**:
- Profile picture (avatar fallback with initials)
- Email preferences
- Account status
- Member since date
- Password change
- Account deletion warning

---

## 🔄 Data Flow

### User Interaction Flow
```
1. User clicks sidebar tab
   ↓
2. onModeChange() triggered
   ↓
3. activeMode state updates
   ↓
4. Correct panel component renders
   ↓
5. Panel displays relevant data
   ↓
6. User interacts with panel
   ↓
7. State updates (Zustand or React state)
   ↓
8. Components re-render with new data
```

### Build Persistence Flow
```
1. User adds parts to build
   ↓
2. Parts stored in Zustand store
   ↓
3. User clicks "Save Build"
   ↓
4. BuildFlowPanel calls onSave()
   ↓
5. UnifiedBuilder.handleSaveBuild() triggered
   ↓
6. Build data prepared with Zustand state
   ↓
7. Supabase.from('builds').insert() or .update()
   ↓
8. Builds list refreshed
   ↓
9. Sidebar history updated
   ↓
10. User sees confirmation
```

### Build Loading Flow
```
1. User clicks build in sidebar history
   ↓
2. BuilderSidebar calls onLoadBuild(build)
   ↓
3. UnifiedBuilder.handleLoadBuild() triggered
   ↓
4. For each part in build.parts:
   - builderStore.setPart(category, part)
   ↓
5. Zustand state updated
   ↓
6. BuildFlowPanel re-renders with restored parts
   ↓
7. User sees their complete saved build
```

---

## 🎨 Design System Implementation

### Glassmorphism (Sidebar)
```typescript
// Base styles for frosted glass effect
className={`
  bg-gradient-to-b from-surface-2/60 to-surface-1/40      // Semi-transparent gradient
  backdrop-blur-xl backdrop-saturate-150                    // Frosted glass effect
  border-r border-border/10                                // Subtle border
  shadow-2xl                                               // Depth shadow
`}
```

### Component Styling Pattern
```typescript
// Active state (selected/highlighted)
`bg-accent/15 border border-accent/30 text-text-primary shadow-md`

// Hover state (interactive)
`hover:bg-surface-2/60 hover:border-border/20`

// Disabled state (inactive)
`bg-surface-3/30 text-text-muted/50 cursor-not-allowed`

// Focus state (keyboard nav)
`focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10`
```

### Color Usage Guide
```typescript
// Backgrounds
bg-bg              // Page background (darkest)
surface-1          // Primary container (dark)
surface-2          // Secondary container (medium)
surface-3          // Tertiary container (lighter)

// Text
text-primary       // Main text (light)
text-muted         // Secondary text (dimmed)

// Accents
accent             // Primary CTA (#6370F1)
accent/15          // Subtle background
accent/30          // Medium background
accent/50          // Strong emphasis

// Borders
border-border/10   // Subtle (most common)
border-border/20   // Medium emphasis
border-border      // Strong borders
```

---

## 🚀 How to Extend

### Adding a New Panel

1. **Create component** in `components/builder/NewPanel.tsx`:
```typescript
interface NewPanelProps {
  // Pass required props
}

export default function NewPanel({ }: NewPanelProps) {
  return (
    <div className="space-y-6">
      {/* Panel content */}
    </div>
  );
}
```

2. **Add mode type** in `UnifiedBuilder.tsx`:
```typescript
export type BuilderMode = 'build' | 'guide' | 'insights' | 'profile' | 'history' | 'newmode';
```

3. **Add navigation item** in `BuilderSidebar.tsx`:
```typescript
const navigationItems = [
  // ... existing items
  { id: 'newmode', label: 'New Mode', icon: '🎯' },
];
```

4. **Add render case** in `UnifiedBuilder.tsx`:
```typescript
case 'newmode':
  return <NewPanel {...props} />;
```

---

### Customizing Panel Layout

Panels follow a consistent structure:
```typescript
export default function PanelName() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Section Title
        </h2>
        <p className="text-text-muted">Description</p>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Content cards */}
      </div>

      {/* Action Section */}
      <div className="flex gap-3">
        <button>Action 1</button>
        <button>Action 2</button>
      </div>
    </div>
  );
}
```

---

## 🧪 Testing Checklist

### Component Rendering
- [ ] All components render without errors
- [ ] Props are properly typed
- [ ] No console warnings
- [ ] Responsive layouts work

### State Management
- [ ] Zustand store updates correctly
- [ ] React state changes trigger re-renders
- [ ] Context is preserved across tabs
- [ ] No memory leaks (effect cleanup)

### Data Persistence
- [ ] Builds save to Supabase
- [ ] Builds load from Supabase
- [ ] Build updates work
- [ ] Build deletion works
- [ ] Build duplication works

### Navigation
- [ ] Sidebar tabs switch active mode
- [ ] Query params navigate correctly
- [ ] Back button works (if using router)
- [ ] Build history links work

### Design Consistency
- [ ] Colors match landing page
- [ ] Typography matches landing page
- [ ] Spacing is consistent
- [ ] Transitions are smooth

---

## 📦 Dependencies

### External Libraries
- **Next.js**: Routing, SSR, image optimization
- **React**: Component framework
- **Zustand**: State management
- **Supabase**: Backend/database
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

### Internal Dependencies
- `@/store/builder` - Zustand store
- `@/lib/supabaseClient` - Supabase client
- `@/lib/supabaseParts` - Parts queries
- `@/lib/supabaseBuilds` - Builds queries

---

## 🔐 Security Considerations

### Authentication
- User must be authenticated to save/load builds
- Supabase RLS policies ensure users only access their builds
- Sign out clears auth state

### Data Validation
- Build data validated before saving
- Parts must exist in database
- User ID verified on save

### XSS Prevention
- All user input sanitized by Supabase
- React auto-escapes in JSX
- No direct `innerHTML` usage

---

## 🎯 Performance Optimization

### Current Optimizations
- **Virtual scrolling** in part lists (only render visible items)
- **Memoization** of part cards (prevent re-renders)
- **Lazy loading** of Supabase data (on-demand)
- **Debounced** compatibility checks (300ms delay)
- **Throttled** scroll events (requestAnimationFrame)

### Potential Improvements
- [ ] Code splitting (lazy load panels)
- [ ] Image optimization (part thumbnails)
- [ ] Caching strategy (SWR for builds)
- [ ] WebWorker for heavy calculations
- [ ] Infinite scroll for history (pagination)

---

## 🐛 Debugging Tips

### Check Active Mode
```typescript
console.log('Active mode:', activeMode);
console.log('Sidebar received:', { activeMode, builds, user });
```

### Verify Zustand State
```typescript
const state = useBuilderStore.getState();
console.log('Build parts:', state.selected);
```

### Check Supabase Connection
```typescript
const { data, error } = await supabase.from('builds').select('*');
console.log('Builds data:', data);
console.log('Error:', error);
```

### React DevTools
- Inspect component props in real-time
- Check state changes in timeline
- Profile performance

---

## 📚 File Structure Reference

```
components/builder/
├── UnifiedBuilder.tsx          Main orchestrator (287 lines)
├── BuilderSidebar.tsx          Navigation sidebar (260 lines)
├── BuildFlowPanel.tsx          Part selection (300+ lines)
├── GuidePanel.tsx              Build guidance (200+ lines)
├── InsightsPanel.tsx           Analysis panel (350+ lines)
├── ProfilePanel.tsx            Account management (300+ lines)
└── hooks/                      Custom hooks (if added)

app/
├── builder/
│   └── page.tsx                Entry point (3 lines)
├── page.tsx                    Landing page (updated)
├── globals.css                 Styling (updated)
└── layout.tsx                  Root layout

middleware.ts                   Route redirects
```

---

## 🎓 Key Concepts

### Builder Mode
Enum representing the active tab/panel:
- `'build'` - Part selection
- `'guide'` - Step-by-step guidance
- `'insights'` - Analysis
- `'profile'` - Account settings
- `'history'` - Saved builds

### SavedBuild
Represents a saved PC build:
```typescript
{
  id: string              // UUID
  name: string            // User-given name
  parts: Record<string, any>  // Selected parts by category
  createdAt: string       // ISO timestamp
  updatedAt: string       // ISO timestamp
}
```

### Part Categories
Seven essential component types:
1. CPU (Processor)
2. Motherboard
3. RAM (Memory)
4. GPU (Graphics Card)
5. Storage (SSD/HDD)
6. PSU (Power Supply)
7. Case (Chassis)

---

## 📞 Support & Contribution

For questions or improvements:
1. Review this architecture guide
2. Check component docstrings
3. Refer to inline comments
4. Test locally with debug logging
5. Follow TypeScript types strictly

---

**Architecture Document Version**: 1.0  
**Last Updated**: January 17, 2026  
**Status**: Production Ready ✅
