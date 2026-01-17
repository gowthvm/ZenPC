# Professional Design System - Quick Reference

## Component Classes for Developers

### Cards & Containers
```tsx
// Premium glass card
<div className="card">Content</div>

// Full-featured panel
<div className="panel">
  <div className="panel-header">
    <h2 className="panel-title">Title</h2>
    <p className="panel-subtitle">Subtitle</p>
  </div>
  {/* Content */}
</div>
```

### Page Structure
```tsx
// Standard page layout
<div className="w-full animate-in fade-in duration-500">
  {/* Page Header */}
  <div className="section-header mb-8">
    <h1 className="section-title">Page Title</h1>
    <p className="section-subtitle">Descriptive subtitle</p>
  </div>
  
  {/* Content Grid */}
  <div className="content-grid-3">
    {/* Cards go here */}
  </div>
</div>
```

### Buttons
```tsx
// Primary action
<button className="btn-primary">Action</button>

// Secondary action
<button className="btn-secondary">Alternative</button>

// Outline button
<button className="btn-outline">Tertiary</button>

// Ghost button
<button className="btn-ghost">Icon</button>
```

### Form Inputs
```tsx
<label className="form-label" htmlFor="field">Label</label>
<input id="field" className="form-input" type="text" />
```

### Status Indicators
```tsx
<span className="badge-success">✓ Success</span>
<span className="badge-warning">⚠ Warning</span>
<span className="badge-error">✗ Error</span>
<span className="badge-info">ℹ Info</span>
```

### Navigation Items
```tsx
<button className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}>
  Item
</button>
```

### Empty States
```tsx
<div className="panel text-center">
  <div className="empty-state">
    <div className="empty-state-icon">
      <IconComponent />
    </div>
    <h3 className="empty-state-title">Title</h3>
    <p className="empty-state-text">Description</p>
    <button className="btn-primary">Action</button>
  </div>
</div>
```

## Grid Layouts
```tsx
// 2-column responsive grid
<div className="content-grid-2">...</div>

// 3-column responsive grid
<div className="content-grid-3">...</div>

// Custom grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">...</div>
```

## Color Usage Guide

### Text Colors
```
Primary text: text-text-primary
Secondary text: text-text-muted
Accent text: text-accent
Error text: text-red-400
Success text: text-green-400
Warning text: text-yellow-400
```

### Background Colors
```
Primary bg: bg-surface-1
Secondary bg: bg-surface-2
Tertiary bg: bg-surface-3
Accent bg: bg-accent
With transparency: bg-surface-1/50, bg-accent/20
```

### Border Colors
```
Subtle border: border-border/10
Light border: border-border/20
Visible border: border-border/30
Accent border: border-accent/20
```

## Spacing Guidelines

### Section Spacing
```
Between sections: mb-8 (32px)
Between subsections: mb-6 (24px)
Between items: gap-4 to gap-6 (16-24px)
Padding in cards/panels: p-6 md:p-8 (24-32px)
```

### Layout Patterns
```
Single column: max-w-4xl mx-auto px-4
Two column: md:grid-cols-2
Three column: lg:grid-cols-3
With sidebars: grid-cols-1 md:grid-cols-4
```

## Typography Classes

### Headings
```tsx
<h1 className="section-title">Large Page Title</h1>
<h2 className="section-title text-xl">Smaller Heading</h2>
<h3 className="panel-title">Panel/Card Title</h3>
```

### Text
```tsx
<p className="text-text-primary">Primary text</p>
<p className="text-text-muted">Secondary text</p>
<p className="text-sm text-text-muted">Small secondary</p>
<p className="text-xs text-text-muted">Extra small secondary</p>
```

## Hover & Interactive States

### Card Hover
```tsx
<div className="panel group hover:scale-[1.02] transition-all duration-base ease-premium">
  {/* Content */}
</div>
```

### Button Hover (built-in)
```
All btn-* classes include:
- Smooth color transitions
- Scale effects (95% active, 105% hover)
- Shadow enhancements
- 250ms transition duration
```

### Nav Item Hover
```tsx
<button className={`nav-item ${active ? 'nav-item-active' : 'nav-item-inactive'}`}>
  {/* Built-in hover effects */}
</button>
```

## Animation Usage

### Page Transitions
```tsx
<div className="animate-in fade-in duration-500">
  {/* Page content - fades in on load */}
</div>
```

### Custom Animations
```
fade-in: 0.5s fade from 0 to 1 opacity
slide-in-from-top: Slides in from above with fade
slide-in-from-bottom: Slides in from below with fade
```

### Hover Animations
```
Most components include smooth 250ms transitions
Use transition-all for comprehensive effect
Use ease-premium for professional feel
```

## Responsive Breakpoints

```
Mobile: < 768px (md breakpoint)
Tablet: 768px - 1024px (lg breakpoint)
Desktop: > 1024px

Usage:
  grid-cols-1       - Mobile (full width)
  md:grid-cols-2    - Tablet and up
  lg:grid-cols-3    - Desktop and up
  
  hidden md:block    - Hidden on mobile, visible on tablet+
  md:px-8           - Extra padding on larger screens
```

## Do's and Don'ts

### ✅ DO
- Use `.card` for content containers
- Use `.panel` for feature-complete sections
- Apply `animate-in fade-in duration-500` to page-level containers
- Use grid utilities for responsive layouts
- Apply consistent padding with `p-6 md:p-8`
- Use button hierarchy (primary/secondary/outline/ghost)
- Leverage badge-* for status indicators
- Implement empty-state components properly

### ❌ DON'T
- Create custom card styles - use `.card`
- Mix old styling approaches with new utilities
- Create buttons without button hierarchy
- Forget responsive classes (md:, lg:)
- Use flat colors without transparency
- Add random padding/spacing values
- Create new color tokens outside the system
- Forget animations on page transitions

## Common Patterns

### Full-Width Page
```tsx
<div className="w-full animate-in fade-in duration-500 space-y-12">
  <div className="section-header mb-8">
    <h1 className="section-title">Title</h1>
    <p className="section-subtitle">Subtitle</p>
  </div>
  {/* Content */}
</div>
```

### Two-Column Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
  <div className="panel">Left</div>
  <div className="panel">Right</div>
</div>
```

### Sidebar + Content
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
  <div className="md:col-span-1">
    <div className="card sticky top-24">Sidebar</div>
  </div>
  <div className="md:col-span-3">
    <div className="panel">Main Content</div>
  </div>
</div>
```

### Action Bar
```tsx
<div className="border-b border-border/10 bg-surface-1/30 backdrop-blur-xl px-6 py-5">
  <h1 className="font-display text-xl font-semibold text-text-primary">Title</h1>
  <p className="text-xs text-text-muted mt-1">Description</p>
</div>
```

## Color Reference

### Status Colors
- Success: `#10b981` (green-500)
- Warning: `#eab308` (yellow-500)
- Error: `#ef4444` (red-500)
- Info: `rgb(99 112 241)` (accent)

### Opacity Variants
For any color, use: `color/opacity`
Examples:
- `text-accent/50` - 50% opacity
- `bg-surface-1/40` - 40% opacity
- `border-border/10` - 10% opacity

## Performance Considerations

### Transitions
- Use `transition-all duration-base ease-premium` for smooth effects
- Default duration is 250ms (production-optimized)
- Avoid custom durations unless necessary

### Animations
- Page transitions use `animate-in fade-in` (0.5s)
- Limited to necessary animations for performance
- Respects `prefers-reduced-motion` system setting

### Rendering
- Use `group` and `group-hover:` for hover states
- Use `opacity-0 group-hover:opacity-100` for conditional visibility
- Prefer CSS transitions over JavaScript animations

## Maintenance Guidelines

When updating the design system:

1. **Update globals.css** for utility changes
2. **Update tailwind.config.ts** for new configurations
3. **Update this reference guide** with any new patterns
4. **Test responsive** on mobile, tablet, desktop
5. **Verify animations** across all pages
6. **Check accessibility** (focus states, color contrast)
7. **Ensure consistency** across all pages

## Resources

- Landing page (`/app/page.tsx`) - Design reference
- Globals CSS (`/app/globals.css`) - Utility definitions
- Tailwind config (`/tailwind.config.ts`) - Theme configuration
- Design summary (`DESIGN_POLISH_SUMMARY.md`) - Detailed changes

---

**Version**: 1.0 | **Last Updated**: January 2026 | **Status**: Production-Ready
