---
title: "수요예측 — SARIMAX + R 패키지"
date: "2025-11-28"
description: "외생변수 최적화 SARIMAX: Elastic-Net vs PCA 파이프라인 비교, 설치형 R 패키지로 배포"
tags: ["시계열","SARIMAX","Granger","Elastic-Net","R 패키지"]
---

## 개요
대형 가전(MDA) 시장 수요예측 시스템으로, **외생변수 선택을 핵심 문제로** 정의했습니다. 후보 시장 지표가 85개나 되면 전부 SARIMAX에 넣으면 과적합되고, 감으로 고르면 재현이 안 됩니다. 두 개의 경쟁 파이프라인을 만들어 백테스트로 비교하고, 설치 가능한 R 패키지로 만들었습니다.

## 두 가지 변수 최적화 파이프라인
- **Elastic-Net 파이프라인** — Elastic-Net 회귀로 후보 변수를 선택한 뒤, **Granger 인과성 검정**을 통과한 변수와 최적 시차만 모델에 투입
- **PCA 파이프라인** — 85개 지표를 소수의 주성분으로 압축한 뒤, 동일한 Granger + 최적 시차 필터를 거쳐 SARIMAX에 투입

비교 러너가 두 파이프라인을 끝까지 실행해 정확도 비교 테이블을 출력하고, 방법론별 예측 워크북을 내보냅니다.

## R 패키지 엔지니어링
두 파이프라인을 `remotes::install_github`로 설치 가능한 패키지(`regforecast`, `pcaforecast`)로 배포했습니다. `run_pipeline()` 함수 하나로 실행(데이터 경로, 품목군, 예측 기간, 백테스트 구간, 유의수준 지정). devtools · roxygen2 · testthat 기반.

## 성과
- 품목군 평균 **MAPE 0.9~7.5%**, **MASE 0.3~0.8** 달성
- 연산량 증가에도 AICc를 ±5 이내로 유지 — 안정성을 잃지 않는 정확도 개선
- 부서 표준 예측 방법론으로 정착, 동일 방법론으로 고객사 대상 5개년 시나리오 예측 지원

## 링크
- Repo: https://github.com/jay-lay-down/demand_forecasting
- Slides: https://github.com/jay-lay-down/demand_forecasting/blob/main/assets/Example_Forecasting%20Projects.pdf
