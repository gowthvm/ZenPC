# Real Examples: Enhanced Error Messages in Action

## Example 1: CPU Socket Mismatch

### What the user sees:

```
❌ CPU Socket Mismatch: Intel Core i9-13900K requires LGA1700 but motherboard has AM5

INCOMPATIBLE: "Intel Core i9-13900K" uses the LGA1700 socket, but "AMD Ryzen 7 7700X" motherboard uses the AM5 socket. These sockets are not compatible - you cannot install this CPU on this motherboard.

EXACTLY WHAT'S WRONG:
• Your CPU: Intel Core i9-13900K (socket: LGA1700)
• Your motherboard: ASUS ROG STRIX X870-E (socket: AM5)
• Problem: The CPU physically will not fit into the motherboard's socket.

Option 1: Replace the motherboard with one that has an LGA1700 socket (to match your CPU)

Option 2: Replace the CPU with a processor that uses the AM5 socket (to match your motherboard)

To fix this issue, you MUST choose parts with matching sockets. Common sockets include: AM4/AM5 (AMD), LGA1150/LGA1200/LGA1700 (Intel).
```

### Why this is better:
- **Before:** User gets "CPU socket is incompatible"
- **After:** User sees the EXACT sockets, which parts have which, and two clear action paths to fix it

---

## Example 2: GPU Too Large for Case

### What the user sees:

```
❌ GPU Too Large: RTX 4090 Founders Edition (312mm × 111mm) exceeds Fractal Define 7 Compact (max 300mm × 100mm)

INCOMPATIBLE: "RTX 4090 Founders Edition" is physically too large to fit inside "Fractal Define 7 Compact". The GPU will not fit and cannot be installed.

EXACTLY WHAT'S WRONG:
• Your GPU: RTX 4090 Founders Edition (312mm length × 111mm height)
• Your case: Fractal Define 7 Compact (max GPU space: 300mm length × 100mm height)
• Problems:
  • Length: 312mm (GPU) vs 300mm (case) - GPU is 12mm TOO LONG
  • Height: 111mm (GPU) vs 100mm (case) - GPU is 11mm TOO TALL

Option 1: Get a larger case that can accommodate a GPU that's 12mm larger

Option 2: Replace the GPU with a smaller model that fits within the Fractal Define 7 Compact's dimensions (max 300mm length, 100mm height)

Check your case's GPU clearance specifications (usually listed as "Max GPU length") before selecting a graphics card. Large GPUs need large cases.
```

### Why this is better:
- **Before:** "GPU is too large" - user doesn't know by how much
- **After:** User sees exact measurements (312mm vs 300mm, 111mm vs 100mm) and knows exactly how big a case/GPU they need

---

## Example 3: Missing Power Connectors

### What the user sees:

```
❌ Missing Power Connectors: RTX 4080 Super needs 2× 8-pin that CORSAIR RM1000x (provides 1× 8-pin) doesn't have

INCOMPATIBLE: "RTX 4080 Super" requires 2× 8-pin and 1× 6-pin, but "CORSAIR RM1000x" does not have enough power connectors. Using adapters on high-end GPUs can cause power delivery issues, system crashes, or even fire hazards.

EXACTLY WHAT'S WRONG:
• Your GPU: RTX 4080 Super (requires: 2× 8-pin and 1× 6-pin connectors)
• Your PSU: CORSAIR RM1000x (provides: 1× 8-pin and 0× 6-pin)
• Missing: 1× 8-pin and 1× 6-pin

Option 1: Choose a more powerful PSU (850W+) with dual 8-pin connectors and 6-pin support

Option 2: Replace the GPU with a lower-power model that fits within the CORSAIR RM1000x's connector capacity (RTX 4070)

BLOCKING ERROR: The GPU cannot receive adequate power. Using adapters is dangerous and not recommended.

High-end RTX 40-series GPUs need 850W+ PSUs with dedicated connectors. Never use adapters for power delivery—it's unsafe.
```

### Why this is better:
- **Before:** "GPU requires connectors PSU doesn't provide"
- **After:** User sees:
  - Exact connector count needed vs provided (2× 8-pin vs 1× 8-pin)
  - Specific PSU wattage recommendation (850W+)
  - Specific alternative GPU model
  - Safety warning about adapter dangers

---

## Example 4: Cooler Height Clearance

### What the user sees:

```
❌ Cooler Too Tall: Noctua NH-D15 (165mm) doesn't fit in Lian Li Lancool 205 Mesh (max 160mm)

INCOMPATIBLE: "Noctua NH-D15" is too tall to fit inside "Lian Li Lancool 205 Mesh". The cooler will hit the case's side panel and cannot be installed.

EXACTLY WHAT'S WRONG:
• Your cooler: Noctua NH-D15 (height: 165mm)
• Your case: Lian Li Lancool 205 Mesh (max cooler clearance: 160mm)
• Problem: The cooler is 5mm TOO TALL - it will not fit vertically inside the case.

Option 1: Replace the cooler with a shorter model (must be under 160mm tall)

Option 2: Replace the case with a larger one that supports cooler heights up to 165mm

Always check your case's maximum cooler height specification. Large air coolers and thick radiators need more vertical space.
```

### Why this is better:
- **Before:** "CPU cooler is too tall" - vague
- **After:** User sees exact heights (165mm vs 160mm) and how much bigger they need

---

## Example 5: Motherboard Form Factor

### What the user sees:

```
❌ Motherboard Won't Fit: ROG STRIX X870-E-E GAMING (ATX) doesn't fit in Lian Li Lancool 205 (supports Micro-ATX, Mini-ITX)

INCOMPATIBLE: "ROG STRIX X870-E-E GAMING" is a ATX motherboard, but "Lian Li Lancool 205" only supports Micro-ATX, Mini-ITX boards. The motherboard will be too large (or small) for this case's mounting bracket.

EXACTLY WHAT'S WRONG:
• Your motherboard: ROG STRIX X870-E-E GAMING (size: ATX)
• Your case: Lian Li Lancool 205 (supports: Micro-ATX, Mini-ITX)
• Problem: The motherboard mounting holes don't align with the case's bracket positions. The board will not mount securely.

Option 1: Choose a Micro-ATX, Mini-ITX motherboard that fits in this case

Option 2: Choose a different case that supports ATX motherboards

Common motherboard sizes are ATX (full-size), Micro-ATX (smaller), and Mini-ITX (very small). Always match your motherboard size to your case's supported form factors.
```

### Why this is better:
- **Before:** "Case does not support ATX motherboards"
- **After:** User sees available options (Micro-ATX, Mini-ITX) and knows to find compatible boards

---

## Example 6: Memory Type Mismatch

### What the user sees:

```
❌ Memory Type Mismatch: G.SKILL Trident Z5 64GB is DDR5 but motherboard requires DDR4

INCOMPATIBLE: "G.SKILL Trident Z5 64GB" is DDR5 memory, but "MSI MPG B650E EDGE WIFI" only supports DDR4 memory. The RAM will not fit into the motherboard's memory slots and the system will not work.

EXACTLY WHAT'S WRONG:
• Your RAM: G.SKILL Trident Z5 64GB (type: DDR5)
• Your motherboard: MSI MPG B650E EDGE WIFI (supports: DDR4)
• Problem: The physical connectors don't match - your RAM will not seat into the motherboard's DIMM slots.

Option 1: Replace your RAM with DDR4 memory to match your motherboard's requirements

Option 2: Replace your motherboard with one that supports DDR5 memory to match your RAM

Ensure both RAM and motherboard support the same memory standard. DDR5 and DDR4 are not compatible with each other.
```

### Why this is better:
- **Before:** "RAM type is incompatible"
- **After:** User sees the exact types (DDR5 vs DDR4) and that they're physically incompatible

---

## Example 7: Cooler Socket Incompatibility

### What the user sees:

```
❌ Cooler Incompatible: CORSAIR H150i Elite Capellix doesn't support AM5 socket (supports: AM4, LGA1150, LGA1200, LGA1700)

INCOMPATIBLE: "CORSAIR H150i Elite Capellix" does not have mounting brackets for socket AM5. The cooler cannot be mechanically mounted to your CPU.

EXACTLY WHAT'S WRONG:
• Your CPU: AMD Ryzen 7 7700X (socket: AM5)
• Your cooler: CORSAIR H150i Elite Capellix (supports: AM4, LGA1150, LGA1200, LGA1700)
• Problem: The cooler's mounting hardware is not compatible with this CPU socket.

Option 1: Choose a different cooler that supports socket AM5

Option 2: Choose a different CPU with a socket supported by this cooler (AM4, LGA1150, LGA1200, LGA1700)

Make sure your cooler supports your CPU's socket. Common coolers support multiple sockets, but some are exclusive to one platform (AMD vs Intel).
```

### Why this is better:
- **Before:** "Cooler does not support socket AM5"
- **After:** User sees all supported sockets and can choose accordingly

---

## Example 8: PSU Form Factor

### What the user sees:

```
❌ PSU Won't Fit: EVGA SuperNOVA 1000W P5 (ATX) doesn't fit in Corsair Crystal 280X RGB (supports ATX, SFX)

INCOMPATIBLE: "EVGA SuperNOVA 1000W P5" is a ATX form factor power supply, but "Corsair Crystal 280X RGB" only supports ATX, SFX PSUs. The PSU will not fit in the case's power supply bay.

EXACTLY WHAT'S WRONG:
• Your PSU: EVGA SuperNOVA 1000W P5 (size: ATX)
• Your case: Corsair Crystal 280X RGB (supports: ATX, SFX)
• Problem: The PSU is physically too large (or the wrong shape) for the case's power supply mounting area.

Option 1: Choose a SFX PSU that fits in this case

Option 2: Choose a different case that supports ATX power supplies

Common PSU sizes are ATX (full-size, most common) and SFX (compact). Check your case's PSU bay dimensions before selecting a power supply.
```

### Why this is better:
- **Before:** "Case does not support PSU type"
- **After:** User sees available options (ATX, SFX) and knows what to look for

---

## Summary: From Vague to Specific

| Issue | Old Message | New Message |
|-------|-------------|-------------|
| Socket mismatch | "Socket incompatible" | "LGA1700 vs AM5 - CPU won't fit" |
| GPU size | "GPU too large" | "312mm vs 300mm - needs 12mm larger case" |
| Power connectors | "Missing connectors" | "Needs 2× 8-pin, only 1× available" |
| Cooler height | "Too tall" | "165mm vs 160mm - 5mm too tall" |
| Motherboard size | "Not supported" | "ATX doesn't fit Micro-ATX case" |

**Key Benefit:** Users now know EXACTLY what's wrong and EXACTLY what to do, making the builder intuitive and frustration-free.
