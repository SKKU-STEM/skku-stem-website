// 화학식/물리 첨자 자동 포매팅 — 데이터 파일에 plain text로 저장된 화학식을 <sub> 태그로 변환
// 출력은 HTML이므로 Astro 템플릿에서 set:html 또는 <Fragment set:html={...}>로 렌더링
// CMS 관리자(src/pages/admin/index.astro)의 제목 미리보기도 같은 함수를 쓴다 — 사이트와 미리보기가 어긋나지 않게.

const HTML_ESCAPE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escapeHtml = (text: string): string =>
  text.replace(/[&<>"']/g, (ch) => HTML_ESCAPE[ch] ?? ch);

// 제목에 직접 적는 첨자 태그 — 속성 없는 <sub>/<sup>만 허용, 그 외 HTML은 전부 escape
const MARKUP_TAG = /<(\/?)(sub|sup)>/gi;

// 첨자 본문: 1~3자리 숫자(소수 가능, 옵션 -x 같은 한 글자 변수) 또는 변수 x/y/z 반복.
// 4자리 이상 숫자(KSM2024, 특허번호)는 (?!\d)로 차단. -doped 같은 단어는 (?![a-z])로 본문에서 제외.
const SUB_BODY = String.raw`(?:\d{1,3}(?!\d)(?:\.\d+)?(?:[-‐−][a-z](?![a-z]))?|[xyz])+`;

// 첨자 뒤에 올 수 있는 것: 다음 원소(대문자)·괄호·공백·구두점·en/em dash, 또는 -단어(-doped, -LaxSr).
// -숫자(MS4-15, Tl-1223)나 다른 숫자는 차단.
const SUB_END = String.raw`(?=[A-Z(]|[\s)/,;.:\]–—]|[-‐][A-Za-z]|$)`;

// 원소 + 첨자. lookbehind로 대문자 2개가 연속된 뒤(NCM811, IMC19)는 약어로 보고 제외.
// 대문자 1개 뒤(VO2, CO2, WS2, WSe2)는 화학식으로 인정.
const ELEMENT_SUB = new RegExp(String.raw`(?<![A-Z]{2})([A-Z][a-z]?)(${SUB_BODY})${SUB_END}`, 'g');

// 괄호 그룹 첨자: (LaFeO3)2
const GROUP_SUB = new RegExp(String.raw`(\))(${SUB_BODY})${SUB_END}`, 'g');

// 태그 바로 앞 구간 끝에 붙이는 표식 — SUB_END의 $가 거기서 성립하지 않게 해서
// L1<sub>0</sub>의 1처럼 직접 적은 첨자 옆 글자가 자동 첨자로 바뀌지 않게 한다.
const TAG_GUARD = '';

/**
 * 태그가 없는 plain text 구간의 첨자 자동 변환:
 *   - V_O → V<sub>O</sub>  (LaTeX-style underscore)
 *   - H2O, MoS2, VO2, WS2 → 끝 숫자가 첨자
 *   - B3N3-doped, HfO2-based → 뒤에 -단어가 와도 첨자
 *   - Hf0.5Zr0.5O2 → 소수 첨자 다중
 *   - Ti1-xHfxNiSn1-ySby → 변수형 첨자 (1-x, x, 1-y, y)
 *   - (LaFeO3)2 → (LaFeO<sub>3</sub>)<sub>2</sub>  (괄호 그룹 첨자)
 *
 * 일부러 처리하지 않음 (false positive 방지):
 *   - Cu(111), (0001) — Miller 지수, 괄호 안 정수는 첨자 X
 *   - 2024 (연도), 1st (순서) — 알파벳 prefix 없음
 *   - NCM811, IMC19 — 대문자 2개 연속 뒤는 약어로 판단
 *   - KSM2024-137, US12487196B2 — 4자리 이상 숫자는 첨자 X
 *
 * 자동 규칙이 못 푸는 경우(Bi2-XSbXTe3, L10, (LaFeO3)n)는 제목에 <sub>/<sup>를 직접 적는다.
 */
function autoSubscript(text: string): string {
  return escapeHtml(text)
    .replace(/([A-Za-z])_([A-Za-z0-9]+)/g, '$1<sub>$2</sub>')
    .replace(ELEMENT_SUB, '$1<sub>$2</sub>')
    .replace(GROUP_SUB, '$1<sub>$2</sub>');
}

/**
 * 제목 → 안전한 HTML. 직접 적은 <sub>/<sup>는 살리고(짝 안 맞는 태그는 보정),
 * 태그 밖 구간만 자동 첨자 변환한다. 태그 안은 적힌 그대로 escape만.
 */
export function formatChemistry(text: string): string {
  let html = '';
  let last = 0;
  const open: string[] = [];

  for (const m of text.matchAll(MARKUP_TAG)) {
    const segment = text.slice(last, m.index);
    html += open.length
      ? escapeHtml(segment)
      : autoSubscript(segment + TAG_GUARD).slice(0, -TAG_GUARD.length);
    last = m.index + m[0].length;

    const tag = m[2].toLowerCase();
    if (!m[1]) {
      open.push(tag);
      html += `<${tag}>`;
    } else if (open.at(-1) === tag) {
      open.pop();
      html += `</${tag}>`;
    }
    // 짝 없는 닫는 태그는 버린다
  }

  const rest = text.slice(last);
  html += open.length ? escapeHtml(rest) : autoSubscript(rest);
  // 닫히지 않은 태그는 끝에서 닫는다 — 제목 뒤 전체가 첨자로 번지지 않게
  while (open.length) html += `</${open.pop()}>`;
  return html;
}

/** 첨자 태그를 뗀 plain text — 키워드 매칭처럼 HTML이 아닌 곳에서 제목을 쓸 때 */
export const stripTitleMarkup = (text: string): string => text.replace(MARKUP_TAG, '');
