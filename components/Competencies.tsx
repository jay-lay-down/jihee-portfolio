export default function Competencies() {
  const items = [
    "정성/정량 데이터 통합",
    "베이지안 모델링 및 대시보드 구축",
    "AI/LLM 응용",
    "비즈니스 인사이트 도출",
    "Prompt Engineering",
    "글로벌 고객사와 협업",
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
