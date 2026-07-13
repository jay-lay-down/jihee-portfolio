---
title: "세그먼트 자동화 도구 – 데스크톱 앱 (EXE)"
date: "2025-11-28"
description: "PCA → 의사결정나무 세분화 → 엑셀 자동 리포트"
tags: ["PySide6","Segmentation","자동화","PyInstaller"]
---

## 요약
데이터 로딩, PCA, 의사결정나무 기반 세분화, 시각화, 엑셀 리포트 생성까지 — 여러 단계가 필요하던 세그먼트 분석을 데스크톱 GUI에서 몇 번의 클릭으로 끝내는 분석 자동화 도구입니다.

## 기술 스택
Python · PySide6 · Scikit-learn · Pandas · 엑셀 자동화 · PyInstaller

## 주요 기능
- 원본 데이터 정제와 요인 라벨링 자동화
- PCA 설정과 요인 산출물 저장
- 의사결정나무 로직으로 세그먼트 생성·라벨링
- 엑셀 리포트 자동 생성
- 설치가 필요 없는 실행파일(EXE) 형태로 배포

## 링크
- Repo: https://github.com/jay-lay-down/auto_segment
- Download: https://drive.google.com/uc?id=1l6dMl6QHx7fJAeh8zL3xPIJX572mtnum&export=download
