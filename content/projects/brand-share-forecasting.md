---
title: "Brand Share% Forecasting (Seq2Seq + Attention)"
date: "2025-11-28"
description: "Share-constrained forecasting: Granger-validated exogenous lags + LSTM encoder-decoder with additive attention"
tags: ["Seq2Seq","LSTM","Attention","Granger","TensorFlow"]
---

## Overview
Market share differs from ordinary time series in one crucial way: **competing brands' shares must sum to 100%**. This project forecasts brand-level share under that constraint, combining statistical causality checks with an attention-based Seq2Seq architecture.

## Pipeline
Raw data → automatic schema detection (date, `*Share` targets, exogenous columns) → **logit transform** of shares → **Granger causality tests** to keep only exogenous variables with statistically significant lag effects → forward-shift lag generation with tail-ARIMA extension (so future-impact lags exist at prediction time) → sequence building.

## Model
- LSTM **encoder–decoder** with **additive attention** over encoder states
- **Dual architecture comparison**: a Softmax output head (shares constrained to sum to 1 by construction) vs post-hoc sum-normalization — evaluating whether building the constraint into the network beats fixing it afterwards
- Multi-step scenario forecasting extending monthly predictions through end-2026

## Tech Stack
Python · TensorFlow/Keras · statsmodels (Granger) · pandas · NumPy · Colab-ready quickstart

## What This Demonstrates
Blending econometric rigor (causality-validated features, logit space) with deep learning architecture design for a business metric that has hard structural constraints.

## Links
- Repo: https://github.com/jay-lay-down/seq2seq_softmax
