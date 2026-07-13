---
title: "세그먼트 자동화 도구 — 데스크톱 분석 앱 (EXE)"
date: "2025-11-28"
description: "클릭 기반 세그먼테이션 스튜디오: 변수 가공 → PCA/EFA → 의사결정나무 → Demand Space 맵 + AI 어시스턴트"
tags: ["PyQt6","Segmentation","Demand Space","RAG","자동화"]
---

## 개요
세그먼트 조사는 보통 데이터 정제, 리코딩, 요인분석, 트리 분석, 매핑, 리포팅까지 수많은 수작업이 필요합니다. 이 도구는 그 전체 워크플로를 클릭 기반 GUI로 바꾸고, 드래그 앤 드롭으로 편집하는 **Demand Space** 맵으로 마무리하며, 즉각적인 해석·디버깅을 돕는 **AI 어시스턴트(RAG)** 까지 내장했습니다. 설치가 필요 없는 Windows 실행파일(EXE)로 배포합니다.

## 커버하는 워크플로
- **데이터 & RECODE 정규화** — 워크북의 모든 `RECODE*` 시트를 병합하고 QUESTION/CODE/NAME 컬럼을 정규화, 원문/한글 라벨 모드를 선택하면 이후 분석·UI에 자동 반영
- **변수 만들기** — Binary recode, 그룹핑 맵, 여러 `_seg` 변수를 결합한 최종 세그먼트 키 생성(예: `gender_seg|age_seg`), Min N 필터로 희소 조합 제거
- **요인분석** — 선택적 PCA/EFA, 요인 점수를 세그먼트 유사도 계산에 투입 가능
- **드라이버 분석** — 의사결정나무의 개선도 피벗, Split 상세, 그룹 추천을 제공하며 코드→라벨 매핑 자동 적용
- **Demand Space** — 두 가지 투영 모드: *segments-as-points* (타깃×세그먼트 피벗 → 분포 벡터 정규화 → 거리 → PCA/MDS 2D 좌표 → K-Means/Ward 클러스터), *variables-as-points* (변수 간 상관 기반 거리). 점·라벨 드래그 이동, 클러스터 병합, 자동 라벨 배치 지원
- **Export** — 전처리 데이터, PCA/트리 결과, Demand Space 좌표·클러스터를 엑셀로 저장
- **AI 어시스턴트 / RAG** — OpenAI 또는 Gemini API 키를 넣으면 로드된 데이터와 앱 코드에 대해 질의하며 해석 지원

## 기술 스택
Python · PyQt6 · pyqtgraph · scikit-learn · pandas · PyInstaller(EXE 패키징) · OpenAI/Gemini API

## 효과
며칠 걸리고 실수가 잦던 세그먼테이션 워크플로를 인터랙티브 세션 하나로 줄였고, 코딩을 모르는 리서처도 혼자서 Demand Space 맵과 라벨링된 세그먼트를 만들 수 있게 진입장벽을 낮췄습니다.

## 링크
- Repo: https://github.com/jay-lay-down/auto_segment
- Download: https://drive.google.com/uc?id=1l6dMl6QHx7fJAeh8zL3xPIJX572mtnum&export=download
