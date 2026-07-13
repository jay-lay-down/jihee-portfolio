---
title: "직원 몰입 드라이버 분석 (LPA 파이프라인)"
date: "2025-11-28"
description: "재현 가능한 tidyLPA 파이프라인 — BIC 기반 모델 스윕, 프로파일 배정, 조직 전략 해석"
tags: ["LPA","tidyLPA","Segmentation","R","CLI"]
---

## 개요
조직은 보통 몰입도 조사를 평균으로 읽지만, "평균 3.5점"인 조직 안에는 잘 지내는 그룹, 갈등하는 그룹, 곧 떠날 그룹이 섞여 있습니다. 이 프로젝트는 몰입·이탈 지표(직원 관점/관리자 관점)에 **잠재프로파일분석(LPA)** 을 적용해 직원을 세분화하고, 프로파일별 맞춤 관리 전략으로 연결합니다.

## 파이프라인 엔지니어링
`tidyLPA` 기반의 재현 가능한 CLI 파이프라인으로 구축:

- 모델 파라미터화(1~6) × 프로파일 수(1..K)를 전수 탐색하고 **BIC**로 최적해 선택(동률이면 **Entropy**가 높은 쪽)
- 지표 컬럼 자동 탐지(`ENGAGEMENT_*`, `ATTRITION_*` 또는 한국어 키워드) 또는 `--vars`로 명시 지정
- 선택적 지역별 실행(`--region`) — 지역별 산출물과 통합 요약 제공, 컬럼이 없으면 전체 단일 실행으로 자동 폴백
- 재사용에 필요한 모든 산출물 저장: 전체 해의 적합도 지표, 클래스 배정, 클래스별 평균, BIC 엘보·프로파일 플롯, 재현성용 세션 정보

## 해석
프로파일은 지표 패턴으로 라벨링합니다 — 예: 안정 몰입형, 갈등 취약형(직원-관리자 인식 격차가 큰 그룹), 이탈 위험형. 일괄적인 HR 정책 대신 그룹별 맞춤 개입을 설계할 수 있게 합니다.

## 기술 스택
R · tidyLPA/mclust · dplyr · ggplot2 · optparse(CLI)

## 링크
- Repo: https://github.com/jay-lay-down/LPA_synthetic_vars
- Slides: https://github.com/jay-lay-down/LPA_synthetic_vars/blob/main/assets/LPA_example.pdf
