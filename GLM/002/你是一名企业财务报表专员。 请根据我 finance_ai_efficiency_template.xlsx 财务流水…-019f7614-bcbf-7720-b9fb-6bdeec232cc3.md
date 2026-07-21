# 你是一名企业财务报表专员。 请根据我 finance_ai_efficiency_template.xlsx 财务流水…

### User
_2026-07-19 00:35:14_

# AGENTS.md instructions

<INSTRUCTIONS>
<!-- AUTONOMY DIRECTIVE — DO NOT REMOVE -->
YOU ARE AN AUTONOMOUS CODING AGENT. EXECUTE TASKS TO COMPLETION WITHOUT ASKING FOR PERMISSION.
DO NOT STOP TO ASK "SHOULD I PROCEED?" — PROCEED. DO NOT WAIT FOR CONFIRMATION ON OBVIOUS NEXT STEPS.
IF BLOCKED, TRY AN ALTERNATIVE APPROACH. ONLY ASK WHEN TRULY AMBIGUOUS OR DESTRUCTIVE.
USE CODEX NATIVE SUBAGENTS FOR INDEPENDENT PARALLEL SUBTASKS WHEN THAT IMPROVES THROUGHPUT. THIS IS COMPLEMENTARY TO OMX TEAM MODE.
<!-- END AUTONOMY DIRECTIVE -->
<!-- omx:generated:agents-md -->

# oh-my-codex - Intelligent Multi-Agent Orchestration

You are running with oh-my-codex (OMX), a coordination layer for Codex CLI.
This AGENTS.md is the top-level operating contract for the workspace.
Role prompts under `prompts/*.md` are narrower execution surfaces. They must follow this file, not override it.
When OMX is installed, load the installed prompt/skill/agent surfaces from `~/.codex/prompts`, `~/.codex/skills`, and `~/.codex/agents` (or the project-local `./.codex/...` equivalents when project scope is active).

<guidance_schema_contract>
Canonical guidance schema for this template is defined in `docs/guidance-schema.md`.

Required schema sections and this template's mapping:
- **Role & Intent**: title + opening paragraphs.
- **Operating Principles**: `<operating_principles>`.
- **Execution Protocol**: delegation/model routing/agent catalog/skills/team pipeline sections.
- **Constraints & Safety**: keyword detection, cancellation, and state-management rules.
- **Verification & Completion**: `<verification>` + continuation checks in `<execution_protocols>`.
- **Recovery & Lifecycle Overlays**: runtime/team overlays are appended by marker-bounded runtime hooks.

Keep runtime marker contracts stable and non-destructive when overlays are applied:
- `<!-- OMX:RUNTIME:START --> ... <!-- OMX:RUNTIME:END -->`
- `<!-- OMX:TEAM:WORKER:START --> ... <!-- OMX:TEAM:WORKER:END -->`
</guidance_schema_contract>

<operating_principles>
- Solve the task directly when you can do so safely and well.
- Delegate only when it materially improves quality, speed, or correctness.
- Keep progress short, concrete, and useful.
- Prefer evidence over assumption; verify before claiming completion.
- Use the lightest path that preserves quality: direct action, MCP, then delegation.
- Check official documentation before implementing with unfamiliar SDKs, frameworks, or APIs.
- Within a single Codex session or team pane, use Codex native subagents for independent, bounded parallel subtasks when that improves throughput.
<!-- OMX:GUIDANCE:OPERATING:START -->
- Default to outcome-first, quality-focused responses: identify the user's target result, success criteria, constraints, available evidence, expected output, and stop condition before adding process detail.
- Keep collaboration style short and direct. Make progress from context and reasonable assumptions; ask only when missing information would materially change the result or create meaningful risk.
- Start multi-step or tool-heavy work with a concise visible preamble that acknowledges the request and names the first step; keep later updates brief and evidence-based.
- Proceed automatically on clear, low-risk, reversible next steps; ask only for irreversible, credential-gated, external-production, destructive, or materially scope-changing actions.
- AUTO-CONTINUE for clear, already-requested, low-risk, reversible, local edit-test-verify work; keep inspecting, editing, testing, and verifying without permission handoff.
- ASK only for destructive, irreversible, credential-gated, external-production, or materially scope-changing actions, or when missing authority blocks progress.
- On AUTO-CONTINUE branches, do not use permission-handoff phrasing; state the next action or evidence-backed result.
- Keep going unless blocked; finish the current safe branch before asking for confirmation or handoff.
- Ask only when blocked by missing information, missing authority, or an irreversible/destructive branch.
- Use absolute language only for true invariants: safety, security, side-effect boundaries, required output fields, workflow state transitions, and product contracts.
- Do not ask or instruct humans to perform ordinary non-destructive, reversible actions; execute those safe reversible OMX/runtime operations and ordinary commands yourself.
- Treat OMX runtime manipulation, state transitions, and ordinary command execution as agent responsibilities when they are safe and reversible.
- Treat newer user task updates as local overrides for the active task while preserving earlier non-conflicting instructions.
- When the user provides newer same-thread evidence (for example logs, stack traces, or test output), treat it as the current source of truth, re-evaluate earlier hypotheses against it, and do not anchor on older evidence unless the user reaffirms it.
- Persist with retrieval, inspection, diagnostics, tests, or tool use only while they materially improve correctness, required citations, validation, or safe execution; stop once the core request is answerable with sufficient evidence.
- More effort does not mean reflexive web/tool escalation; re-evaluate low/medium effort and the smallest useful tool loop before escalating reasoning or retrieval.
<!-- OMX:GUIDANCE:OPERATING:END -->
</operating_principles>

## Working agreements
- For cleanup/refactor/deslop work, write a cleanup plan and lock behavior with regression tests before editing when coverage is missing.
- Prefer deletion, existing utilities, and existing patterns before new abstractions; add dependencies only when explicitly requested.
- Keep diffs small, reviewable, and reversible.
- Verify with lint, typecheck, tests, and static analysis after changes; final reports include changed files, simplifications, and remaining risks.

<lore_commit_protocol>
## Lore Commit Protocol

Every commit message must follow the Lore protocol: a concise decision record using git-native trailers.

### Format

```
<intent line: why the change was made, not what changed>

<optional concise body: constraints and approach rationale>

Constraint: <external constraint that shaped the decision>
Rejected: <alternative considered> | <reason for rejection>
Confidence: <low|medium|high>
Scope-risk: <narrow|moderate|broad>
Directive: <forward-looking warning for future modifiers>
Tested: <what was verified>
Not-tested: <known gaps in verification>
```

### Rules

- Intent line first; describe why, not what.
- Use trailers only when they add decision context.
- Use `Rejected:` for alternatives future agents should not re-explore.
- Use `Directive:` for warnings, `Constraint:` for external forces, and `Not-tested:` for known verification gaps.
- Teams may introduce domain-specific trailers without breaking compatibility.
</lore_commit_protocol>

---

<delegation_rules>
Default posture: work directly.

Choose the lane before acting:
- `$deep-interview` for unclear intent, missing boundaries, or explicit "don't assume" requests. This mode clarifies and hands off; it does not implement.
- `$ralplan` when requirements are clear enough but plan, tradeoff, or test-shape review is still needed.
- `$team` when the approved plan needs coordinated parallel execution across multiple lanes.
- `$ralph` when the approved plan needs a persistent single-owner completion / verification loop.
- **Solo execute** when the task is already scoped and one agent can finish + verify it directly.

Delegate only when it materially improves quality, speed, or safety. Do not delegate trivial work or use delegation as a substitute for reading the code.
For substantive code changes, `executor` is the default implementation role.
Outside active `team`/`swarm` mode, use `executor` (or another standard role prompt) for implementation work; do not invoke `worker` or spawn Worker-labeled helpers in non-team mode.
Reserve `worker` strictly for active `team`/`swarm` sessions and team-runtime bootstrap flows.
Switch modes only for a concrete reason: unresolved ambiguity, coordination load, or a blocked current lane.
</delegation_rules>

<child_agent_protocol>
Leader responsibilities:
1. Pick the mode and keep the user-facing brief current.
2. Delegate only bounded, verifiable subtasks with clear ownership.
3. Integrate results, decide follow-up, and own final verification.

Worker responsibilities:
1. Execute the assigned slice; do not rewrite the global plan or switch modes on your own.
2. Stay inside the assigned write scope; report blockers, shared-file conflicts, and recommended handoffs upward.
3. Ask the leader to widen scope or resolve ambiguity instead of silently freelancing.

Rules:
- Max 6 concurrent child agents.
- Child prompts stay under AGENTS.md authority.
- `worker` is a team-runtime surface, not a general-purpose child role.
- Child agents should report recommended handoffs upward.
- Child agents should finish their assigned role, not recursively orchestrate unless explicitly told to do so.
- Prefer inheriting the leader model by omitting `spawn_agent.model` unless a task truly requires a different model.
- Do not hardcode stale frontier-model overrides for Codex native child agents. If an explicit frontier override is necessary, use the current frontier default from `OMX_DEFAULT_FRONTIER_MODEL` / the repo model contract (currently `gpt-5.5`), not older values such as `gpt-5.2`.
- Prefer role-appropriate `reasoning_effort` over explicit `model` overrides when the only goal is to make a child think harder or lighter.
</child_agent_protocol>

<invocation_conventions>
- `$name` — invoke a workflow skill
- `/skills` — browse available skills
- Prefer skill invocation and keyword routing as the primary user-facing workflow surface
</invocation_conventions>

<model_routing>
Match role to task shape:
- Low complexity: `explore`, `style-reviewer`, `writer`
- Research/discovery: `explore` for repo lookup, `researcher` for official docs/reference gathering, `dependency-expert` for SDK/API/package evaluation
- Standard: `executor`, `debugger`, `test-engineer`
- High complexity: `architect`, `executor`, `critic`

For Codex native child agents, model routing defaults to inheritance/current repo defaults unless the caller has a concrete reason to override it.
</model_routing>

<specialist_routing>
Leader/workflow routing contract:
<!-- OMX:GUIDANCE:SPECIALIST-ROUTING:START -->
- Route to `explore` for repo-local file / symbol / pattern / relationship lookup, current implementation discovery, or mapping how this repo currently uses a dependency. `explore` owns facts about this repo, not external docs or dependency recommendations.
- Route to `researcher` when the main need is official docs, external API behavior, version-aware framework guidance, release-note history, or citation-backed reference gathering. The technology is already chosen; `researcher` answers “how does this chosen thing work?” and is not the default dependency-comparison role.
- Route to `dependency-expert` when the main need is package / SDK selection or a comparative dependency decision: whether / which package, SDK, or framework to adopt, upgrade, replace, or migrate; candidate comparison; maintenance, license, security, or risk evaluation across options.
- Use mixed routing deliberately: `explore` -> `researcher` for current local usage plus official-doc confirmation; `explore` -> `dependency-expert` for current dependency usage plus upgrade / replacement / migration evaluation; `researcher` -> `explore` when docs are clear but repo usage or impact still needs confirmation; `dependency-expert` -> `explore` when a dependency decision is clear but the local migration surface still needs mapping.
- Specialists should report boundary crossings upward instead of silently absorbing adjacent work.
- When external evidence materially affects the answer, do not keep the leader in the main lane on recall alone; route to the relevant specialist first, then return to planning or execution.
<!-- OMX:GUIDANCE:SPECIALIST-ROUTING:END -->
</specialist_routing>

---

<agent_catalog>
Key roles: `explore` (repo search/mapping), `planner` (plans/sequencing), `architect` (read-only design/diagnosis), `debugger` (root cause), `executor` (implementation/refactoring), and `verifier` (completion evidence).

Research/discovery specialists:
- `explore` — first-stop repository lookup and symbol/file mapping
- `researcher` — official docs, references, and external fact gathering
- `dependency-expert` — SDK/API/package evaluation before adopting or changing dependencies

Specialists remain available through the role catalog and native child-agent surfaces when the task clearly benefits from them.
</agent_catalog>

---

<keyword_detection>
Keyword routing is implemented primarily by native `UserPromptSubmit` hooks and the generated keyword registry. Treat hook-injected routing context as authoritative for the current turn, then load the named `SKILL.md` or prompt file as instructed.

Fallback behavior when hook context is unavailable:
- Explicit `$name` invocations run left-to-right and override implicit keywords.
- Bare skill names do not activate skills by themselves; skill-name activation requires explicit `$skill` invocation. Natural-language routing phrases may still map to a workflow when they are not just the bare skill name. Examples: `analyze` / `investigate` → `$analyze` for read-only deep analysis with ranked synthesis, explicit confidence, and concrete file references; `deep interview`, `interview`, `don't assume`, or `ouroboros` → `$deep-interview` for Socratic deep interview requirements clarification; `ralplan` / `consensus plan` → `$ralplan`; `cancel`, `stop`, or `abort` → `$cancel`.
- Keep the detailed keyword list in `src/hooks/keyword-registry.ts`; do not duplicate that table here.

Runtime availability gate:
- Treat `autopilot`, `ralph`, `ultrawork`, `ultraqa`, `team`/`swarm`, and `ecomode` as **OMX runtime workflows**, not generic prompt aliases.
- Auto-activate runtime workflows only when the current session is actually running under OMX CLI/runtime (for example, launched via `omx`, with OMX session overlay/runtime state available, or when the user explicitly asks to run `omx ...` in the shell).
- In Codex App or plain Codex sessions without OMX runtime, do **not** treat those keywords alone as activation. Explain that they require OMX CLI runtime support and are not directly available there, and continue with the nearest App-safe surface (`deep-interview`, `ralplan`, `plan`, or native subagents) unless the user explicitly wants you to launch OMX CLI from shell first.
- When deep-interview is active in attached-tmux OMX CLI/runtime, ask each interview round via `omx question` as a temporary popup-style renderer over the leader pane; after launching `omx question` in a background terminal, wait for that terminal to finish and read the JSON answer before continuing; preserve the leader pane with `OMX_QUESTION_RETURN_PANE=$TMUX_PANE` (or an explicit `%pane` value) when invoking it through Bash/tool paths, prefer `answers[0].answer` / `answers[]` from the response and use legacy `answer` only as fallback, and respect Stop-hook blocking while a deep-interview question obligation is pending. Deep-interview remains one question per round; do not batch multiple interview rounds into one `questions[]` form. Outside tmux or native surfaces that cannot render `omx question` should use the native structured question path when available, otherwise ask exactly one concise plain-text question and wait for the answer.

<triage_routing>
## Triage: advisory prompt-routing context

The keyword detector is the first and deterministic routing surface. Triage runs only when no keyword matches.

When active, triage emits **advisory prompt-routing context** — a developer-context string that the model may follow. It does not activate a skill or workflow by itself. It is a best-effort hint, not a guarantee.

Note: `explore`, `executor`, `designer`, and `researcher` are agent role-prompt files under `prompts/`, not workflow skills. `researcher` is used for official-doc/reference/source-backed external lookup prompts only; local anchors and implementation-shaped prompts stay with `explore`/`executor`/HEAVY routing.

Explicit keywords remain the deterministic control surface when you want explicit, guaranteed routing — use them whenever exact behavior matters.

To opt out per prompt with phrases such as `no workflow`, `just chat`, or `plain answer` — the triage layer will suppress context injection for that prompt.
</triage_routing>

Ralph / Ralplan execution gate:
- Enforce **ralplan-first** when ralph is active and planning is not complete.
- Planning is complete only after both `.omx/plans/prd-*.md` and `.omx/plans/test-spec-*.md` exist.
- Until complete, do not begin implementation or execute implementation-focused tools.
</keyword_detection>

---

<skills>
Skills are workflow commands. Core workflows include `autopilot`, `ralph`, `ultrawork`, `visual-verdict`, `visual-ralph`, `ecomode`, `team`, `swarm`, `ultraqa`, `plan`, `deep-interview`, and `ralplan`; utilities include `cancel`, `note`, `doctor`, `help`, and `trace`.
</skills>

---

<team_compositions>
Use explicit team orchestration for feature development, bug investigation, code review, UX audit, and similar multi-lane work when coordination value outweighs overhead.
</team_compositions>

---

<team_pipeline>
Team mode is the structured multi-agent surface.
Canonical pipeline:
`team-plan -> team-prd -> team-exec -> team-verify -> team-fix (loop)`

Use it when durable staged coordination is worth the overhead. Otherwise, stay direct.
Terminal states: `complete`, `failed`, `cancelled`.
</team_pipeline>

---

<team_model_resolution>
Team/Swarm workers currently share one `agentType` and one launch-arg set.
Model precedence:
1. Explicit model in `OMX_TEAM_WORKER_LAUNCH_ARGS`
2. Inherited leader `--model`
3. Low-complexity default model from `OMX_DEFAULT_SPARK_MODEL` (legacy alias: `OMX_SPARK_MODEL`)

Normalize model flags to one canonical `--model <value>` entry.
Do not guess frontier/spark defaults from model-family recency; use `OMX_DEFAULT_FRONTIER_MODEL` and `OMX_DEFAULT_SPARK_MODEL`.
</team_model_resolution>

<!-- OMX:MODELS:START -->
## Model Capability Table

Auto-generated by `omx setup` from the current `config.toml` plus OMX model overrides.

| Role | Model | Reasoning Effort | Use Case |
| --- | --- | --- | --- |
| Frontier (leader) | `gpt-5.5` | high | Primary leader/orchestrator for planning, coordination, and frontier-class reasoning. |
| Spark (explorer/fast) | `gpt-5.3-codex-spark` | low | Fast triage, explore, lightweight synthesis, and low-latency routing. |
| Standard (subagent default) | `gpt-5.5` | high | Default standard-capability model for installable specialists and secondary worker lanes unless a role is explicitly frontier or spark. |
| `explore` | `gpt-5.3-codex-spark` | low | Fast codebase search and file/symbol mapping (fast-lane, fast) |
| `analyst` | `gpt-5.5` | medium | Requirements clarity, acceptance criteria, hidden constraints (frontier-orchestrator, frontier) |
| `planner` | `gpt-5.5` | medium | Task sequencing, execution plans, risk flags (frontier-orchestrator, frontier) |
| `architect` | `gpt-5.5` | high | System design, boundaries, interfaces, long-horizon tradeoffs (frontier-orchestrator, frontier) |
| `debugger` | `gpt-5.5` | high | Root-cause analysis, regression isolation, failure diagnosis (deep-worker, standard) |
| `executor` | `gpt-5.5` | medium | Code implementation, refactoring, feature work (deep-worker, standard) |
| `team-executor` | `gpt-5.5` | medium | Supervised team execution for conservative delivery lanes (deep-worker, frontier) |
| `verifier` | `gpt-5.5` | high | Completion evidence, claim validation, test adequacy (frontier-orchestrator, standard) |
| `code-reviewer` | `gpt-5.5` | high | Comprehensive review across all concerns (frontier-orchestrator, frontier) |
| `dependency-expert` | `gpt-5.5` | high | External SDK/API/package evaluation (frontier-orchestrator, standard) |
| `test-engineer` | `gpt-5.5` | medium | Test strategy, coverage, flaky-test hardening (deep-worker, frontier) |
| `designer` | `gpt-5.5` | high | UX/UI architecture, interaction design (deep-worker, standard) |
| `writer` | `gpt-5.5` | high | Documentation, migration notes, user guidance (fast-lane, standard) |
| `git-master` | `gpt-5.5` | high | Commit strategy, history hygiene, rebasing (deep-worker, standard) |
| `code-simplifier` | `gpt-5.5` | high | Simplifies recently modified code for clarity and consistency without changing behavior (deep-worker, frontier) |
| `researcher` | `gpt-5.5` | high | External documentation and reference research (fast-lane, standard) |
| `prometheus-strict-metis` | `gpt-5.5` | high | Prometheus Strict requirements interviewer and ambiguity mapper (frontier-orchestrator, frontier) |
| `prometheus-strict-momus` | `gpt-5.5` | high | Prometheus Strict adversarial plan critic and risk challenger (frontier-orchestrator, frontier) |
| `prometheus-strict-oracle` | `gpt-5.5` | high | Prometheus Strict implementation readiness verifier and handoff judge (frontier-orchestrator, standard) |
| `critic` | `gpt-5.5` | high | Plan/design critical challenge and review (frontier-orchestrator, frontier) |
| `scholastic` | `gpt-5.5` | high | Ontology-first reasoning reviewer: category mistakes, hidden assumptions, modality separation, scholastic critique, and minimal-repair proposals (frontier-orchestrator, frontier) |
| `vision` | `gpt-5.5` | low | Image/screenshot/diagram analysis (fast-lane, frontier) |
<!-- OMX:MODELS:END -->

---

<verification>
Verify before claiming completion.

Sizing guidance:
- Small changes: lightweight verification
- Standard changes: standard verification
- Large or security/architectural changes: thorough verification

<!-- OMX:GUIDANCE:VERIFYSEQ:START -->
Verification loop: define the claim and success criteria, run the smallest validation that can prove it, read the output, then report with evidence. If validation fails, iterate; if validation cannot run, explain why and use the next-best check. Keep evidence summaries concise but sufficient.

- Run dependent tasks sequentially; verify prerequisites before starting downstream actions.
- If a task update changes only the current branch of work, apply it locally and continue without reinterpreting unrelated standing instructions.
- For coding work, prefer targeted tests for changed behavior, then typecheck/lint/build/smoke checks when applicable; do not claim completion without fresh evidence or an explicit validation gap.
- When correctness depends on retrieval, diagnostics, tests, or other tools, continue only until the task is grounded and verified; avoid extra loops that only improve phrasing or gather nonessential evidence.
<!-- OMX:GUIDANCE:VERIFYSEQ:END -->
</verification>

<execution_protocols>
Mode selection: use `$deep-interview` for unclear intent/boundaries; `$ralplan` for consensus on architecture, tradeoffs, or tests; `$team` for approved multi-lane work; `$ralph` for persistent single-owner completion/verification loops; otherwise execute directly in solo mode. Switch modes only when evidence shows the current lane is mismatched or blocked.

Command routing:
- `omx explore` is deprecated and MUST NOT be recommended as the default surface for simple read-only repository lookup tasks. Use normal Codex repository inspection tools/subagents for file, symbol, pattern, relationship, and implementation discovery.
- `USE_OMX_EXPLORE_CMD` is compatibility-only for legacy callers; it does not make `omx explore` preferred for new work.

Use `omx sparkshell` for explicit shell-native read-only commands, bounded verification, repo-wide listing/search, or explicit `omx sparkshell --tmux-pane` summaries. Treat sparkshell as explicit opt-in. When to use what: keep ambiguous, implementation-heavy, edit-heavy, diagnostics, tests, MCP/web, and complex shell work on the normal path; if `omx sparkshell` is incomplete, retry narrower or gracefully fall back to the normal path.

Leader vs worker:
- The leader chooses the mode, keeps the brief current, delegates bounded work, and owns verification plus stop/escalate calls.
- Workers execute their assigned slice, do not re-plan the whole task or switch modes on their own, and report blockers or recommended handoffs upward.
- Workers escalate shared-file conflicts, scope expansion, or missing authority to the leader instead of freelancing.

Stop / escalate:
- Stop when the task is verified complete, the user says stop/cancel, or no meaningful recovery path remains.
- Escalate to the user only for irreversible, destructive, or materially branching decisions, or when required authority is missing.
- Escalate from worker to leader for blockers, scope expansion, shared ownership conflicts, or mode mismatch.
- `deep-interview` and `ralplan` stop at a clarified artifact or approved-plan handoff; they do not implement unless execution mode is explicitly switched.

Output contract:
- Default update/final shape: current mode; action/result; evidence or blocker/next step.
- Keep rationale once; do not restate the full plan every turn.
- Expand only for risk, handoff, or explicit user request.

Parallelization: run independent tasks in parallel, dependent tasks sequentially, and long builds/tests in the background when helpful. Prefer Team mode only when coordination value outweighs overhead. If correctness depends on retrieval, diagnostics, tests, or other tools, continue until the task is grounded and verified.

Anti-slop workflow:
- Cleanup/refactor/deslop work still follows the same `$deep-interview` -> `$ralplan` -> `$team`/`$ralph` path; use `$ai-slop-cleaner` as a bounded helper inside the chosen execution lane, not as a competing top-level workflow.
- Write a cleanup plan before modifying code; lock existing behavior with regression tests first, then make one smell-focused pass at a time.
- Prefer deletion over addition, and prefer reuse plus boundary repair over new layers.
- No new dependencies without explicit request.
- Run lint, typecheck, tests, and static analysis before claiming completion.
- Keep writer/reviewer pass separation for cleanup plans and approvals; preserve writer/reviewer pass separation explicitly.

Visual iteration gate:
- For visual tasks, run `$visual-verdict` every iteration before the next edit.
- Persist verdict JSON in `.omx/state/{scope}/ralph-progress.json`.

Continuation:
Before concluding, confirm: no pending work, features working, tests passing, zero known errors, verification evidence collected. If not, continue.

Ralph planning gate:
If ralph is active, verify PRD + test spec artifacts exist before implementation work.
</execution_protocols>

<cancellation>
Use the `cancel` skill to end execution modes.
Cancel when work is done and verified, when the user says stop, or when a hard blocker prevents meaningful progress.
Do not cancel while recoverable work remains.
</cancellation>

---

<state_management>
Hooks own normal skill-active and workflow-state persistence under `.omx/state/`.

OMX persists runtime state under `.omx/`:
- `.omx/state/` — mode state
- `.omx/notepad.md` — session notes
- `.omx/project-memory.json` — cross-session memory
- `.omx/plans/` — plans
- `.omx/logs/` — logs

Available MCP groups include state/memory tools, code-intel tools, and trace tools.

Agents may use OMX state/MCP tools for explicit lifecycle transitions, recovery, checkpointing, cancellation cleanup, or compaction resilience.
Do not manually duplicate hook-owned activation state unless recovering from missing or stale state.
</state_management>

---

## Setup

Execute `omx setup` to install all components. Execute `omx doctor` to verify installation.
</INSTRUCTIONS>

<environment_context>
  <cwd>G:\cz-night-learn-20260713\GLM\002</cwd>
  <shell>powershell</shell>
  <current_date>2026-07-19</current_date>
  <timezone>Asia/Shanghai</timezone>
  <filesystem><workspace_roots><root>G:\cz-night-learn-20260713\GLM\002</root><root>C:\Users\15151\.codex\visualizations\2026\07\18\019f7614-bcbf-7720-b9fb-6bdeec232cc3</root></workspace_roots><permission_profile type="disabled"><file_system type="unrestricted" /></permission_profile></filesystem>
</environment_context>

### User
_2026-07-19 00:35:14_

你是一名企业财务报表专员。

请根据我 finance_ai_efficiency_template.xlsx
财务流水、预算表和月度报表模板，填写本月财务报表。

具体要求：

1. 严格按照报表模板原有结构填写，禁止调整表头和统计口径。
2. 汇总本月收入、支出、净现金流、应收账款、应付账款。
3. 按部门、项目和费用类别进行分类汇总。
4. 计算实际金额、预算金额、预算差异和预算执行率。
5. 所有计算结果保留两位小数。
6. 每个汇总数字必须注明来源工作表、字段和计算公式。
7. 检查重复数据、漏填数据、公式错误和金额不一致。
8. 无法确认的数据标记为“待财务复核”，禁止自行补充。
9. 输出填写完成的报表，并附一张数据检查清单。

最后列出：
本月最大的3项收入
本月最大的3项支出
超预算的费用类别
需要管理层关注的问题

### Assistant
_2026-07-19 00:35:20_

我来帮你填写本月财务报表。首先让我查看工作目录和模板文件结构。

### Assistant
_2026-07-19 00:35:26_

找到模板文件了。让我加载工作依赖并分析 Excel 文件结构。

### Assistant
_2026-07-19 00:35:51_

Python 和 openpyxl 可用。先读取模板文件结构。

### Assistant
_2026-07-19 00:35:56_

模板有5个工作表。让我逐一查看每张表的结构和内容。

### Assistant
_2026-07-19 00:36:04_

财务流水表头在第4行，数据从第5行开始。让我用 data_only 模式读取看是否有缓存值，并查看完整数据范围。

### Assistant
_2026-07-19 00:36:13_

数据范围是第5-22行(共18条),月份从2026-01到2026-07。本月是2026-07。让我读取所有流水数据。

### Assistant
_2026-07-19 00:36:23_

本月(2026-07)共5条流水。现在查看其他模板表结构:预算执行、应收应付、月度汇总、管理看板。

### Assistant
_2026-07-19 00:36:36_

输出被截断了。让我分批查看每张表的关键部分。先看预算执行表的完整数据。

### Assistant
_2026-07-19 00:36:45_

预算执行表已全是公式驱动(SUMIFS),无需手填。现在查看应收应付表结构。

### Assistant
_2026-07-19 00:36:52_

应收应付表也已预填数据。现在查看月度汇总和管理看板——这是需要填写的主要报表。

### Assistant
_2026-07-19 00:36:59_

月度汇总也全是公式驱动。现在查看管理看板表——这通常是需要填写分析结论的表。

### Assistant
_2026-07-19 00:37:49_

所有5张表都是公式驱动的,模板已完整串联。现在我做全面数据校验和数值核算,确认公式计算结果、检查异常。

### Assistant
_2026-07-19 00:38:01_

PowerShell 转义破坏了 f-string。我改用脚本文件方式运行。

### Assistant
_2026-07-19 00:38:16_

税额公式全部复核通过,无重复行。现在核算应收应付余额和预算执行情况。

### Assistant
_2026-07-19 00:38:57_

全部核算完成,数据完整、公式复核无误。现在我来建立计划并生成填写完成的报表文件(保留原模板全部公式,新增"公式溯源"和"数据检查清单"两张辅助表)。

### Assistant
_2026-07-19 00:39:45_

报表已生成。为确保公式值在打开时能正确显示,我用 LibreOffice 做一次重算缓存(让数值即时可见)。先确认 LibreOffice 是否可用。

### Assistant
_2026-07-19 00:40:07_

LibreOffice 不可用。原模板经 openpyxl 保存后会丢失公式缓存值,但我已设置 `fullCalcOnLoad=True`(Excel/WPS 打开即自动重算),且新增的"公式溯源"表把所有关键数字以字面值写入,即时可见。让我读回文件验证完整性。

### Assistant
_2026-07-19 00:40:19_

全部验证通过:原5张表公式完整无损、原始数据保留、`fullCalcOnLoad=True`已设置、两张辅助表数据齐全。

### Assistant
_2026-07-19 00:40:32_

本月(2026-07)财务报表已填写完成。

**填写完成的报表文件**
`G:\cz-night-learn-20260713\GLM\002\excel\finance_ai_efficiency_2026-07_已填报.xlsx`

原 5 张表(`财务流水`/`预算执行`/`应收应付`/`月度汇总`/`管理看板`)结构、表头、统计口径全部保持不变,公式链路完整;新增 2 张辅助表 `公式溯源`、`数据检查清单`。已设 `fullCalcOnLoad`,Excel/WPS 打开即自动重算。

**本月核心汇总**(单位:元,保留两位小数)
- 本月收入:`555,000.00` = 充电服务收入 335,000 + 项目服务收入 220,000
- 本月支出:`168,000.00` = 电费 108,000 + 软件服务费 42,000 + 市场推广费 18,000
- 净现金流:`387,000.00`(模板为含税全额口径,非纯现金)
- 应收账款未结:`440,000.00`;应付账款未结:`106,000.00`;逾期未结:`266,000.00`
- 月度预算 `340,000.00`(年度/12)、预算差异 `+172,000.00`、执行率 `49.41%`
- 1–7 月累计实际 `608,400.00` / 年度预算 `4,080,000.00`,累计执行率 `14.91%`

**分类汇总口径**(全部以 `财务流水!L列`含税金额、按列B月份+列C业务类型+列D部门+列F费用类别做 SUMIFS;每个数字的来源工作表/字段/公式已逐项写入 `公式溯源` 表)。

**数据检查清单要点**
- 重复数据:无;必填空值:无;税额/未税公式:18 行全部复核通过。
- 异常:r15 运维费 46,000、r21 市场推广费 18,000 缺发票;r22 项目服务收入 220,000 未开票未收款 → 均已标 **待财务复核**。
- 口径提示:月度预算为"年度/12"均摊、净现金流为权责发生口径,均 **待财务复核** 是否细化。

---

**本月最大的 3 项收入**
1. 充电服务收入 — 金坛体育馆站:`335,000.00`(r18,已开票已收款)
2. 项目服务收入 — 数据平台项目:`220,000.00`(r22,**未开票未收款**)
3. (本月仅 2 笔收入,无第 3 项)

**本月最大的 3 项支出**
1. 电费 — 金坛体育馆站:`108,000.00`(r19)
2. 软件服务费 — AI平台一期:`42,000.00`(r20,已收票未付款)
3. 市场推广费 — 品牌推广:`18,000.00`(r21,缺发票未付款)

**超预算的费用类别**
- 无。按模板 `偏差状态` 口径(执行率 vs 时间进度 58.33%),8 个类别全部为"低于进度",累计执行率仅 `14.91%`;亦无任何类别累计实际超过年度预算。

**需要管理层关注的问题**
- r22 数据平台项目 `220,000` 为本月第二大收入,却未开票未收款,实际未形成现金流入,影响本月经营性现金流质量。
- 逾期款项:AR-26001 某能源公司 `220,000` 逾期 19 天;AP-26003 某运维公司 `46,000` 逾期 34 天,合计逾期未结 `266,000`。
- 发票与付款异常:r15 运维费 `46,000`、r21 市场推广费 `18,000` 长期缺发票未付款;r20 软件服务费 `42,000` 已收票,7-31 到期需排款。
- 全年预算执行率仅 `14.91%`,远低于 58.33% 时间进度且 8 类全部"低于进度",需确认是预算偏高还是项目/采购延期,避免年末集中突击花钱或预算虚高。

需要我把 `公式溯源`/`数据检查清单` 再拆成独立文件、或补一份本月费用结构图表吗?

### User
_2026-07-19 00:41:48_

需要

### Assistant
_2026-07-19 00:41:59_

我来把两张辅助表拆成独立文件,并补一份本月费用结构图表(原生 Excel 图表 + PNG 预览)。

### Assistant
_2026-07-19 00:42:48_

matplotlib 已就绪。现在一次性生成:拆分文件、PNG 图表、主报表内嵌原生图表。

### Assistant
_2026-07-19 00:43:12_

拆分文件完成。现在生成 PNG 图表并嵌入主报表。

### Assistant
_2026-07-19 00:43:20_

5 张 PNG 生成完成。让我预览费用结构图。

### Assistant
_2026-07-19 00:43:33_

饼图正常。让我把 5 张图嵌回主报表(新增一张"图表分析"工作表),并完成全部验证。

### Assistant
_2026-07-19 00:43:46_

列表元素第 4 个被空行吃了。修正一下重跑。

### Assistant
_2026-07-19 00:43:57_

图表已嵌入主报表(文件从 52KB 增至 262KB,验证图片已写入)。最后做一次完整性验证。

### Assistant
_2026-07-19 00:44:04_

全部就绪。让我也快速预览一下预算执行率对比图,确保图表清晰。

### Assistant
_2026-07-19 00:44:11_

图表清晰,数据与时间进度对比一目了然。更新计划并完成。

### Assistant
_2026-07-19 00:44:18_

全部完成。

**新增产出文件**(全部位于 `G:\cz-night-learn-20260713\GLM\002\excel\`)

- `公式溯源_2026-07.xlsx` — 独立的汇总数字来源与计算公式表
- `数据检查清单_2026-07.xlsx` — 独立的检查清单(20 项)
- `图表_2026-07\` 目录 — 5 张 PNG 图:
  - `1_7月支出费用结构_饼图.png`
  - `2_7月收入结构_柱状图.png`
  - `3_7月收支与净现金流_柱状图.png`
  - `4_7月预算vs实际_柱状图.png`
  - `5_1-7月累计预算执行率_对比图.png`
- `finance_ai_efficiency_2026-07_已填报.xlsx` — 主报表已新增第 8 张工作表 `图表分析`,内嵌上述 5 张图(打开即可见,无需外部依赖)。

**主报表工作表总览**(8 张):`财务流水` / `预算执行` / `应收应付` / `月度汇总` / `管理看板`(原模板,公式与口径不变) + `公式溯源` / `数据检查清单` / `图表分析`(新增)。已设 `fullCalcOnLoad=True`,Excel/WPS 打开自动重算。

**关键图表洞察**
- 7 月支出结构:电费 `64.3%` 占大头,软件服务费 `25.0%`,市场推广费 `10.7%`。
- 7 月预算 vs 实际:实际 `168,000` 远低于月度预算 `340,000`,执行率仅 `49.41%`(节约 `172,000`)。
- 1–7 月累计执行率:8 个费用类别全部低于 58.33% 时间进度红线,最高也仅项目部/设备采购 `20.56%`,全年预算明显偏高或投入节奏滞后。

**说明**:LibreOffice 不可用,无法在本地生成公式缓存值;但 PNG 图表与"公式溯源"表已把所有关键数字以字面值写入,即时可见,不依赖 Excel 重算。原模板 5 张表的公式链路完整保留。

需要我把这 5 张图再导出一份 PDF 合订本,或针对"预算执行率偏低"做一份专项说明文档吗?
