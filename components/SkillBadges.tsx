type Skill = { name: string; bg: string; fg: string };

const SKILLS: Skill[] = [
  { name: "Python", bg: "#3776AB", fg: "#ffffff" },
  { name: "PyTorch", bg: "#EE4C2C", fg: "#ffffff" },
  { name: "TensorFlow", bg: "#FF6F00", fg: "#ffffff" },
  { name: "R", bg: "#276DC3", fg: "#ffffff" },
  { name: "SQL", bg: "#336791", fg: "#ffffff" },
  { name: "Tableau", bg: "#E97627", fg: "#ffffff" },
  { name: "Hadoop", bg: "#66CCFF", fg: "#0b0b0b" },
  { name: "Excel", bg: "#217346", fg: "#ffffff" },
  { name: "PowerPoint", bg: "#B7472A", fg: "#ffffff" },
  { name: "Hugging Face", bg: "#FFD21E", fg: "#0b0b0b" },
  { name: "SPSS", bg: "#0066CC", fg: "#ffffff" },
];

export default function SkillBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      {SKILLS.map((s) => (
        <span
          key={s.name}
          className="text-xs px-3 py-1.5 rounded-full border border-black/10 shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          style={{ backgroundColor: s.bg, color: s.fg }}
        >
          {s.name}
        </span>
      ))}
    </div>
  );
}
