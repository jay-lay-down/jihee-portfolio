---
title: "베이지안 Norm 기반 브랜드 이미지 평가"
date: "2025-11-28"
description: "소셜 + 설문 데이터 증강 기반 브랜드 이미지 평가 체계"
tags: ["NLP","Bayesian","트래킹","VBA"]
---

## 요약
온라인 리뷰 등 소셜(정성) 데이터와 설문(정량) 데이터를 결합·증강해 브랜드 이미지를 평가하는 체계를 만들고, 결과를 대시보드로 구성했습니다. 소표본에서도 왜곡을 줄이고 통계적 설명력을 높이는 것이 목표였습니다.

## 기술 스택
Python · pandas · scikit-learn · NLP (KoNLPy/spaCy) · PyMC · VBA

## 성과
- 반복적인 재학습·재조사 필요를 줄인 재사용 가능한 파이프라인으로 구성
- 트래킹형 조사에 맞는 시계열 누적이 가능해져, 브랜드 인사이트를 지속적으로 축적

## 링크
- Repo: https://github.com/jay-lay-down/bayesian_norm
- Blog: https://velog.io/@jaylaydown/BayesianAdjectiveNorm
- Dashboard: https://github.com/jay-lay-down/bayesian_norm/blob/main/assets/bayesian_norm_fin.xlsm
