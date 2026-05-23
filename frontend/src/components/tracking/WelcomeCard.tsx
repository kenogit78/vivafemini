export function WelcomeCard() {
  return (
    <div className="rounded-card bg-white p-6 text-center shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div
        className="mx-auto mb-5 flex h-40 w-full max-w-[280px] items-center justify-center rounded-card bg-gradient-to-br from-primary-bg via-primary/20 to-primary-light/30"
        aria-hidden
      >
        <svg
          viewBox="0 0 200 160"
          className="h-32 w-40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="60" y="30" width="80" height="120" rx="12" fill="#FFF0F5" stroke="#E91E8C" strokeWidth="2" />
          <circle cx="100" cy="55" r="8" fill="#E91E8C" opacity="0.6" />
          <rect x="75" y="75" width="50" height="6" rx="3" fill="#FF4D8D" opacity="0.5" />
          <rect x="80" y="88" width="40" height="6" rx="3" fill="#FF4D8D" opacity="0.4" />
          <path
            d="M30 100 C20 80, 40 60, 55 75 C45 55, 70 45, 60 90 Z"
            fill="#FFB6C1"
            opacity="0.8"
          />
          <circle cx="155" cy="50" r="12" fill="#E91E8C" opacity="0.3" />
          <text x="148" y="55" fontSize="14">💊</text>
          <circle cx="165" cy="90" r="10" fill="#FF4D8D" opacity="0.3" />
          <text x="158" y="95" fontSize="12">📅</text>
          <circle cx="40" cy="45" r="10" fill="#E91E8C" opacity="0.3" />
          <text x="33" y="50" fontSize="12">🌸</text>
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-text-primary">Welcome,</h2>
      <p className="mt-1 text-lg text-text-secondary">
        How are you doing today?
      </p>
      <p className="mt-3 text-xs leading-relaxed text-text-secondary">
        Get to track your symptoms daily, to know your state of wellbeing
      </p>
    </div>
  );
}
