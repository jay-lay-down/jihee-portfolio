---
title: "AI/LLM-powered Persona Chatbot (Ddolbae)"
date: "2025-11-28"
description: "A sassy Korean best-friend LLM — 3-phase persona fine-tuning, QLoRA, self-hosted deployment"
tags: ["LLM","QLoRA","Unsloth","NEFTune","Transformers","Gradio"]
---

## Overview
Ddolbae (똘배) is a custom fine-tuned LLM that simulates a realistic, cynical, and witty close friend. Unlike standard polite assistants, it speaks in Banmal (casual Korean), uses slang, denies being an AI, and roasts you — while still giving logically sound advice. The goal was to test how far a small model can go in conversational realism and consistent persona, without any paid API.

## Training Architecture — the 3-Phase Pipeline
Built on **Qwen2.5-1.5B-Instruct** with **Unsloth** (≈2x faster training, ~60% less memory):

- **Phase 1 · Foundation** — standard SFT on structured conversation pairs (Excel-curated) to teach the base dialogue format
- **Phase 2 · Style Transfer** — training on raw chat logs with **NEFTune noise injection** (alpha 5.0) so the informal tone generalizes instead of being memorized
- **Phase 3 · Behavioral Alignment** — mixed high-quality correction data and style-maintenance data with up to 10x augmentation, to fix failure modes while keeping the persona

LoRA configuration was tuned for style transfer: rank 64, alpha 128, applied across all attention and MLP projection modules. Per-phase learning rates (2e-4 → 1e-4 → 8e-5) and weight decay were separately tuned.

## Deployment
- Quantized with **QLoRA 4-bit** for training and exported to **GGUF (q4_k_m)** for cheap self-hosted serving
- Shipped as an interactive **Gradio** chat app on Hugging Face Spaces, connected to its own domain

## What This Demonstrates
- End-to-end LLM workflow ownership: data curation → multi-phase fine-tuning → quantization → export → serving
- Persona control in a 1.5B-parameter model — small enough to run cheaply, consistent enough to feel like a person

## Links
- Repo: https://github.com/jay-lay-down/jaychatbot_2nd
- Demo: http://www.duboobanmo.site
- Blog: https://velog.io/@jaylaydown/series/side-project-1
