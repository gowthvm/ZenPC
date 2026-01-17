# 🚀 Quick Start Guide - ZenPC Unified Builder

## What's New?

The app is now unified into a single `/builder` page with an integrated sidebar and multiple panels. No more fragmented pages!

---

## 🎯 For Users

### Getting Started
1. Go to `https://zenpc.app/` (landing page)
2. Click **"Start Building"** button
3. You're now in the Unified Builder!

### Using the Sidebar
```
┌─ ZenPC Logo (click to go back to homepage)
├─ ➕ New Build (start fresh)
├─ 🔧 Build (part selection) ← Default view
├─ 📖 Guide (step-by-step help)
├─ 📊 Insights (compatibility check)
├─ 📁 History (your saved builds)
├─ 👤 Account (profile settings)
└─ Collapse (◀/▶ to hide sidebar)
```

### Building a PC
1. **Build Tab** → Select components category by category
2. **Guide Tab** → Get tips if you're stuck
3. **Insights Tab** → Check compatibility before saving
4. **Save Your Build** → Give it a name and click "Save Build"

### Your Builds
- View recent builds in the sidebar
- Click any build to load it
- Hover to see **duplicate** (📋) or **delete** (🗑️) buttons
- No need to refresh - everything instant!

### Switching Between Tabs
- Click any tab in sidebar → **instant switch**
- Your build stays intact
- No page reloads

---

## 👨‍💻 For Developers

### Key Files to Know

| File | Purpose | What It Does |
|------|---------|--------------|
| `app/builder/page.tsx` | Builder entry | Renders `<UnifiedBuilder />` |
| `components/builder/UnifiedBuilder.tsx` | Main logic | Manages state, loads/saves builds |
| `components/builder/BuilderSidebar.tsx` | Navigation | Sidebar with tabs and history |
| `components/builder/BuildFlowPanel.tsx` | Part selection | The building interface |
| `components/builder/GuidePanel.tsx` | Help content | 7-step guide |
| `components/builder/InsightsPanel.tsx` | Analysis | Compatibility checking |
| `components/builder/ProfilePanel.tsx` | Account | User settings |
| `middleware.ts` | Redirects | `/app` → `/builder` etc. |

### Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
# http://localhost:3000/builder
```

### Debugging

Check which tab is active:
```typescript
// In UnifiedBuilder.tsx
console.log('Active mode:', activeMode);
// Output: 'build', 'guide', 'insights', 'profile', or 'history'
```

Check saved builds:
```typescript
const { data: builds } = await supabase
  .from('builds')
  .select('*')
  .eq('user_id', user.id);
console.log('User builds:', builds);
```

Check Zustand state:
```typescript
import { useBuilderStore } from '@/store/builder';

const parts = useBuilderStore.getState().selected;
console.log('Selected parts:', parts);
```

### Component Props

**UnifiedBuilder** (no props, uses hooks internally)
```typescript
<UnifiedBuilder />
```

**BuilderSidebar**
```typescript
<BuilderSidebar
  user={user}                              // AuthUser or null
  builds={builds}                          // SavedBuild[]
  onNewBuild={() => {}}                    // () => void
  onLoadBuild={(build) => {}}              // (SavedBuild) => void
  onDeleteBuild={(id) => {}}               // (string) => void
  onDuplicateBuild={(build) => {}}         // (SavedBuild) => void
  activeMode="build"                       // BuilderMode
  onModeChange={(mode) => {}}              // (BuilderMode) => void
/>
```

**BuildFlowPanel**
```typescript
<BuildFlowPanel
  onSave={(name) => {}}                    // (string) => void
  buildName="My Build"                     // string | undefined
/>
```

Others don't need props (they access Zustand and Supabase directly).

### Adding a Feature

1. **New panel?** Create `components/builder/NewPanel.tsx`
2. **New mode?** Add to `BuilderMode` type in UnifiedBuilder
3. **New navigation?** Add to sidebar tabs in BuilderSidebar
4. **New data?** Add to Zustand store in `store/builder.ts`

### Testing Redirects

```bash
# These should all go to /builder
http://localhost:3000/app           → /builder
http://localhost:3000/guide         → /builder?tab=guide
http://localhost:3000/app/account   → /builder?tab=profile

# These work with query params
http://localhost:3000/builder?tab=guide    → Show guide
http://localhost:3000/builder?tab=insights → Show insights
```

---

## 🎨 Design System

### Colors
```css
--accent: 99 112 241;           /* #6370F1 - Purple-blue */
--bg: 10 10 14;                 /* Dark background */
--surface-1: 16 16 22;          /* Primary container */
--surface-2: 24 24 33;          /* Secondary container */
--surface-3: 32 32 44;          /* Tertiary container */
--text: 236 237 242;            /* Light text */
--muted: 154 160 176;           /* Dimmed text */
```

### Spacing Grid
```css
p-3 / gap-3    →  12px
p-4 / gap-4    →  16px
p-6 / gap-6    →  24px
p-8 / gap-8    →  32px
```

### Transitions
```css
duration-200   →  200ms (fast)
duration-300   →  300ms (normal)
ease-premium   →  cubic-bezier(0.2, 0.8, 0.2, 1)
```

### Glassmorphism
```css
backdrop-blur-xl
backdrop-saturate-150
bg-surface-2/60
border-border/10
shadow-2xl
```

---

## 📊 Data Flow

### Saving a Build
```
User clicks "Save Build"
    ↓
BuildFlowPanel calls onSave("Build Name")
    ↓
UnifiedBuilder.handleSaveBuild() runs
    ↓
If new: supabase.from('builds').insert([...])
If update: supabase.from('builds').update([...])
    ↓
Supabase table updated
    ↓
builds[] state updated
    ↓
BuilderSidebar re-renders with new build in history
    ↓
✅ "Build saved successfully!"
```

### Loading a Build
```
User clicks build in sidebar
    ↓
BuilderSidebar calls onLoadBuild(build)
    ↓
UnifiedBuilder.handleLoadBuild() runs
    ↓
For each part in build.parts:
  builderStore.setPart(category, part)
    ↓
Zustand state updated
    ↓
BuildFlowPanel re-renders showing all parts
    ↓
✅ Build loaded!
```

### Switching Tabs
```
User clicks "Guide" tab
    ↓
BuilderSidebar calls onModeChange('guide')
    ↓
UnifiedBuilder sets activeMode = 'guide'
    ↓
renderActivePanel() returns <GuidePanel />
    ↓
Panel appears instantly (no reload)
    ↓
Parts still in Zustand store (not lost!)
    ↓
✅ Seamless transition
```

---

## 🔍 Common Tasks

### Find where a button is
```
Sidebar: components/builder/BuilderSidebar.tsx
Build panel buttons: components/builder/BuildFlowPanel.tsx
Guide buttons: components/builder/GuidePanel.tsx
Account buttons: components/builder/ProfilePanel.tsx
```

### Change sidebar appearance
```
File: components/builder/BuilderSidebar.tsx
Look for: className={`...`} around line 40
Edit: background, blur, colors, borders
```

### Add a new part category
```
File: components/builder/BuildFlowPanel.tsx
Look for: BUILD_ORDER array at top
Add: { key: 'newpart', label: 'New Part', icon: '🎯' }
```

### Modify a step in the guide
```
File: components/builder/GuidePanel.tsx
Look for: buildSteps array
Edit: tips array for any step
```

### Change save/load behavior
```
File: components/builder/UnifiedBuilder.tsx
Look for: handleSaveBuild() and handleLoadBuild()
Edit: Supabase queries or state updates
```

---

## 🚨 Common Issues

### "Components not found" error
```
Problem: TypeScript can't find BuilderSidebar, etc.
Solution: Make sure files exist in components/builder/
          Check spelling matches exactly (case-sensitive)
          Clear .next folder: rm -rf .next
          Restart dev server
```

### "useSearchParams is not defined"
```
Problem: Can't use useSearchParams in component
Solution: Make sure component has 'use client' at top
          import { useSearchParams } from 'next/navigation'
          (not from 'next/router')
```

### Build not saving
```
Problem: "Save Build" button doesn't work
Solution: 1. Check Supabase connection
          2. Check user is authenticated
          3. Check buildName input has text
          4. Check browser console for errors
          5. Verify 'builds' table exists in Supabase
```

### Sidebar not appearing
```
Problem: Sidebar hidden or not visible
Solution: 1. Check BuilderSidebar is imported
          2. Check flex layout: flex h-dvh
          3. Check z-index isn't too low
          4. Check CSS isn't overriding it
          5. Check sidebar width isn't 0
```

### Tabs not switching
```
Problem: Clicking tab doesn't change panel
Solution: 1. Check onModeChange is passed correctly
          2. Check activeMode state updates
          3. Check renderActivePanel() case includes mode
          4. Check no CSS display:none on panels
          5. Check browser console for errors
```

---

## ✅ Quality Checklist

Before committing code:
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No console errors in browser
- [ ] Component renders without crashes
- [ ] All buttons are clickable
- [ ] Sidebar appears correctly
- [ ] Panels switch instantly
- [ ] Colors match design system
- [ ] Spacing is consistent
- [ ] Mobile view works (collapse sidebar)

---

## 🎯 Next Steps

### For Users
- [ ] Build your first PC
- [ ] Save a build
- [ ] Load your saved build
- [ ] Read the guide
- [ ] Check compatibility
- [ ] Update profile

### For Developers
- [ ] Run locally and test all tabs
- [ ] Try adding a part and saving
- [ ] Load a saved build
- [ ] Test redirects (/app, /guide, etc.)
- [ ] Check responsive design
- [ ] Add console logging to debug

---

## 📞 Need Help?

1. **User issue?** → Read DEPLOYMENT_READY.md
2. **Developer issue?** → Read ARCHITECTURE.md
3. **Want to extend?** → Check ARCHITECTURE.md "How to Extend"
4. **Debug needed?** → Use console.log() and browser DevTools

---

## 🎓 Learning Resources

- **React Hooks**: https://react.dev/reference/react
- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Zustand**: https://github.com/pmndrs/zustand
- **Supabase**: https://supabase.com/docs

---

**Quick Start Version**: 1.0  
**Last Updated**: January 17, 2026  
**Status**: Ready to Use ✅

Good luck building! 🚀
