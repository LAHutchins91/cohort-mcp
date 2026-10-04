export type CurriculumRecord = {
  id: string;
  kind: string;
  title: string;
  status: "LOCKED" | "DEVELOPING" | "UNKNOWN" | "RETIRED";
  content: string;
  tags: string[];
};

export type ModuleRecord = { ordinal: number; title?: string | null; summary: string; approved: boolean };

const tokenize = (text: string) => new Set(text.toLowerCase().match(/[a-z0-9']+/g) ?? []);

export function rankCurriculum(query: string, entries: CurriculumRecord[], limit = 20): CurriculumRecord[] {
  const words = tokenize(query);
  return entries
    .filter((entry) => entry.status !== "RETIRED")
    .map((entry, index) => {
      const hay = tokenize(`${entry.title} ${entry.kind} ${entry.tags.join(" ")} ${entry.content}`);
      let score = entry.status === "LOCKED" ? 4 : entry.status === "DEVELOPING" ? 2 : 0;
      for (const token of words) if (hay.has(token)) score += 3;
      if (query.toLowerCase().includes(entry.title.toLowerCase())) score += 10;
      if (entry.kind === "NONCONTRADICTION" && entry.status === "LOCKED") score += 4;
      return { entry, index, score };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((item) => item.entry);
}

export function buildCurriculumPacket(input: {
  programName: string;
  request: string;
  curriculum: CurriculumRecord[];
  modules: ModuleRecord[];
}) {
  const selected = rankCurriculum(input.request, input.curriculum);
  const recentModules = input.modules.filter((item) => item.approved).sort((a, b) => b.ordinal - a.ordinal).slice(0, 5);

  return {
    protocol: "COHORT_V1",
    program: input.programName,
    operating_rule: "Owner-approved curriculum is authoritative. Never contradict LOCKED promises, module outcomes, or non-contradiction rules. Do not invent missing curriculum as fact.",
    request: input.request,
    curriculum: selected,
    recent_modules: recentModules,
    output_contract: {
      lock: "State the approved facts that constrain the answer.",
      prompt: "Answer the learner or draft the lesson using only compatible curriculum.",
      curriculum_check: "List contradictions prevented, unresolved unknowns, and any proposed permanent changes."
    }
  };
}
