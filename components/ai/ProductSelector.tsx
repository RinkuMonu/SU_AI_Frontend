"use client";

import { Check } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image_url?: string;
}

interface ProductSelectorProps {
  products: Product[];
  value: string[];
  onChange: (ids: string[]) => void;
  maxSelection?: number;
}

export default function ProductSelector({
  products,
  value = [],
  onChange,
  maxSelection = 5,
}: ProductSelectorProps) {
  const handleSelect = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      if (value.length < maxSelection) {
        onChange([...value, id]);
      } else {
        alert(`You can select up to ${maxSelection} products.`);
      }
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => {
        const selected = value.includes(product.id);

        return (
          <button
            key={product.id}
            type="button"
            onClick={() => handleSelect(product.id)}
            className={`
              relative rounded-xl border p-4 text-left transition-all
              ${
                selected
                  ? "border-brand-purple ring-2 ring-brand-purple/20 bg-brand-purple/5"
                  : "border-border hover:border-brand-purple/50 bg-surface"
              }
            `}
          >
            {selected && (
              <div className="absolute top-2 right-2 bg-brand-purple text-white rounded-full p-1 shadow-md">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}

            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full aspect-square object-cover rounded-lg mb-3"
              />
            )}

            <p className="font-medium text-sm text-white truncate">
              {product.name}
            </p>
          </button>
        );
      })}
    </div>
  );
}
