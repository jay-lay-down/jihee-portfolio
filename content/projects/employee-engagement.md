---
title: "Drivers of Employee Engagement (LPA Pipeline)"
date: "2025-11-28"
description: "A reproducible tidyLPA pipeline — BIC-driven model sweep, profile assignment, and org-strategy interpretation"
tags: ["LPA","tidyLPA","Segmentation","R","CLI"]
---

## Overview
Organizations usually read engagement surveys as averages, which hides the fact that a "3.5 average" workforce may contain thriving, conflicted, and about-to-quit groups. This project segments employees with **Latent Profile Analysis (LPA)** on engagement and attrition indicators (employee- and manager-level), then turns profiles into targeted management strategies.

## Pipeline Engineering
Built as a reproducible, CLI-driven R pipeline on `tidyLPA`:

- Sweeps model parameterizations (1–6) × profile counts (1..K) and selects the best solution by **BIC**, breaking ties with higher **entropy**
- Auto-detects indicator columns by naming patterns (`ENGAGEMENT_*`, `ATTRITION_*`, or Korean keywords) or accepts explicit `--vars`
- Optional region-aware runs (`--region`) with per-region outputs and a cross-region summary; silently falls back to a global run when the column is absent
- Outputs everything needed for reuse: fit indices for all solutions, class assignments, class-wise means, BIC elbow and profile plots, and session info for reproducibility

## Interpretation
Profiles are labeled by their indicator patterns — e.g. stable-thriving, conflict-prone (high engagement gap between employee and manager view), and attrition-risk — so each group gets a tailored intervention rather than one blanket HR policy.

## Tech Stack
R · tidyLPA/mclust · dplyr · ggplot2 · optparse (CLI)

## Links
- Repo: https://github.com/jay-lay-down/LPA_synthetic_vars
- Slides: https://github.com/jay-lay-down/LPA_synthetic_vars/blob/main/assets/LPA_example.pdf
