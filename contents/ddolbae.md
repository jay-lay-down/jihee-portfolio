---
title: "AI/LLM-powered Analytics Chatbot"
date: "2025-11-28"
description: "Persona fine-tuning + self-hosting"
tags: ["LLM","Finetuning","QLoRA","Gradio"]
---

## Summary
👿 AI assistant? No. I'm your childhood friend who just happens to live in GPU.

## Tech Stack
Python · PyTorch · Transformers · QLoRA · bitsandbytes · Hugging Face Hub · Gradio

## Project Impact
- 정교한 페르소나 주입: 1.5B 소형 모델의 한계를 극복하고, 특정 페르소나를 이식하는 소형 LLM 학습 & 파인튜닝
- SLM 최적화: 1.5B 모델을 경량화(Quantization)하여 GPU 리소스가 제한된 환경에서도 구동 가능하도록 최적화
- 비용 효율성 확보: 상용 API(GPT-4 등) 의존 없이 자체 호스팅이 가능하여, 트래픽 증가에 따른 운영 비용을 '0원'으로 절감

## Key Takeaways
- Custom Chatbot: 특정 캐릭터 or 브랜드 보이스(Tone & Manner) 파인튜닝 파이프라인 구축
- 운영 비용 절감: 토큰 과금 API가 아닌 자체 모델 운영으로 장기 비용 절감
- 확장 가능성: 엔터테인먼트/게임 NPC/퍼스널 봇 등 맞춤형 AI 적용 가능

## Links
- Repo: https://github.com/jay-lay-down/jaychatbot_2nd
- Demo: http://www.duboobanmo.site
- Blog: https://velog.io/@jaylaydown/series/side-project-1
