import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';



const steps = [
    { label: 'Product Entry', index: 0 },
    { label: 'Shopping Cart', index: 1 },
    { label: 'Transaction Totals', index: 2 },
    { label: 'Quick Actions', index: 3 },
];



export function Stepper({ currentStep, onStepClick, completedSteps = [] }) {
    return (
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto py-4">
            {steps.map((step, idx) => {
                const isActive = currentStep === step.index;
                const isCompleted = completedSteps.includes(step.index) || step.index < currentStep;
                const isClickable = isCompleted || step.index <= currentStep;

                return (
                    <div key={step.index} className="flex items-center flex-1 last:flex-none">
                        <button
                            onClick={() => isClickable && onStepClick(step.index)}
                            disabled={!isClickable}
                            className={cn(
                                'flex flex-col items-center gap-1.5 group',
                                isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                            )}
                        >
                            <div
                                className={cn(
                                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors border-2',
                                    isActive
                                        ? 'bg-primary border-primary text-white'
                                        : isCompleted
                                            ? 'bg-primary border-primary text-white'
                                            : 'border-muted-foreground/30 text-muted-foreground bg-background'
                                )}
                            >
                                {isCompleted && !isActive ? <Check className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span
                                className={cn(
                                    'text-xs font-medium whitespace-nowrap',
                                    isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-muted-foreground'
                                )}
                            >
                                {step.label}
                            </span>
                        </button>
                        {idx < steps.length - 1 && (
                            <div
                                className={cn(
                                    'flex-1 h-0.5 mx-2 mt-[-18px]',
                                    step.index < currentStep ? 'bg-primary' : 'bg-muted'
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
