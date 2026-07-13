---
title: "브랜드 점유율(Share%) 예측 (Seq2Seq + Attention)"
date: "2025-11-28"
description: "점유율 제약을 반영한 예측: Granger 검증 외생 시차 + additive attention 결합 LSTM 인코더-디코더"
tags: ["Seq2Seq","LSTM","Attention","Granger","TensorFlow"]
---

## 개요
시장 점유율은 일반 시계열과 결정적으로 다릅니다: **경쟁 브랜드들의 점유율 합이 항상 100%** 여야 합니다. 이 프로젝트는 그 제약 아래에서 브랜드별 점유율을 예측하며, 통계적 인과성 검증과 어텐션 기반 Seq2Seq 아키텍처를 결합했습니다.

## 파이프라인
원본 데이터 → 자동 스키마 인식(날짜, `*Share` 타깃, 외생변수 컬럼) → 점유율 **로짓 변환** → **Granger 인과성 검정**으로 통계적으로 유의한 시차 효과를 가진 외생변수만 유지 → forward-shift 시차 생성 + tail-ARIMA 연장(예측 시점에 미래 영향 시차가 존재하도록) → 시퀀스 구성.

## 모델
- **additive attention**을 얹은 LSTM **인코더-디코더**
- **이중 아키텍처 비교**: Softmax 출력 헤드(구조적으로 합=1 보장) vs 사후 합-정규화 — 제약을 네트워크 안에 심는 것과 나중에 고치는 것 중 무엇이 나은지 검증
- 월 단위 예측을 2026년 말까지 연장하는 다단계 시나리오 예측

## 기술 스택
Python · TensorFlow/Keras · statsmodels(Granger) · pandas · NumPy · Colab 퀵스타트 제공

## 이 프로젝트가 보여주는 것
계량경제학적 엄밀함(인과성 검증된 피처, 로짓 공간)과 딥러닝 아키텍처 설계를, 강한 구조적 제약이 있는 비즈니스 지표에 결합하는 능력.

## 링크
- Repo: https://github.com/jay-lay-down/seq2seq_softmax
