"use client";

const objectives = [
  {
    id: "product_promotion",
    name: "Product Promotion",
  },
  {
    id: "sale",
    name: "Sale",
  },
  {
    id: "launch",
    name: "Product Launch",
  },
  {
    id: "festival",
    name: "Festival",
  },
  {
    id: "awareness",
    name: "Brand Awareness",
  },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ObjectiveSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {objectives.map((objective) => (
        <button
          key={objective.id}
          type="button"
          onClick={() => onChange(objective.id)}
          className={`
            px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap
            ${
              value === objective.id
                ? "border-brand-purple bg-brand-purple text-white shadow-md shadow-purple-500/20"
                : "border-border bg-[#0a142c] text-text-muted hover:text-white hover:border-brand-purple/50"
            }
          `}
        >
          {objective.name}
        </button>
      ))}
    </div>
  );
}
