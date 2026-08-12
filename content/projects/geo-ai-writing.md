---
title: "AI Writing — Embedding-guided Content Optimization"
date: "2026-08-12"
description: "GEO PoC for a major Korean financial holding company — optimized 141 content touchpoints, citation rate 0% → 30.7% in 6 weeks (client masked)"
tags: ["GEO","AI Writing","Embeddings","Similarity Scoring","Finance"]
---

## Background
A GEO PoC for a major Korean financial holding company. The goal was to verify a simple question: if we rewrite sentences so they are easier for AI to cite, does citation actually follow? I owned the optimization design through performance reporting. The client name is masked for confidentiality.

## Problem Definition
Which sentences an AI picks as sources is a black box. We proxied it with **semantic similarity** (0-100) between a target concept and each sentence, averaging three different embedding models to reduce single-model bias.

## Approach — 141 Touchpoints, Humans Keep the Last Word
A five-step pipeline: source text → target concept → candidate generation → similarity scoring → human review. Applied to **141 touchpoints** across 30 articles: 30 titles, 30 meta descriptions, and 81 FAQ answers. Because a similarity score never verifies whether a sentence is factually true, we enforced a **no-auto-adoption** rule — no candidate ships without human review. For a financial brand, the accuracy of a single sentence outranks any performance metric.

## Factor Decomposition — What Actually Moved the Number
By contrasting measurement points, we decomposed the lift: early gains came from content restructuring, later gains from AI Writing on top of it. Intervention dates were marked directly on the trend charts, making the causal claim inspectable rather than asserted.

## The Asymmetry — Citations Rise, Mentions Don't
While citation rate surged, mention rate stayed flat. Tracing the cause: of 40 cited articles, only 2 contained the brand name. This grounded a two-track next plan — citation via AI-friendly content optimization, mention via context-driven content strategy that follows consumer interests and purchase situations.

## Results
- Similarity improved at **all 141 touchpoints** (avg. 62.8 → 77.5)
- Citation rate **0% → 30.7%** in 6 weeks
- Mention rate up from baseline, entering the top-2 tier of tracked brands
- Selected as an official company success story; the review workflow was reused across other client programs
