---
title: "Bayesian Funnel Modeling & Dashboard"
date: "2025-11-28"
description: "Hierarchical Bayesian estimation of a 4-stage purchase funnel with an uncertainty-aware Plotly dashboard"
tags: ["Bayesian","PyMC","Funnel","Plotly/Dash"]
---

## Overview
Estimated conversion through a 4-stage funnel — **preference → recommendation → purchase intent → purchase** — with hierarchical Bayesian logistic models, then built a dashboard that quantifies bottlenecks and risk so investment priorities can be ranked per customer group. (The repo ships synthetic demo data, not real client data.)

## Model Design
- Four PyMC hierarchical logistic models, one per stage, on conditional flows (recommend | preference, intent | recommend, purchase | intent)
- Random effects for segment, nested segment-model, loyalty, and their interactions — small groups borrow strength from parent distributions, so estimates stay reliable at low n
- Posterior summaries per group and cross-level: mean conversion, 95% CI, **SNR**, lift vs total, **Fail Prob** (probability of being worse than the brand baseline), dropout rate, and chained conversion (pref × rec × intent × buy)
- Weighted scoring (default 0.2/0.3/0.0/0.5) with quantile-based A–D grades for prioritization
- Ordinal logistic MLE cutpoints keep preference metrics compatible with legacy (non-Bayesian) reports

## Dashboard
Interactive Plotly/Dash app (served with gunicorn, hosted on Hugging Face Spaces) showing funnel stages, group comparisons, and uncertainty bands — so decisions are made on credible intervals, not just point estimates.

## Why It Matters
Survey-based funnel numbers are usually read as simple percentages. This project reframes them with uncertainty: which drops are real bottlenecks, which are noise, and which groups justify investment first — reducing dependence on booster samples and re-fielding.

## Links
- Repo: https://github.com/jay-lay-down/bayesian_dashboard
- Dashboard: https://jay1121-bayesian-dashboard.hf.space
