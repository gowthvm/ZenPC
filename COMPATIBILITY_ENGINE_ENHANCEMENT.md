# PC Compatibility Engine Enhancement Prompt

## Overview
Design and implement a comprehensive PC compatibility checking system that validates every possible compatibility factor between PC components. The system should provide real-time feedback with severity levels (error, warning, info) and detailed explanations.

## Core Compatibility Rules

### 1. CPU ↔ Motherboard Compatibility

#### Socket Compatibility (ERROR)
- CPU socket must exactly match motherboard socket
- Examples: AM5 CPU requires AM5 motherboard, LGA1700 CPU requires LGA1700 motherboard.
- Handle socket variations: AM4 vs AM5, LGA1200 vs LGA1700, etc.

#### Chipset Support (WARNING/INFO)
- CPU generation should be supported by motherboard chipset
- Example: Ryzen 7000 series requires 600-series chipset or newer
- Intel 13th gen may require BIOS update on older chipsets

#### Power Delivery (WARNING)
- Motherboard VRM quality should match CPU power requirements
- High-end CPUs need robust power delivery phases
- Check TDP vs motherboard power delivery capabilities

#### Memory Controller (ERROR)
- CPU memory type must match motherboard supported memory
- DDR5 CPUs only work with DDR5 motherboards
- DDR4 CPUs only work with DDR4 motherboards
- Some CPUs support both (rare, needs validation)

### 2. RAM ↔ Motherboard Compatibility

#### Memory Type (ERROR)
- DDR5 RAM only works in DDR5 motherboards
- DDR4 RAM only works in DDR4 motherboards
- Cannot mix DDR types on same motherboard

#### Memory Speed (WARNING)
- RAM speed should not exceed motherboard maximum supported speed
- RAM will downclock to motherboard's max speed if exceeded
- Show both rated speed and expected actual speed

#### Memory Capacity (WARNING)
- Total RAM should not exceed motherboard maximum capacity
- Consider per-slot limitations and total slot count
- Example: 4 slots × 32GB max per module = 128GB total max

#### Memory Voltage (WARNING)
- RAM voltage should be within motherboard specifications
- XMP/EXPO profiles may require specific voltage support
- Check JEDEC vs XMP voltage requirements

#### ECC Memory Support (INFO/WARNING)
- Server/workstation motherboards may support ECC
- Consumer motherboards typically don't support ECC
- ECC RAM may work as non-ECC on unsupported boards

### 3. GPU ↔ System Compatibility

#### PCIe Version (INFO)
- Check GPU PCIe version vs motherboard PCIe slots
- PCIe 4.0 GPU works in PCIe 3.0 slot (reduced bandwidth)
- PCIe 5.0 GPU requires PCIe 5.0 slot for full performance

#### Physical Clearance (ERROR)
- GPU length must fit in case
- GPU height must fit in case (consider side panel clearance)
- GPU thickness (slot count) must fit motherboard space

#### Power Connector (ERROR)
- GPU power connectors must match available PSU connectors
- 6-pin, 8-pin, 12VHPWR considerations
- Adapter requirements and limitations

#### Power Supply (ERROR)
- PSU wattage must exceed total system power draw
- Include 30-40% headroom for stability and overclocking
- Consider GPU peak power vs average power

#### CPU Bottleneck (WARNING)
- Check if CPU will bottleneck GPU performance
- Provide performance tier matching recommendations
- Consider use case (gaming, content creation, etc.)

### 4. Storage ↔ Motherboard Compatibility

#### Interface Type (ERROR)
- SATA drives require SATA ports on motherboard
- NVMe drives require M.2 slots with PCIe support
- Check M.2 key type (M-key, B+M key)

#### PCIe Generation (INFO)
- NVMe PCIe generation vs motherboard M.2 support
- PCIe 4.0 NVMe works in PCIe 3.0 slot (reduced speed)
- PCIe 5.0 NVMe requires PCIe 5.0 M.2 slot

#### Physical Space (ERROR)
- M.2 drives may conflict with other components
- Check clearance with GPU, CPU cooler, RAM slots
- Some M.2 slots share bandwidth with SATA ports

#### Storage Capacity (INFO)
- Consider total storage needs and upgrade paths
- Check operating system requirements for boot drives

### 5. Power Supply ↔ System Compatibility

#### Wattage Requirements (ERROR)
- Total system power draw must be less than PSU capacity
- Include CPU TDP, GPU TBP, and other components
- Add 30-40% headroom for peak loads and overclocking

#### Efficiency Rating (INFO)
- 80+ ratings (Bronze, Silver, Gold, Platinum, Titanium)
- Higher efficiency = less heat, lower electricity costs
- Consider operating load efficiency curves

#### Modular vs Non-Modular (INFO)
- Case size and cable management considerations
- Non-modular PSUs may have unused cables cluttering case

#### Form Factor (ERROR)
- PSU form factor must match case (ATX, SFX, etc.)
- Check depth clearance in case
- Consider cable length for larger cases

#### Connectors (ERROR)
- Sufficient connectors for all components
- SATA power connectors count
- PCIe power connectors for GPU
- CPU power connector (4+4, 8-pin)

### 6. CPU Cooler ↔ System Compatibility

#### Socket Compatibility (ERROR)
- Cooler socket must match CPU socket
- AM4 vs AM5, LGA1700 vs LGA1200, etc.
- Include mounting hardware requirements

#### Height Clearance (ERROR)
- Cooler height must fit in case
- Consider side panel clearance
- Check motherboard component interference

#### RAM Clearance (ERROR)
- Cooler must not interfere with RAM slots
- Tall RAM may require low-profile cooler
- Check overhang past motherboard edge

#### TDP Support (WARNING)
- Cooler should handle CPU TDP with headroom
- Consider overclocking heat output
- Review thermal performance reviews

#### Fan Headers (INFO)
- Motherboard must have sufficient fan headers
- CPU fan header requirement
- Additional case fan connectivity

### 7. Case ↔ System Compatibility

#### Motherboard Form Factor (ERROR)
- Motherboard must fit case (ATX, Micro-ATX, Mini-ITX)
- Standoff locations must align
- Check I/O shield clearance

#### Component Clearance (ERROR)
- GPU length/height must fit
- CPU cooler height must fit
- RAM height with side panel clearance
- PSU length and cable routing

#### Cooling Support (INFO)
- Case fan mounts and radiator support
- Front panel I/O availability
- Dust filter considerations

#### Drive Bays (INFO)
- 2.5" and 3.5" drive bay availability
- M.2 slot locations on motherboard
- Consider storage expansion needs

## Advanced Compatibility Features

### 1. Performance Matching Analysis
- CPU-GPU performance balance recommendations
- RAM speed vs CPU memory controller capabilities
- Storage speed vs use case requirements

### 2. Future-Proofing Suggestions
- Upgrade path compatibility
- Socket longevity considerations
- PCIe generation headroom

### 3. Use Case Optimization
- Gaming build priorities
- Content creation requirements
- Productivity/workstation needs
- Budget-conscious recommendations

### 4. Thermal Analysis
- Case airflow vs component heat output
- Cooler performance vs case size
- Component temperature predictions

### 5. Power Efficiency Analysis
- PSU efficiency at expected load
- Total system power consumption estimates
- Electricity cost projections

## Implementation Requirements

### 1. Rule Engine Architecture
- Declarative compatibility rules stored in database
- Easy to add/modify rules without code changes
- Rule priority and severity system
- Conditional logic support

### 2. Real-Time Validation
- Instant feedback as components are selected
- Progressive checking (only check relevant combinations)
- Performance-optimized rule evaluation

### 3. User-Friendly Feedback
- Clear, actionable error messages
- Visual indicators (colors, icons, severity levels)
- Detailed explanations and recommendations
- Alternative component suggestions

### 4. Extensibility
- Plugin architecture for new component types
- Custom rule creation for advanced users
- Community-contributed compatibility rules

### 5. Data Structure
```typescript
interface CompatibilityRule {
  id: string;
  sourceCategory: ComponentCategory;
  targetCategory: ComponentCategory;
  sourceField: string;
  targetField: string;
  operator: ComparisonOperator;
  severity: 'error' | 'warning' | 'info';
  message: string;
  explanation: string;
  recommendations?: string[];
  conditions?: RuleCondition[];
}

interface CompatibilityResult {
  passed: boolean;
  severity: 'error' | 'warning' | 'info';
  message: string;
  explanation: string;
  recommendations?: string[];
  alternatives?: ComponentSuggestion[];
}
```

## Testing Strategy

### 1. Unit Tests
- Individual rule validation
- Edge case coverage
- Performance benchmarks

### 2. Integration Tests
- Complete build scenarios
- Real-world component combinations
- User workflow testing

### 3. User Acceptance Testing
- Build complexity scenarios
- Error message clarity
- Recommendation accuracy

## Success Metrics

### 1. Accuracy
- False positive rate < 5%
- False negative rate < 2%
- Rule coverage > 95% of compatibility issues

### 2. Performance
- Validation time < 100ms per component change
- Database query optimization
- Caching effectiveness

### 3. User Experience
- User satisfaction with error messages
- Build completion rate improvement
- Support ticket reduction for compatibility issues

This comprehensive compatibility engine will ensure users can build PCs with confidence, knowing that every possible compatibility factor has been considered and validated.
