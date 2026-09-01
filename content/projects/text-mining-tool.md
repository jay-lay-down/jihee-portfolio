---
title: "Text Mining Tool — Quantitative Analysis Pipeline (EXE)"
date: "2026-09-01"
description: "Preprocessing through sentiment in one pass — a PyQt5 desktop app that fixes the research workflow into nine tabs"
tags: ["PyQt5","Text Mining","Sentiment Analysis","Network Analysis","Automation"]
---

## Overview
A desktop app that takes social and online buzz data from an Excel export all the way through preprocessing, frequency analysis, word clouds, co-occurrence networks and sentiment scoring in a single window, then writes the whole thing out as one Excel file. It ships in two builds — `kor.py` for Korean (Kiwi morphological analysis) and `eng.py` for English (VADER with lemmatization).

## The Problem
- Every buzz study meant coding preprocessing, tokenization and visualization from scratch again.
- Stopword and part-of-speech criteria differed per researcher, so the same data produced different results depending on who ran it.
- Anyone who couldn't write Python couldn't even reach the raw data.

## Approach
- **Fixed the research workflow into nine tabs** — load → preprocess → mine → sentiment → export. Following the tabs in order is the whole analysis.
- Put **synonym, representative-term and stopword dictionaries into saved, reusable rule files** on top of Kiwi morphological analysis, so the criteria live in a file rather than in a person's head.
- Made co-occurrence weighting selectable between count and PMI, and layered **five rule corrections** onto the KNU sentiment lexicon to catch the negation and contrast patterns Korean actually uses.

## Screens

Word cloud — top tokens under period, Top N and sentiment filters. Right-clicking a row in the table on the right sends that word straight to the stopword list.

![Word cloud tab — top token table and the cloud itself](/tm_wordcloud.jpg)

Network — co-occurrence weighted by count or PMI. Search a node, expand it n hops, and drag the layout into shape.

![Network tab — co-occurrence graph with Edges/Nodes tables](/tm_network.jpg)

Sentiment — KNU lexicon scores cut into five levels. The five checkboxes across the top are the rule corrections.

![Sentiment tab — rule correction options and the distribution chart](/tm_sentiment.jpg)

## The Nine Tabs
- **Data load** — reads the first sheet, normalizes column names, and auto-maps roles (date / channel / body text / country code); page types and keywords can be excluded, and the text column set by hand when detection misses
- **Buzz volume** — year / month / week / day aggregation, stacked bars by group, count or %, and click-through from any bar to the underlying posts
- **Text mining** — filters for numbers, punctuation, single characters and Hangul-only, a stopword list, token sampling, and manual AS-IS → TO-BE token correction
- **Preprocessing** — pre-tokenization substitutions plus post-tokenization merge, synonym, representative-term and model-name rules, POS selection (nouns / nouns+adjectives / nouns+verbs / all), and rule sets that save and reload across studies
- **Word cloud** — period, Top N and sentiment filters (all / positive / negative / neutral), random palettes and mask shapes; right-clicking a row in the Top N table sends that word straight to the stopword list
- **Network** — document- or sentence-level co-occurrence, count or PMI weighting, node search with n-hop expansion, drag-to-edit node layout, and Edges/Nodes tables
- **Sentiment** — scores against the KNU Korean sentiment lexicon (`KnuSentiLex`), cut at −1.5 / −0.5 / 0.5 / 1.5 into five levels, with five rule corrections: negation scope, weighting of clauses after contrastive conjunctions, emoticon adjustment, profanity-as-positive intensification, and negation propagation from the previous sentence
- **Sentiment detail** — cross-tabs across period, channel, topic, country and group axes, in count or %, with VoC summaries
- **Export** — seven sheets plus the charts selected on screen as 150dpi PNGs, written into a single workbook

Monthly random downsampling to the smallest month, once enabled in any tab, applies consistently across the rest.

## Tech Stack
Python · PyQt5 · kiwipiepy · vaderSentiment · pandas · NumPy · matplotlib · networkx · wordcloud · openpyxl · PyInstaller (EXE packaging)

## Results
- **Runs without code** — shipped as a PyInstaller EXE, so researchers who don't write Python start analyzing immediately.
- **Reproducible results** — preprocessing rules travel as files, so the same data gives the same answer even when the person running it changes.
- **Straight into the report** — `clean_data`, `buzz_summary`, `word_freq_topN`, `network_nodes`/`network_edges`, `sentiment_records` and `sentiment_summary`, plus chart images, land in one workbook that pastes directly into slides.

## Distribution
Packaged for Windows as `TextMiningTool_KOR.exe` and `TextMiningTool_ENG.exe` via PyInstaller; runs from source on macOS and Linux. Apache License 2.0.

