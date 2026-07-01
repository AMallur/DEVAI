# ============================================================
# 02_build_training_set.py
# Converts labeled.jsonl (real output from label_tool.py) into the
# prompt/completion format the training notebook needs -- handling
# BOTH category and compliance, since that's what you're training.
#
# Usage:
#   python3 02_build_training_set.py --input labeled.jsonl --output training_data.jsonl
# ============================================================

import argparse
import json
from pathlib import Path
from collections import Counter

from taxonomy import TAXONOMY, CATEGORY_IDS, get_category

CATEGORY_LIST_STR = ", ".join(CATEGORY_IDS)


def format_example(row: dict) -> dict:
    """Builds one training example. If the category has a compliance
    rule, the model is trained to output BOTH the category and the
    compliance verdict in one structured response -- this is what
    makes it a genuinely two-headed task rather than two separate
    models."""
    category = get_category(row["category"])
    clause = row["text"]

    prompt = (
        f"Classify the following contract clause into exactly one category "
        f"from this list: {CATEGORY_LIST_STR}.\n\n"
        f'Clause: "{clause}"\n\n'
        f"Category:"
    )

    if category.compliance_rule:
        completion = f" {category.id}\nRule: {category.compliance_rule}\nCompliance: {row['compliance']}"
    else:
        completion = f" {category.id}\nCompliance: not_applicable"

    return {"prompt": prompt, "completion": completion, "text": prompt + completion}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=Path("labeled.jsonl"))
    parser.add_argument("--output", type=Path, default=Path("training_data.jsonl"))
    parser.add_argument("--min-per-category", type=int, default=20,
                         help="Warn if any category has fewer examples than this")
    args = parser.parse_args()

    if not args.input.exists():
        print(f"Error: {args.input} does not exist. Label some clauses first with label_tool.py.")
        return

    rows = []
    with open(args.input) as f:
        for line in f:
            rows.append(json.loads(line))

    # Filter out 'unclear' compliance labels -- training on ambiguous
    # judgments teaches the model to be confidently wrong on edge cases
    clean_rows = [r for r in rows if r.get("compliance") != "unclear"]
    dropped = len(rows) - len(clean_rows)
    if dropped:
        print(f"Dropped {dropped} examples marked 'unclear' (not used for training).")

    formatted = [format_example(r) for r in clean_rows]

    with open(args.output, "w") as f:
        for ex in formatted:
            f.write(json.dumps({"text": ex["text"]}) + "\n")

    counts = Counter(r["category"] for r in clean_rows)
    print(f"\nWrote {len(formatted)} training examples to {args.output}\n")
    print("Per-category counts:")
    low_categories = []
    for cat in TAXONOMY:
        n = counts.get(cat.id, 0)
        flag = ""
        if n < args.min_per_category:
            flag = "  <-- BELOW MINIMUM, model will be unreliable on this category"
            low_categories.append(cat.id)
        print(f"  {cat.id:35s} {n:4d}{flag}")

    if low_categories:
        print(f"\n{len(low_categories)} categories are below the {args.min_per_category}-example minimum.")
        print("Label more examples for these before training, or the model will")
        print("guess randomly (or default to the most common category) for them.")
    else:
        print(f"\nAll categories meet the {args.min_per_category}-example minimum. Ready to train.")

    print(f"\n--- Sample formatted example ---")
    print(formatted[0]["text"] if formatted else "(no examples)")


if __name__ == "__main__":
    main()
