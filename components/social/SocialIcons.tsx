import React from "react";

export function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ig-official-full-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="12%" stopColor="#fa7e1e" />
          <stop offset="38%" stopColor="#d62976" />
          <stop offset="68%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      {/* Colorful Instagram gradient rounded square matching Image 2 */}
      <rect width="24" height="24" rx="6.5" fill="url(#ig-official-full-grad)" />
      {/* White Camera outer body */}
      <rect x="3.8" y="3.8" width="16.4" height="16.4" rx="4.4" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
      {/* White Camera center lens */}
      <circle cx="12" cy="12" r="4.1" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
      {/* White Camera flash dot */}
      <circle cx="16.6" cy="7.4" r="1.2" fill="#FFFFFF" />
    </svg>
  );
}

export function FacebookIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#0866FF" />
      <path
        d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.80008 14.34 7.875 15.8306 7.875H17.3438V4.92188C17.3438 4.92188 15.9701 4.6875 14.6576 4.6875C11.9166 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8542C10.7441 23.9515 11.3728 24 12 24C12.6272 24 13.2559 23.9515 13.875 23.8542V15.4688H16.6711Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function LinkedInIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#0A66C2" />
      <path
        d="M6.88 8.56H9.84V18H6.88V8.56ZM8.36 3.84C9.31 3.84 10.08 4.61 10.08 5.56C10.08 6.51 9.31 7.28 8.36 7.28C7.41 7.28 6.64 6.51 6.64 5.56C6.64 4.61 7.41 3.84 8.36 3.84ZM11.44 8.56H14.28V9.85H14.32C14.72 9.09 15.7 8.28 17.18 8.28C20.24 8.28 20.8 10.29 20.8 12.91V18H17.84V13.36C17.84 12.25 17.82 10.83 16.29 10.83C14.74 10.83 14.5 12.04 14.5 13.28V18H11.54L11.44 8.56Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
