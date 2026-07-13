---
title: "AI/LLM 페르소나 챗봇 (똘배)"
date: "2025-11-28"
description: "까칠한 절친 컨셉의 한국어 LLM — 3단계 페르소나 파인튜닝, QLoRA, 셀프호스팅 배포"
tags: ["LLM","QLoRA","Unsloth","NEFTune","Transformers","Gradio"]
---

## 개요
똘배는 현실적이고 시니컬하며 위트 있는 절친을 시뮬레이션하는 커스텀 파인튜닝 LLM입니다. 존댓말 쓰는 일반적인 AI와 달리 반말로 대화하고, 인터넷 슬랭을 쓰고, 자기가 AI라는 걸 부정하고, 팩폭도 날리지만 — 논리적으로는 맞는 조언을 해 줍니다. 유료 API 없이, 작은 모델로 대화의 사실감과 일관된 페르소나를 어디까지 구현할 수 있는지 실험한 프로젝트입니다.

## 학습 아키텍처 — 3단계 파이프라인
**Qwen2.5-1.5B-Instruct** 기반, **Unsloth** 사용(학습 속도 약 2배, 메모리 약 60% 절감):

- **Phase 1 · Foundation** — 엑셀로 정제한 구조화 대화쌍으로 표준 SFT를 수행해 기본 대화 형식 학습
- **Phase 2 · Style Transfer** — 실제 채팅 로그에 **NEFTune 노이즈 주입**(alpha 5.0)을 적용해, 말투를 암기가 아니라 일반화된 스타일로 학습
- **Phase 3 · Behavioral Alignment** — 고품질 교정 데이터와 스타일 유지 데이터를 최대 10배 증강해 혼합, 페르소나를 유지하면서 문제 행동 교정

LoRA 설정은 스타일 전이에 맞게 튜닝: rank 64, alpha 128, 어텐션·MLP 프로젝션 전 모듈 적용. 단계별 학습률(2e-4 → 1e-4 → 8e-5)과 weight decay를 따로 조정했습니다.

## 배포
- **QLoRA 4bit** 양자화로 학습하고 **GGUF(q4_k_m)** 로 내보내 저비용 셀프호스팅 서빙
- **Gradio** 채팅 앱으로 Hugging Face Spaces에 배포하고 자체 도메인 연결

## 이 프로젝트가 보여주는 것
- 데이터 큐레이션 → 다단계 파인튜닝 → 양자화 → 익스포트 → 서빙까지 LLM 워크플로 전체를 직접 운영
- 1.5B급 소형 모델에서의 페르소나 제어 — 저렴하게 돌릴 만큼 작으면서, 사람처럼 느껴질 만큼 일관됨

## 링크
- Repo: https://github.com/jay-lay-down/jaychatbot_2nd
- Demo: http://www.duboobanmo.site
- Blog: https://velog.io/@jaylaydown/series/side-project-1
