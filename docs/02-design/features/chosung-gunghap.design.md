# 이름궁합 Design Document

> **Summary**: React+TS+Vite 클라이언트 전용 미니앱. features/ + lib/ + content/ + zustand store의 Pragmatic 아키텍처로 2화면(입력 / 결과+공유) 구현.
>
> **Project**: chosung-gunghap (이름궁합)
> **Version**: 0.1
> **Author**: 본인 + Claude
> **Date**: 2026-05-22
> **Status**: Draft
> **Planning Doc**: [chosung-gunghap.plan.md](../../01-plan/features/chosung-gunghap.plan.md)
> **PRD**: [chosung-gunghap.prd.md](../../00-pm/chosung-gunghap.prd.md)

---

## Context Anchor

> Plan에서 승계. Do 단계로 자동 전파.

| Key | Value |
|-----|-------|
| **WHY** | 한국 운세시장 1.4조원 중 "초저가·초고빈도·바이럴공유" 세그먼트를 1인 개발자로 점유. 토스 MAU 2,900만 기반 무료 진입로 활용 |
| **WHO** | 1차 비치헤드: 22-25세 여성 대학생(50%) + 직장인 친구 모임(30%) + 트렌드 추종 10대(20%) |
| **RISK** | (1) 검수 "사행성/점술" 판정 — 면책·투명성 (2) IAP 전환율 1% 미만 — A/B 가격 (3) D7 retention 하락 — 시드 변수(Phase 2) |
| **SUCCESS** | D30: MAU 5만 / IAP 5% / 월 매출 248만원. D90: MAU 10만 / 월 495만원 / D7 15% |
| **SCOPE** | **In**: 한글 이름 2개, 5차원 알고리즘, IAP 990원, 9:16 Canvas 카드, 카톡/인스타 공유, TDS. **Out (v1)**: 로그인, 사주, 결과 히스토리, LLM |

---

## 1. Overview

### 1.1 Design Goals

- **결정론성**: 동일 입력 = 항상 동일 결과 (친구간 결과 신뢰)
- **단순성**: 2화면 미니앱에 맞는 최소 추상화 (feature 폴더 + lib + store)
- **확장성**: Phase 2 (시드 변수, 시즌 카드, A/B 가격)를 리팩토링 없이 수용
- **검수 친화**: TDS 컴포넌트 75%+, 커스텀은 TDS 토큰 위에서만
- **성능**: 입력→결과 0.5초, 카드 생성 1.5초 (저사양 안드로이드)
- **번들 슬림**: 초기 번들 ≤ 200KB gzipped

### 1.2 Design Principles

- **Pure 알고리즘**: `lib/algorithm/*` 는 React/외부 SDK 의존 0, Vitest 100% 단위 테스트
- **Feature-first**: 기능 흐름별로 폴더 분리 (intro / name-input / result / share)
- **Static Content**: 콘텐츠는 빌드 타임 정적 데이터, 런타임 LLM 호출 0
- **State Single Source**: Zustand 단일 store, useState는 컴포넌트 ephemeral only
- **TDS Primary, Custom Tokenized**: 커스텀 컴포넌트도 `@toss/tds-colors` 토큰 위에서 빌드
- **Fail-safe IAP**: `getPendingOrders` 복원 + 결제 실패 시 무료 영역으로 복귀

---

## 2. Architecture Options (Selected: C — Pragmatic Balance)

### 2.0 Architecture Comparison

| Criteria | A: Minimal | B: Clean | **C: Pragmatic** |
|----------|:-:|:-:|:-:|
| Approach | App.tsx + lib | 4-layer 엄격 | features + lib + store |
| New Files | ~6 | ~25+ | **~18** |
| Complexity | Low | High | **Medium** |
| Maintainability | Medium | High | **High** |
| Effort | Low | High | **Medium** |
| Testability | Medium | High | **High (lib 단위)** |
| 2화면 적합도 | 적합 | 과함 | **최적** |
| Phase 2 확장 | 리팩토링 필요 | 손쉬움 | **손쉬움** |

**Selected**: **Option C — Pragmatic Balance**

**Rationale**: 2화면 미니앱에는 4-layer 엄격 분리(B)가 오버킬. 그러나 Phase 2 확장(시드 변수, 시즌 카드)과 알고리즘 단위 테스트 필요성을 고려할 때 A(Minimal)는 부족. features/lib/content/store 4개 영역으로 자연스럽게 분리되는 C가 균형점.

### 2.1 Component Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                    토스 앱 (WebView)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │             이름궁합 미니앱 (React SPA)                    │  │
│  │                                                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐    │  │
│  │  │   features/ │  │  Zustand    │  │   lib/       │    │  │
│  │  │             │──┤  app-store  ├──│  algorithm/  │    │  │
│  │  │  intro      │  │             │  │  canvas/     │    │  │
│  │  │  name-input │  │  screen     │  │  iap/        │    │  │
│  │  │  result     │  │  name1/2    │  │  hangul/     │    │  │
│  │  │  share      │  │  result     │  │              │    │  │
│  │  └─────────────┘  │  payment    │  └──────────────┘    │  │
│  │         │         └─────────────┘         │            │  │
│  │         │                                  │            │  │
│  │         ▼                                  ▼            │  │
│  │  ┌─────────────────────────────┐  ┌──────────────┐    │  │
│  │  │  @toss/tds-mobile           │  │  content/    │    │  │
│  │  │  @toss/tds-mobile-ait       │  │  static data │    │  │
│  │  │  @toss/tds-colors           │  └──────────────┘    │  │
│  │  └─────────────────────────────┘                       │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  @apps-in-toss/web-framework (SDK 2.x)           │  │  │
│  │  │  - IAP.createOneTimePurchaseOrder                │  │  │
│  │  │  - IAP.getPendingOrders                          │  │  │
│  │  │  - share-link                                     │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                              ↕
              토스 결제 / 카톡 / 인스타 (Native)
```

### 2.2 Data Flow

```
[입력 화면]
  name1, name2 (string)
       │
       ▼
[lib/hangul/validate] — 한글 검증 (es-hangul 활용)
       │
       ▼
[lib/algorithm/compose] — 5차원 합산
  ├─ stroke-count.compute()     (es-hangul.disassemble 사용)
  ├─ ohaeng.compute()           (es-hangul.getChoseong 사용)
  ├─ yin-yang.compute()
  ├─ vowel-harmony.compute()
  └─ character-type.compute()
       │
       ▼
CompatibilityResult { totalScore, ohaengLabel, categories, scenario, ... }
       │
       ▼
[content/ 매칭] — 한 줄·시나리오 선택 (점수×오행 인덱스)
       │
       ▼
[Zustand store] — result 저장
       │
       ▼
[ResultScreen] — 무료 영역 렌더 + 유료 영역 블러
       │
       │ (사용자 "공유하기" 탭)
       ▼
[lib/iap/client] — createOneTimePurchaseOrder
       │
       │ (결제 성공)
       ▼
[Zustand store] — paymentStatus: success
       │
       ▼
[ResultScreen] — 블러 해제 + 카드 생성
       │
       ▼
[lib/canvas/generate-card] — Canvas로 9:16 카드 동적 생성 (두 이름·점수·코멘트 포함)
       │
       ├─→ [download button] — canvas.toBlob() + a[download] 트리거 (사용자가 저장 후 인스타 등에 첨부)
       │
       └─→ [SDK share] — 텍스트 메시지 + 딥링크 (`share({message: 'X와 Y는 87점! →' + tossLink})`)
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| features/* | store, lib/, content/, components/ | 화면 구성 |
| store/app-store | lib/algorithm/compose, lib/iap/client | 결과 계산, 결제 트리거 |
| lib/algorithm/compose | lib/hangul, lib/algorithm/* | 5차원 합산 |
| lib/algorithm/* | lib/hangul/* (es-hangul wrapper) | 자모 분해 |
| lib/canvas/generate-card | content/, types/ | 9:16 카드 동적 렌더 (두 이름 박힘) |
| lib/iap/client | @apps-in-toss/web-framework | IAP 호출 |
| components/* | @toss/tds-mobile* | TDS 래핑 |

---

## 3. Data Model

> 백엔드·DB 없음. 모든 데이터는 메모리 내 TypeScript 타입.

### 3.1 Core Types

```typescript
// types/algorithm.ts
export type Hangul = string;

export type Ohaeng = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
//                   목(木)  화(火)   토(土)    금(金)    수(水)

export type OhaengRelation = 'sangsaeng' | 'neutral' | 'sangkuk';
//                            상생         중립         상극

export type CharacterType =
  | 'leader'      // 木 — 리더형
  | 'passionate'  // 火 — 열정형
  | 'stable'      // 土 — 안정형
  | 'perfect'     // 金 — 완벽형
  | 'flexible';   // 水 — 유연형

export type YinYang = 'yin' | 'yang';

export interface DimensionScores {
  stroke: number;          // 0-100  획수법
  ohaeng: number;          // 0-100  오행 상성 (점수화)
  yinYang: number;         // 0-100  음양 균형
  vowel: number;           // 0-100  모음 조화
  characterBonus: number;  // -10~+10 캐릭터 매칭 보너스
}

export interface CategoryScores {
  romance: number;     // 연애
  friendship: number;  // 우정
  chemistry: number;   // 케미
  daily: number;       // 일상
}
```

### 3.2 Result Type

```typescript
// types/result.ts
export interface OhaengLabel {
  name1Ohaeng: Ohaeng;
  name2Ohaeng: Ohaeng;
  relation: OhaengRelation;
  label: string;            // "🔥 불 × 💧 물 = 격렬한 케미"
}

export interface CharacterPair {
  name1Type: CharacterType;
  name2Type: CharacterType;
}

export interface CompatibilityResult {
  // 입력 (Canvas 카드 생성에 필요)
  name1: Hangul;
  name2: Hangul;

  // 무료 영역
  totalScore: number;          // 1-99 (clamped, 절대 0/100 회피)
  oneLineComment: string;      // 점수×오행 매트릭스에서 선택
  ohaengLabel: OhaengLabel;

  // 유료 영역
  categories: CategoryScores;
  scenario: string;            // 3-4 문장, 변수 조합
  characters: CharacterPair;

  // 메타 (디버깅용, UI 미노출)
  dimensions: DimensionScores;
  algorithmVersion: string;    // "1.0.0" — 결정론성 보증
}
```

### 3.3 Store State

```typescript
// store/app-store.ts
export type Screen =
  | 'intro'         // 1초 인트로
  | 'input'         // 이름 입력
  | 'result-free'   // 결과 무료 (블러 영역 잠김)
  | 'result-full'   // 결과 풀 (블러 해제 직후)
  | 'sharing';      // 공유 다이얼로그 표시 중

export type PaymentStatus = 'idle' | 'pending' | 'success' | 'failed' | 'canceled';

export interface AppState {
  screen: Screen;
  name1: string;
  name2: string;
  result: CompatibilityResult | null;
  payment: {
    status: PaymentStatus;
    error: string | null;
    orderId: string | null;
  };

  // Actions
  setName1: (name: string) => void;
  setName2: (name: string) => void;
  goToResult: () => void;        // input → result-free (compute + transition)
  startPayment: () => Promise<void>;
  resetPayment: () => void;
  reset: () => void;             // 처음으로
}
```

### 3.4 Content Data Types

```typescript
// content/one-liners.ts
export interface OneLinerEntry {
  scoreRange: [number, number];  // [70, 89]
  ohaengCombo: OhaengCombo;      // 'wood-fire' 등
  text: string;
}

// content/scenarios.ts
export interface ScenarioTemplate {
  scoreRange: [number, number];
  ohaengRelation: OhaengRelation;
  template: string;              // "{NAME1}은 {c1_trait}이고..."
  slots: Record<string, string[]>;  // 변수 후보들
}
```

---

## 4. API Specification

**해당 없음** (백엔드 없음).

외부 SDK 호출만 존재:

| 호출 | SDK | Purpose |
|---|---|---|
| `IAP.createOneTimePurchaseOrder()` | @apps-in-toss/web-framework | 990원 결제 |
| `IAP.getPendingOrders()` | @apps-in-toss/web-framework | 앱 진입 시 미결 주문 복원 |
| `IAP.completeProductGrant()` | @apps-in-toss/web-framework | 상품 지급 확정 |
| `shareLink(...)` | @apps-in-toss/web-framework | 카톡/인스타/링크 복사 다이얼로그 |

---

## 5. UI/UX Design

> 화면별 상호작용·전환 효과·마이크로카피의 상세 명세는 **Plan §6 (UX Flow Detail)** 참조.
> 본 섹션은 컴포넌트 매핑과 Page UI Checklist에 집중.

### 5.1 Screen Layout

#### 화면 1: 입력

```
┌──────────────────────────────────┐
│                                  │
│   두 사람의 이름을               │   ← Top.TitleParagraph (t1)
│   알려주세요                     │
│                                  │
│   ┌────────────────────────┐    │
│   │  내 이름                │    │   ← TextField #1
│   └────────────────────────┘    │
│                                  │
│   ┌────────────────────────┐    │
│   │  친구 이름              │    │   ← TextField #2
│   └────────────────────────┘    │
│                                  │
│   재미용 콘텐츠입니다 😊         │   ← Paragraph (t7, grey)
│                                  │
├──────────────────────────────────┤
│  ┌────────────────────────────┐ │
│  │      궁합 보기              │ │   ← FixedBottomCTA
│  └────────────────────────────┘ │
└──────────────────────────────────┘
```

#### 화면 2: 결과 + 공유

```
┌──────────────────────────────────┐
│     혁철 ✕ 민지                  │   ← Top.TitleParagraph + 두 이름
│                                  │
│         ╭─────╮                  │
│        │ 87  │                   │   ← ScoreGauge (커스텀, 카운트업)
│         ╰─────╯                  │
│      불꽃 같은 케미!              │   ← Paragraph (t3)
│                                  │
│   ┌─────────────────────────┐   │
│   │ 🔥 불 × 💧 물 =          │   │   ← Badge (오행 라벨, 컬러 토큰)
│   │ 격렬한 케미              │   │
│   └─────────────────────────┘   │
│                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │   ← Border (height16)
│                                  │
│  둘만 아는 4가지 케미 포인트 👀  │   ← ListHeader
│  공유 시 잠금 해제 🔓             │   ← 칩 (커스텀, 우측 상단)
│                                  │
│  ┌─────────┐    ┌─────────┐    │
│  │ 🔒 연애  │    │ 🔒 우정  │    │   ← ListRow (블러 처리)
│  │  ..??.. │    │  ..??.. │    │
│  └─────────┘    └─────────┘    │
│  ┌─────────┐    ┌─────────┐    │
│  │ 🔒 케미  │    │ 🔒 일상  │    │
│  │  ..??.. │    │  ..??.. │    │
│  └─────────┘    └─────────┘    │
│                                  │
│  ┌─────────────────────────┐   │
│  │ 두 사람은 ...            │   │   ← 시나리오 카드 (블러)
│  │ ████████████████████    │   │
│  └─────────────────────────┘   │
│                                  │
│  재미용 콘텐츠예요 😊            │   ← Disclaimer (t7)
│                                  │
├──────────────────────────────────┤
│  ┌────────────────────────────┐ │
│  │  공유하기  ·  ₩990          │ │   ← FixedBottomCTA
│  └────────────────────────────┘ │
└──────────────────────────────────┘
```

### 5.2 User Flow

```
[Intro 1초] → [Input] → [Result-Free] → [Payment Dialog]
                                              │
                            ┌─────────────────┼─────────────────┐
                            ▼                 ▼                 ▼
                    [Result-Full]      [Result-Free       [Result-Free
                            │           + Error Toast]    (silent)]
                            ▼              (실패)            (취소)
                    [Card 생성 1.5초]
                            ▼
                    [Sharing Dialog] ← SDK shareLink
                            ▼
                    [Result-Full] (공유 후 머무름)
                            │
                            ▼
                    [reset] → [Input] (다시하기)
```

### 5.3 Component List

| Component | Location | Responsibility | TDS? |
|-----------|----------|----------------|:-:|
| `IntroScreen` | features/intro/ | 1초 로고+카피 노출 후 자동 전환 | ✅ Top + Asset |
| `NameInputScreen` | features/name-input/ | 이름 2개 입력 + 검증 + CTA | ✅ TextField + FixedBottomCTA |
| `ResultScreen` | features/result/ | 무료/유료 영역, 점수 게이지, 블러 | 부분 (게이지/블러 커스텀) |
| `ScoreGauge` | features/result/ | 카운트업 점수 표시 | ❌ 커스텀 (ProgressBar 베이스) |
| `BlurOverlay` | features/result/ | 유료 영역 블러 처리 | ❌ 커스텀 (CSS) |
| `ShareButton` | features/share/ | "공유하기" CTA → 결제 → 공유 | ✅ FixedBottomCTA 사용 |
| `Disclaimer` | components/ | "재미용 콘텐츠" 면책 텍스트 | ✅ Paragraph 래핑 |
| `LegalModal` | components/ | 약관·개인정보 모달 | ✅ Modal |
| `ErrorToast` | components/ | 결제 실패 안내 | ✅ Toast + useToast |

### 5.4 Page UI Checklist (검수·Gap Detector용)

#### 화면 1 (Input)

- [ ] **Top**: 헤드라인 "두 사람의 이름을 알려주세요" (TDS Top.TitleParagraph t1)
- [ ] **TextField**: 내 이름 입력 (placeholder "내 이름", maxLength 4, 한글만 허용)
- [ ] **TextField**: 친구 이름 입력 (placeholder "친구 이름", maxLength 4, 한글만 허용)
- [ ] **Input validation feedback**: 한글 외 입력 시 친절한 가이드 ("한글 이름만 가능해요")
- [ ] **FixedBottomCTA**: "궁합 보기" (양 필드 비어있으면 disabled, 채워지면 active)
- [ ] **Disclaimer**: "재미용 콘텐츠입니다 😊" (Paragraph t7, grey500)

#### 화면 2 (Result + Share)

**무료 영역**:
- [ ] **Top**: 두 이름 동시 노출 ("혁철 ✕ 민지", Top.TitleParagraph)
- [ ] **ScoreGauge**: 0→실제 점수 카운트업 (0.6초 애니메이션, 카운트업 종료 시 햅틱)
- [ ] **One-liner**: 점수+오행 매트릭스 기반 한 줄 코멘트 (Paragraph t3)
- [ ] **Badge**: 오행 라벨 ("🔥 불 × 💧 물 = 격렬한 케미", 오행별 컬러)
- [ ] **Toggle (선택)**: "왜 이런 점수인가요?" (탭하면 한 줄 부가 설명)
- [ ] **Border**: 무료/유료 영역 시각적 구분 (height16)

**유료 영역 (블러)**:
- [ ] **ListHeader**: "둘만 아는 4가지 케미 포인트 👀"
- [ ] **Chip**: "공유 시 잠금 해제 🔓" (우측 상단)
- [ ] **BlurOverlay**: 4개 카드 + 시나리오 모두 blur(10px) 처리
- [ ] **ListRow ×4**: 분야별 점수 (연애/우정/케미/일상) — 블러 처리됨
- [ ] **Scenario Card**: 관계 시나리오 텍스트 — 블러 처리됨

**CTA**:
- [ ] **FixedBottomCTA**: "공유하기 · ₩990" (탭하면 IAP 호출)

**공통**:
- [ ] **Disclaimer**: "재미용 콘텐츠예요 😊" (Paragraph t7)
- [ ] **LegalModal trigger**: 화면 어딘가에 "약관·개인정보처리방침" 진입점

**결제 후 (Result-Full)**:
- [ ] **BlurOverlay 해제**: 0.5초 페이드
- [ ] **ListRow ×4**: 실제 점수 표시 (연애 92 / 우정 75 / 케미 60 / 일상 50 등)
- [ ] **Scenario**: 실제 텍스트 3-4문장
- [ ] **Toast**: "카드를 만들고 있어요" (1초)
- [ ] **Canvas card**: 9:16 카드 미리보기 (자동 표시)
- [ ] **Share dialog**: SDK shareLink 호출 (카톡/인스타/링크 복사)

---

## 6. Error Handling

### 6.1 Error Code Definition

> 백엔드 없음 → HTTP 코드 X. 클라이언트 에러만.

| Code | Message | Cause | Handling |
|------|---------|-------|----------|
| `INVALID_INPUT_NON_HANGUL` | 한글 이름만 가능해요 | 한글 외 입력 | 필드 외곽 강조, 토스트 X (마찰 최소화) |
| `INVALID_INPUT_LENGTH` | 1-4글자로 입력해주세요 | 길이 위반 | 필드 외곽 + 작은 가이드 |
| `INVALID_INPUT_PROFANITY` | 부적절한 표현이 포함되어 있어요 | 욕설 사전 매칭 | Toast로 안내 |
| `PAYMENT_INSUFFICIENT_BALANCE` | 토스 머니 잔액이 부족해요 | IAP onError | "충전하기" 버튼 + 재시도 |
| `PAYMENT_CANCELED_BY_USER` | (silent) | IAP onCancel | 화면 변경 없이 result-free 유지 |
| `PAYMENT_NETWORK_ERROR` | 잠시 후 다시 시도해주세요 | IAP onError 일반 | Toast + 재시도 버튼 |
| `CARD_GENERATION_FAILED` | 카드 만들기에 실패했어요 | Canvas 렌더 에러 | Toast + "다시 만들기" |
| `SHARE_DIALOG_FAILED` | 공유에 실패했어요. 다시 시도해주세요 | shareLink 에러 | Toast + 재시도 |

### 6.2 Recovery Strategy

```
[Payment Failed: Insufficient]
  → result-free 유지
  → Toast: "토스 머니 잔액이 부족해요"
  → CTA가 "토스 머니 충전 후 공유하기"로 변경
  → 다시 탭 시 결제 재시도

[Payment Failed: Network]
  → result-free 유지
  → Toast + 재시도 버튼

[Payment Canceled]
  → result-free 유지, 조용히 (사용자 의지)

[Pending Order on App Restart]
  → getPendingOrders() 자동 호출 (App mount)
  → 미결 주문 있으면:
    → completeProductGrant 호출
    → result-full 상태로 점프 (이미 결제됐던 사용자 자동 복원)
```

---

## 7. Security Considerations

- [x] **XSS 방어**: 사용자 입력은 React 기본 escaping. `dangerouslySetInnerHTML` 완전 금지 (ESLint rule)
- [x] **eval() 금지**: ESLint `no-eval` + `no-implied-eval` 활성화 (검수 반려 사유)
- [x] **입력값 미저장**: localStorage / sessionStorage / cookie 모두 사용 안 함 (세션 메모리만)
- [x] **개인정보 미전송**: 외부 fetch 0회 (DevTools Network 탭으로 검증)
- [x] **결제 검증**: SDK가 자체 검증. 클라이언트는 결제 영수증을 신뢰하지 않고 SDK 콜백만 신뢰
- [x] **알고리즘 결정론**: `Math.random()` 절대 사용 안 함. 시드 외부화 (Phase 2에서만)
- [x] **HTTPS only**: 앱인토스가 자동 강제 (별도 작업 없음)
- [x] **Rate Limiting**: 백엔드 없으므로 N/A. IAP는 토스가 제어
- [x] **콘텐츠 검수**: 모든 텍스트가 정적 파일에 있어 빌드 타임 검수 가능 ("운명·점술" 단어 grep)

---

## 8. Test Plan

> Plan §3.2의 시나리오(T-01~T-15)를 본 섹션에서 L1/L2/L3으로 재분류.
> Test code는 Do 단계에서 코드와 함께 작성. Check 단계는 실행만.

### 8.1 Test Scope

| Type | Target | Tool | Phase |
|------|--------|------|-------|
| L1: 알고리즘 단위 | lib/algorithm/* 5개 + compose | **Vitest** | Do |
| L2: 컴포넌트 단위 | features/* 화면, 커스텀 컴포넌트 | **Vitest + React Testing Library** | Do |
| L3: E2E 시나리오 | 토스 샌드박스 앱 수동 + (선택) Playwright | **Sandbox 수동** | Check |

> 백엔드 없음 → API 테스트(통상 L1) 대신 알고리즘 단위 테스트가 L1 자리.

### 8.2 L1: 알고리즘 단위 테스트 (Vitest)

| # | 대상 | 시나리오 | 기대 |
|---|---|---|---|
| L1-1 | `compose("홍길동", "김민지")` | 정상 입력 | 결과 객체에 totalScore, ohaengLabel, categories 모두 채워짐 |
| L1-2 | `compose("홍길동", "김민지")` × 100회 | 결정론성 | 100회 모두 동일 결과 |
| L1-3 | `compose("a", "b")` | 비한글 입력 | throw `INVALID_INPUT_NON_HANGUL` |
| L1-4 | `compose("", "민지")` | 빈 입력 | throw `INVALID_INPUT_LENGTH` |
| L1-5 | `compute()` (각 차원 함수) | 모든 차원 0-100 범위 | clamp 통과 |
| L1-6 | `composeTotalScore()` 5차원 합산 | 가중치 정확성 | 0.50·0.25·0.10·0.10·0.05 적용 확인 |
| L1-7 | `composeTotalScore()` | clamp 1-99 | 절대 0/100 반환 안 함 |
| L1-8 | `ohaeng.relation()` | 상생/중립/상극 | 木→火 = sangsaeng, 木↔土 = sangkuk 등 매핑 정확 |
| L1-9 | `hangul.extractJamo("강희")` | 자모 분해 | `[ㄱ,ㅏ,ㅇ,ㅎ,ㅡ,ㅣ]` |
| L1-10 | `hangul.validate("Hong")` | 한글 외 | false |
| L1-11 | `oneLineComment.pick(score=87, combo="fire-water")` | 매트릭스 선택 | 정의된 문자열 반환 |
| L1-12 | `scenario.generate(...)` | 슬롯 치환 | `{NAME1}` 등 모두 치환됨, 빈 슬롯 없음 |
| L1-13 | `categories.romance(...)` 등 4종 | 분야 가중치 | 총점 ±20점 이내 |
| L1-14 | `character.classify("불꽃")` | 캐릭터 매핑 | passionate (火) |

**커버리지 목표**: lib/algorithm/* 90% 이상

### 8.3 L2: 컴포넌트 단위 테스트 (Vitest + RTL)

| # | 컴포넌트 | 액션 | 기대 |
|---|---|---|---|
| L2-1 | NameInputScreen | 한글 2글자씩 입력 | CTA active |
| L2-2 | NameInputScreen | 한 필드 비움 | CTA disabled |
| L2-3 | NameInputScreen | 영문 입력 | 가이드 메시지 |
| L2-4 | ScoreGauge | score=87 prop | 0→87 카운트업 |
| L2-5 | BlurOverlay | isLocked=true | filter: blur(10px) 적용 |
| L2-6 | BlurOverlay | isLocked=false | 블러 해제 |
| L2-7 | ResultScreen (mock store) | 무료 영역 렌더 | 점수·코멘트·오행 라벨 노출 |
| L2-8 | ResultScreen | paymentStatus="success" | 블러 해제 + 분야별 점수 노출 |
| L2-9 | ShareButton | onClick | usePayment.startPayment 호출됨 |
| L2-10 | ErrorToast | INSUFFICIENT_BALANCE | 메시지 정확 |

### 8.4 L3: E2E 시나리오 (샌드박스 수동)

> 토스앱 샌드박스에서 실제 IAP 흐름 검증. iOS/Android 양 OS 모두.

| # | 시나리오 | 단계 | 성공 기준 |
|---|---|---|---|
| L3-1 | Happy Path | 인트로 → 이름 입력 → 결과 → 공유하기 → 결제 성공 → 카드 → 카톡 공유 | 모든 단계 정상, 카톡에 카드 첨부됨 |
| L3-2 | 부정 결과 | 점수 30점 미만 케이스 | 긍정 톤 코멘트로 마무리 |
| L3-3 | 결제 실패 (잔액 부족) | 잔액 0원 상태로 결제 시도 | Toast + 충전 안내, 화면 그대로 |
| L3-4 | 결제 취소 | 결제창에서 뒤로가기 | 조용히 result-free 복귀 |
| L3-5 | 미결 주문 복원 | 결제 진행 중 강제 종료 → 재진입 | 자동으로 result-full로 점프 |
| L3-6 | 인스타 공유 | 결제 완료 후 인스타 선택 | 인스타 앱 호출, 카드 첨부됨 |
| L3-7 | 다시하기 | 결과 화면에서 reset → 다른 이름 | 새 결과 정상 |
| L3-8 | 네트워크 끊김 | 비행기 모드로 결제 시도 | Network 에러 토스트 + 재시도 |
| L3-9 | iOS 동작 | iOS 14+ 샌드박스 | 전 플로우 동일 |
| L3-10 | Android 동작 | Android 10+ 샌드박스 | 전 플로우 동일 |
| L3-11 | 약관 진입 | 약관 링크 탭 → 모달 | 약관·개인정보처리방침 모두 노출 |
| L3-12 | 면책 디스클레이머 | 모든 화면 확인 | "재미용" 표시 항상 노출 |

### 8.5 Seed Data Requirements

**없음** — 정적 데이터로만 구성. `content/*.ts` 파일 자체가 빌드 시점 데이터.

단, 콘텐츠 작성 후 다음 검수 필요:
- one-liners.ts: 25개 이상 (5구간 × 5오행)
- scenarios.ts: 30개 이상 (점수×오행 매트릭스 cover)
- 50점 미만 항목 100%가 긍정 톤 (자동 검사 스크립트)

---

## 9. Architecture Layout (Option C Detail)

### 9.1 Layer Mapping (Pragmatic)

> 4-layer Clean Architecture를 강제하지 않되, 의존 방향만 단방향 유지.

| Layer (개념) | 실제 폴더 | Responsibility |
|---|---|---|
| **Presentation** | `features/*/Screen.tsx`, `features/*/Component.tsx`, `components/` | TDS 컴포넌트 조합, UI 렌더 |
| **Application** | `features/*/use*.ts`, `store/app-store.ts` | 화면 별 hook, 상태 관리, 액션 |
| **Domain** | `lib/algorithm/*`, `lib/hangul/*`, `types/` | 순수 알고리즘, 한글 처리, 타입 (외부 의존 0) |
| **Infrastructure** | `lib/iap/`, `lib/canvas/`, `@apps-in-toss/web-framework` | SDK 호출, Canvas, 외부 입출력 |
| **Content** | `content/*.ts` | 정적 데이터 |

### 9.2 Dependency Direction

```
features/   ←─ depends on ──→  components/, store/, lib/, content/
store/      ←─ depends on ──→  lib/algorithm, lib/iap
lib/algorithm ──→  lib/hangul, types/
lib/iap     ──→  @apps-in-toss/web-framework
lib/canvas  ──→  content/ (폰트 토큰만)
content/    ──→  types/ (only)

❌ Never:
  lib/algorithm → React, TDS, SDK  (순수 함수만)
  types/ → 다른 어느 곳
  content/ → 알고리즘 결과 (정적 데이터 우선)
```

### 9.3 Why This Works for 이름궁합

- 알고리즘이 React 의존 0 → Vitest로 빠르게 검증 (100ms 이내 14개 테스트)
- features 폴더가 흐름별 → 새 화면 추가 시 폴더 하나만 추가
- store 단일 → 화면 간 상태 동기화 자동
- content 분리 → 콘텐츠 수정이 코드 변경 없이 가능 (검수 후 텍스트 톤 조정)

---

## 10. Coding Convention

### 10.1 Naming

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 | PascalCase.tsx | `NameInputScreen.tsx`, `ScoreGauge.tsx` |
| Hook | useXxx.ts | `useNameInput.ts`, `usePayment.ts` |
| 유틸/도메인 | camelCase.ts | `extract-jamo.ts` → kebab 파일명 OK, export는 camelCase |
| 타입/인터페이스 | PascalCase | `CompatibilityResult`, `DimensionScores` |
| 상수 | UPPER_SNAKE_CASE | `MAX_NAME_LENGTH`, `IAP_SKU` |
| 폴더 | kebab-case | `name-input/`, `algorithm/` |
| Zustand action | 동사camelCase | `setName1`, `goToResult`, `startPayment` |

### 10.2 Import Order

```typescript
// 1. External libraries
import { useState, useEffect } from 'react';
import { create } from 'zustand';

// 2. 앱인토스 / TDS
import { IAP } from '@apps-in-toss/web-framework';
import { Top, TextField, FixedBottomCTA } from '@toss/tds-mobile';
import { colors } from '@toss/tds-colors';

// 3. 내부 lib
import { compose } from '@/lib/algorithm/compose';
import { validate } from '@/lib/hangul/validate';

// 4. 내부 features / store
import { useAppStore } from '@/store/app-store';

// 5. 컴포넌트 (상대 경로)
import { ScoreGauge } from './ScoreGauge';

// 6. 타입
import type { CompatibilityResult } from '@/types/result';

// 7. 스타일
import styles from './ResultScreen.module.css';
```

Path alias `@/*` = `src/*` (Vite alias 설정).

### 10.3 Environment Variables

| 변수 | 용도 | 기본값 |
|---|---|---|
| `VITE_IAP_SKU` | IAP 상품 ID | `share_unlock_v1` |
| `VITE_PAYMENT_ENABLED` | 결제 활성화 (사업자 등록 전 false) | `false` |
| `VITE_APP_VERSION` | 앱 버전 표시 | package.json |

### 10.4 This Feature's Conventions

| 항목 | 적용 |
|---|---|
| 컴포넌트 네이밍 | `*Screen.tsx` = 화면 단위, 그 외는 의미 단위 (ScoreGauge 등) |
| 파일 구성 | features/{flow}/ 안에 컴포넌트·hook·validator 같이 |
| 상태 관리 | 전역=Zustand 단일 store, 로컬=useState |
| 에러 처리 | 외부 SDK 호출에만 try/catch. 알고리즘은 throw로 명시적 |
| 주석 정책 | 알고리즘 차원별 1-2줄 only, UI는 주석 X |
| 테스트 | algorithm 90%+ 커버, 컴포넌트는 핵심 시나리오만 |

---

## 11. Implementation Guide

### 11.1 File Structure (Option C 확정)

```
chosung-gunghap/
├── src/
│   ├── main.tsx                      # Entry + TDSMobileAITProvider
│   ├── App.tsx                       # Screen 라우팅 (store.screen 기반)
│   │
│   ├── store/
│   │   └── app-store.ts              # Zustand: screen, name1/2, result, payment
│   │
│   ├── features/
│   │   ├── intro/
│   │   │   └── IntroScreen.tsx       # 1초 인트로 → 자동 input 전환
│   │   ├── name-input/
│   │   │   ├── NameInputScreen.tsx
│   │   │   ├── useNameInput.ts       # 입력 검증 + CTA 활성화
│   │   │   └── validators.ts
│   │   ├── result/
│   │   │   ├── ResultScreen.tsx      # 무료/유료 통합 화면
│   │   │   ├── ScoreGauge.tsx        # 커스텀
│   │   │   ├── BlurOverlay.tsx       # 커스텀
│   │   │   ├── CategoryGrid.tsx      # 분야별 점수 2x2
│   │   │   ├── ScenarioCard.tsx
│   │   │   └── useResult.ts
│   │   └── share/
│   │       ├── ShareButton.tsx       # FixedBottomCTA 래핑
│   │       ├── usePayment.ts         # IAP 흐름
│   │       └── useShare.ts           # shareLink 호출 + Canvas
│   │
│   ├── lib/
│   │   ├── algorithm/
│   │   │   ├── stroke-count.ts       # 획수법
│   │   │   ├── ohaeng.ts             # 오행 상성 + 매핑표
│   │   │   ├── yin-yang.ts           # 음양 균형
│   │   │   ├── vowel-harmony.ts      # 모음 조화
│   │   │   ├── character-type.ts     # 캐릭터 유형 분류
│   │   │   ├── compose.ts            # 5차원 합산 + 카테고리 점수
│   │   │   └── __tests__/            # Vitest L1
│   │   ├── canvas/
│   │   │   ├── generate-card.ts      # 9:16 Canvas 렌더
│   │   │   ├── fonts.ts              # 폰트 로딩
│   │   │   └── layouts.ts            # 좌표·크기 상수
│   │   ├── iap/
│   │   │   ├── client.ts             # SDK 래핑
│   │   │   ├── restore-orders.ts     # 미결 복원
│   │   │   └── types.ts
│   │   ├── hangul/
│   │   │   ├── extract-jamo.ts       # 한글 자모 분해
│   │   │   ├── validate.ts           # 한글 검증
│   │   │   └── profanity-filter.ts
│   │   └── ohaeng-to-color.ts        # 오행 → TDS 컬러 매핑
│   │
│   ├── content/
│   │   ├── one-liners.ts             # 25개+, 점수×오행 매트릭스
│   │   ├── scenarios.ts              # 30개+ 시나리오 템플릿
│   │   ├── ohaeng-labels.ts          # 오행 상성 라벨
│   │   ├── character-traits.ts       # 캐릭터 유형 텍스트
│   │   └── legal.ts                  # 약관·개인정보 텍스트
│   │
│   ├── components/
│   │   ├── Disclaimer.tsx            # "재미용 콘텐츠" Paragraph 래핑
│   │   ├── LegalModal.tsx            # 약관 모달 (Modal 래핑)
│   │   └── ErrorToast.tsx            # useToast 래핑
│   │
│   └── types/
│       ├── algorithm.ts              # Hangul, Ohaeng, DimensionScores
│       ├── result.ts                 # CompatibilityResult
│       └── iap.ts                    # PaymentStatus, Order
│
├── public/
│   ├── icon.png
│   ├── thumbnail.png
│   └── fonts/                        # Canvas용 웹폰트
│
├── docs/                             # PDCA 문서
├── granite.config.ts
├── vite.config.ts                    # path alias @/* → src/*
├── tsconfig.json                     # strict: true, paths alias
├── package.json
├── .env.example
└── README.md
```

### 11.2 Implementation Order

1. [ ] **부트스트랩**: `npx create-ait-app chosung-gunghap`, TDS 옵션 yes, IAP 예제 yes
2. [ ] **타입 정의**: `types/` 3 파일 (algorithm, result, iap) — 인터페이스 합의
3. [ ] **한글 유틸**: `lib/hangul/extract-jamo.ts` + 단위 테스트
4. [ ] **알고리즘 5종**: 각 차원 함수 + 단위 테스트 (Vitest)
5. [ ] **합산 함수**: `lib/algorithm/compose.ts` + 결정론 테스트
6. [ ] **콘텐츠 작성**: `content/*.ts` (AI 초안 → 본인 검수, 100개 시드)
7. [ ] **Zustand store**: 화면 전환 + 입력 + 결과 + 결제 상태
8. [ ] **화면 1**: IntroScreen + NameInputScreen (TDS only)
9. [ ] **화면 2 — 무료 영역**: ResultScreen 골격 + ScoreGauge (커스텀) + 오행 Badge
10. [ ] **화면 2 — 유료 영역**: BlurOverlay (커스텀) + CategoryGrid + ScenarioCard (블러 상태)
11. [ ] **IAP wrapper**: `lib/iap/client.ts` — mock (`VITE_PAYMENT_ENABLED=false`)
12. [ ] **결제 흐름**: usePayment hook + 에러 처리
13. [ ] **Canvas 카드**: `lib/canvas/generate-card.ts` — 9:16 레이아웃
14. [ ] **공유 다이얼로그**: useShare hook + SDK shareLink
15. [ ] **약관·개인정보**: LegalModal + 진입점
16. [ ] **샌드박스 검증 (L3)**: iOS/Android 양 OS 수동 테스트
17. [ ] **사업자 승인 후**: `.env` 토글 + IAP 상품 등록 + 샌드박스 결제 테스트
18. [ ] **검수 셀프 체크**: Plan §11.6 항목 전체 확인
19. [ ] **번들 빌드**: `npm run build` → .ait → 콘솔 업로드 → 검토 요청

### 11.3 Session Guide

> 멀티 세션 구현을 위한 모듈 분할. `/pdca do chosung-gunghap --scope module-N` 활용.

#### Module Map

| Module | Scope Key | Description | Files | Estimated Turns |
|---|---|---|---|:-:|
| **algo** | `module-1` | 5차원 알고리즘 + 한글 유틸 + 단위 테스트 (Vitest 90% 커버) | `lib/algorithm/*`, `lib/hangul/*`, `types/algorithm.ts`, `__tests__/*` | **20-25** |
| **content** | `module-2` | 콘텐츠 100개 시드 (AI 초안 + 본인 검수) | `content/*.ts` | **15-20** |
| **store** | `module-3` | Zustand store + IAP wrapper (mock) | `store/app-store.ts`, `lib/iap/*` | **10-12** |
| **ui-input** | `module-4` | 인트로 + 입력 화면 (TDS only) | `features/intro/*`, `features/name-input/*`, `App.tsx`, `main.tsx` | **15-18** |
| **ui-result** | `module-5` | 결과 화면 (커스텀 ScoreGauge + BlurOverlay) | `features/result/*`, `components/Disclaimer.tsx` | **20-25** |
| **share-card** | `module-6` | Canvas 카드 + 공유 다이얼로그 + 결제 게이트 통합 | `features/share/*`, `lib/canvas/*`, `components/ErrorToast.tsx`, `components/LegalModal.tsx` | **20-25** |

#### Recommended Session Plan

| Session | Phase | Scope | Turns |
|---|---|---|:-:|
| Session 1 | Plan + Design | 전체 (완료) | ~50 (완료) |
| Session 2 | Do | `--scope module-1,module-3` (algo + store) | 30-37 |
| Session 3 | Do | `--scope module-2` (content) | 15-20 |
| Session 4 | Do | `--scope module-4,module-5` (UI 화면) | 35-43 |
| Session 5 | Do | `--scope module-6` (share + Canvas + IAP) | 20-25 |
| Session 6 | Check + Report | 전체 검수, gap 분석 | 30-40 |

병렬 작업 가능: module-2(content)는 module-1(algo) 완료 후 어느 시점에든 가능.

---

## 12. Open Decisions (Do 단계 부트스트랩 후 확정)

다음 항목들은 `npx create-ait-app` 실행 후 자동완성·예제 코드를 보고 확정:

- [ ] **TDS TextField 정확한 props** (validation 콜백, error 표시 방식)
- [ ] **`@toss/tds-colors` adaptive 객체 사용법** (다크모드 대응 필요 여부)
- [ ] **Asset 아이콘 사용 가능 목록** (자물쇠/공유/하트 아이콘명)
- [ ] **TypeScript/Vite 정확한 버전** (생성된 package.json에서 확인)
- [ ] **`granite.config.ts` 권한(permissions) 필요 여부** (IAP만 쓰는데 별도 권한이 필요한지)
- [ ] **샌드박스 앱 다운로드 링크** (iOS/Android 각각)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-22 | Initial Design. Option C (Pragmatic) 선정. 5차원 알고리즘 타입·시그니처·가중치 확정. 화면 ASCII 레이아웃. Page UI Checklist. L1-L3 테스트 시나리오. 6개 모듈 분할 + Session Plan. | 본인 + Claude |
