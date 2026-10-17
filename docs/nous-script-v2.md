# 노스 소개 음성 원고 v2 (재생성 요청용)

작성 2026-10-17. v1(`nous_member_card/작업지시서.md` §5)을 대체한다. **사이트 반영 완료** — ElevenLabs "Taehyung"(eleven_v4)로 아래 영어판과 한국어 낭독판을 문단별로 생성하고, Higgsfield Wan 2.7 립싱크 영상(`public/nous/intro-{ko,en}.mp4`)으로 만들었다.

## 바꾼 이유

- 핵심 메시지 = "우리는 소재를 만들지 않는다. 소재가 왜 그렇게 동작하는지를 원자 단위에서 설명한다. 그 능력이 AI 반도체 등 신소재 연구에 필수라서 우리 학생들이 찾는 사람이 된다." v1은 연구 분야 나열에 머물렀다.
- v1의 사실 문제 3곳 해소.
  - "processes shrink below the nanometer scale" → 1nm 미만 공정은 없음. "just a few nanometers"로.
  - "the rapidly growing field of nanoscale analysis for AI semiconductors and logic devices" → 사이트 연구 주제에 근거한 구체 소재(HfO₂ 강유전체, 2D 반도체)로.
  - "the demand for precise nanoscale analysis keeps rising" → 출처 없는 주장 삭제. 대신 KISDI 인용 수치(연평균 24.3%)를 정확히 말함.
- 진로는 v1이 "alumni"라고 했지만 KIST는 연구교수 출신 사례다. "graduates and researchers"로 정확히.

## 영어 원고 (자막에 그대로 쓰는 판)

1. Hi, I'm Nous — the AI research assistant for the SKKU-STEM Lab.

2. We don't make materials — we explain them. With aberration-corrected scanning transmission electron microscopy, electron spectroscopy, and machine learning, we uncover why a material performs the way it does, atom by atom: in hydrogen fuel cells, catalysts, solar cells, and the new materials behind AI chips.

3. That skill has never mattered more. As chips shrink to just a few nanometers, a handful of atoms at an interface can decide how a device behaves. The AI semiconductor market is projected to grow about 24% a year through 2028, and the materials driving it, like ferroelectric hafnium oxide and two-dimensional semiconductors, need people who can see, and explain, their atoms.

4. That's why our people are in demand. Our graduates and researchers now work at Samsung Electronics, SK hynix, LG Energy Solution, Lam Research, and SEMES; at KIST, KRISS, and KAIST; and at Oak Ridge National Laboratory in the United States.

5. If you want to learn to read materials at the atomic scale, email Professor Young-Min Kim at youngmk@skku.edu. We'd love to hear from you.

분량 184단어. v1 실측 속도(137 wpm) 기준 약 81초.

## TTS 입력용 (발음 힌트를 넣은 판)

v1 음성에서 받아쓰기가 이메일을 "youngkscue.edu"로 인식했다. 사람 귀에도 불분명할 수 있어 철자로 읽히게 한다. 문단 사이에는 0.8초 이상 쉼을 둔다(ElevenLabs `<break time="0.8s" />`).

```
Hi, I'm Nous — the AI research assistant for the S-K-K-U STEM Lab. <break time="0.8s" />
We don't make materials — we explain them. With aberration-corrected scanning transmission electron microscopy, electron spectroscopy, and machine learning, we uncover why a material performs the way it does, atom by atom: in hydrogen fuel cells, catalysts, solar cells, and the new materials behind A-I chips. <break time="0.8s" />
That skill has never mattered more. As chips shrink to just a few nanometers, a handful of atoms at an interface can decide how a device behaves. The A-I semiconductor market is projected to grow about twenty-four percent a year through twenty twenty-eight, and the materials driving it, like ferroelectric hafnium oxide and two-dimensional semiconductors, need people who can see, and explain, their atoms. <break time="0.8s" />
That's why our people are in demand. Our graduates and researchers now work at Samsung Electronics, S-K hynix, L-G Energy Solution, Lam Research, and SEMES; at KIST, KRISS, and KAIST; and at Oak Ridge National Laboratory in the United States. <break time="0.8s" />
If you want to learn to read materials at the atomic scale, email Professor Young-Min Kim at young, m, k, at s, k, k, u, dot e, d, u. We'd love to hear from you.
```

기관 약칭 발음: KIST "키스트", KRISS "크리스", KAIST "카이스트", SEMES "세메스" — 한국식 통용 발음으로 읽히는지 생성 후 확인. 원하는 대로 안 읽히면 `K-I-S-T` 식 철자 표기로 바꾼다.

## 한국어 번역 (자막 병기용)

1. 안녕하세요, 저는 SKKU-STEM 연구실의 AI 연구보조원 노스입니다.
2. 저희는 소재를 만들지 않습니다. 소재를 설명합니다. 수차보정 주사투과전자현미경, 전자분광법, 머신러닝으로 소재가 왜 그런 성능을 내는지 원자 하나하나의 수준에서 밝혀냅니다. 수소 연료전지, 촉매, 태양전지, 그리고 AI 칩에 들어가는 신소재까지요.
3. 이 능력이 지금처럼 중요했던 적은 없습니다. 칩이 몇 나노미터 수준으로 작아지면서, 계면의 원자 몇 개가 소자의 동작을 좌우하게 되었습니다. AI 반도체 시장은 2028년까지 해마다 약 24%씩 성장할 것으로 전망되고, 그 성장을 이끄는 강유전체 산화하프늄이나 2차원 반도체 같은 소재에는 원자를 보고 설명할 수 있는 사람이 필요합니다.
4. 그래서 저희 연구실 사람들을 찾습니다. 졸업생과 연구원들은 지금 삼성전자, SK하이닉스, LG에너지솔루션, 램리서치, 세메스, 그리고 KIST, KRISS, KAIST, 미국 오크리지 국립연구소에서 일하고 있습니다.
5. 원자 단위에서 소재를 읽는 법을 배우고 싶다면 김영민 교수님(youngmk@skku.edu)께 메일을 보내 주세요. 여러분의 연락을 기다립니다.

## 근거

| 원고 주장 | 근거 |
|---|---|
| STEM·전자분광·머신러닝 | 사이트 Research themes 01·02·04 |
| 수소 연료전지·촉매·태양전지 | Research themes 01(촉매·SOFC), 02(페로브스카이트 태양전지), 03(PEMFC), 04(Pt 나노입자) |
| HfO₂ 강유전체·2D 반도체 | Research themes 02(HfO2-based ferroelectrics), 06(2D TMD) |
| 연평균 약 24% 성장, 2028년까지 | KISDI Perspectives 2024 No.1 그림 4, 원자료 Gartner(2024.4): 2023→2028 CAGR 24.3% |
| 진출 기관 9곳 | People Alumni의 currentAffiliation(2026-10-16). KIST는 연구교수, SK하이닉스는 포닥·석사 출신 |
| "a handful of atoms at an interface can decide how a device behaves" | 수 nm 소자에서 계면 결함·원자 배열이 특성을 좌우한다는 일반적 서술. 수치 주장 아님 |

## 한국어 낭독판 (TTS 입력, 2026-10-17)

자막(번역)과 달리 소리 나는 대로 적었다 — 기관 약칭은 들리는 대로, 메일은 한 글자씩. 문단마다 따로 생성하고 0.8초 쉼으로 이었다.

1. 안녕하세요, 저는 성균관대 스템 연구실의 AI 연구보조원, 노스입니다.
2. 저희는 소재를 만들지 않습니다. 소재를 설명합니다. 수차보정 주사투과전자현미경과 전자분광법, 그리고 머신러닝으로, 소재가 왜 그런 성능을 내는지 원자 하나하나의 수준에서 밝혀냅니다. 수소 연료전지와 촉매, 태양전지, 그리고 AI 칩에 들어가는 신소재까지요.
3. 이 능력이 지금처럼 중요했던 적은 없습니다. 칩이 몇 나노미터 수준까지 작아지면서, 계면에 있는 원자 몇 개가 소자의 동작을 좌우하게 되었습니다. AI 반도체 시장은 2028년까지 해마다 약 24%씩 성장할 것으로 전망됩니다. 그 성장을 이끄는 강유전체 산화하프늄이나 2차원 반도체 같은 소재에는, 원자를 보고 설명할 수 있는 사람이 필요합니다.
4. 그래서 저희 연구실 사람들을 찾습니다. 졸업생과 연구원들은 지금 삼성전자, SK하이닉스, LG에너지솔루션, 램리서치, 세메스, 그리고 키스트, 한국표준과학연구원, 카이스트, 미국 오크리지 국립연구소에서 일하고 있습니다.
5. 원자 단위에서 소재를 읽는 법을 배우고 싶다면, 김영민 교수님께 메일을 보내 주세요. 주소는 영, 엠, 케이, 골뱅이, 에스, 케이, 케이, 유, 닷, 에듀입니다. 여러분의 연락을 기다리겠습니다.

길이: 한국어 92.24초(문단 시작 0 · 6.16 · 28.56 · 56.64 · 76.88), 영어 84.08초(0 · 5.84 · 27.12 · 52.4 · 72.56).
