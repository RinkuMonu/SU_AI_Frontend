"use client";

const platforms = [
  {
    id: "instagram",
    name: "Instagram Post",
  },
  {
    id: "instagram_story",
    name: "Instagram Story",
  },
  {
    id: "facebook",
    name: "Facebook",
  },
  {
    id: "google_business",
    name: "Google Business Post",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
  },
  {
    id: "advertisement",
    name: "Advertisement",
  },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function PlatformSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => (
        <button
          key={platform.id}
          type="button"
          onClick={() => onChange(platform.id)}
          className={`
            px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap
            ${
              value === platform.id
                ? "border-brand-purple bg-brand-purple text-white shadow-md shadow-purple-500/20"
                : "border-border bg-[#0a142c] text-text-muted hover:text-white hover:border-brand-purple/50"
            }
          `}
        >
          {platform.name}
        </button>
      ))}
    </div>
  );
}
