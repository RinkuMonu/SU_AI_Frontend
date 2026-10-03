"use client";

const platforms = [
  {
    id: "instagram",
    label: "Instagram",
  },
  {
    id: "facebook",
    label: "Facebook",
  },
  {
    id: "google",
    label: "Google",
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
    <div>

      <h3 className="mb-3 font-semibold">
        Platform
      </h3>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

        {platforms.map((platform) => (

          <button
            type="button"
            key={platform.id}
            onClick={() =>
              onChange(platform.id)
            }
            className={`rounded-xl border p-4 ${
              value === platform.id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200"
            }`}
          >
            {platform.label}
          </button>

        ))}

      </div>

    </div>
  );
}
