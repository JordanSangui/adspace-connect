interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  className = "",
}: StatsCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trendUp
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {trendUp ? "↑" : "↓"} {trend}
              </span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
    </div>
  );
}
