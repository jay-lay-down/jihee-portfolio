---
title: "Demand Forecasting — SARIMAX + R Packages"
date: "2025-11-28"
description: "Exogenous-variable-optimized SARIMAX: Elastic-Net vs PCA pipelines, shipped as installable R packages"
tags: ["Time Series","SARIMAX","Granger","Elastic-Net","R Package"]
---

## Overview
A demand forecasting system for the major domestic appliance (MDA) market that treats **exogenous variable selection as the core problem**: with 85 candidate market indicators, feeding everything into SARIMAX overfits, and picking by intuition is irreproducible. Two competing pipelines were built, compared on backtests, and packaged as installable R libraries.

## Two Variable-Optimization Pipelines
- **Elastic-Net pipeline** — Elastic-Net regression selects candidate variables, then **Granger causality tests** keep only variables (and their optimal lags) with validated predictive causality
- **PCA pipeline** — 85 indicators compressed into a few principal components, then the same Granger + optimal-lag filter before entering SARIMAX

A comparison runner executes both end-to-end and prints an accuracy comparison table, exporting per-method forecast workbooks.

## R Package Engineering
Both pipelines are published as installable packages (`regforecast`, `pcaforecast`) via `remotes::install_github`, with a single `run_pipeline()` entry point (data path, product group, horizon, backtest window, significance threshold). Built with devtools · roxygen2 · testthat.

## Outcome
- Average **MAPE 0.9–7.5%** and **MASE 0.3–0.8** across product groups
- AICc held within ±5 despite heavier computation — accuracy gains without stability loss
- Adopted as the team's standard forecasting approach; the same methodology supported client-facing 5-year scenario forecasts

## Links
- Repo: https://github.com/jay-lay-down/demand_forecasting
- Slides: https://github.com/jay-lay-down/demand_forecasting/blob/main/assets/Example_Forecasting%20Projects.pdf
