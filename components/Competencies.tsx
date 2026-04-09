export default function Competencies() {
  const items = [
    "Integrating qualitative and quantitative data",
    "Bayesian modeling and dashboard development",
    "Applied AI and LLM solutions",
    "Turning analysis into business insight",
    "Prompt Engineering",
    "Collaborating with global clients",
  ];

  return (
    <ul className="space-y-2 text-sm text-[var(--muted)]">
      {items.map((t) => (
        <li key={t} className="flex gap-2 leading-6">
          <span className="mt-[2px] text-[var(--fg)]">•</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
