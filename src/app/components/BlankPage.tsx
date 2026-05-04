interface BlankPageProps {
  title: string;
  description?: string;
  plannedFeatures?: string[];
}

export function BlankPage({ title, description, plannedFeatures }: BlankPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-xl">
        <div className="text-5xl mb-3 opacity-30">📋</div>
        <h2 className="text-lg font-bold text-gray-700 mb-2">{title}</h2>
        {description && <p className="text-sm text-gray-500 mb-5">{description}</p>}
        {plannedFeatures && plannedFeatures.length > 0 && (
          <div
            className="rounded-lg p-4 text-left border"
            style={{
              backgroundColor: "var(--region-light)",
              borderColor: "var(--region-border)",
            }}
          >
            <h3 className="text-xs font-bold text-gray-700 mb-2.5">예정 콘텐츠:</h3>
            <ul className="space-y-1.5">
              {plannedFeatures.map((feature, index) => (
                <li
                  key={index}
                  className="text-xs text-gray-600 flex items-start gap-2"
                >
                  <span
                    className="mt-0.5 font-bold"
                    style={{ color: "var(--region-primary)" }}
                  >
                    •
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
