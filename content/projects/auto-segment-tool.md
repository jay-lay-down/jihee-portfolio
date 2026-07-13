---
title: "Auto Segment Tool — Desktop Analytics App (EXE)"
date: "2025-11-28"
description: "Click-based segmentation studio: variable recoding → PCA/EFA → decision trees → Demand Space maps, with an AI assistant"
tags: ["PyQt6","Segmentation","Demand Space","RAG","Automation"]
---

## Overview
Segmentation studies normally require many manual steps — data cleaning, recoding, factor analysis, tree analysis, mapping, reporting. This desktop tool turns that whole workflow into a click-based GUI, ends with a drag-and-drop **Demand Space** map, and includes an **AI assistant (RAG)** for instant interpretation and debugging. Distributed as a Windows executable that needs no installation.

## Workflow Covered
- **Data & RECODE normalization** — merges all `RECODE*` sheets from the workbook, normalizes QUESTION/CODE/NAME columns, and supports bilingual label modes (original vs Korean) applied downstream automatically
- **Variable building** — binary recodes, grouping maps, and composition of multiple `_seg` variables into a final segment key (e.g. `gender_seg|age_seg`), with a minimum-N filter for sparse combinations
- **Factor analysis** — optional PCA/EFA; factor scores can feed into segment similarity
- **Driver analysis** — decision trees with improvement pivots, split details, and group recommendations, all label-mapped automatically
- **Demand Space** — two projection modes: *segments-as-points* (target × segment pivot → normalized distribution vectors → distance → PCA/MDS 2D coordinates → K-Means/Ward clusters) and *variables-as-points* (correlation-based distances). Points and labels can be dragged, clusters merged, labels auto-placed
- **Export** — preprocessed data, PCA/tree outputs, Demand Space coordinates and clusters, all to Excel
- **AI Assistant / RAG** — plug in an OpenAI or Gemini key and query the loaded data and the app's own code for interpretation help

## Tech Stack
Python · PyQt6 · pyqtgraph · scikit-learn · pandas · PyInstaller (EXE packaging) · OpenAI/Gemini API

## Impact
Reduced a multi-day, error-prone segmentation workflow to an interactive session, and lowered the skill barrier — researchers without coding backgrounds can produce Demand Space maps and labeled segments on their own.

## Links
- Repo: https://github.com/jay-lay-down/auto_segment
- Download: https://drive.google.com/uc?id=1l6dMl6QHx7fJAeh8zL3xPIJX572mtnum&export=download
