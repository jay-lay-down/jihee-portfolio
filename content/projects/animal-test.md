---
title: "Social Animal Type Test (Metacognition & Situation Reading)"
date: "2025-11-28"
description: "An 11-type social persona test — from psychological framework to scoring logic, UI, and live deployment"
tags: ["Gradio","HTML/CSS","UX","Psychometrics","Deployment"]
---

## Overview
An interactive web test that maps real-world social behavior onto 11 "social animal" types. It started from a question many people have at work: *"I think I read the room well — so why do my relationships keep going sideways?"*

## Psychological Framework
The test is built on two distinct axes rather than a single "social skill" score:

- **Metacognition** (Flavell, 1979) — do you know how you come across, what you know, and what you don't?
- **Situational judgment** (Thorndike's social intelligence, 1920) — can you read what is actually happening around you: intent, timing, context?

The Dunning–Kruger asymmetry ("the person making the mistake is the last to know") is exactly the gap between these two axes, and the 11 types are combinations of where someone sits on each.

## Product Design
- Designed the question set and a custom scoring algorithm mapping response patterns to the two axes and then to 11 types
- Built the UI with Gradio plus heavy CSS customization and dynamically generated HTML for the result cards
- Privacy by design: nothing is stored beyond gender / age band / item responses

## Deployment
Deployed on Hugging Face Spaces and connected to a custom domain (`myanimaltest.site`) — a live service that collects and analyzes user responses.

## Links
- Repo: https://github.com/jay-lay-down/animal_test
- Demo: https://myanimaltest.site/
- Space: https://huggingface.co/spaces/Jay1121/animal_test
