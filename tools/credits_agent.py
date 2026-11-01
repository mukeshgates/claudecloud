#!/usr/bin/env python3
"""Run Claude through the Agent SDK on Console API credits.

Two jobs:
  resume    pick up a Claude Code session that stopped at your usage limit
  research  run a source-checked research pass on a YouTube topic

Setup (on the computer where your Claude Code sessions live):
  python3 -m venv .venv && source .venv/bin/activate
  pip install claude-agent-sdk
  export ANTHROPIC_API_KEY=sk-ant-...      # key from the Console org with the credits

Examples:
  python credits_agent.py list --dir ~/my-project
  python credits_agent.py resume --dir ~/my-project               # most recent session there
  python credits_agent.py resume --dir ~/my-project --id <session-id>
  python credits_agent.py research 'The $6.3B Binance hack' --out binance.md   # single quotes: "$6" would be read as a shell variable

Each turn prints its cost. --budget caps spend per run (default $5).
"""
import argparse
import asyncio
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

from claude_agent_sdk import (
    AssistantMessage,
    ClaudeAgentOptions,
    ClaudeSDKClient,
    ResultMessage,
    TextBlock,
    ToolUseBlock,
    query,
)

RESEARCH_PROMPT = """You are a research assistant for an investigative YouTube channel about AI, power and accountability.
Research the topic using web search and fetch. Rules:
- Primary sources first: court filings, regulator and government statements, company posts, original reporting.
- Every fact gets a source link and a date. Label each VERIFIED (primary or 2+ independent reputable sources),
  PARTLY VERIFIED, or UNVERIFIED. Flag numbers that are still changing.
- Quote people only with wording you saw verbatim; otherwise paraphrase and say so.
- Separate allegations from proven facts. Never present speculation as fact.
Output markdown with: one-line summary, timeline, key facts (labelled), who profits / who pays,
accountability (charges, fines, convictions), quotable clips (who, quote, where, date, link),
a CUT list of claims that failed checks, and open questions."""


def sessions_dir(cwd: Path) -> Path:
    # Claude Code stores transcripts under ~/.claude/projects/<cwd with non-alphanumerics replaced by '->
    base = Path(os.environ.get("CLAUDE_CONFIG_DIR", Path.home() / ".claude")) / "projects"
    return base / re.sub(r"[^A-Za-z0-9]", "-", str(cwd.resolve()))[:200]


def first_prompt(path: Path) -> str:
    try:
        with path.open(encoding="utf-8") as f:
            for line in f:
                try:
                    rec = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if rec.get("type") != "user":
                    continue
                content = (rec.get("message") or {}).get("content")
                if isinstance(content, str):
                    return content
                if isinstance(content, list):
                    for block in content:
                        if isinstance(block, dict) and block.get("type") == "text":
                            return block.get("text", "")
    except OSError:
        pass
    return ""


def list_sessions(cwd: Path, limit: int = 15) -> None:
    folder = sessions_dir(cwd)
    files = sorted(folder.glob("*.jsonl"), key=lambda p: p.stat().st_mtime, reverse=True) if folder.is_dir() else []
    if not files:
        print(f"No Claude Code sessions found for {cwd} (looked in {folder}).")
        return
    for p in files[:limit]:
        when = datetime.fromtimestamp(p.stat().st_mtime).strftime("%Y-%m-%d %H:%M")
        text = " ".join(first_prompt(p).split())[:80]
        print(f"{when}  {p.stem}  {text}")


def show(message) -> None:
    if isinstance(message, AssistantMessage):
        for block in message.content:
            if isinstance(block, TextBlock):
                print(block.text)
            elif isinstance(block, ToolUseBlock):
                print(f"  [tool] {block.name}")
    elif isinstance(message, ResultMessage):
        cost = f"${message.total_cost_usd:.4f}" if message.total_cost_usd is not None else "n/a"
        print(f"\n[{message.subtype} · turns {message.num_turns} · cost {cost} · session {message.session_id}]")


def base_tools(allow_bash: bool) -> list[str]:
    tools = ["Read", "Edit", "Write", "Glob", "Grep", "WebSearch", "WebFetch"]
    return tools + ["Bash"] if allow_bash else tools


async def resume(args) -> None:
    options = ClaudeAgentOptions(
        cwd=str(args.dir),
        allowed_tools=base_tools(args.allow_bash),
        permission_mode="acceptEdits",
        max_budget_usd=args.budget,
        model=args.model,
    )
    if args.id:
        options.resume = args.id
    elif any(sessions_dir(args.dir).glob("*.jsonl")):
        options.continue_conversation = True
    else:
        print(f"No saved session for {args.dir}; starting a new one there.")

    prompt = args.prompt or "Continue where you left off. First say in two lines what you were doing and what's next."
    async with ClaudeSDKClient(options=options) as client:
        while True:
            await client.query(prompt)
            async for message in client.receive_response():
                show(message)
            try:
                prompt = input("\nyou> ").strip()
            except (EOFError, KeyboardInterrupt):
                break
            if prompt.lower() in {"", "exit", "quit"}:
                break


async def research(args) -> None:
    options = ClaudeAgentOptions(
        cwd=str(args.dir),
        allowed_tools=["WebSearch", "WebFetch", "Read", "Write"],
        permission_mode="acceptEdits",
        system_prompt=RESEARCH_PROMPT,
        max_budget_usd=args.budget,
        model=args.model,
    )
    task = f"Research this topic for a script: {args.topic}"
    if args.out:
        task += f"\nWrite the final report to {args.out}."
    try:
        async for message in query(prompt=task, options=options):
            show(message)
    except Exception as error:  # query() raises after yielding an error result (e.g. budget reached)
        print(f"\nStopped: {error}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_list = sub.add_parser("list", help="list recent Claude Code sessions for a folder")
    p_list.add_argument("--dir", type=Path, default=Path.cwd())

    p_res = sub.add_parser("resume", help="continue a Claude Code session")
    p_res.add_argument("--dir", type=Path, default=Path.cwd(), help="the project folder the session ran in")
    p_res.add_argument("--id", help="session ID (default: most recent in --dir)")
    p_res.add_argument("--prompt", help="first message to send")
    p_res.add_argument("--allow-bash", action="store_true", help="let Claude run shell commands without asking")

    p_rs = sub.add_parser("research", help="source-checked research on a topic")
    p_rs.add_argument("topic")
    p_rs.add_argument("--dir", type=Path, default=Path.cwd())
    p_rs.add_argument("--out", help="markdown file to write the report to")

    for p in (p_res, p_rs):
        p.add_argument("--budget", type=float, default=5.0, help="max USD per run (default 5)")
        p.add_argument("--model", default=None, help="model ID, e.g. claude-opus-5-5 (default: SDK default)")

    args = parser.parse_args()

    if args.cmd == "list":
        list_sessions(args.dir)
        return
    if not args.dir.is_dir():
        sys.exit(f"Folder not found: {args.dir}\nCheck the exact path (e.g. `dir D:\\ /s /b /ad | findstr /i binance` on Windows).")
    if not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("Set ANTHROPIC_API_KEY to a key from the Console org that holds the credits.")
    asyncio.run(resume(args) if args.cmd == "resume" else research(args))


if __name__ == "__main__":
    main()
