# 이름궁합 Planning Document

> **Summary**: 토스 앱 안에서 단 2화면·2기능(보기·공유)으로 동작하는 한글 이름 기반 5차원 궁합 미니앱
>
> **Project**: chosung-gunghap (이름궁합)
> **Version**: 0.1
> **Author**: 본인 (1인 개발)
> **Date**: 2026-05-22
> **Status**: Draft
> **PRD**: [chosung-gunghap.prd.md](../../00-pm/chosung-gunghap.prd.md)

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 토스 활성 사용자 20-30대는 톡방에 던질 30초짜리 콘텐츠를 매일 찾지만, 기존 운세앱은 다운로드·회원가입·고가 결제 마찰이 높아 즉시 소비/공유에 부적합 |
| **Solution** | 화면 2개 · 기능 2개(보기·공유)로 압축된 미니앱. 이름 2개 입력 → 5차원 분석 결과 → "공유하기" 1탭으로 IAP 990원 결제 + 풀결과 + 9:16 카드 + 카톡/인스타 공유까지 한 흐름 처리 |
| **Function·UX·Effect** | 순수 클라이언트(React+TS+Vite), 백엔드 0, 콘텐츠 변수조합 템플릿(LLM 비용 0). 입력 1탭 → 결과 0.5초 → 공유 1탭. 출시 D30 MAU 5만·IAP 전환율 5%·월 매출 248만원 |
| **Core Value** | "30초짜리 대화 시작 트리거" — 토스 디자인 철학(빠르다·쉽다·편하다)을 미니앱 구조 그 자체로 구현. 결제를 "기능"이 아닌 "공유 동작의 한 단계"로 인지시킴 |

---

## Context Anchor

> PRD에서 승계. Design/Do 문서로 자동 전파.

| Key | Value |
|-----|-------|
| **WHY** | 한국 운세시장 1.4조원 중 "초저가·초고빈도·바이럴공유" 세그먼트를 1인 개발자로 점유. 토스 MAU 2,900만 기반 무료 진입로 활용 |
| **WHO** | 1차 비치헤드: 22-25세 여성 대학생(50%) + 직장인 친구 모임(30%) + 트렌드 추종 10대(20%) |
| **RISK** | (1) 검수에서 "사행성/점술" 판정 — 면책 명시·알고리즘 투명성으로 완화 (2) IAP 전환율 1% 미만 — A/B 가격 테스트 (3) 단순 구조로 D7 retention 하락 — 시드 변수(Phase 2) |
| **SUCCESS** | D30: MAU 5만 / IAP 전환율 5% / 월 매출 248만원. D90: MAU 10만 / 월 매출 495만원 / D7 retention 15% |
| **SCOPE** | **In**: 한글 이름 2개 입력, 5차원 알고리즘, 무료+유료 결과 화면, IAP 990원 단일 상품, 9:16 Canvas 카드, 카톡/인스타 공유, TDS 적용. **Out (v1)**: 로그인, 사주/생년월일, 결과 히스토리, 상담사 매칭, 다국어, LLM 생성 |

---

## 1. Overview

### 1.1 Purpose

토스 앱 안에서 다운로드·회원가입 없이 30초 안에 친구와 공유 가능한 이름 궁합 콘텐츠를 제공하고, 단일 IAP(990원)를 통한 마이크로 결제로 수익화한다. 1인 개발자가 6주 내 출시하여 검증한다.

### 1.2 Background

- 한국 운세시장 1.4조원, MZ세대 1인당 연 8만원 소비
- 점신이 앱인토스 입점 후 예상치 6배 DAU 달성 → 카테고리 검증 완료
- 봉봉(Vonvon) 이름궁합 글로벌 2억+ 참가 → 공유 수요 검증 완료
- 앱인토스 IAP 수수료 무료 프로모션 진행 중 (2026-02-28까지)
- 사용자는 토스페이먼츠 간편 사업자 등록 신청 완료, 결과 대기 중

### 1.3 Related Documents

- PRD: `docs/00-pm/chosung-gunghap.prd.md`
- Design (예정): `docs/02-design/features/chosung-gunghap.design.md`
- 앱인토스 공식 IAP 가이드: https://developers-apps-in-toss.toss.im/iap/develop.html
- TDS 컴포넌트: https://developers-apps-in-toss.toss.im/design/components.html

---

## 2. Scope

### 2.1 In Scope

- [ ] 화면 1: 이름 입력 (내 이름 + 친구 이름)
- [ ] 화면 2: 결과 + 공유 (무료/유료 영역 + 단일 CTA)
- [ ] 5차원 알고리즘 (획수법/오행/음양/모음/캐릭터)
- [ ] 결정론적 점수 계산 (동일 입력 = 동일 결과)
- [ ] 무료 콘텐츠 3종 (종합점수·한줄코멘트·오행라벨)
- [ ] 유료 콘텐츠 3종 (분야별 점수 4개·관계 시나리오·고화질 카드)
- [ ] IAP 990원 단일 상품 (`share_unlock_v1`)
- [ ] HTML Canvas 기반 9:16 공유 카드 생성
- [ ] 앱인토스 SDK 공유 다이얼로그 (카톡/인스타/링크 복사)
- [ ] TDS 컴포넌트 일관 적용
- [ ] 면책 디스클레이머 및 약관/개인정보처리방침 페이지

### 2.2 Out of Scope

- 로그인/회원가입 (앱인토스 인증 우회, 익명 사용)
- 사주/생년월일 기반 정통 궁합 (검수 사행성 리스크)
- 결과 히스토리/저장 (개인정보 최소화)
- 상담사 매칭, 1:1 채팅
- 다국어 (한국 시장 집중)
- LLM 호출 (비용/검수 불안정)
- 광고(IAA) — Phase 2로 이연
- 백엔드 서버, 데이터베이스
- 사용자 분석 외부 도구 (앱인토스 콘솔 기본 지표만 사용)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 화면 1에서 한글 이름 2개를 입력 가능. 각 필드 최소 2자, 최대 4자. 한글 외 입력 차단(영문/숫자/이모지/특수문자) | High | Pending |
| FR-02 | "궁합 보기" 버튼 클릭 시 0.5초 이내에 화면 2로 전이하며 점수가 카운트업 애니메이션으로 등장 | High | Pending |
| FR-03 | 5차원 알고리즘 합산 점수 (0-100)와 오행 상성 라벨(상생/중립/상극)을 무료로 표시 | High | Pending |
| FR-04 | 분야별 점수 4개(연애/우정/케미/일상)와 관계 시나리오(3-4문장)는 블러 처리 | High | Pending |
| FR-05 | "공유하기" 버튼 클릭 시 IAP 결제창 자동 호출 (`createOneTimePurchaseOrder`, sku=`share_unlock_v1`) | High | Pending |
| FR-06 | 결제 성공 시 즉시 블러 해제 → 0.5초 페이드 → 카드 자동 생성 → 공유 다이얼로그 호출 | High | Pending |
| FR-07 | 9:16 비율 공유 카드를 HTML Canvas로 생성. 두 이름·점수·한줄코멘트·워터마크·CTA 링크 포함 | High | Pending |
| FR-08 | 앱 시작 시 `getPendingOrders()` 호출하여 미결 주문 자동 복원 (결제 후 앱 종료 케이스 대비) | High | Pending |
| FR-09 | 결제 실패(잔액 부족/취소/네트워크)에 대해 명확한 에러 UI와 복구 가이드 제공 | High | Pending |
| FR-10 | 동일 이름 입력 시 항상 동일 결과 (결정론적) — 친구간 결과 공유 신뢰성 확보 | High | Pending |
| FR-11 | 모든 결과 화면 하단 "재미용 콘텐츠입니다" 면책 디스클레이머 노출 | High | Pending |
| FR-12 | 입력값은 서버 미저장. 메모리에만 보관하고 세션 종료 시 폐기 | High | Pending |
| FR-13 | 욕설/비속어 입력 차단 (한국어 비속어 사전 기반) | Medium | Pending |
| FR-14 | 앱인토스 SDK 2.x 사용 (1.x deprecated 2026-03-23) | High | Pending |
| FR-15 | 약관·개인정보처리방침 페이지 제공 (별도 라우트 또는 모달) | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| **Performance** | 입력→결과 화면 전이 0.5초 이내 | Performance API |
| **Performance** | 카드 생성 1.5초 이내 (저사양 안드로이드 기준) | Performance API |
| **Performance** | 초기 번들 크기 200KB 이하 (gzipped) | Vite build report |
| **Performance** | 100MB 미만 앱 번들 (앱인토스 제한) | granite.config.ts 빌드 결과 |
| **Reliability** | 결제 실패 시 사용자 데이터 손실 없음, 재시도 가능 | 수동 시나리오 테스트 |
| **Reliability** | `getPendingOrders` 호출로 미결 주문 100% 복원 | 강제 종료 시나리오 |
| **Compatibility** | 토스 앱 iOS / Android 모두 동작 | 샌드박스 앱 양 OS 테스트 |
| **Accessibility** | 텍스트 대비 4.5:1 이상 (WCAG AA) | TDS 컬러 토큰 사용으로 자동 충족 |
| **Privacy** | 입력값 서버 미전송 (DevTools Network 탭에서 확인) | 수동 검증 |
| **Security** | XSS 방어 — 사용자 입력은 모두 텍스트로 처리, dangerouslySetInnerHTML 금지 | ESLint react/no-danger |
| **Maintainability** | TypeScript strict mode, ESLint 에러 0 | CI 빌드 |
| **Localization** | 한국어 only (UTF-8) | - |

---

## 4. Success Criteria

### 4.1 Definition of Done (MVP 출시 기준)

- [ ] 모든 P0/High Functional Requirement 구현 완료
- [ ] 양 OS(iOS/Android) 샌드박스에서 전체 플로우 정상 동작
- [ ] IAP 샌드박스에서 결제 성공/실패 케이스 모두 통과
- [ ] 미결 주문 복원 시나리오 검증 (강제 종료 후 재진입)
- [ ] 카드 생성 → 카톡·인스타 공유 양 OS 정상
- [ ] 면책 디스클레이머·약관·개인정보처리방침 모든 화면에서 접근 가능
- [ ] 앱인토스 검수 가이드(checklist) 항목 전체 ✅
- [ ] TDS 컴포넌트만 사용 (커스텀 UI 최소화)
- [ ] eval() 또는 동적 코드 실행 완전 제거 (검수 반려 사유)
- [ ] 첫 검수 제출

### 4.2 Quality Criteria

- [ ] TypeScript 컴파일 에러 0
- [ ] ESLint 에러 0
- [ ] Lighthouse Performance ≥ 90 (모바일)
- [ ] 초기 번들 ≤ 200KB gzipped
- [ ] 알고리즘 단위 테스트 90% 커버리지
- [ ] 결제 플로우 시나리오 테스트 15종 (T-01~T-15) 모두 통과

### 4.3 Business Success (출시 후 30일)

- [ ] MAU 50,000 도달
- [ ] IAP 전환율 5% 이상
- [ ] 월 매출 248만원 이상 (gross)
- [ ] D7 retention 10% 이상
- [ ] K-factor 0.2 이상

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 앱인토스 검수에서 "사행성/점술" 판정 반려 | High | Medium (30%) | "재미용 콘텐츠" 명시, 알고리즘 계산 방식 FAQ 공개, "운명·예언" 단어 금지 |
| 검수 반려 — 인트로 페이지 누락 | Medium | High (50%) | 앱 첫 진입 시 1초 인트로 화면 (로고 + 한 줄 소개) 필수 |
| 검수 반려 — eval() 사용 | Low | Low (10%) | ESLint `no-eval` 활성화, Vite 빌드 시점 검증 |
| 검수 반려 — TDS 미준수 | Medium | Medium (25%) | TDS 컴포넌트만 사용, 커스텀 스타일 최소화 |
| IAP 결제 실패율 5% 초과 | High | Low (15%) | 토스 머니 잔액 확인 가이드, 재시도 버튼 |
| 동일 결과 재현 실패 (비결정론) | High | Low (10%) | 알고리즘 단위 테스트 100% 커버, 시드 외부화 |
| 사업자 등록 지연 (1주+) | Medium | Medium (20%) | Phase 0 작업 병행으로 대기 시간 활용 |
| 단순 구조로 D7 retention < 5% | Medium | High (50%) | Phase 2 시드 변수 우선 구현 준비 |
| 카드 생성이 저사양 안드로이드에서 느림 | Medium | Medium (25%) | OffscreenCanvas 또는 사전 합성, 텍스트 우선 렌더 |

---

## 6. UX Flow Detail (전환 최적화 명세)

> 각 Step마다 **시각 / 인지 / 감정 / 액션 / 마이크로카피 / 심리 원리** 6개 레이어로 명세

### 6.1 화면 1: 입력

#### Step 1-A: 첫 인상 (앱 진입 0.0초 ~ 1.0초)

- **시각**: 토스 미니앱 진입 → 1초 인트로(로고 "이름궁합" + 한 줄 "30초 만에 친구와의 케미를 확인하세요") → 페이드 → 입력 화면
- **인지**: "뭐 하는 앱이지?" → 한 줄로 답
- **감정**: 안심 (토스 브랜드 신뢰) + 기대
- **액션**: 시선이 자연스럽게 첫 입력 필드로 이동
- **마이크로카피**:
  - 좋음: "30초 만에 친구와의 케미를 확인하세요"
  - 나쁨: "한국식 전통 이름풀이 서비스" (지루)
- **심리 원리**: First impression bias — 1초 이내 신뢰 결정

#### Step 1-B: 이름 입력 (1.0초 ~ 사용자 입력 완료)

- **시각**:
  - 화면 상단: 헤드라인 "두 사람의 이름을 알려주세요"
  - 가운데 2개 입력 필드 (TDS TextField)
    - 첫째: placeholder "내 이름" + 인디케이터 "1/2"
    - 둘째: placeholder "친구 이름" + 인디케이터 "2/2"
  - 입력 완료 시 필드 외곽 토스 블루 강조
  - 하단 BottomCTA: "궁합 보기" (비활성 → 양쪽 입력 완료 시 활성)
- **인지**: "내 이름 + 친구 이름이구나" → 즉시 이해
- **감정**: 호기심 점증 ("얼마 나올까?")
- **액션**: 양 필드 입력 → CTA 활성화 → 탭
- **마이크로카피**:
  - 좋음: "두 사람의 이름을 알려주세요"
  - 좋음 CTA: "궁합 보기"
  - 나쁨 CTA: "다음" "시작" (목적 모호)
  - 한글 외 입력 에러: "한글 이름만 가능해요"
  - 빈 입력 가이드: 필드 외곽만 강조, 에러 텍스트 X (마찰 ↓)
- **심리 원리**:
  - Progress indicator (1/2, 2/2) — 완료 욕구 자극
  - Specific CTA verb — "궁합 보기"가 "다음"보다 클릭률 ↑

#### Step 1-C: "궁합 보기" 탭 (탭 → 0.5초)

- **시각**: 버튼 ripple 효과 → 화면 페이드 전환 (0.3초)
- **인지**: "결과 나온다!"
- **감정**: 기대감 최고조
- **액션**: 대기 (스피너 없음 — 0.5초 이내라 불필요)
- **마이크로카피**: 전환 중 텍스트 없음 (속도가 메시지)
- **심리 원리**: Anticipation peak — 결과 직전이 가장 강한 몰입 순간

### 6.2 화면 2: 결과 + 공유

#### Step 2-A: 점수 등장 (0.0초 ~ 0.8초)

- **시각**:
  - 상단 1/3: 두 이름 함께 "혁철 ✕ 민지" (가운데 큰 ✕ 또는 ❤︎)
  - 중앙: 점수 카운트업 애니메이션 (0 → 87점 0.6초)
  - 도달 시 0.2초 살짝 진동 (HapticFeedback if supported)
  - 점수 아래: 한 줄 코멘트 페이드인 ("불꽃 같은 케미!")
- **인지**: "오 몇 점일까?" → 카운트업 → "87점? 꽤 높네?"
- **감정**: 호기심 → 기대 → 살짝 만족
- **액션**: 자연스럽게 스크롤 다운
- **마이크로카피**:
  - 좋음: 점수대별 구체적 코멘트
    - 90+: "운명적 케미!" / "예측불가의 환상 케미!"
    - 70~89: "불꽃 같은 케미!" / "은근 잘 맞는 케미!"
    - 50~69: "익숙한 듯 새로운 케미"
    - 30~49: "정반대 매력 케미"
    - 0~29: "의외의 반전 케미 (낮을수록 흥미진진!)"
  - 나쁨: "당신들은 좋은 궁합입니다" (밋밋·일반적)
- **심리 원리**:
  - Peak-end rule: 결과 첫 순간이 전체 인상 결정
  - Anchoring: 점수가 먼저 = 이후 콘텐츠 가치 결정
  - **부정 결과 방어**: 50점 미만도 긍정 톤 유지 → 낮은 점수도 공유 가능

#### Step 2-B: 무료 영역 노출 (0.8초 ~ 1.5초)

- **시각**:
  - 점수 카드 아래로 오행 상성 라벨 카드 페이드인
    - "🔥 불 × 💧 물 = 격렬한 케미" 형식
    - 상생/중립/상극 3종, 각각 색 토큰 다름
  - 오행 카드 아래에 "왜 이런 점수인가요?" 토글 (탭하면 한 줄 추가 설명)
- **인지**: "왜 이 점수인지 근거 있구나" → 신뢰 ↑
- **감정**: 만족·납득
- **액션**: 더 스크롤
- **마이크로카피**:
  - 오행 라벨: "🔥 불 × 💧 물 = 격렬한 케미"
  - 토글: "왜 이런 점수인가요?" (호기심 자극)
- **심리 원리**: Reasoning provided — 결과에 이유가 있으면 신뢰도 ↑

#### Step 2-C: 유료 영역 (블러) 노출 (1.5초 ~ 사용자 스크롤)

- **시각**:
  - 분야별 점수 4개 카드 그리드 (2x2): 강한 블러 (커널 10px)
  - 각 카드: "🔒" 아이콘 + 분야명만 보임 ("연애", "우정", "케미", "일상")
  - 그 아래 시나리오 텍스트 카드: 첫 줄만 부분 보임 ("두 사람은...")
  - 우측 상단 칩: "공유 시 잠금 해제 🔓"
- **인지**:
  - "어느 분야가 가장 높을까?" → 분야별 호기심
  - "시나리오가 흥미로운데..." → 텍스트 욕구
- **감정**: 호기심 + 약한 좌절감 (커튼 효과)
- **액션**: 시각 동선이 자연스럽게 BottomCTA로 이동
- **마이크로카피**:
  - 좋음 헤더: "둘만 아는 4가지 케미 포인트 👀"
  - 나쁨 헤더: "프리미엄 콘텐츠"
  - 좋음 칩: "공유 시 잠금 해제 🔓" (액션=보상 직결)
  - 나쁨 칩: "990원 결제 후 보기" (가격 먼저 = 마찰)
- **심리 원리**:
  - Curiosity gap (Loewenstein) — 정보 일부 노출
  - Zeigarnik effect — 미완성 정보가 더 강하게 기억
  - "결제" 단어 절대 금지 — 트리거 단어 회피

#### Step 2-D: "공유하기" CTA (스크롤 후 fixed)

- **시각**:
  - 화면 하단 고정 BottomCTA (TDS BottomCTA)
  - Primary 컬러 (토스 블루)
  - 버튼 구성: 메인 텍스트 "공유하기" + 작은 부텍스트 "친구에게 자랑하기 · ₩990"
  - 좌측에 카톡·인스타 아이콘 미니 그룹
  - 위치 절대 변하지 않음 (스크롤 추적)
- **인지**:
  - "결제는 부담스러운데..." → 작은 글씨 가격으로 신뢰
  - "990원? 카페 음료보다 싸네" → 자동 앵커링
- **감정**: 결정 직전 망설임 → "친구에게 자랑"으로 결제 목적이 자신에서 외부로 전이
- **액션**: 1탭 = IAP 결제창 호출
- **마이크로카피**:
  - 좋음: "공유하기  ·  ₩990"
  - 좋음: "친구에게 자랑하기  ·  ₩990"
  - 나쁨: "결제하고 잠금 해제" ← "결제" 단어
  - 나쁨: "구매하기" ← 부담감
- **심리 원리**:
  - Action-oriented verb
  - Price anchoring (숨기지 않음)
  - Social motivation — 결제 목적 외부 전이

#### Step 2-E: 결제 다이얼로그 (탭 → 결제 완료)

- **시각**: 토스 네이티브 IAP 다이얼로그 (앱인토스 SDK가 호출)
- **인지**: "익숙한 토스 결제창이네" → 신뢰
- **감정**: 안심 (네이티브 UI)
- **액션**: 토스 머니/카드로 결제 완료
- **마이크로카피**: 앱인토스 SDK 기본 카피 (커스텀 불가)
- **심리 원리**: Familiarity bias — 토스 결제 UX가 익숙하면 결제 마찰 최소

#### Step 2-F: 결제 완료 → 카드 생성 → 공유 (결제 완료 → 3초)

- **시각**:
  - 블러 영역에 라이트 페이드 (0.3초)
  - 블러 해제 (0.5초 부드러운 전환)
  - 분야별 점수 카운트업 (0.4초 동시)
  - "고화질 카드를 만들고 있어요" 토스트 (1초)
  - 카드 생성 완료 → 카드 프리뷰 + 공유 다이얼로그 자동 호출
- **인지**: "와 풀결과 나왔다" → 즉시 공유 욕구 → "공유 어디로?"
- **감정**: 성취감 → 만족 → 자랑 욕구
- **액션**: 공유 채널 선택 (카톡/인스타/링크 복사)
- **마이크로카피**:
  - 토스트: "카드를 만들고 있어요"
  - 공유 다이얼로그: "어디로 공유할까요?"
- **심리 원리**:
  - Immediate reward — 결제 직후 즉시 보상 = "결제 잘했다" 강화
  - Peak experience — 카운트업 + 카드 생성이 결제 후 절정 순간

### 6.3 전환 레버 체크리스트 (필수 구현 10개)

- [ ] **L-01**: 두 이름이 함께 노출되는 시점 (Step 2-A 첫 0.0초)
- [ ] **L-02**: 점수 카운트업 애니메이션 (0.6초 페이크 텐션)
- [ ] **L-03**: 부정 결과 방어 — 50점 미만 긍정 톤 ("의외의 반전 케미")
- [ ] **L-04**: 블러 강도 정밀 조정 (커널 8-12px sweet spot)
- [ ] **L-05**: 자물쇠 칩 카피 "공유 시 잠금 해제" (액션=보상)
- [ ] **L-06**: BottomCTA 카피 — "공유하기 · ₩990" (결제 단어 금지)
- [ ] **L-07**: 가격 위치 — CTA 안 작게 노출 (숨기지도, 강조하지도 않음)
- [ ] **L-08**: 결제 후 즉시 보상 — 블러 해제 0.5초 + 카드 자동 생성
- [ ] **L-09**: 공유 카드 워터마크 — 로고 + "내 것도 보기" 진입 링크
- [ ] **L-10**: 에러 복구 카피 — 결제 실패 시 도움 제안 ("토스 머니 충전해드릴까요?")

### 6.4 마이크로카피 사전 (Do/Don't)

| 상황 | Do (전환↑) | Don't (전환↓) | 이유 |
|---|---|---|---|
| 메인 CTA | "궁합 보기" | "시작하기" | 목적 명확성 |
| 결제 CTA | "공유하기 · ₩990" | "결제하기" | 트리거 단어 회피 |
| 블러 영역 헤더 | "둘만 아는 케미 포인트 👀" | "프리미엄 콘텐츠" | 호기심 유발 |
| 블러 칩 | "공유 시 잠금 해제 🔓" | "990원 결제 후 보기" | 액션=보상 |
| 낮은 점수 코멘트 | "의외의 반전 케미" | "궁합이 좋지 않습니다" | 부정 회피 |
| 결제 실패 | "토스 머니 충전해드릴까요?" | "결제에 실패했습니다" | 도움 제안 |
| 한글 외 입력 | "한글 이름만 가능해요" | "잘못된 입력입니다" | 친절한 안내 |
| 면책 디스클레이머 | "재미용 콘텐츠예요 😊" | "본 서비스는 점술이 아닙니다" | 가벼운 톤 |
| 진입 카피 | "30초 만에 친구와의 케미를" | "한국식 이름풀이 서비스" | 시간·결과 명시 |

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| Starter | 단순 정적 사이트 | 포트폴리오, 랜딩 페이지 | ☐ |
| **Dynamic** | Feature 모듈 + 외부 SDK | **미니앱, SaaS MVP, IAP 통합** | **☑** |
| Enterprise | DI, 마이크로서비스 | 고트래픽 시스템 | ☐ |

**선정**: Dynamic — 백엔드는 없지만 외부 SDK(앱인토스) 통합 + 다수의 도메인 로직(알고리즘, 카드 생성, IAP)이 있어 feature 기반 모듈화 필요.

### 7.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | React / Vue / Vanilla | **React 18+** | 앱인토스 커뮤니티 주류, 자료 풍부, TDS 친화 |
| Language | TS / JS | **TypeScript (strict)** | 타입 안정성, 알고리즘 검증, 리팩토링 안전 |
| Build Tool | Vite / Webpack / CRA | **Vite** | create-ait-app 기본, 빠른 HMR, 작은 번들 |
| State Mgmt | Context / Zustand / Redux | **Zustand** | 작은 앱에 적합, 보일러플레이트 최소 |
| Routing | React Router / TanStack / 단일 페이지 | **단일 페이지 + 상태 전환** | 화면 2개라 라우터 불필요, 상태로 전환 |
| Styling | Tailwind / CSS Modules / styled | **TDS 컴포넌트 우선 + CSS Modules** | 검수 통과 + 최소 커스텀 |
| Form Handling | react-hook-form / native | **native + useState** | 입력 2개라 라이브러리 과잉 |
| Card Generation | Canvas API / SVG / html2canvas | **HTML Canvas API** | 폰트/이미지 정밀 제어, 결과 안정성 |
| IAP | 앱인토스 SDK 2.x | **`@apps-in-toss/web-framework` IAP** | 공식 SDK 필수, 1.x deprecated |
| Testing | Vitest / Jest / Playwright | **Vitest (단위) + 수동(통합)** | 알고리즘 결정성 검증, 결제는 샌드박스 수동 |
| Lint/Format | ESLint + Prettier | **eslint:recommended + prettier** | 표준 설정 |
| Backend | 없음 | **순수 클라이언트** | 입력값 미저장 원칙, 비용 0 |

### 7.3 Folder Structure (Dynamic Level)

```
chosung-gunghap/
├── src/
│   ├── App.tsx                          # 화면 전환 컨트롤러
│   ├── main.tsx                         # Entry point
│   │
│   ├── features/
│   │   ├── name-input/                  # 화면 1: 입력
│   │   │   ├── NameInputScreen.tsx
│   │   │   ├── useNameInput.ts
│   │   │   └── validators.ts
│   │   ├── result/                      # 화면 2: 결과
│   │   │   ├── ResultScreen.tsx
│   │   │   ├── ScoreDisplay.tsx
│   │   │   ├── BlurredSection.tsx
│   │   │   └── useResult.ts
│   │   └── share/                       # 공유 + 결제
│   │       ├── ShareButton.tsx
│   │       ├── usePayment.ts
│   │       └── useShare.ts
│   │
│   ├── lib/
│   │   ├── algorithm/                   # 5차원 알고리즘
│   │   │   ├── stroke-count.ts          # 획수법
│   │   │   ├── ohaeng.ts                # 오행 상성
│   │   │   ├── yin-yang.ts              # 음양 균형
│   │   │   ├── vowel-harmony.ts         # 모음 조화
│   │   │   ├── character-type.ts        # 캐릭터 유형
│   │   │   ├── compose.ts               # 5차원 합산
│   │   │   └── tests/                   # Vitest unit tests
│   │   ├── canvas/                      # 카드 생성
│   │   │   ├── generate-card.ts
│   │   │   ├── fonts.ts
│   │   │   └── layouts.ts
│   │   ├── iap/                         # IAP wrapper
│   │   │   ├── client.ts
│   │   │   ├── restore-orders.ts
│   │   │   └── types.ts
│   │   └── hangul/                      # 한글 유틸
│   │       ├── extract-jamo.ts
│   │       └── validate.ts
│   │
│   ├── content/                         # 콘텐츠 템플릿 데이터
│   │   ├── one-liners.ts                # 점수대별 코멘트 15+종
│   │   ├── scenarios.ts                 # 시나리오 매트릭스 30+종
│   │   ├── ohaeng-labels.ts             # 오행 상성 라벨
│   │   └── character-traits.ts          # 캐릭터 유형 텍스트
│   │
│   ├── components/                      # TDS 래퍼 + 공용 컴포넌트
│   │   ├── BottomCTA.tsx
│   │   ├── ScoreGauge.tsx
│   │   ├── Disclaimer.tsx
│   │   └── IntroScreen.tsx
│   │
│   ├── store/                           # Zustand
│   │   └── app-store.ts
│   │
│   └── types/
│       ├── result.ts
│       ├── algorithm.ts
│       └── iap.ts
│
├── public/
│   ├── icon.png                         # 미니앱 아이콘
│   ├── thumbnail.png                    # 미니앱 썸네일
│   └── fonts/                           # 카드 생성용 웹폰트
│
├── docs/                                # PDCA 문서
├── granite.config.ts                    # 앱인토스 설정
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### 7.4 State Machine (단일 페이지 상태 전환)

```
[IDLE: 인트로]
  ↓ (1초 후)
[INPUT: 입력 화면]
  ↓ (양 이름 입력 완료 + "궁합 보기" 탭)
[RESULT_FREE: 결과 무료 영역만]
  ↓ ("공유하기" 탭)
[PAYMENT_PENDING: IAP 다이얼로그]
  ├─→ [PAYMENT_SUCCESS] → [RESULT_FULL] → [SHARING] → [SHARED]
  ├─→ [PAYMENT_FAILED: 에러 + 재시도]
  └─→ [PAYMENT_CANCELED: RESULT_FREE로 복귀]

특수 케이스:
- 앱 재진입 시 getPendingOrders() 호출
  → 미결 주문 있으면 [PAYMENT_SUCCESS] 분기로 점프
```

---

## 8. Algorithm Specification

### 8.1 5차원 알고리즘 개요

| 차원 | 입력 | 출력 | 종합 점수 가중치 |
|---|---|---|---|
| 획수법 | 한글 자모 획수 합 | 0-100 | **50%** |
| 오행 상성 | 한글 자음 → 오행 매핑 | 0-100 + 상생/중립/상극 라벨 | **25%** |
| 음양 균형 | 자모 음양 분류 | 0-100 | **10%** |
| 모음 조화 | 양성/음성 모음 비율 | 0-100 | **10%** |
| 캐릭터 유형 | 첫 글자 오행 | 4-6개 카테고리 (점수 아님, 시나리오 생성용) | **5%** (보너스/페널티) |

**종합 점수 공식**:
```
score = 0.50 × 획수점수
      + 0.25 × 오행점수
      + 0.10 × 음양점수
      + 0.10 × 모음점수
      + 0.05 × 캐릭터보정
score = round(score)                  // 0~100 정수
score = clamp(score, 1, 99)           // 절대 0/100은 피함 (사용자 경험)
```

### 8.2 차원 상세 (Design 단계에서 정밀화)

> Design 문서에서 각 차원의 구체적 계산 함수와 매핑 표를 정의. 본 Plan에서는 원리만 명시.

- **획수법**: 한글 자모별 획수표 사용 → 자릿수 합산 반복 → 백분율
- **오행 매핑**:
  - 木: ㄱ, ㅋ, ㄲ
  - 火: ㄴ, ㄷ, ㄹ, ㅌ, ㄸ
  - 土: ㅁ, ㅂ, ㅍ, ㅃ
  - 金: ㅅ, ㅆ, ㅈ, ㅊ, ㅉ
  - 水: ㅇ, ㅎ
  - 상생: 木→火→土→金→水→木 (인접하면 100, 한 칸 이상 멀면 점수 ↓)
  - 상극: 木↔土, 火↔金, 土↔水, 金↔木, 水↔火
- **음양**:
  - 양: ㅏ, ㅗ, ㅑ, ㅛ, ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅅ
  - 음: ㅓ, ㅜ, ㅕ, ㅠ, 그 외 자음
- **모음 조화**: 양성-양성 또는 음성-음성 매칭 시 ↑, 혼합 시 중간, 모순 시 ↓
- **캐릭터 유형**: 木→리더형, 火→열정형, 土→안정형, 金→완벽형, 水→유연형

### 8.3 결정론성 보장

- 모든 입력값은 NFC 정규화 → 동일 한글 시퀀스 보장
- 부동소수점 사용 시 마지막에 round() — Math.random() 절대 사용 안 함
- 시드 없음 (Phase 2에서 시드 변수 도입 예정)

### 8.4 분야별 점수 4종 (연애/우정/케미/일상)

| 분야 | 가중 조합 |
|---|---|
| **연애** | 음양 균형 ↑ + 모음 조화 ↑ + 오행 상생 보너스 |
| **우정** | 오행 상생/중립 ↑ + 캐릭터 같은 카테고리 보너스 |
| **케미** | 캐릭터 매칭 ↑ + 모음 대비 |
| **일상** | 획수법 ↑ + 음양 안정 |

각각 0-100 정수, 종합 점수 ±20점 이내로 보정 (극단 회피).

---

## 9. Content Template System

### 9.1 한 줄 코멘트 매트릭스 (무료 노출)

- 점수 5구간 × 오행 5종 = **25개 코멘트**
- 형식: 짧고 구체적이며 이미지화된 단어 1-2개 포함
- 예시:
  - (90+, 木×木): "쌍둥이처럼 통하는 케미"
  - (70-89, 火×水): "불꽃과 폭우의 격렬한 케미"
  - (50-69, 土×金): "오래 가는 든든한 케미"
  - (30-49, 木×金): "정반대의 끌림"
  - (0-29, 火×火): "불꽃 튀는 반전 케미"

### 9.2 분야별 점수 라벨 (유료)

각 분야 0-100 점수에 짧은 라벨 (점수만 보여주는 게 아니라 한 줄 설명 동반)

- 연애 92: "운명적 끌림"
- 우정 75: "베스트 프렌드 가능성"
- 케미 60: "은근 잘 맞음"
- 일상 50: "평범하지만 편함"

### 9.3 관계 시나리오 텍스트 (유료, 3-4문장)

변수 조합형 — 다음 변수 슬롯을 채워 생성:

```
[NAME1]은 {{c1_trait}}이고, [NAME2]는 {{c2_trait}}이라
이 둘은 {{relation_pattern}} 관계예요.
처음엔 {{first_impression}}, 시간이 지나면 {{long_term}}.
{{advice_one_liner}}
```

각 슬롯에 5-10개 후보 → 조합 수십~수백 가지.

### 9.4 콘텐츠 작성 워크플로 (AI 초안 + 검수)

1. 본 Plan 승인 후 별도 콘텐츠 작업 세션
2. Claude/GPT에 톤·구조 가이드 + 변수 슬롯 정의를 입력
3. 점수 5구간 × 오행 5종 × 분야 4개 = 100개 시드 텍스트 생성
4. 사용자가 1차 검수 → 톤·표현 통일
5. `src/content/*.ts` 파일에 데이터 구조로 저장 (LLM 호출 없음, 정적)
6. 부정 결과 보호 검사 — 50점 미만 코멘트가 모두 긍정 톤인지 확인

---

## 10. Convention Prerequisites

### 10.1 To Define

| Category | Rule |
|----------|------|
| **Naming** | 컴포넌트 PascalCase, 훅 useXxx, 유틸 camelCase, 타입 PascalCase |
| **Folder** | feature-first (도메인별 폴더 안에 컴포넌트·훅·로직 함께) |
| **Import order** | 1) React 2) 외부 라이브러리 3) 앱인토스 SDK 4) 내부 `lib/` 5) 내부 `features/` 6) 스타일/이미지 |
| **Env vars** | `VITE_` 접두사 (Vite 규약), `VITE_IAP_SKU=share_unlock_v1`, `VITE_PAYMENT_ENABLED=false/true` |
| **Error handling** | try/catch는 IAP·Canvas·외부 SDK 호출에만. 알고리즘은 throw 금지 (절대 실패하면 안 됨) |
| **Comment policy** | 알고리즘 차원별 1-2줄 주석만, UI는 주석 X |

### 10.2 Environment Variables

| Variable | Purpose | Scope | Default (dev) |
|----------|---------|-------|---------------|
| `VITE_IAP_SKU` | IAP 상품 ID | Client | `share_unlock_v1` |
| `VITE_PAYMENT_ENABLED` | 결제 활성화 (사업자 등록 전 false) | Client | `false` |
| `VITE_APP_VERSION` | 앱 버전 | Client | package.json 참조 |

### 10.3 Dependencies (정밀)

> 공식 문서(`tossmini-docs.toss.im/tds-mobile/start/`) 기준 peer deps 포함

```json
{
  "dependencies": {
    "@apps-in-toss/web-framework": "^2.6.0",
    "@toss/tds-mobile": "^2.3.0",
    "@toss/tds-mobile-ait": "^2.3.0",
    "@toss/tds-colors": "^0.1.0",
    "@emotion/react": "^11.14.0",
    "es-hangul": "^2.3.8",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@ait-co/devtools": "latest",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.7.2",
    "vite": "^6.2.0",
    "vitest": "^2",
    "eslint": "^9.21.0",
    "prettier": "^3.4.2"
  }
}
```

> 추가된 패키지: **`es-hangul`** (한글 자모 분해, 토스 공식 라이브러리, 별 1,800) — **`@ait-co/devtools`** (브라우저에서 앱인토스 SDK 시뮬레이션, IAP까지 mock 가능)
>
> 설치 시 주의: `@ait-co/devtools`는 peer 충돌로 `--legacy-peer-deps` 플래그 필요

### 10.4 TDS Provider 설정 (필수)

```tsx
// src/main.tsx
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';

createRoot(document.getElementById('root')!).render(
  <TDSMobileAITProvider>
    <App />
  </TDSMobileAITProvider>
);
```

### 10.5 TDS 컴포넌트 매핑표

| 우리 화면 요소 | TDS 컴포넌트 | 비고 |
|---|---|---|
| 화면 1 헤드라인 | `Top` + `Top.TitleParagraph` | 페이지 타이틀 표준 |
| 이름 입력 필드 | `TextField` | label 연결 필수 (a11y) |
| 화면 1 BottomCTA | `FixedBottomCTA` | 키보드 올라올 때 같이 상승 |
| 화면 2 점수 헤더 | `Top` + `Top.TitleParagraph` (size 28) | t1 타이포 |
| 오행 라벨 | `Badge` (variant="fill") | 오행별 컬러: 木=green / 火=red / 土=yellow / 金=grey / 水=blue |
| 분야별 점수 행 | `ListRow` + `ListRow.Texts` | border="indented" |
| 섹션 구분선 | `Border` | variant="height16" |
| 토스트 "카드 만드는 중" | `Toast` + `useToast` | duration=3000, position="bottom" |
| 약관·개인정보 모달 | `Modal` + `Modal.Overlay` + `Modal.Content` | open/onOpenChange 제어 |
| 공유 다이얼로그 | `BottomSheet` | 카톡/인스타/링크복사 옵션 |
| 면책 디스클레이머 | `Paragraph` | typography="t7" 작게 |
| 아이콘 (자물쇠 등) | `Asset` | name prop으로 지정 |
| 인트로 화면 | `Top` + `Paragraph` + 이미지(`Asset`) | 1초 페이드 후 자동 전환 |

### 10.6 TDS에 없어 직접 구현할 4종 (커스텀)

| 항목 | 구현 방식 | 위치 |
|---|---|---|
| **점수 카운트업 게이지** | `ProgressBar` 베이스 + `requestAnimationFrame`으로 0.6초 카운트업 | `components/ScoreGauge.tsx` |
| **유료 영역 블러 오버레이** | CSS `filter: blur(10px)` + `backdrop-filter: blur(10px)` | `components/BlurOverlay.tsx` |
| **9:16 공유 카드** | HTML Canvas API (1080×1920 px) | `lib/canvas/generate-card.ts` |
| **오행 → TDS 컬러 매핑 유틸** | 오행 5종을 `colors.greenXXX/redXXX/...`로 변환 | `lib/ohaeng-to-color.ts` |

커스텀 4종 모두 **TDS 디자인 토큰(colors, typography) 위에서** 만들어 일관성 유지. 검수 통과에 무리 없음.

### 10.7 Build & Bundle (번들 제출 절차)

```bash
# 1) 로컬 개발
npm run dev                              # vite dev 서버

# 2) 토스앱 샌드박스 테스트 (필수, 양 OS 모두)
# - 같은 WiFi에서 샌드박스 앱이 로컬 dev 서버를 미러링

# 3) 프로덕션 빌드
npm run build                            # vite build → dist/ → granite가 .ait 패키징

# 4) 콘솔 업로드
# 앱인토스 콘솔 → "앱 출시" → 번들 업로드 → "검토 요청하기"
# - 번들 크기 100MB 이하 (압축 해제 기준)
# - 검토 영업일 최대 3일
# - 반려 시 "반려사유 보기" → 수정 → 재제출 (재검토는 보통 더 빠름)
```

**granite.config.ts 주요 설정**:

```typescript
export default defineConfig({
  appName: 'ireum-gunghap',                  // 콘솔에 등록한 appName과 일치
  brand: {
    displayName: '이름궁합',
    primaryColor: '#3182F6',                 // 토스 블루
    icon: 'https://.../icon.png',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite dev',
      build: 'vite build',
    },
  },
  permissions: [],                            // 추가 권한 없음 (입력값 미저장)
  outdir: 'dist',
});
```

**CORS 도메인** (TDS Provider가 자동 처리하나 참고):
- 실환경: `https://ireum-gunghap.apps.tossmini.com`
- QR 테스트: `https://ireum-gunghap.private-apps.tossmini.com`

---

## 11. Toss Console Submission Material

> 앱인토스 콘솔에 미니앱을 검수 제출할 때 입력하는 필드들의 초안. 검수 통과를 위해 "재미용"·"개인정보 미저장"·"두 기능만"을 명확히.

### 11.1 앱 기본 정보

| 항목 | 내용 |
|---|---|
| **앱 이름** | 이름궁합 |
| **영문 표기** | Ireum Gunghap |
| **앱 카테고리** | 엔터테인먼트 > 운세/궁합 (재미용) |
| **연령 등급** | 전체 이용가 |
| **언어** | 한국어 |
| **개발자 표시명** | (사업자명 또는 본인 닉네임) |

### 11.2 한 줄 소개 (검색·홈 노출용)

```
내 이름과 친구 이름으로 30초 만에 케미 점수를 확인하고 공유해보세요
```

### 11.3 상세 설명 (미니앱 상세 페이지)

> 토스 공식 예시 포맷 준수 — 입력 → 결과 → 추가 액션 → 외부 연결 4단 구조, "~해요" 친근체, 마크다운/이모지 미사용

```
이름궁합

내 이름과 친구 이름을 입력하면 두 사람의 궁합 점수를 바로 보여줘요. 결과 화면에서 종합 점수와 한 줄 코멘트, 오행 상성 라벨을 무료로 확인할 수 있어요. 공유하기 버튼을 누르면 연애·우정·케미·일상 4가지 분야별 점수와 두 사람의 관계 해석이 잠금 해제돼요. 결과가 마음에 들면 자동으로 만들어진 공유 카드를 카톡이나 인스타에 바로 보낼 수 있어요.
```

**보조 안내 문구** (필요 시 상세 페이지 하단 또는 FAQ에 별도 배치):

- 무엇이 무료이고 무엇이 유료인가요? — 무료: 종합 점수, 한 줄 코멘트, 오행 상성 라벨 / 유료(990원): 분야별 점수 4개, 관계 시나리오, 고화질 공유 카드
- 개인정보는요? — 입력한 이름은 서버에 저장하지 않아요. 화면을 닫으면 모두 사라져요.
- 알아두세요 — 본 서비스는 재미용 콘텐츠예요. 점술이나 운명 예언이 아니에요.

### 11.4 키워드/검색 태그

```
이름궁합, 궁합, 케미, 친구궁합, 커플궁합, 30초궁합, 이름테스트,
인스타스토리, 카톡공유, 이름풀이, 오행, 한국식이름궁합
```

### 11.5 인트로 페이지 (앱 첫 진입 1초)

- 화면: 로고 "이름궁합" 중앙 정렬
- 부제: "30초 만에 친구와의 케미를 확인하세요"
- 하단 작은 글씨: "재미용 콘텐츠"
- 1초 후 자동 페이드 → 입력 화면

> ⚠️ 인트로 페이지 누락은 검수 반려 사유 (커뮤니티 사례). 반드시 포함.

### 11.6 검수 가이드 자체 체크리스트

- [ ] 인트로 페이지 존재 (서비스 한 줄 소개)
- [ ] 모든 결과 화면에 "재미용 콘텐츠" 디스클레이머
- [ ] "운명·예언·점술" 단어 사용 0회
- [ ] **"토스 포인트로 결제" / "포인트 차감" / "포인트 결합" 표현 0회** (D-16 정책 위반)
- [ ] 사주/생년월일 등 사행성 콘텐츠 0
- [ ] eval() / 동적 코드 실행 0 (ESLint 검증)
- [ ] TDS 컴포넌트로 모든 UI 구성
- [ ] 약관·개인정보처리방침 페이지/모달 존재
- [ ] 입력값 서버 미전송 (DevTools Network 탭 검증)
- [ ] iOS / Android 양 OS에서 정상 동작
- [ ] IAP 미결 주문 복원 동작 (`getPendingOrders` + `completeProductGrant`)
- [ ] `processProductGrant` 콜백에서 항상 `true` 반환 확인 (SKU mismatch 403 회피)
- [ ] 앱 이름 영문 표기 규칙 준수
- [ ] **통신판매업 신고증 출력/보관 완료** (정부24 발급 후 7일 내 PDF 저장)

### 11.7 약관·개인정보처리방침 핵심 문구

**서비스 이용약관 핵심**:
- 본 서비스는 엔터테인먼트 목적의 재미용 콘텐츠입니다
- 결과는 통계적/전통적 알고리즘에 의한 것이며 실제 운명·예언과 무관
- IAP 결제는 토스페이먼츠를 통해 처리됩니다
- 환불 정책: 결제 후 7일 이내, 카드 미생성 시 환불 가능

**개인정보처리방침 핵심**:
- 수집 정보: 사용자가 입력한 이름 (세션 내 메모리만, 서버 미전송)
- 보관 기간: 화면 종료 시 즉시 폐기
- 제3자 제공: 없음
- 결제 정보: 토스페이먼츠가 처리, 본 서비스는 결제 결과(성공/실패)만 수신

### 11.8 IAP 상품 등록 정보 (콘솔)

> 등록 메뉴: 콘솔 → 앱 선택 → 인앱 결제 → 상품 관리 → 상품 등록

| 항목 | 내용 |
|---|---|
| **상품 ID (SKU)** | `share_unlock_v1` |
| **상품명** | 공유 잠금 해제 |
| **상품 설명** | 분야별 점수 4개 + 관계 시나리오 + 고화질 공유 카드 + 친구 공유 기능 |
| **유형** | **비소모품 (non-consumable)** — 한 번 구매로 영구 공유 권한 (D-17) |
| **공급가 (VAT 제외)** | **455원** (= 500 ÷ 1.1, 반올림) |
| **판매가** | **500원** (소비자가, 990원→500원 하향 D-01) |
| **상품 이미지** | **1024×1024px PNG 필수** |
| **노출 여부** | **ON** (샌드박스에서도 노출 ON이어야 `getProductItemList` 조회 가능) |
| **노출 명칭** | "공유하기" (UI에서 보이는 텍스트) |
| **금지 표현** | "토스 포인트로 결제" / "포인트 차감" / "포인트 결합" 모두 금지 (D-16) |

### 11.9 콘솔 가입 절차 (사업자 승인 후 순서)

```
1. 콘솔 → 워크스페이스 → 파트너 정보 → 사업자 정보
   → 사업자등록증 PDF 업로드 → 검토 요청
   ⏱ 영업일 1-2일

2. 콘솔 → 파트너 정보 → 정산 정보
   → 계좌번호 + 예금주명 (한 글자도 틀리면 안 됨) → 검토 요청
   ⏱ 영업일 2-3일

3. 인앱결제 약관 동의

4. 콘솔 → 앱 → 인앱 결제 → 상품 관리 → 상품 등록 (§11.8 필드)

5. 샌드박스 앱 다운로드 + 3가지 IAP 시나리오 테스트
   - 결제 성공 → 즉시 잠금 해제
   - 결제 후 서버 실패 → 앱 재실행 시 getPendingOrders 복원
   - 에러 케이스 (네트워크/취소/내부 오류)

6. 정식 출시 검수 요청 (영업일 1-3일)
```

### 11.10 정산 정보 (참고용)

| 항목 | 값 |
|---|---|
| **수수료** | 앱마켓 15% + 토스 5% = **약 20%** (2026-05 기준) |
| **990원당 실수령** | 약 **805원** |
| **정산 주기** | 결제월 +1월 5일 내역 확정 → 같은 달 말 영업일 입금 |
| **최소 정산** | 5,000원 (미달 시 이월) |
| **부가세** | 토스가 처리 (소비자 부담 포함) |
| **종합소득세** | 다음 해 5월 본인 신고 |
| **환불** | Android: 콘솔 "환불 내역" 처리 / iOS: 토스 앱에서 자동 처리 |
| **수수료 무료 프로모션** | 2026-02-28 종료된 것으로 보임 (콘솔 채널톡 직접 확인 권장) |

---

## 12. Impact Analysis

> 신규 프로젝트이므로 기존 자원에 미치는 영향 없음. 향후 Phase 2 변경 시 본 섹션 갱신.

### 12.1 Changed Resources

신규 프로젝트 (Greenfield) — 변경할 기존 자원 없음.

### 12.2 외부 의존성 영향

| Resource | Impact |
|---|---|
| 앱인토스 SDK | 2.x 사용. 1.x deprecated 2026-03-23 — 영향 없음 |
| 토스페이먼츠 IAP | 단일 SKU 사용, 표준 API만 호출 |
| 토스 사업자 등록 | 결과 대기 중. 승인 전까지 `VITE_PAYMENT_ENABLED=false`로 mock 처리 |

---

## 13. Next Steps

1. [ ] Plan 검토·확정 (본 문서)
2. [ ] `/pdca design chosung-gunghap` — Design 문서 작성 (3가지 아키텍처 옵션 비교 + 모듈 분할)
3. [ ] Design 확정 후 `/pdca do chosung-gunghap` — 구현 시작
4. [ ] 사업자 등록 승인 도착 시:
   - 앱인토스 콘솔 IAP 상품 등록
   - `.env`에 `VITE_PAYMENT_ENABLED=true`
   - 샌드박스에서 결제 테스트
5. [ ] 콘텐츠 템플릿 작성 (AI 초안 → 본인 검수, 100개 시드)
6. [ ] 검수 제출 전 자체 체크리스트(§11.6) 전체 통과 확인

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-22 | Initial Plan based on PRD v2.0.0. 4 architecture decisions (client-only, Canvas, AI templates, React+TS+Vite). UX Flow Detail 6-layer spec for 2 screens. Toss console submission material §11. | 본인 + Claude |
