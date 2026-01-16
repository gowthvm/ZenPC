/**
 * Build Guide Engine - Comprehensive PC Building Authority
 * 
 * This engine provides dynamic, data-driven guidance for every phase of PC building.
 * It uses the compatibility engine, spec dictionary, and rules as the single source of truth.
 */

import { evaluateCompatibility, estimatePowerRequirements, CompatibilityIssue, CompatibilityConfirmation } from './compatibilityEngine';
import { getSpecValue, getSpecDefinition, getSpecsForCategory, PartCategory } from './specDictionary';
import { SelectedParts } from '../store/builder';

export type BuildPhase = 
  | 'pre_build_planning'
  | 'component_selection' 
  | 'system_constraints'
  | 'build_order'
  | 'firmware_setup'
  | 'validation_review';

export type StepStatus = 'blocked' | 'ready' | 'in_progress' | 'completed' | 'warning';

export interface BuildStep {
  id: string;
  phase: BuildPhase;
  title: string;
  description: string;
  status: StepStatus;
  dependencies: string[];
  recommendations: BuildRecommendation[];
  warnings: BuildWarning[];
  errors: BuildError[];
  actions: BuildAction[];
  progress: number; // 0-100
}

export interface BuildRecommendation {
  type: 'component' | 'setting' | 'general_action' | 'check' | 'select_part' | 'change_part';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category?: PartCategory;
  specKey?: string;
  targetValue?: any;
  reasoning: string;
}

export interface BuildWarning {
  type: 'compatibility' | 'performance' | 'physical' | 'power' | 'thermal';
  title: string;
  description: string;
  affected: string[];
  resolution: string;
  severity: 'warning' | 'info';
}

export interface BuildError {
  type: 'compatibility' | 'critical' | 'missing';
  title: string;
  description: string;
  affected: string[];
  resolution: string;
  blocking: boolean;
}

export interface BuildAction {
  type: 'select_part' | 'change_part' | 'verify_spec' | 'test_connection' | 'configure_setting' | 'general_action' | 'check';
  title: string;
  description: string;
  category?: PartCategory;
  instructions: string[];
  completed: boolean;
}

export interface BuildGuideState {
  currentPhase: BuildPhase;
  currentStep: string;
  steps: BuildStep[];
  overallProgress: number;
  buildHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  summary: BuildSummary;
}

export interface BuildSummary {
  totalIssues: number;
  criticalIssues: number;
  warnings: number;
  recommendations: number;
  completedSteps: number;
  totalSteps: number;
  estimatedPower: number;
  thermalRisk: 'low' | 'medium' | 'high';
  upgradePotential: 'low' | 'medium' | 'high';
}

export interface UseCaseAnalysis {
  primaryUse: 'gaming' | 'productivity' | 'content_creation' | 'ai_workstation' | 'general' | 'mixed';
  performanceTier: 'entry' | 'mainstream' | 'high_performance' | 'enthusiast' | 'extreme';
  budgetRange: 'budget' | 'mid_range' | 'high_end' | 'premium';
  platformPreference: 'intel' | 'amd' | 'neutral';
  upgradeLongevity: 'short_term' | 'medium_term' | 'long_term';
  recommendations: string[];
  expectations: PerformanceExpectation[];
}

export interface PerformanceExpectation {
  metric: string;
  expectedValue: string;
  context: string;
  dependsOn: string[];
}

/**
 * Build Guide Engine Class
 */
export class BuildGuideEngine {
  private selectedParts: SelectedParts;
  private compatibilityData: { issues: CompatibilityIssue[]; confirmations: CompatibilityConfirmation[] } = { issues: [], confirmations: [] };
  private useCase: UseCaseAnalysis | null = null;

  constructor(selectedParts: SelectedParts = {}) {
    this.selectedParts = selectedParts;
  }

  /**
   * Update the selected parts and recompute all guidance
   */
  async updateParts(parts: SelectedParts): Promise<BuildGuideState> {
    this.selectedParts = parts;
    this.compatibilityData = await evaluateCompatibility(parts);
    
    return this.generateGuideState();
  }

  /**
   * Set use case analysis for planning phase
   */
  setUseCase(useCase: UseCaseAnalysis): void {
    this.useCase = useCase;
  }

  /**
   * Generate the complete build guide state
   */
  private async generateGuideState(): Promise<BuildGuideState> {
    const steps = this.generateAllSteps();
    const summary = this.generateSummary();
    const buildHealth = this.determineBuildHealth();
    const overallProgress = this.calculateOverallProgress(steps);
    
    // Find current active step
    const currentStep = this.findCurrentStep(steps);
    const currentPhase = this.getPhaseForStep(currentStep);

    return {
      currentPhase,
      currentStep,
      steps,
      overallProgress,
      buildHealth,
      summary
    };
  }

  /**
   * Generate all build steps across all phases
   */
  private generateAllSteps(): BuildStep[] {
    const steps: BuildStep[] = [];

    // Pre-Build Planning Phase
    steps.push(...this.generatePreBuildPlanningSteps());

    // Component Selection Phase
    steps.push(...this.generateComponentSelectionSteps());

    // System-Level Constraints Phase
    steps.push(...this.generateSystemConstraintSteps());

    // Build Order & Assembly Phase
    steps.push(...this.generateBuildOrderSteps());

    // Firmware & Software Setup Phase
    steps.push(...this.generateFirmwareSetupSteps());

    // Validation & Review Phase
    steps.push(...this.generateValidationSteps());

    return steps;
  }

  /**
   * Pre-Build Planning Phase Steps
   */
  private generatePreBuildPlanningSteps(): BuildStep[] {
    const steps: BuildStep[] = [];

    // Step 1: Intended Use Detection
    steps.push({
      id: 'intended_use_detection',
      phase: 'pre_build_planning',
      title: 'Define Your Intended Use',
      description: 'Identify your primary use case to guide component selection',
      status: this.useCase ? 'completed' : 'ready',
      dependencies: [],
      recommendations: this.generateUseCaseRecommendations(),
      warnings: [],
      errors: [],
      actions: this.generateUseCaseActions(),
      progress: this.useCase ? 100 : 0
    });

    // Step 2: Budget Analysis
    steps.push({
      id: 'budget_analysis',
      phase: 'pre_build_planning',
      title: 'Budget Planning & Tradeoffs',
      description: 'Understand budget implications and component tradeoffs',
      status: this.useCase?.budgetRange ? 'completed' : 'ready',
      dependencies: ['intended_use_detection'],
      recommendations: this.generateBudgetRecommendations(),
      warnings: this.generateBudgetWarnings(),
      errors: [],
      actions: this.generateBudgetActions(),
      progress: this.useCase?.budgetRange ? 100 : 0
    });

    // Step 3: Platform Decision
    steps.push({
      id: 'platform_decision',
      phase: 'pre_build_planning',
      title: 'Platform Selection (Intel vs AMD)',
      description: 'Choose CPU platform based on performance needs and upgrade path',
      status: this.selectedParts.cpu ? 'completed' : 'ready',
      dependencies: ['budget_analysis'],
      recommendations: this.generatePlatformRecommendations(),
      warnings: this.generatePlatformWarnings(),
      errors: [],
      actions: this.generatePlatformActions(),
      progress: this.selectedParts.cpu ? 100 : 0
    });

    // Step 4: Performance Expectations
    steps.push({
      id: 'performance_expectations',
      phase: 'pre_build_planning',
      title: 'Performance Tier & Expectations',
      description: 'Set realistic performance expectations for your use case',
      status: this.useCase?.performanceTier ? 'completed' : 'ready',
      dependencies: ['platform_decision'],
      recommendations: this.generatePerformanceRecommendations(),
      warnings: this.generatePerformanceWarnings(),
      errors: [],
      actions: this.generatePerformanceActions(),
      progress: this.useCase?.performanceTier ? 100 : 0
    });

    return steps;
  }

  /**
   * Component Selection Phase Steps
   */
  private generateComponentSelectionSteps(): BuildStep[] {
    const steps: BuildStep[] = [];
    const componentOrder: PartCategory[] = ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'case', 'cooler'];

    componentOrder.forEach((category, index) => {
      const stepId = `select_${category}`;
      const previousStep = index > 0 ? `select_${componentOrder[index - 1]}` : 'performance_expectations';
      
      steps.push({
        id: stepId,
        phase: 'component_selection',
        title: `Select ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        description: this.getComponentDescription(category),
        status: this.selectedParts[category] ? 'completed' : 'ready',
        dependencies: [previousStep],
        recommendations: this.generateComponentRecommendations(category),
        warnings: this.generateComponentWarnings(category),
        errors: this.generateComponentErrors(category),
        actions: this.generateComponentActions(category),
        progress: this.selectedParts[category] ? 100 : 0
      });
    });

    return steps;
  }

  /**
   * System-Level Constraints Phase Steps
   */
  private generateSystemConstraintSteps(): BuildStep[] {
    const steps: BuildStep[] = [];

    // Power Analysis
    steps.push({
      id: 'power_analysis',
      phase: 'system_constraints',
      title: 'Power Consumption Analysis',
      description: 'Verify power supply capacity and calculate headroom',
      status: this.analyzePowerStatus(),
      dependencies: ['select_psu', 'select_gpu', 'select_cpu'],
      recommendations: this.generatePowerRecommendations(),
      warnings: this.generatePowerWarnings(),
      errors: this.generatePowerErrors(),
      actions: this.generatePowerActions(),
      progress: this.calculatePowerProgress()
    });

    // Thermal Analysis
    steps.push({
      id: 'thermal_analysis',
      phase: 'system_constraints',
      title: 'Thermal Considerations',
      description: 'Analyze cooling requirements and airflow',
      status: this.analyzeThermalStatus(),
      dependencies: ['select_cooler', 'select_case', 'select_cpu', 'select_gpu'],
      recommendations: this.generateThermalRecommendations(),
      warnings: this.generateThermalWarnings(),
      errors: this.generateThermalErrors(),
      actions: this.generateThermalActions(),
      progress: this.calculateThermalProgress()
    });

    // Physical Fit Analysis
    steps.push({
      id: 'physical_fit_analysis',
      phase: 'system_constraints',
      title: 'Physical Compatibility Check',
      description: 'Verify all components will fit in the case',
      status: this.analyzePhysicalFitStatus(),
      dependencies: ['select_case', 'select_gpu', 'select_cooler', 'select_motherboard'],
      recommendations: this.generatePhysicalFitRecommendations(),
      warnings: this.generatePhysicalFitWarnings(),
      errors: this.generatePhysicalFitErrors(),
      actions: this.generatePhysicalFitActions(),
      progress: this.calculatePhysicalFitProgress()
    });

    // Upgrade Path Analysis
    steps.push({
      id: 'upgrade_analysis',
      phase: 'system_constraints',
      title: 'Upgrade Path Planning',
      description: 'Evaluate future upgrade possibilities',
      status: this.analyzeUpgradeStatus(),
      dependencies: ['select_motherboard', 'select_case', 'select_psu'],
      recommendations: this.generateUpgradeRecommendations(),
      warnings: this.generateUpgradeWarnings(),
      errors: [],
      actions: this.generateUpgradeActions(),
      progress: this.calculateUpgradeProgress()
    });

    return steps;
  }

  /**
   * Build Order & Assembly Phase Steps
   */
  private generateBuildOrderSteps(): BuildStep[] {
    const steps: BuildStep[] = [];

    const assemblySteps = [
      {
        id: 'preparation',
        title: 'Workspace Preparation',
        description: 'Set up your workspace and gather tools',
        dependencies: ['physical_fit_analysis']
      },
      {
        id: 'cpu_installation',
        title: 'CPU Installation',
        description: 'Install CPU on motherboard',
        dependencies: ['preparation']
      },
      {
        id: 'ram_installation',
        title: 'RAM Installation',
        description: 'Install memory modules',
        dependencies: ['cpu_installation']
      },
      {
        id: 'motherboard_mounting',
        title: 'Motherboard Installation',
        description: 'Mount motherboard in case',
        dependencies: ['ram_installation']
      },
      {
        id: 'gpu_installation',
        title: 'GPU Installation',
        description: 'Install graphics card',
        dependencies: ['motherboard_mounting']
      },
      {
        id: 'storage_installation',
        title: 'Storage Installation',
        description: 'Install storage drives',
        dependencies: ['motherboard_mounting']
      },
      {
        id: 'psu_installation',
        title: 'Power Supply Installation',
        description: 'Install and connect power supply',
        dependencies: ['gpu_installation', 'storage_installation']
      },
      {
        id: 'cable_management',
        title: 'Cable Management',
        description: 'Connect and manage all cables',
        dependencies: ['psu_installation']
      },
      {
        id: 'cooling_installation',
        title: 'Cooling System Setup',
        description: 'Install CPU cooler and case fans',
        dependencies: ['cable_management']
      },
      {
        id: 'final_checks',
        title: 'Pre-Boot Verification',
        description: 'Final checks before powering on',
        dependencies: ['cooling_installation']
      }
    ];

    assemblySteps.forEach((step, index) => {
      steps.push({
        id: step.id,
        phase: 'build_order',
        title: step.title,
        description: step.description,
        status: 'ready', // These are manual steps
        dependencies: step.dependencies,
        recommendations: this.generateAssemblyRecommendations(step.id),
        warnings: this.generateAssemblyWarnings(step.id),
        errors: this.generateAssemblyErrors(step.id),
        actions: this.generateAssemblyActions(step.id),
        progress: 0
      });
    });

    return steps;
  }

  /**
   * Firmware & Software Setup Phase Steps
   */
  private generateFirmwareSetupSteps(): BuildStep[] {
    const steps: BuildStep[] = [];

    const softwareSteps = [
      {
        id: 'bios_configuration',
        title: 'BIOS/UEFI Configuration',
        description: 'Configure BIOS settings and enable XMP/EXPO',
        dependencies: ['final_checks']
      },
      {
        id: 'os_installation',
        title: 'Operating System Installation',
        description: 'Install and configure your operating system',
        dependencies: ['bios_configuration']
      },
      {
        id: 'driver_installation',
        title: 'Driver Installation',
        description: 'Install chipset, GPU, and other drivers',
        dependencies: ['os_installation']
      },
      {
        id: 'software_setup',
        title: 'Essential Software Setup',
        description: 'Install monitoring tools and essential software',
        dependencies: ['driver_installation']
      }
    ];

    softwareSteps.forEach((step) => {
      steps.push({
        id: step.id,
        phase: 'firmware_setup',
        title: step.title,
        description: step.description,
        status: 'ready',
        dependencies: step.dependencies,
        recommendations: this.generateSoftwareRecommendations(step.id),
        warnings: this.generateSoftwareWarnings(step.id),
        errors: this.generateSoftwareErrors(step.id),
        actions: this.generateSoftwareActions(step.id),
        progress: 0
      });
    });

    return steps;
  }

  /**
   * Validation & Review Phase Steps
   */
  private generateValidationSteps(): BuildStep[] {
    const steps: BuildStep[] = [];

    steps.push({
      id: 'compatibility_review',
      phase: 'validation_review',
      title: 'Final Compatibility Review',
      description: 'Review all compatibility checks and confirmations',
      status: this.compatibilityData.issues.length > 0 ? 'warning' : 'completed',
      dependencies: ['software_setup'],
      recommendations: this.generateValidationRecommendations(),
      warnings: this.generateValidationWarnings(),
      errors: this.generateValidationErrors(),
      actions: this.generateValidationActions(),
      progress: this.compatibilityData.issues.length === 0 ? 100 : 50
    });

    steps.push({
      id: 'performance_validation',
      phase: 'validation_review',
      title: 'Performance Validation',
      description: 'Test system performance and validate expectations',
      status: 'ready',
      dependencies: ['compatibility_review'],
      recommendations: this.generatePerformanceValidationRecommendations(),
      warnings: [],
      errors: [],
      actions: this.generatePerformanceValidationActions(),
      progress: 0
    });

    steps.push({
      id: 'build_completion',
      phase: 'validation_review',
      title: 'Build Completion Summary',
      description: 'Final build summary and upgrade recommendations',
      status: 'ready',
      dependencies: ['performance_validation'],
      recommendations: this.generateCompletionRecommendations(),
      warnings: this.generateCompletionWarnings(),
      errors: [],
      actions: this.generateCompletionActions(),
      progress: 0
    });

    return steps;
  }

  // Helper methods for generating recommendations, warnings, errors, and actions
  // These will be implemented in the next part...

  private generateUseCaseRecommendations(): BuildRecommendation[] {
    if (!this.useCase) return [];
    
    return [
      {
        type: 'general_action',
        title: 'Define Primary Use Case',
        description: 'Select your primary use case to guide component selection',
        priority: 'high',
        reasoning: 'Your use case determines which components matter most for performance and value'
      }
    ];
  }

  private generateUseCaseActions(): BuildAction[] {
    return [
      {
        type: 'general_action',
        title: 'Select Use Case',
        description: 'Choose from gaming, productivity, content creation, AI workstation, or general use',
        instructions: [
          'Consider your primary daily activities',
          'Think about software requirements',
          'Plan for future needs'
        ],
        completed: !!this.useCase
      }
    ];
  }

  // Placeholder methods for the remaining generation functions
  // These will be fully implemented based on the specific requirements
  
  private generateBudgetRecommendations(): BuildRecommendation[] {
    if (!this.useCase) return [];
    
    const recommendations: BuildRecommendation[] = [
      {
        type: 'general_action',
        title: 'Set Realistic Budget Range',
        description: 'Determine your total budget including all components',
        priority: 'high',
        reasoning: 'Budget dictates component choices and performance expectations'
      },
      {
        type: 'component',
        title: 'Allocate Budget by Priority',
        description: 'Focus budget on components that matter most for your use case',
        priority: 'high',
        category: this.getPriorityComponent(),
        reasoning: 'Different use cases benefit from different component priorities'
      }
    ];
    
    return recommendations;
  }

  private generateBudgetWarnings(): BuildWarning[] {
    const warnings: BuildWarning[] = [];
    
    if (this.useCase?.budgetRange === 'budget' && this.useCase?.performanceTier === 'enthusiast') {
      warnings.push({
        type: 'performance',
        title: 'Budget vs Performance Mismatch',
        description: 'Enthusiast performance may not be achievable with a budget build',
        affected: ['budget', 'performance'],
        resolution: 'Consider mainstream performance tier or increase budget',
        severity: 'warning'
      });
    }
    
    return warnings;
  }

  private generateBudgetActions(): BuildAction[] {
    return [
      {
        type: 'general_action',
        title: 'Define Budget Range',
        description: 'Select your budget range to guide component selection',
        instructions: [
          'Include all components in budget (CPU, GPU, RAM, etc.)',
          'Don\'t forget peripherals and software',
          'Consider tax and shipping costs'
        ],
        completed: !!this.useCase?.budgetRange
      }
    ];
  }

  private generatePlatformRecommendations(): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    
    if (this.useCase?.primaryUse === 'gaming') {
      recommendations.push({
        type: 'component',
        title: 'Gaming Platform Considerations',
        description: 'Both Intel and AMD offer excellent gaming performance',
        priority: 'medium',
        category: 'cpu',
        reasoning: 'Gaming performance depends more on GPU than CPU platform'
      });
    }
    
    if (this.useCase?.upgradeLongevity === 'long_term') {
      recommendations.push({
        type: 'component',
        title: 'Platform Upgrade Path',
        description: 'Consider motherboard socket longevity for future upgrades',
        priority: 'high',
        category: 'motherboard',
        reasoning: 'Some platforms have longer upgrade cycles than others'
      });
    }
    
    return recommendations;
  }

  private generatePlatformWarnings(): BuildWarning[] {
    const warnings: BuildWarning[] = [];
    
    if (this.selectedParts.cpu && this.selectedParts.motherboard) {
      const cpuSocket = getSpecValue(this.selectedParts.cpu, 'socket');
      const motherboardSocket = getSpecValue(this.selectedParts.motherboard, 'socket');
      
      if (cpuSocket && motherboardSocket && cpuSocket !== motherboardSocket) {
        warnings.push({
          type: 'compatibility',
          title: 'CPU Socket Mismatch',
          description: `CPU socket (${cpuSocket}) doesn't match motherboard socket (${motherboardSocket})`,
          affected: ['cpu', 'motherboard'],
          resolution: 'Select CPU and motherboard with matching sockets',
          severity: 'warning'
        });
      }
    }
    
    return warnings;
  }

  private generatePlatformActions(): BuildAction[] {
    return [
      {
        type: 'select_part',
        title: 'Choose CPU Platform',
        description: 'Select between Intel and AMD platforms',
        category: 'cpu',
        instructions: [
          'Intel: Generally better single-core performance',
          'AMD: Often better multi-core performance for price',
          'Consider motherboard features and upgrade path'
        ],
        completed: !!this.selectedParts.cpu
      }
    ];
  }

  private generatePerformanceRecommendations(): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    
    if (this.useCase?.primaryUse === 'gaming') {
      recommendations.push({
        type: 'component',
        title: 'Gaming Performance Focus',
        description: 'Prioritize GPU and CPU single-core performance for gaming',
        priority: 'high',
        category: 'gpu',
        reasoning: 'Gaming performance is heavily GPU-dependent'
      });
    }
    
    if (this.useCase?.primaryUse === 'content_creation') {
      recommendations.push({
        type: 'component',
        title: 'Content Creation Focus',
        description: 'Prioritize CPU cores, RAM capacity, and fast storage',
        priority: 'high',
        category: 'cpu',
        reasoning: 'Content creation benefits from multi-core performance and fast storage'
      });
    }
    
    return recommendations;
  }

  private generatePerformanceWarnings(): BuildWarning[] {
    const warnings: BuildWarning[] = [];
    
    if (this.useCase?.performanceTier === 'entry' && this.useCase?.primaryUse === 'ai_workstation') {
      warnings.push({
        type: 'performance',
        title: 'Performance Tier Insufficient',
        description: 'Entry-level components may not meet AI workstation requirements',
        affected: ['cpu', 'gpu', 'ram'],
        resolution: 'Consider high-performance or enthusiast tier for AI workloads',
        severity: 'warning'
      });
    }
    
    return warnings;
  }

  private generatePerformanceActions(): BuildAction[] {
    return [
      {
        type: 'general_action',
        title: 'Set Performance Expectations',
        description: 'Define your performance requirements and expectations',
        instructions: [
          'Research benchmarks for your use case',
          'Consider resolution and refresh rate for gaming',
          'Plan for future software requirements'
        ],
        completed: !!this.useCase?.performanceTier
      }
    ];
  }
  
  private getPriorityComponent(): PartCategory {
    switch (this.useCase?.primaryUse) {
      case 'gaming': return 'gpu';
      case 'content_creation': return 'cpu';
      case 'ai_workstation': return 'gpu';
      case 'productivity': return 'cpu';
      default: return 'cpu';
    }
  }

  private getComponentDescription(category: PartCategory): string {
    const descriptions: Record<PartCategory, string> = {
      cpu: 'Central Processing Unit - the brain of your computer',
      motherboard: 'Main circuit board that connects all components',
      ram: 'System memory for multitasking and performance',
      gpu: 'Graphics card for gaming and visual tasks',
      storage: 'Storage drives for your OS, games, and files',
      psu: 'Power supply unit providing stable power',
      case: 'Computer case housing all components',
      cooler: 'CPU cooling solution for temperature management'
    };
    return descriptions[category] || 'Select component';
  }

  private getComponentReasoning(category: PartCategory): string {
    const reasoning: Record<PartCategory, string> = {
      cpu: 'CPU determines overall system performance and compatibility',
      motherboard: 'Motherboard dictates component compatibility and features',
      ram: 'RAM capacity and speed affect multitasking and performance',
      gpu: 'GPU handles graphics processing and gaming performance',
      storage: 'Storage speed affects boot times and loading',
      psu: 'PSU provides power to all components',
      case: 'Case determines component fit and cooling potential',
      cooler: 'Cooler maintains CPU temperature and performance'
    };
    return reasoning[category] || 'This component is essential for your build';
  }

  private generateComponentRecommendations(category: PartCategory): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    const part = this.selectedParts[category];
    
    if (!part) {
      recommendations.push({
        type: 'select_part',
        title: `Select ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        description: `Choose a ${category} that matches your requirements and budget`,
        priority: 'high',
        category,
        reasoning: this.getComponentReasoning(category)
      });
    }
    
    // Add specific recommendations based on use case
    if (category === 'cpu' && this.useCase) {
      recommendations.push(...this.generateCPURecommendations());
    } else if (category === 'gpu' && this.useCase) {
      recommendations.push(...this.generateGPURecommendations());
    } else if (category === 'ram') {
      recommendations.push(...this.generateRAMRecommendations());
    } else if (category === 'motherboard') {
      recommendations.push(...this.generateMotherboardRecommendations());
    }
    
    return recommendations;
  }

  private generateComponentWarnings(category: PartCategory): BuildWarning[] {
    const warnings: BuildWarning[] = [];
    const part = this.selectedParts[category];
    
    if (!part) return warnings;
    
    // Check compatibility with other selected parts
    const compatibilityIssues = this.compatibilityData.issues.filter(
      issue => issue.affected.includes(category)
    );
    
    compatibilityIssues.forEach(issue => {
      warnings.push({
        type: 'compatibility',
        title: issue.message,
        description: issue.explanation,
        affected: issue.affected,
        resolution: issue.fix || 'Review compatibility requirements',
        severity: issue.severity === 'error' ? 'warning' : 'info'
      });
    });
    
    return warnings;
  }

  private generateComponentErrors(category: PartCategory): BuildError[] {
    const errors: BuildError[] = [];
    const part = this.selectedParts[category];
    
    if (!part) return errors;
    
    // Check for critical compatibility issues
    const criticalIssues = this.compatibilityData.issues.filter(
      issue => issue.affected.includes(category) && issue.severity === 'error'
    );
    
    criticalIssues.forEach(issue => {
      errors.push({
        type: 'compatibility',
        title: issue.message,
        description: issue.explanation,
        affected: issue.affected,
        resolution: issue.fix || 'This component is incompatible with selected parts',
        blocking: true
      });
    });
    
    return errors;
  }

  private generateComponentActions(category: PartCategory): BuildAction[] {
    const actions: BuildAction[] = [];
    const part = this.selectedParts[category];
    
    if (!part) {
      actions.push({
        type: 'select_part',
        title: `Choose ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        description: `Select a ${category} from available options`,
        category,
        instructions: this.getComponentSelectionInstructions(category),
        completed: false
      });
    } else {
      actions.push({
        type: 'verify_spec',
        title: `Verify ${category} Specifications`,
        description: `Review and confirm ${category} specifications`,
        category,
        instructions: this.getComponentVerificationInstructions(category),
        completed: true
      });
    }
    
    return actions;
  }

  // Helper methods for component-specific guidance
  private generateCPURecommendations(): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    
    if (this.useCase?.primaryUse === 'gaming') {
      recommendations.push({
        type: 'component',
        title: 'Gaming CPU Priority',
        description: 'Focus on single-core performance and cache size',
        priority: 'high',
        category: 'cpu',
        reasoning: 'Gaming performance heavily depends on single-core speed'
      });
    }
    
    if (this.useCase?.primaryUse === 'content_creation') {
      recommendations.push({
        type: 'component',
        title: 'Content Creation CPU',
        description: 'Prioritize core count and multi-threading performance',
        priority: 'high',
        category: 'cpu',
        reasoning: 'Content creation benefits from parallel processing'
      });
    }
    
    return recommendations;
  }

  private generateGPURecommendations(): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    
    if (this.useCase?.primaryUse === 'gaming') {
      recommendations.push({
        type: 'component',
        title: 'Gaming GPU Priority',
        description: 'Focus on VRAM and rasterization performance',
        priority: 'high',
        category: 'gpu',
        reasoning: 'Gaming performance is GPU-bound at higher resolutions'
      });
    }
    
    if (this.useCase?.primaryUse === 'ai_workstation') {
      recommendations.push({
        type: 'component',
        title: 'AI/ML GPU Requirements',
        description: 'Prioritize CUDA cores and tensor cores for AI workloads',
        priority: 'high',
        category: 'gpu',
        reasoning: 'AI workloads benefit from specialized GPU hardware'
      });
    }
    
    return recommendations;
  }

  private generateRAMRecommendations(): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    
    if (this.useCase?.primaryUse === 'gaming') {
      recommendations.push({
        type: 'component',
        title: 'Gaming Memory',
        description: '16GB minimum, 32GB recommended for future-proofing',
        priority: 'medium',
        category: 'ram',
        reasoning: 'Modern games benefit from faster and more memory'
      });
    }
    
    if (this.useCase?.primaryUse === 'content_creation') {
      recommendations.push({
        type: 'component',
        title: 'Content Creation Memory',
        description: '32GB minimum, 64GB recommended for heavy workloads',
        priority: 'high',
        category: 'ram',
        reasoning: 'Content creation applications are memory-intensive'
      });
    }
    
    return recommendations;
  }

  private generateMotherboardRecommendations(): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    
    recommendations.push({
      type: 'component',
      title: 'Motherboard Features',
      description: 'Consider VRM quality, connectivity, and expansion options',
      priority: 'medium',
      category: 'motherboard',
      reasoning: 'Motherboard quality affects system stability and upgrade potential'
    });
    
    return recommendations;
  }

  private getComponentSelectionInstructions(category: PartCategory): string[] {
    const instructions: Record<PartCategory, string[]> = {
      cpu: ['Check socket compatibility with motherboard', 'Consider TDP and cooling requirements', 'Compare single vs multi-core performance'],
      motherboard: ['Match socket with chosen CPU', 'Check form factor for case compatibility', 'Verify RAM and expansion slot support'],
      ram: ['Check memory type (DDR4/DDR5) compatibility', 'Consider speed and capacity needs', 'Verify dual/quad channel support'],
      gpu: ['Check case clearance for length/height', 'Verify power supply connectors', 'Consider VRAM for resolution/settings'],
      storage: ['Choose between SSD and HDD based on speed/capacity needs', 'Check interface compatibility (SATA/NVMe)', 'Consider capacity requirements'],
      psu: ['Calculate total power requirements', 'Check efficiency rating', 'Verify modular vs non-modular preferences'],
      case: ['Ensure motherboard form factor compatibility', 'Check GPU and cooler clearance', 'Consider airflow and cooling options'],
      cooler: ['Verify socket compatibility', 'Check case height clearance', 'Consider noise vs performance balance']
    };
    
    return instructions[category] || ['Research component specifications', 'Check compatibility with selected parts', 'Consider budget and performance needs'];
  }

  private getComponentVerificationInstructions(category: PartCategory): string[] {
    return [
      'Review component specifications',
      'Verify compatibility with other selected parts',
      'Check warranty and return policy',
      'Confirm power and connection requirements'
    ];
  }
  
  private analyzePowerStatus(): StepStatus {
    const powerAnalysis = estimatePowerRequirements(this.selectedParts);
    if (!this.selectedParts.psu) return 'ready';
    if (powerAnalysis.headroom < 0) return 'warning';
    if (powerAnalysis.headroom < 50) return 'warning';
    return 'completed';
  }

  private generatePowerRecommendations(): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    const powerAnalysis = estimatePowerRequirements(this.selectedParts);
    
    if (!this.selectedParts.psu) {
      recommendations.push({
        type: 'select_part',
        title: 'Select Power Supply',
        description: 'Choose a PSU with adequate wattage for your components',
        priority: 'high',
        category: 'psu',
        reasoning: 'PSU provides power to all components and affects system stability'
      });
    }
    
    if (powerAnalysis.headroom < 50 && this.selectedParts.psu) {
      recommendations.push({
        type: 'change_part',
        title: 'Increase Power Supply Headroom',
        description: 'Consider a higher wattage PSU for better efficiency and future upgrades',
        priority: 'medium',
        category: 'psu',
        reasoning: 'Adequate headroom ensures stable operation and upgrade flexibility'
      });
    }
    
    return recommendations;
  }

  private generatePowerWarnings(): BuildWarning[] {
    const warnings: BuildWarning[] = [];
    const powerAnalysis = estimatePowerRequirements(this.selectedParts);
    
    if (powerAnalysis.headroom < 0) {
      warnings.push({
        type: 'power',
        title: 'Insufficient Power Supply',
        description: `Estimated power draw (${powerAnalysis.estimated}W) exceeds PSU capacity (${powerAnalysis.psuWattage}W)`,
        affected: ['psu', 'cpu', 'gpu'],
        resolution: 'Select a higher wattage power supply',
        severity: 'warning'
      });
    }
    
    if (powerAnalysis.headroom > 0 && powerAnalysis.headroom < 50) {
      warnings.push({
        type: 'power',
        title: 'Limited Power Headroom',
        description: `Only ${powerAnalysis.headroom}W of headroom available for peak loads and upgrades`,
        affected: ['psu'],
        resolution: 'Consider a higher wattage PSU for better efficiency and upgrade potential',
        severity: 'warning'
      });
    }
    
    return warnings;
  }

  private generatePowerErrors(): BuildError[] {
    const errors: BuildError[] = [];
    const powerAnalysis = estimatePowerRequirements(this.selectedParts);
    
    if (powerAnalysis.headroom < -100) {
      errors.push({
        type: 'critical',
        title: 'Critical Power Shortage',
        description: `Power requirements exceed PSU capacity by ${Math.abs(powerAnalysis.headroom)}W`,
        affected: ['psu'],
        resolution: 'Select a power supply with at least ' + (powerAnalysis.estimated + 150) + 'W capacity',
        blocking: true
      });
    }
    
    return errors;
  }

  private generatePowerActions(): BuildAction[] {
    const actions: BuildAction[] = [];
    const powerAnalysis = estimatePowerRequirements(this.selectedParts);
    
    if (!this.selectedParts.psu) {
      actions.push({
        type: 'select_part',
        title: 'Calculate Power Requirements',
        description: 'Determine total power needs and select appropriate PSU',
        category: 'psu',
        instructions: [
          'Calculate estimated power draw: ' + powerAnalysis.estimated + 'W',
          'Add 150W headroom for safety and efficiency',
          'Select PSU with at least ' + (powerAnalysis.estimated + 150) + 'W capacity',
          'Consider efficiency rating (80+ Bronze, Gold, Platinum)'
        ],
        completed: false
      });
    } else {
      actions.push({
        type: 'verify_spec',
        title: 'Verify Power Supply Capacity',
        description: 'Confirm PSU meets all power requirements',
        category: 'psu',
        instructions: [
          'Verify total system power draw: ' + powerAnalysis.estimated + 'W',
          'Check available headroom: ' + powerAnalysis.headroom + 'W',
          'Confirm all power connectors are available',
          'Verify efficiency rating and warranty'
        ],
        completed: powerAnalysis.headroom >= 0
      });
    }
    
    return actions;
  }

  private calculatePowerProgress(): number {
    if (!this.selectedParts.psu) return 0;
    const powerAnalysis = estimatePowerRequirements(this.selectedParts);
    if (powerAnalysis.headroom < 0) return 25;
    if (powerAnalysis.headroom < 50) return 75;
    return 100;
  }
  
  private analyzeThermalStatus(): StepStatus {
    const cpu = this.selectedParts.cpu;
    const gpu = this.selectedParts.gpu;
    const cooler = this.selectedParts.cooler;
    const case_ = this.selectedParts.case;
    
    if (!cpu || !gpu) return 'ready';
    if (!cooler || !case_) return 'warning';
    
    // Basic thermal analysis
    const cpuTdp = getSpecValue(cpu, 'tdp_watts') || 0;
    const gpuTdp = getSpecValue(gpu, 'tdp_watts') || 0;
    const totalTdp = cpuTdp + gpuTdp;
    
    if (totalTdp > 400) return 'warning';
    return 'completed';
  }

  private generateThermalRecommendations(): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    const cpu = this.selectedParts.cpu;
    const gpu = this.selectedParts.gpu;
    
    if (cpu && !this.selectedParts.cooler) {
      const cpuTdp = getSpecValue(cpu, 'tdp_watts') || 0;
      recommendations.push({
        type: 'select_part',
        title: 'Select CPU Cooler',
        description: 'Choose appropriate cooling for your CPU TDP',
        priority: 'high',
        category: 'cooler',
        reasoning: `CPU TDP of ${cpuTdp}W requires adequate cooling for performance and longevity`
      });
    }
    
    if (gpu) {
      const gpuTdp = getSpecValue(gpu, 'tdp_watts') || 0;
      if (gpuTdp > 250) {
        recommendations.push({
          type: 'setting',
          title: 'High-TDP GPU Cooling',
          description: 'Ensure case airflow can handle high-TDP graphics card',
          priority: 'medium',
          reasoning: `GPU TDP of ${gpuTdp}W generates significant heat that requires good case airflow`
        });
      }
    }
    
    return recommendations;
  }

  private generateThermalWarnings(): BuildWarning[] {
    const warnings: BuildWarning[] = [];
    const cpu = this.selectedParts.cpu;
    const gpu = this.selectedParts.gpu;
    
    if (cpu && gpu) {
      const cpuTdp = getSpecValue(cpu, 'tdp_watts') || 0;
      const gpuTdp = getSpecValue(gpu, 'tdp_watts') || 0;
      const totalTdp = cpuTdp + gpuTdp;
      
      if (totalTdp > 400) {
        warnings.push({
          type: 'thermal',
          title: 'High Thermal Output',
          description: `Total TDP of ${totalTdp}W requires excellent case airflow and cooling`,
          affected: ['cpu', 'gpu', 'cooler', 'case'],
          resolution: 'Ensure case has good airflow and consider high-performance cooling',
          severity: 'warning'
        });
      }
    }
    
    return warnings;
  }

  private generateThermalErrors(): BuildError[] {
    const errors: BuildError[] = [];
    
    if (this.selectedParts.cpu && !this.selectedParts.cooler) {
      const cpuTdp = getSpecValue(this.selectedParts.cpu, 'tdp_watts') || 0;
      if (cpuTdp > 95) {
        errors.push({
          type: 'critical',
          title: 'High-TDP CPU Requires Cooler',
          description: `CPU TDP of ${cpuTdp}W requires aftermarket cooling solution`,
          affected: ['cpu', 'cooler'],
          resolution: 'Select an appropriate CPU cooler for this TDP level',
          blocking: true
        });
      }
    }
    
    return errors;
  }

  private generateThermalActions(): BuildAction[] {
    const actions: BuildAction[] = [];
    
    if (!this.selectedParts.cooler && this.selectedParts.cpu) {
      const cpuTdp = getSpecValue(this.selectedParts.cpu, 'tdp_watts') || 0;
      actions.push({
        type: 'select_part',
        title: 'Choose CPU Cooling Solution',
        description: 'Select appropriate cooling for your CPU',
        category: 'cooler',
        instructions: [
          'Check CPU TDP: ' + cpuTdp + 'W',
          'Consider case clearance for cooler height',
          'Choose between air cooling and liquid cooling',
          'Consider noise levels and performance needs'
        ],
        completed: false
      });
    }
    
    return actions;
  }

  private calculateThermalProgress(): number {
    if (!this.selectedParts.cpu) return 0;
    if (!this.selectedParts.cooler) return 25;
    if (!this.selectedParts.case) return 50;
    return 100;
  }
  
  private analyzePhysicalFitStatus(): StepStatus {
    const case_ = this.selectedParts.case;
    const gpu = this.selectedParts.gpu;
    const cooler = this.selectedParts.cooler;
    const motherboard = this.selectedParts.motherboard;
    
    if (!case_) return 'ready';
    if (!gpu || !cooler || !motherboard) return 'warning';
    
    // Check for physical compatibility issues
    const physicalIssues = this.compatibilityData.issues.filter(
      issue => issue.affected.includes('case') && issue.severity === 'error'
    );
    
    return physicalIssues.length > 0 ? 'warning' : 'completed';
  }

  private generatePhysicalFitRecommendations(): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    
    if (!this.selectedParts.case) {
      recommendations.push({
        type: 'select_part',
        title: 'Select Computer Case',
        description: 'Choose a case that fits all your components',
        priority: 'high',
        category: 'case',
        reasoning: 'Case determines component compatibility and cooling potential'
      });
    }
    
    return recommendations;
  }

  private generatePhysicalFitWarnings(): BuildWarning[] {
    const warnings: BuildWarning[] = [];
    
    // Check GPU length compatibility
    if (this.selectedParts.gpu && this.selectedParts.case) {
      const gpuLength = getSpecValue(this.selectedParts.gpu, 'length_mm');
      const maxGpuLength = getSpecValue(this.selectedParts.case, 'gpu_max_length_mm');
      
      if (gpuLength && maxGpuLength && gpuLength > maxGpuLength) {
        warnings.push({
          type: 'physical',
          title: 'GPU Length Exceeds Case Capacity',
          description: `GPU length (${gpuLength}mm) exceeds case maximum (${maxGpuLength}mm)`,
          affected: ['gpu', 'case'],
          resolution: 'Select a shorter GPU or a larger case',
          severity: 'warning'
        });
      }
    }
    
    // Check cooler height compatibility
    if (this.selectedParts.cooler && this.selectedParts.case) {
      const coolerHeight = getSpecValue(this.selectedParts.cooler, 'height_mm');
      const maxCoolerHeight = getSpecValue(this.selectedParts.case, 'cpu_cooler_height_mm');
      
      if (coolerHeight && maxCoolerHeight && coolerHeight > maxCoolerHeight) {
        warnings.push({
          type: 'physical',
          title: 'CPU Cooler Height Exceeds Case Capacity',
          description: `Cooler height (${coolerHeight}mm) exceeds case maximum (${maxCoolerHeight}mm)`,
          affected: ['cooler', 'case'],
          resolution: 'Select a shorter cooler or a larger case',
          severity: 'warning'
        });
      }
    }
    
    return warnings;
  }

  private generatePhysicalFitErrors(): BuildError[] {
    const errors: BuildError[] = [];
    
    // Check for critical physical compatibility issues
    const criticalIssues = this.compatibilityData.issues.filter(
      issue => issue.affected.includes('case') && issue.severity === 'error'
    );
    
    criticalIssues.forEach(issue => {
      errors.push({
        type: 'compatibility',
        title: issue.message,
        description: issue.explanation,
        affected: issue.affected,
        resolution: issue.fix || 'Components are physically incompatible',
        blocking: true
      });
    });
    
    return errors;
  }

  private generatePhysicalFitActions(): BuildAction[] {
    const actions: BuildAction[] = [];
    
    if (!this.selectedParts.case) {
      actions.push({
        type: 'select_part',
        title: 'Verify Component Clearances',
        description: 'Ensure all components will fit in the selected case',
        category: 'case',
        instructions: [
          'Check motherboard form factor compatibility',
          'Verify GPU length clearance',
          'Confirm CPU cooler height clearance',
          'Check PSU mounting options',
          'Consider cable management space'
        ],
        completed: false
      });
    }
    
    return actions;
  }

  private calculatePhysicalFitProgress(): number {
    if (!this.selectedParts.case) return 0;
    const physicalIssues = this.compatibilityData.issues.filter(
      issue => issue.affected.includes('case')
    );
    if (physicalIssues.length > 0) return 50;
    return 100;
  }
  
  private analyzeUpgradeStatus(): StepStatus {
    const motherboard = this.selectedParts.motherboard;
    const case_ = this.selectedParts.case;
    const psu = this.selectedParts.psu;
    
    if (!motherboard || !case_ || !psu) return 'ready';
    return 'completed';
  }

  private generateUpgradeRecommendations(): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    const motherboard = this.selectedParts.motherboard;
    
    if (motherboard) {
      recommendations.push({
        type: 'check',
        title: 'Evaluate Upgrade Path',
        description: 'Consider future upgrade possibilities for your platform',
        priority: 'medium',
        category: 'motherboard',
        reasoning: 'Motherboard chipset and socket determine upgrade options'
      });
    }
    
    return recommendations;
  }

  private generateUpgradeWarnings(): BuildWarning[] {
    const warnings: BuildWarning[] = [];
    
    if (this.selectedParts.motherboard) {
      const ramSlots = getSpecValue(this.selectedParts.motherboard, 'ram_slots') || 0;
      if (ramSlots && ramSlots < 4) {
        warnings.push({
          type: 'performance',
          title: 'Limited RAM Upgrade Path',
          description: `Motherboard has only ${ramSlots} RAM slots, limiting future memory upgrades`,
          affected: ['motherboard', 'ram'],
          resolution: 'Consider higher capacity RAM modules now if limited slots',
          severity: 'info'
        });
      }
    }
    
    return warnings;
  }

  private generateUpgradeActions(): BuildAction[] {
    const actions: BuildAction[] = [];
    
    actions.push({
      type: 'check',
      title: 'Plan Future Upgrades',
      description: 'Consider upgrade potential for your build',
      instructions: [
        'Check CPU socket upgrade path',
        'Verify RAM expansion options',
        'Consider GPU clearance for future upgrades',
        'Evaluate PSU headroom for additional components'
      ],
      completed: false
    });
    
    return actions;
  }

  private calculateUpgradeProgress(): number {
    const hasUpgradeAnalysis = this.selectedParts.motherboard && this.selectedParts.case && this.selectedParts.psu;
    return hasUpgradeAnalysis ? 100 : 50;
  }
  
  private generateAssemblyRecommendations(stepId: string): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    
    switch (stepId) {
      case 'preparation':
        recommendations.push({
          type: 'general_action',
          title: 'Prepare Clean Workspace',
          description: 'Set up a clean, well-lit area with adequate space',
          priority: 'high',
          reasoning: 'Clean workspace prevents component damage and makes assembly easier'
        });
        break;
        
      case 'cpu_installation':
        recommendations.push({
          type: 'general_action',
          title: 'Handle CPU with Care',
          description: 'CPU pins are delicate - handle by edges only',
          priority: 'high',
          reasoning: 'CPU damage is expensive and often irreversible'
        });
        break;
        
      case 'motherboard_mounting':
        recommendations.push({
          type: 'general_action',
          title: 'Use Motherboard Standoffs',
          description: 'Install standoffs before mounting motherboard',
          priority: 'high',
          reasoning: 'Standoffs prevent short circuits and provide proper mounting'
        });
        break;
        
      case 'gpu_installation':
        recommendations.push({
          type: 'general_action',
          title: 'Secure GPU Properly',
          description: 'Ensure GPU is fully seated and screwed in',
          priority: 'high',
          reasoning: 'Proper GPU mounting prevents sag and connection issues'
        });
        break;
        
      case 'cable_management':
        recommendations.push({
          type: 'general_action',
          title: 'Manage Cables for Airflow',
          description: 'Route cables away from fans and components',
          priority: 'medium',
          reasoning: 'Good cable management improves cooling and aesthetics'
        });
        break;
    }
    
    return recommendations;
  }

  private generateAssemblyWarnings(stepId: string): BuildWarning[] {
    const warnings: BuildWarning[] = [];
    
    switch (stepId) {
      case 'preparation':
        warnings.push({
          type: 'physical',
          title: 'Static Electricity Risk',
          description: 'Static discharge can damage sensitive components',
          affected: ['all_components'],
          resolution: 'Use anti-static wrist strap and work on non-conductive surface',
          severity: 'warning'
        });
        break;
        
      case 'cpu_installation':
        warnings.push({
          type: 'physical',
          title: 'CPU Installation Orientation',
          description: 'CPU can only be installed one way - forcing it will damage pins',
          affected: ['cpu', 'motherboard'],
          resolution: 'Match CPU notch with socket indicator',
          severity: 'warning'
        });
        break;
        
      case 'ram_installation':
        warnings.push({
          type: 'physical',
          title: 'RAM Installation Force',
          description: 'RAM should click in place - excessive force indicates misalignment',
          affected: ['ram', 'motherboard'],
          resolution: 'Check orientation and notch alignment before applying pressure',
          severity: 'warning'
        });
        break;
        
      case 'psu_installation':
        warnings.push({
          type: 'power',
          title: 'PSU Fan Orientation',
          description: 'PSU fan direction affects case airflow',
          affected: ['psu', 'case'],
          resolution: 'Point PSU fan down (bottom intake) or up (top exhaust) based on case design',
          severity: 'warning'
        });
        break;
    }
    
    return warnings;
  }

  private generateAssemblyErrors(stepId: string): BuildError[] {
    const errors: BuildError[] = [];
    
    switch (stepId) {
      case 'cpu_installation':
        errors.push({
          type: 'critical',
          title: 'Bent CPU Pins',
          description: 'Bent pins can prevent CPU from working',
          affected: ['cpu'],
          resolution: 'Inspect CPU pins carefully before installation - do not use if bent',
          blocking: true
        });
        break;
        
      case 'motherboard_mounting':
        errors.push({
          type: 'critical',
          title: 'Missing Standoffs',
          description: 'Installing motherboard without standoffs can cause short circuits',
          affected: ['motherboard', 'case'],
          resolution: 'Always install motherboard standoffs before mounting motherboard',
          blocking: true
        });
        break;
    }
    
    return errors;
  }

  private generateAssemblyActions(stepId: string): BuildAction[] {
    const actions: BuildAction[] = [];
    
    switch (stepId) {
      case 'preparation':
        actions.push({
          type: 'general_action',
          title: 'Set Up Workspace',
          description: 'Prepare your building area',
          instructions: [
            'Clear large, clean, well-lit workspace',
            'Gather all tools: screwdrivers, zip ties, anti-static strap',
            'Open all component packages and organize parts',
            'Have smartphone/manuals ready for reference'
          ],
          completed: false
        });
        break;
        
      case 'cpu_installation':
        actions.push({
          type: 'general_action',
          title: 'Install CPU',
          description: 'Carefully install CPU on motherboard',
          instructions: [
            'Release CPU socket lever',
            'Align CPU triangle with socket triangle',
            'Gently place CPU in socket - do not force',
            'Close socket lever slowly',
            'Apply thermal paste if needed'
          ],
          completed: false
        });
        break;
        
      case 'ram_installation':
        actions.push({
          type: 'general_action',
          title: 'Install RAM Modules',
          description: 'Install memory modules in correct slots',
          instructions: [
            'Check motherboard manual for optimal slot configuration',
            'Open RAM slot clips',
            'Align RAM notch with slot notch',
            'Press firmly until clips click into place',
            'Repeat for all RAM modules'
          ],
          completed: false
        });
        break;
        
      case 'motherboard_mounting':
        actions.push({
          type: 'general_action',
          title: 'Mount Motherboard',
          description: 'Install motherboard in case',
          instructions: [
            'Install I/O shield in case',
            'Install standoffs in case mounting holes',
            'Carefully place motherboard in case',
            'Start screws loosely, then tighten diagonally',
            'Connect case front panel connectors'
          ],
          completed: false
        });
        break;
        
      case 'gpu_installation':
        actions.push({
          type: 'general_action',
          title: 'Install Graphics Card',
          description: 'Install GPU in PCIe slot',
          instructions: [
            'Remove PCIe slot covers',
            'Align GPU with PCIe x16 slot',
            'Press firmly until card clicks into place',
            'Screw GPU bracket to case',
            'Connect PCIe power cables if required'
          ],
          completed: false
        });
        break;
        
      case 'storage_installation':
        actions.push({
          type: 'general_action',
          title: 'Install Storage Drives',
          description: 'Mount SSD/HDD in case',
          instructions: [
            'Choose appropriate drive bays',
            'Secure drives with screws',
            'Connect SATA data cables to motherboard',
            'Connect SATA power cables from PSU',
            'For NVMe: install in M.2 slot before motherboard mounting'
          ],
          completed: false
        });
        break;
        
      case 'psu_installation':
        actions.push({
          type: 'general_action',
          title: 'Install Power Supply',
          description: 'Mount and connect PSU',
          instructions: [
            'Determine PSU fan orientation',
            'Mount PSU in case with screws',
            'Connect 24-pin motherboard power',
            'Connect 8-pin CPU power',
            'Connect GPU power cables',
            'Connect storage and peripheral power'
          ],
          completed: false
        });
        break;
        
      case 'cable_management':
        actions.push({
          type: 'general_action',
          title: 'Manage Cables',
          description: 'Route and organize cables',
          instructions: [
            'Route cables behind motherboard tray',
            'Use zip ties or velcro straps',
            'Keep cables away from fans and heatsinks',
            'Ensure no cables interfere with GPU installation',
            'Check all connections are secure'
          ],
          completed: false
        });
        break;
        
      case 'cooling_installation':
        actions.push({
          type: 'general_action',
          title: 'Install Cooling Solution',
          description: 'Install CPU cooler and case fans',
          instructions: [
            'Apply thermal paste if needed',
            'Install CPU cooler according to instructions',
            'Connect CPU fan to motherboard header',
            'Install case fans in appropriate positions',
            'Connect case fans to motherboard or PSU'
          ],
          completed: false
        });
        break;
        
      case 'final_checks':
        actions.push({
          type: 'general_action',
          title: 'Pre-Boot Verification',
          description: 'Final checks before powering on',
          instructions: [
            'Verify all power connections are secure',
            'Check all data cables are properly connected',
            'Ensure RAM is fully seated',
            'Confirm GPU is properly installed',
            'Check for loose screws inside case',
            'Verify CPU cooler is mounted correctly'
          ],
          completed: false
        });
        break;
    }
    
    return actions;
  }
  
  private generateSoftwareRecommendations(stepId: string): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    
    switch (stepId) {
      case 'bios_configuration':
        recommendations.push({
          type: 'setting',
          title: 'Enable XMP/EXPO Memory Profile',
          description: 'Activate memory overclocking profile for rated speed',
          priority: 'high',
          reasoning: 'XMP/EXPO enables RAM to run at advertised speeds instead of default JEDEC speeds'
        });
        recommendations.push({
          type: 'setting',
          title: 'Configure Boot Order',
          description: 'Set boot device priority for OS installation',
          priority: 'high',
          reasoning: 'Correct boot order ensures system boots from intended drive'
        });
        break;
        
      case 'os_installation':
        recommendations.push({
          type: 'general_action',
          title: 'Create Bootable USB Drive',
          description: 'Prepare bootable media for OS installation',
          priority: 'high',
          reasoning: 'Bootable USB is required for clean OS installation'
        });
        break;
        
      case 'driver_installation':
        recommendations.push({
          type: 'general_action',
          title: 'Install Drivers in Correct Order',
          description: 'Chipset drivers first, then GPU, then others',
          priority: 'high',
          reasoning: 'Proper driver installation order prevents conflicts and ensures stability'
        });
        break;
        
      case 'software_setup':
        recommendations.push({
          type: 'general_action',
          title: 'Install Monitoring Software',
          description: 'Set up system monitoring and diagnostic tools',
          priority: 'medium',
          reasoning: 'Monitoring software helps track system health and performance'
        });
        break;
    }
    
    return recommendations;
  }

  private generateSoftwareWarnings(stepId: string): BuildWarning[] {
    const warnings: BuildWarning[] = [];
    
    switch (stepId) {
      case 'bios_configuration':
        warnings.push({
          type: 'compatibility',
          title: 'BIOS Update Risks',
          description: 'BIOS updates can brick motherboard if interrupted',
          affected: ['motherboard'],
          resolution: 'Only update BIOS if necessary and ensure stable power during update',
          severity: 'warning'
        });
        warnings.push({
          type: 'performance',
          title: 'Memory Profile Stability',
          description: 'XMP/EXPO profiles may require voltage adjustments',
          affected: ['ram', 'motherboard'],
          resolution: 'Test system stability after enabling memory profiles',
          severity: 'warning'
        });
        break;
        
      case 'os_installation':
        warnings.push({
          type: 'compatibility',
          title: 'Driver Compatibility',
          description: 'Some components may require specific driver versions',
          affected: ['all_components'],
          resolution: 'Check manufacturer websites for latest drivers',
          severity: 'info'
        });
        break;
        
      case 'driver_installation':
        warnings.push({
          type: 'compatibility',
          title: 'Windows Update Drivers',
          description: 'Windows Update drivers may not be optimal',
          affected: ['gpu', 'motherboard'],
          resolution: 'Prefer manufacturer drivers over Windows Update for critical components',
          severity: 'info'
        });
        break;
    }
    
    return warnings;
  }

  private generateSoftwareErrors(stepId: string): BuildError[] {
    const errors: BuildError[] = [];
    
    switch (stepId) {
      case 'bios_configuration':
        errors.push({
          type: 'critical',
          title: 'Incorrect BIOS Settings',
          description: 'Wrong BIOS settings can prevent system boot',
          affected: ['motherboard', 'cpu', 'ram'],
          resolution: 'Reset BIOS to defaults if system fails to boot after changes',
          blocking: true
        });
        break;
        
      case 'os_installation':
        errors.push({
          type: 'critical',
          title: 'Storage Controller Mode',
          description: 'Wrong storage mode (RAID/AHCI) prevents OS detection',
          affected: ['storage', 'motherboard'],
          resolution: 'Set storage mode to AHCI for most OS installations',
          blocking: true
        });
        break;
    }
    
    return errors;
  }

  private generateSoftwareActions(stepId: string): BuildAction[] {
    const actions: BuildAction[] = [];
    
    switch (stepId) {
      case 'bios_configuration':
        actions.push({
          type: 'configure_setting',
          title: 'Configure BIOS/UEFI Settings',
          description: 'Access and configure BIOS for optimal performance',
          instructions: [
            'Restart system and press DEL/F2 to enter BIOS',
            'Set boot order to prioritize your OS drive',
            'Enable XMP/EXPO for memory if available',
            'Set storage mode to AHCI (unless using RAID)',
            'Disable unused integrated graphics if using dedicated GPU',
            'Save changes and exit'
          ],
          completed: false
        });
        break;
        
      case 'os_installation':
        actions.push({
          type: 'general_action',
          title: 'Install Operating System',
          description: 'Perform clean OS installation',
          instructions: [
            'Create bootable USB with OS installer',
            'Boot from USB drive (change boot order in BIOS)',
            'Follow OS installation wizard',
            'Select custom installation and choose target drive',
            'Create partitions as needed (or use entire drive)',
            'Complete installation and setup user account'
          ],
          completed: false
        });
        break;
        
      case 'driver_installation':
        actions.push({
          type: 'general_action',
          title: 'Install Essential Drivers',
          description: 'Install chipset and component drivers',
          instructions: [
            'Install motherboard chipset drivers first',
            'Install graphics card drivers (NVIDIA/AMD)',
            'Install network/WiFi drivers',
            'Install audio drivers',
            'Install any other peripheral drivers',
            'Restart system after each major driver installation'
          ],
          completed: false
        });
        break;
        
      case 'software_setup':
        actions.push({
          type: 'general_action',
          title: 'Setup Essential Software',
          description: 'Install monitoring and utility software',
          instructions: [
            'Install CPU-Z and GPU-Z for system information',
            'Install HWMonitor or Core Temp for temperature monitoring',
            'Install CrystalDiskInfo for storage health',
            'Install web browser and essential applications',
            'Configure Windows Update settings',
            'Create system restore point'
          ],
          completed: false
        });
        break;
    }
    
    return actions;
  }
  
  private generateValidationRecommendations(): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    
    // Check for remaining compatibility issues
    if (this.compatibilityData.issues.length > 0) {
      recommendations.push({
        type: 'check',
        title: 'Resolve Compatibility Issues',
        description: 'Address all remaining compatibility warnings and errors',
        priority: 'high',
        reasoning: 'Compatibility issues can cause system instability or prevent operation'
      });
    }
    
    // Power validation
    const powerAnalysis = estimatePowerRequirements(this.selectedParts);
    if (powerAnalysis.headroom < 50) {
      recommendations.push({
        type: 'change_part',
        title: 'Consider Higher Wattage PSU',
        description: 'More power headroom provides stability and upgrade flexibility',
        priority: 'medium',
        category: 'psu',
        reasoning: 'Adequate power headroom ensures stable operation under load'
      });
    }
    
    // Thermal validation
    const cpu = this.selectedParts.cpu;
    const gpu = this.selectedParts.gpu;
    if (cpu && gpu) {
      const cpuTdp = getSpecValue(cpu, 'tdp_watts') || 0;
      const gpuTdp = getSpecValue(gpu, 'tdp_watts') || 0;
      const totalTdp = cpuTdp + gpuTdp;
      
      if (totalTdp > 350) {
        recommendations.push({
          type: 'check',
          title: 'Validate Cooling Performance',
          description: 'High TDP components require excellent cooling',
          priority: 'high',
          reasoning: 'Proper cooling prevents thermal throttling and ensures longevity'
        });
      }
    }
    
    return recommendations;
  }

  private generateValidationWarnings(): BuildWarning[] {
    const warnings: BuildWarning[] = [];
    
    // Compatibility warnings
    const warningIssues = this.compatibilityData.issues.filter(issue => issue.severity === 'warning');
    warningIssues.forEach(issue => {
      warnings.push({
        type: 'compatibility',
        title: issue.message,
        description: issue.explanation,
        affected: issue.affected,
        resolution: issue.fix || 'Review component compatibility',
        severity: 'warning'
      });
    });
    
    // Performance balance warnings
    const cpu = this.selectedParts.cpu;
    const gpu = this.selectedParts.gpu;
    
    if (cpu && gpu) {
      const cpuCores = getSpecValue(cpu, 'cores') || 0;
      const gpuVram = getSpecValue(gpu, 'vram_gb') || 0;
      
      if (cpuCores >= 12 && gpuVram < 8) {
        warnings.push({
          type: 'performance',
          title: 'Potential CPU-GPU Imbalance',
          description: 'High-end CPU may be bottlenecked by GPU with limited VRAM',
          affected: ['cpu', 'gpu'],
          resolution: 'Consider GPU with more VRAM for balanced performance',
          severity: 'warning'
        });
      }
    }
    
    return warnings;
  }

  private generateValidationErrors(): BuildError[] {
    const errors: BuildError[] = [];
    
    // Critical compatibility errors
    const errorIssues = this.compatibilityData.issues.filter(issue => issue.severity === 'error');
    errorIssues.forEach(issue => {
      errors.push({
        type: 'compatibility',
        title: issue.message,
        description: issue.explanation,
        affected: issue.affected,
        resolution: issue.fix || 'Replace incompatible components',
        blocking: true
      });
    });
    
    return errors;
  }

  private generateValidationActions(): BuildAction[] {
    const actions: BuildAction[] = [];
    
    actions.push({
      type: 'check',
      title: 'Final Compatibility Check',
      description: 'Review all component compatibility',
      instructions: [
        'Review all compatibility warnings and errors',
        'Verify power supply capacity is adequate',
        'Check physical fit of all components',
        'Confirm thermal solution is appropriate',
        'Validate upgrade path potential'
      ],
      completed: this.compatibilityData.issues.filter(i => i.severity === 'error').length === 0
    });
    
    return actions;
  }

  private generatePerformanceValidationRecommendations(): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    
    if (this.useCase?.primaryUse === 'gaming') {
      recommendations.push({
        type: 'check',
        title: 'Gaming Performance Validation',
        description: 'Test system with gaming benchmarks',
        priority: 'medium',
        reasoning: 'Benchmarks validate performance meets expectations'
      });
    }
    
    if (this.useCase?.primaryUse === 'content_creation') {
      recommendations.push({
        type: 'check',
        title: 'Content Creation Performance',
        description: 'Test with relevant workloads (video editing, 3D rendering)',
        priority: 'medium',
        reasoning: 'Real-world testing validates professional performance'
      });
    }
    
    return recommendations;
  }

  private generatePerformanceValidationActions(): BuildAction[] {
    const actions: BuildAction[] = [];
    
    actions.push({
      type: 'test_connection',
      title: 'Run Performance Benchmarks',
      description: 'Test system performance with appropriate benchmarks',
      instructions: [
        'Run CPU benchmark (Cinebench, Geekbench)',
        'Run GPU benchmark (3DMark, FurMark)',
        'Test gaming performance if gaming build',
        'Monitor temperatures during testing',
        'Run memory bandwidth tests',
        'Test storage speeds (CrystalDiskMark)',
        'Document results for comparison'
      ],
      completed: false
    });
    
    return actions;
  }

  private generateCompletionRecommendations(): BuildRecommendation[] {
    const recommendations: BuildRecommendation[] = [];
    
    // Upgrade path recommendations
    const motherboard = this.selectedParts.motherboard;
    if (motherboard) {
      recommendations.push({
        type: 'check',
        title: 'Document Upgrade Path',
        description: 'Note future upgrade possibilities for your platform',
        priority: 'low',
        reasoning: 'Understanding upgrade path helps with future planning'
      });
    }
    
    // Maintenance recommendations
    recommendations.push({
      type: 'general_action',
      title: 'Establish Maintenance Schedule',
      description: 'Plan regular system maintenance',
      priority: 'medium',
      reasoning: 'Regular maintenance ensures optimal performance and longevity'
    });
    
    return recommendations;
  }

  private generateCompletionWarnings(): BuildWarning[] {
    const warnings: BuildWarning[] = [];
    
    // Warranty reminders
    warnings.push({
      type: 'performance',
      title: 'Warranty Registration',
      description: 'Register component warranties for future support',
      affected: ['all_components'],
      resolution: 'Register warranties with manufacturers within required timeframe',
      severity: 'info'
    });
    
    // Backup recommendations
    warnings.push({
      type: 'performance',
      title: 'Backup Strategy',
      description: 'Implement data backup solution',
      affected: ['storage'],
      resolution: 'Set up automatic backups to protect important data',
      severity: 'info'
    });
    
    return warnings;
  }

  private generateCompletionActions(): BuildAction[] {
    const actions: BuildAction[] = [];
    
    actions.push({
      type: 'general_action',
      title: 'Complete Build Documentation',
      description: 'Document build details and configurations',
      instructions: [
        'Document all component models and serial numbers',
        'Save BIOS configuration settings',
        'Record benchmark results',
        'Create system restore point',
        'Register component warranties',
        'Plan regular maintenance schedule',
        'Share build experience (optional)'
      ],
      completed: false
    });
    
    return actions;
  }

  /**
   * Generate build summary
   */
  private generateSummary(): BuildSummary {
    const totalIssues = this.compatibilityData.issues.length;
    const criticalIssues = this.compatibilityData.issues.filter(i => i.severity === 'error').length;
    const warnings = this.compatibilityData.issues.filter(i => i.severity === 'warning').length;
    
    const powerAnalysis = estimatePowerRequirements(this.selectedParts);
    
    return {
      totalIssues,
      criticalIssues,
      warnings,
      recommendations: 0, // Will be calculated from all steps
      completedSteps: 0,   // Will be calculated from all steps
      totalSteps: 0,       // Will be calculated from all steps
      estimatedPower: powerAnalysis.estimated,
      thermalRisk: 'medium', // Will be calculated from thermal analysis
      upgradePotential: 'medium' // Will be calculated from upgrade analysis
    };
  }

  /**
   * Determine overall build health
   */
  private determineBuildHealth(): BuildGuideState['buildHealth'] {
    const criticalIssues = this.compatibilityData.issues.filter(i => i.severity === 'error').length;
    const warnings = this.compatibilityData.issues.filter(i => i.severity === 'warning').length;
    
    if (criticalIssues > 0) return 'critical';
    if (warnings > 3) return 'poor';
    if (warnings > 0) return 'fair';
    if (warnings === 0 && Object.keys(this.selectedParts).length >= 5) return 'excellent';
    return 'good';
  }

  /**
   * Calculate overall progress
   */
  private calculateOverallProgress(steps: BuildStep[]): number {
    if (steps.length === 0) return 0;
    const totalProgress = steps.reduce((sum, step) => sum + step.progress, 0);
    return Math.round(totalProgress / steps.length);
  }

  /**
   * Find current active step
   */
  private findCurrentStep(steps: BuildStep[]): string {
    // Find first incomplete step
    const incompleteStep = steps.find(step => step.progress < 100);
    return incompleteStep?.id || steps[steps.length - 1]?.id || '';
  }

  /**
   * Get phase for step
   */
  private getPhaseForStep(stepId: string): BuildPhase {
    const stepMap: Record<string, BuildPhase> = {
      'intended_use_detection': 'pre_build_planning',
      'budget_analysis': 'pre_build_planning',
      'platform_decision': 'pre_build_planning',
      'performance_expectations': 'pre_build_planning',
      'select_cpu': 'component_selection',
      'select_motherboard': 'component_selection',
      'select_ram': 'component_selection',
      'select_gpu': 'component_selection',
      'select_storage': 'component_selection',
      'select_psu': 'component_selection',
      'select_case': 'component_selection',
      'select_cooler': 'component_selection',
      'power_analysis': 'system_constraints',
      'thermal_analysis': 'system_constraints',
      'physical_fit_analysis': 'system_constraints',
      'upgrade_analysis': 'system_constraints',
      'preparation': 'build_order',
      'cpu_installation': 'build_order',
      'ram_installation': 'build_order',
      'motherboard_mounting': 'build_order',
      'gpu_installation': 'build_order',
      'storage_installation': 'build_order',
      'psu_installation': 'build_order',
      'cable_management': 'build_order',
      'cooling_installation': 'build_order',
      'final_checks': 'build_order',
      'bios_configuration': 'firmware_setup',
      'os_installation': 'firmware_setup',
      'driver_installation': 'firmware_setup',
      'software_setup': 'firmware_setup',
      'compatibility_review': 'validation_review',
      'performance_validation': 'validation_review',
      'build_completion': 'validation_review'
    };
    
    return stepMap[stepId] || 'pre_build_planning';
  }
}

/**
 * Hook for using the build guide engine
 */
export function useBuildGuideEngine(selectedParts: SelectedParts = {}) {
  const engine = new BuildGuideEngine(selectedParts);
  
  return {
    engine,
    updateParts: engine.updateParts.bind(engine),
    setUseCase: engine.setUseCase.bind(engine)
  };
}
