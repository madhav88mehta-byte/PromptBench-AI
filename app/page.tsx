"use client";

import { useMemo, useState } from "react";

type Strategy = "Basic" | "Detailed" | "Role-Based" | "Step-by-Step";
type Experiment = { task: string; strategy: Strategy; score: number };

const criteria = [
  ["Correctness", 25],
  ["Completeness", 20],
  ["Code quality", 15],
  ["Efficiency", 15],
  ["Error handling", 15],
  ["Clarity", 10],
] as const;

const templates: Record<Strategy, string> = {
  Basic: "Write a solution for the following software-development task.",
  Detailed: "Act as a senior software engineer. Produce a correct, complete, maintainable solution. State assumptions, edge cases, and testing considerations before the final code.",
  "Role-Based": "You are a senior software engineer and code reviewer. Solve the task with production-quality code, explain important design choices, handle edge cases, and include a concise review checklist.",
  "Step-by-Step": "Solve the task systematically: understand requirements, identify edge cases, design the approach, implement it, test it with examples, then review the final solution for defects and improvements.",
};

export default function Home() {
  const [task, setTask] = useState("Write a Python function that validates an email address.");
  const [strategy, setStrategy] = useState<Strategy>("Basic");
  const [output, setOutput] = useState("");
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(criteria.map(([name]) => [name, 70]))
  );
  const [experiments, setExperiments] = useState<Experiment[]>([]);

  const generatedPrompt = useMemo(
    () => task.trim() ? `${templates[strategy]}\n\nTask:\n${task.trim()}` : templates[strategy],
    [task, strategy]
  );

  const total = Math.round(
    criteria.reduce((sum, [name, weight]) => sum + (Number(scores[name]) || 0) * weight, 0) / 100
  );

  function saveExperiment() {
    if (!task.trim()) return;
    setExperiments((old) => [{ task: task.trim(), strategy, score: total }, ...old]);
  }

  return (
    <main>
      <div className="container">
        <nav className="nav">
          <div className="brand"><div className="logo">PB</div><span>PromptBench AI</span></div>
          <span className="badge">Experimental Platform</span>
        </nav>

        <section className="hero">
          <div>
            <div className="kicker">AI-assisted software development</div>
            <h1>Measure how your prompts change the result.</h1>
            <p>PromptBench AI turns prompt engineering into a repeatable experiment. Use the same development task with different prompt strategies, record the outputs, score them, and compare the evidence.</p>
          </div>
          <div className="card">
            <div className="stats">
              <div className="stat"><strong>4</strong><span>Prompt strategies</span></div>
              <div className="stat"><strong>6</strong><span>Evaluation criteria</span></div>
              <div className="stat"><strong>100</strong><span>Maximum score</span></div>
            </div>
            <p className="muted">Designed for the Coursera AI-tools experimentation project and adaptable to real engineering evaluations.</p>
          </div>
        </section>

        <section className="section">
          <div className="section-title">
            <div><h2>1. Build an experiment</h2><div className="muted">Keep the task constant and change only the prompting strategy.</div></div>
          </div>
          <div className="grid">
            <div className="card">
              <label>Software-development task</label>
              <textarea value={task} onChange={(e) => setTask(e.target.value)} />
              <label style={{marginTop:18}}>Prompt strategy</label>
              <div className="strategy">
                {(Object.keys(templates) as Strategy[]).map((item) => (
                  <button key={item} className={strategy === item ? "active" : ""} onClick={() => setStrategy(item)}>{item}</button>
                ))}
              </div>
              <div className="row" style={{marginTop:16}}>
                <button className="primary" onClick={() => document.getElementById("prompt")?.scrollIntoView({behavior:"smooth"})}>Generate prompt</button>
                <button className="secondary" onClick={() => {setTask(""); setOutput("");}}>Reset</button>
              </div>
            </div>
            <div className="card" id="prompt">
              <label>Generated experimental prompt</label>
              <div className="promptbox">{generatedPrompt}</div>
              <p className="muted">Copy this prompt into the AI tool being tested (for example, ChatGPT or GitHub Copilot). Paste the resulting answer into the output box below so the experiment remains auditable.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-title">
            <div><h2>2. Evaluate the AI output</h2><div className="muted">Score the same output against the same weighted criteria each time.</div></div>
            <span className="pill">Current score: {total}/100</span>
          </div>
          <div className="grid">
            <div className="card">
              <label>AI output / code under evaluation</label>
              <textarea value={output} onChange={(e) => setOutput(e.target.value)} placeholder="Paste the AI-generated code or response here..." />
              <div className="scoregrid" style={{marginTop:18}}>
                {criteria.map(([name, weight]) => (
                  <div className="score-row" key={name}>
                    <div><strong>{name}</strong><div className="muted">{weight}% weight</div></div>
                    <input type="number" min="0" max="100" value={scores[name]} onChange={(e) => setScores({...scores, [name]: Math.max(0, Math.min(100, Number(e.target.value)))})} />
                    <div className="progress"><div style={{width:`${scores[name]}%`}} /></div>
                  </div>
                ))}
              </div>
              <button className="primary" style={{marginTop:20}} onClick={saveExperiment}>Save experiment result</button>
            </div>
            <div className="card">
              <label>Experimental discipline</label>
              <h3 style={{fontSize:25, margin:"8px 0 10px"}}>Change one variable at a time.</h3>
              <p className="muted">For a fair comparison, keep the development task, AI model, evaluation rubric, and evaluator consistent. The independent variable is the prompt strategy.</p>
              <div className="promptbox"><strong>Recommended workflow</strong>{"\n"}1. Choose one task.{"\n"}2. Run Basic prompt.{"\n"}3. Run Detailed prompt.{"\n"}4. Run Role-Based prompt.{"\n"}5. Run Step-by-Step prompt.{"\n"}6. Score every output using the same rubric.{"\n"}7. Compare averages and qualitative observations.</div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-title">
            <div><h2>3. Experiment log</h2><div className="muted">Your recorded results become evidence for the written analysis.</div></div>
          </div>
          <div className="card">
            {experiments.length === 0 ? <p className="muted">No experiments saved yet. Run a task above and save its score.</p> : (
              <table className="table">
                <thead><tr><th>Task</th><th>Strategy</th><th>Score</th></tr></thead>
                <tbody>{experiments.map((e, i) => <tr key={i}><td>{e.task}</td><td><span className="pill">{e.strategy}</span></td><td><strong>{e.score}/100</strong></td></tr>)}</tbody>
              </table>
            )}
          </div>
        </section>

        <footer className="footer">PromptBench AI • Experimental Platform for Evaluating AI-Assisted Software Development</footer>
      </div>
    </main>
  );
}
