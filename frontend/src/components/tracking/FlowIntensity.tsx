'use client';

export interface FlowIntensityProps {
  value: number;
  onChange: (value: number) => void;
}

export function FlowIntensity({ value, onChange }: FlowIntensityProps) {
  const percent = (value / 10) * 100;

  return (
    <div className="rounded-card bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Flow Intensity</h3>
          <p className="mt-0.5 text-xs text-text-secondary">
            How heavy is your flow today?
          </p>
        </div>
        <span className="text-sm font-semibold text-text-secondary">
          {value}/10
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flow-slider h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200"
        style={{
          background: `linear-gradient(to right, #E91E8C ${percent}%, #E5E7EB ${percent}%)`,
        }}
        aria-label="Flow intensity"
      />

      <div className="mt-2 flex justify-between text-xs text-text-secondary">
        <span>Light</span>
        <span>Medium</span>
        <span>Heavy</span>
      </div>
    </div>
  );
}
