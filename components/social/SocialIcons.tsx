import React from "react";

export function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <radialGradient id="ig-grad-radial" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad-radial)" />
      <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
      <circle cx="12" cy="12" r="3.2" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
      <circle cx="15.8" cy="8.2" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}

export function FacebookIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M13.5 23.5V13.8H16.8L17.3 9.9H13.5V7.4C13.5 6.3 13.8 5.5 15.4 5.5H17.4V2.05C17.05 2 15.85 1.9 14.45 1.9C11.55 1.9 9.6 3.65 9.6 6.9V9.9H6.4V13.8H9.6V23.5C10.4 23.6 11.2 23.6 12 23.6C12.8 23.6 13.6 23.6 14.4 23.5H13.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function LinkedInIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="5" fill="#0A66C2" />
      <path
        d="M6.5 9H9.3V18H6.5V9ZM7.9 4.5C7 4.5 6.3 5.2 6.3 6.1C6.3 7 7 7.7 7.9 7.7C8.8 7.7 9.5 7 9.5 6.1C9.5 5.2 8.8 4.5 7.9 4.5Z"
        fill="#FFFFFF"
      />
      <path
        d="M10.8 9H13.5V10.2H13.55C13.95 9.45 14.9 8.65 16.35 8.65C19.35 8.65 19.9 10.6 19.9 13.2V18H17.1V13.6C17.1 12.55 17.05 11.2 15.6 11.2C14.1 11.2 13.9 12.35 13.9 13.5V18H11.1L10.8 9Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
