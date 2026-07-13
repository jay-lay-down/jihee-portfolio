---
title: "브랜드 점유율(Share%) 예측"
date: "2025-11-28"
description: "Softmax 최적화 + 어텐션 결합 seq2seq LSTM"
tags: ["Seq2Seq","LSTM","Attention","TensorFlow"]
---

## 요약
경쟁 브랜드 간 시장 점유율을 예측하기 위해 Softmax 기반 최적화와 additive attention을 결합한 seq2seq LSTM 모델을 적용했습니다. 점유율의 합이 100%가 되는 제약을 Softmax로 자연스럽게 처리하면서, 경쟁 구도 속 브랜드별 흐름을 함께 예측하는 것이 핵심입니다.

## 기술 스택
Python · TensorFlow/Keras · LSTM seq2seq · Additive Attention · pandas · NumPy

## 링크
- Repo: https://github.com/jay-lay-down/seq2seq_softmax
