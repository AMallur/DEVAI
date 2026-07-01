# ============================================================
# taxonomy.py
# The single source of truth for labels and compliance rules.
# Every other script in this project imports from here, so
# everyone labeling data is working against the exact same
# definitions -- this is the most important file in the project.
# ============================================================

from dataclasses import dataclass
from typing import Optional


@dataclass
class ClauseCategory:
    id: str
    description: str
    # The specific, checkable requirement for this category, if one
    # exists. None for categories that are purely descriptive
    # (e.g. scope_of_work has no pass/fail compliance check).
    compliance_rule: Optional[str]


# ------------------------------------------------------------
# THE TAXONOMY -- edit this list to match your real standards.
# Each category should be specific enough that two different
# people labeling the same clause would pick the same category
# without arguing about it. If you can't write a one-sentence
# compliance_rule for a category, it probably doesn't need one
# (it's descriptive, not a compliance check).
# ------------------------------------------------------------

TAXONOMY = [
    # --- Insurance (split into sub-types, as you specified) ---
    ClauseCategory(
        "insurance_general_liability",
        "General liability coverage amount and per-occurrence limits",
        "Coverage amount must be >= $1,000,000 per occurrence",
    ),
    ClauseCategory(
        "insurance_additional_insured",
        "Requirement that Contractor be named as additional insured",
        "Must explicitly name Contractor (or Owner) as additional insured",
    ),
    ClauseCategory(
        "insurance_workers_comp",
        "Workers' compensation insurance requirements",
        "Must meet state-mandated workers' comp minimums",
    ),
    ClauseCategory(
        "insurance_auto_liability",
        "Commercial auto liability coverage requirements",
        "Coverage amount must be >= $1,000,000 combined single limit",
    ),
    ClauseCategory(
        "insurance_certificate_timing",
        "When the Certificate of Insurance must be provided/renewed",
        "Must be provided before work begins and renewed before expiration",
    ),

    # --- Payment ---
    ClauseCategory(
        "payment_terms_timing",
        "Payment due date relative to invoice (net 30, net 45, etc.)",
        "Payment terms must not exceed net 45 days",
    ),
    ClauseCategory(
        "payment_retainage",
        "Retainage percentage withheld until completion",
        "Retainage must not exceed 10%",
    ),
    ClauseCategory(
        "payment_pay_if_paid",
        "Pay-if-paid or pay-when-paid contingency clauses",
        None,  # descriptive flag, often a red flag rather than pass/fail
    ),

    # --- Liability / Risk ---
    ClauseCategory(
        "indemnification_scope",
        "What Subcontractor must indemnify Contractor against",
        "Must not require indemnification for Contractor's own negligence",
    ),
    ClauseCategory(
        "limitation_of_liability",
        "Caps on total liability exposure",
        None,
    ),

    # --- Scope / Schedule (descriptive, no compliance check) ---
    ClauseCategory("scope_of_work", "Description of the work being performed", None),
    ClauseCategory("schedule_milestones", "Project timeline and milestone dates", None),
    ClauseCategory("change_orders", "Process for modifying scope/price after signing", None),

    # --- Termination / Disputes ---
    ClauseCategory(
        "termination_for_cause",
        "Conditions allowing termination due to breach",
        None,
    ),
    ClauseCategory(
        "termination_notice_period",
        "Required notice period before termination",
        "Notice period must be at least 7 days",
    ),
    ClauseCategory("dispute_resolution", "Arbitration, mediation, or litigation process", None),
    ClauseCategory("lien_waivers", "Conditional or unconditional lien waiver requirements", None),

    # --- Add more here as you review real contracts and find
    #     categories that don't fit the ones above. Aim for 20-40
    #     total, per your target -- this starter set has 16; you'll
    #     likely add sub-splits for change_orders, dispute_resolution,
    #     and a few more once you're looking at real documents. ---
]

CATEGORY_IDS = [c.id for c in TAXONOMY]


def get_category(category_id: str) -> ClauseCategory:
    for c in TAXONOMY:
        if c.id == category_id:
            return c
    raise ValueError(f"Unknown category: {category_id}")


if __name__ == "__main__":
    print(f"Taxonomy has {len(TAXONOMY)} categories:\n")
    for c in TAXONOMY:
        rule = c.compliance_rule or "(descriptive only, no compliance check)"
        print(f"  {c.id}")
        print(f"    {c.description}")
        print(f"    Rule: {rule}")
        print()
