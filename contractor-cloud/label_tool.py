# ============================================================
# label_tool.py
# A real, working CLI for labeling clauses against the taxonomy.
# Paste in clause text, pick a category by number, optionally mark
# compliance pass/fail/not-applicable. Saves incrementally so you
# never lose work, and can resume a session anytime.
#
# Usage:
#   python3 label_tool.py --input raw_clauses.txt --output labeled.jsonl
#
# raw_clauses.txt should have one clause per line.
# ============================================================

import argparse
import json
from pathlib import Path

from taxonomy import TAXONOMY, CATEGORY_IDS, get_category


def load_existing_labels(output_path: Path) -> set:
    """Returns the set of clause texts already labeled, so re-running
    the tool on the same input skips what's done -- safe to stop and
    resume a labeling session anytime."""
    if not output_path.exists():
        return set()
    done = set()
    with open(output_path) as f:
        for line in f:
            row = json.loads(line)
            done.add(row["text"])
    return done


def load_raw_clauses(input_path: Path) -> list:
    with open(input_path) as f:
        return [line.strip() for line in f if line.strip()]


def print_category_menu():
    print("\nCategories:")
    for i, cat in enumerate(TAXONOMY, start=1):
        print(f"  {i:2d}. {cat.id}")
    print("   0. SKIP this clause (not relevant / unclear)")


def label_session(input_path: Path, output_path: Path):
    clauses = load_raw_clauses(input_path)
    already_done = load_existing_labels(output_path)
    remaining = [c for c in clauses if c not in already_done]

    print(f"Total clauses: {len(clauses)} | Already labeled: {len(already_done)} | Remaining: {len(remaining)}")

    if not remaining:
        print("Nothing left to label.")
        return

    with open(output_path, "a") as out_f:
        for i, clause in enumerate(remaining, start=1):
            print("\n" + "=" * 70)
            print(f"[{i}/{len(remaining)}]")
            print(f'\n  "{clause}"\n')

            print_category_menu()
            choice = input("\nCategory number: ").strip()

            if choice == "0":
                continue

            try:
                idx = int(choice) - 1
                if idx < 0 or idx >= len(TAXONOMY):
                    raise ValueError
                category = TAXONOMY[idx]
            except ValueError:
                print("Invalid choice, skipping this clause. Re-run the tool to retry it.")
                continue

            compliance_label = None
            if category.compliance_rule:
                print(f"\n  Compliance rule: {category.compliance_rule}")
                comp_choice = input("  Does this clause PASS this rule? (y/n/u for unclear): ").strip().lower()
                if comp_choice == "y":
                    compliance_label = "pass"
                elif comp_choice == "n":
                    compliance_label = "fail"
                else:
                    compliance_label = "unclear"

            row = {
                "text": clause,
                "category": category.id,
                "compliance": compliance_label,
            }
            out_f.write(json.dumps(row) + "\n")
            out_f.flush()  # write immediately -- never lose progress on a crash

    print(f"\nDone. Labels saved to {output_path}")


def validate_labels(output_path: Path):
    """Sanity-checks an existing labeled file against the taxonomy --
    catches the kind of mistake that silently ruins training data."""
    if not output_path.exists():
        print(f"{output_path} does not exist yet.")
        return

    errors = []
    counts = {}

    with open(output_path) as f:
        for line_num, line in enumerate(f, start=1):
            row = json.loads(line)
            cat_id = row.get("category")

            if cat_id not in CATEGORY_IDS:
                errors.append(f"Line {line_num}: unknown category '{cat_id}'")
                continue

            category = get_category(cat_id)
            comp = row.get("compliance")

            if category.compliance_rule and comp not in ("pass", "fail", "unclear"):
                errors.append(f"Line {line_num}: category '{cat_id}' requires a compliance rule but got '{comp}'")
            if not category.compliance_rule and comp is not None:
                errors.append(f"Line {line_num}: category '{cat_id}' has no compliance rule but got a value '{comp}'")

            counts[cat_id] = counts.get(cat_id, 0) + 1

    print(f"Checked {sum(counts.values())} labeled examples.")
    print()
    print("Examples per category:")
    for cat in TAXONOMY:
        n = counts.get(cat.id, 0)
        flag = "  <-- LOW, needs more examples" if 0 < n < 20 else ""
        print(f"  {cat.id:35s} {n:4d}{flag}")

    missing = [c.id for c in TAXONOMY if counts.get(c.id, 0) == 0]
    if missing:
        print(f"\nNo examples at all for: {missing}")

    if errors:
        print(f"\n{len(errors)} VALIDATION ERRORS:")
        for e in errors[:20]:
            print(f"  {e}")
    else:
        print("\nNo validation errors.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, help="Raw clauses file, one per line")
    parser.add_argument("--output", type=Path, default=Path("labeled.jsonl"))
    parser.add_argument("--validate-only", action="store_true", help="Just check an existing labeled file, don't label")
    args = parser.parse_args()

    if args.validate_only:
        validate_labels(args.output)
    else:
        if not args.input:
            parser.error("--input is required unless using --validate-only")
        label_session(args.input, args.output)
