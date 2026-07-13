---
title: "Brand Image Evaluation with Bayesian Norms"
date: "2025-11-28"
description: "Online reviews as Bayesian priors + survey data as likelihood — robust adjective-level brand scores at small n"
tags: ["Bayesian","NLP","PyMC","Tracking","VBA"]
---

## Overview
A word(adjective)-level brand image evaluation system that fuses qualitative and quantitative data: crawled online reviews are tokenized against a function/adjective dictionary and treated as the **prior**, and brand-image survey data enters as the **likelihood** of a hierarchical Bayesian model. The result: stable, explainable brand-attribute scores even when the survey sample is small. (Repo data is synthetic for demo purposes.)

## Model
- Hierarchical Bayesian model in PyMC: score ~ StudentT(ν, μ, σ) with μ decomposed into brand, attribute, and adjective effects plus optional interactions (e.g. brand × adjective)
- Partial pooling — sparse brand/adjective combinations borrow strength from parent distributions, stabilizing small-n estimates
- **Student-T likelihood** instead of Gaussian for robustness to outliers
- Outputs both a reporting table (mean/sd per group-adjective) and a posterior-parameter table (post_mu, post_k, …) so results can seed future Bayesian updates — enabling time-series accumulation for tracking studies

## Engineering
- Robust data ingestion (xlsx/xls/xlsb/csv with engine fallback), fuzzy column detection, automatic wide→long reshaping
- Analysis scoping controls (top-N adjectives by frequency, whitelists) to manage compute
- One-command `run_all` execution with FAST presets; results packaged as timestamped Excel/ZIP
- Final dashboard delivered in Excel VBA so non-technical stakeholders can explore results in a familiar tool

## Why It Matters
Small-sample brand studies often produce distorted adjective scores (one respondent calling a service "sturdy" shouldn't define the brand). Anchoring the model with large-scale review data reduces that distortion without fielding more surveys.

## Links
- Repo: https://github.com/jay-lay-down/bayesian_norm
- Blog: https://velog.io/@jaylaydown/BayesianAdjectiveNorm
- Dashboard: https://github.com/jay-lay-down/bayesian_norm/blob/main/assets/bayesian_norm_fin.xlsm
