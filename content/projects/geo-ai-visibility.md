---
title: "GEO Strategy for AI Search Visibility"
date: "2026-07-13"
description: "Prompt-first GEO strategy design for a leading digital bank (all client names masked)"
tags: ["GEO","AEO","Prompt Design","Embeddings","Clustering","KPI Tracking"]
---

## Context
Generative AI search is replacing a growing share of traditional search, but AI prompts leave no public logs — a brand cannot even measure how visible it is inside AI answers. As the strategy lead at an AI-visibility consultancy, I designed and ran an end-to-end GEO (Generative Engine Optimization) program for a leading digital bank. All client and competitor names in this case study are masked for confidentiality.

## Problem Definition
I reframed the vague goal ("show up in AI answers") into two measurable KPIs: **Citation Rate** (share of prompts where the client's content is cited as a source) and **Mention Rate** (share of prompts where the brand is named), both tracked weekly against competitors over a fixed pool of 250 prompts.

## Strategy Design — Prompt-First, Reverse-Engineered Content
Instead of writing content and hoping AI picks it up, I defined the questions first and reverse-engineered content as the answers: define key prompts → validate demand → cluster prompts → design content structure → produce and review content against GEO writing guidelines.

![Overall prompt-first process](/geo_process.png)

## Demand Validation with Organic Search Data
Since AI query logs are not observable, I extracted long-tail keywords from each candidate prompt and validated their real-world demand with monthly organic search volumes from a search-ads API. Only prompts passing a 3-stage filter (keyword extraction → volume check → answerability + bottom-20% cutoff) entered the content pipeline.

![Prompt demand validation](/geo_prompt.png)

## Clustering into a Content Architecture
Validated prompts were vectorized and clustered by cosine similarity, so that semantically adjacent questions map to a single content piece. This turned 250 prompts into 57 content topics, each covering 3–10 prompts on average.

![Prompt clustering to content topics](/geo_cluster.png)

## Outcome
- Citation Rate rose from 47% to **59.2%** in five weeks of tracking — the client's highest ever and **#1 in its industry**, +13.6%p above the second-ranked competitor
- Mention Rate reached **74.4%**, also #1 among all tracked brands
- The prompt design, demand-validation and review workflow was standardized into internal guidelines and reused across other client programs

![Citation rate trend after content release](/geo_result.png)
