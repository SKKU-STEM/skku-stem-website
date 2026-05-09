// 화학식/물리 첨자 자동 포매팅 — 데이터 파일에 plain text로 저장된 화학식을 <sub> 태그로 변환
// 출력은 HTML이므로 Astro 템플릿에서 set:html 또는 <Fragment set:html={...}>로 렌더링

const HTML_ESCAPE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escapeHtml = (text: string): string =>
  text.replace(/[&<>"']/g, (ch) => HTML_ESCAPE[ch] ?? ch);

/**
 * 화학식 첨자 자동 변환:
 *   - V_O → V<sub>O</sub>  (LaTeX-style underscore)
 *   - H2O, MoS2, BiFeO3 → 끝 숫자가 첨자
 *   - Hf0.5Zr0.5O2 → 소수 첨자 다중
 *   - Ti1-xHfxNiSn1-ySby → 변수형 첨자 (1-x, x, 1-y, y)
 *   - (LaFeO3)2 → (LaFeO<sub>3</sub>)<sub>2</sub>  (괄호 그룹 첨자)
 *
 * 일부러 처리하지 않음 (false positive 방지):
 *   - Cu(111), (0001) — Miller 지수, 괄호 안 정수는 첨자 X
 *   - 2024 (연도), 1st (순서) — 알파벳 prefix 없음
 *   - KSM2024-137, BK21 — 'K2', 'M2024' 등 단일대문자+숫자는 lookbehind로 차단
 *     (선행 대문자가 있으면 element로 인식하지 않음 → BK의 K는 K가 아닌 약어 일부)
 *
 * 입력은 escape됨 — &, <, > 같은 HTML 특수문자 안전.
 * 결과를 set:html로 렌더링 가능.
 */
export function formatChemistry(text: string): string {
  let result = escapeHtml(text);

  // 1. LaTeX-style 첨자: V_O, A_BC
  result = result.replace(
    /([A-Za-z])_([A-Za-z0-9]+)/g,
    '$1<sub>$2</sub>'
  );

  // 2. 화학식 첨자 (원소 + 숫자/변수)
  // - 원소: 대문자 + 옵션 소문자 (Hf, Cu, Bi, H, O 등)
  // - lookbehind: 선행 대문자가 있으면 매칭 X — KSM2024 같은 약어 차단
  // - 첨자 본문: 숫자(소수 가능, 옵션 -x/-y/-z) 또는 변수 x/y/z 반복
  // - lookahead: 다음 문자가 대문자 또는 공백/구두점/괄호/슬래시 (다른 숫자나 -숫자 차단)
  result = result.replace(
    /(?<![A-Z])([A-Z][a-z]?)((?:\d+(?:\.\d+)?(?:[-‐−][a-z])?|[xyz])+)(?=[A-Z]|[\s)/,;.:\]]|$)/g,
    '$1<sub>$2</sub>'
  );

  // 3. 괄호 그룹 첨자: )2, )3 등 — (LaFeO3)2 같은 케이스
  result = result.replace(
    /(\))(\d+(?:\.\d+)?(?:[-‐−][a-z])?|[xyz])(?=[A-Z]|[\s)/,;.:\]]|$)/g,
    '$1<sub>$2</sub>'
  );

  return result;
}
