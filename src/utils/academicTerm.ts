// 학사 일정(3월 1학기 / 9월 2학기) 기준으로 멤버 기수를 계산하는 유틸
// 빌드 서버가 UTC로 돌아도 학기 경계는 KST로 판정한다.

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 지금 시각을 KST 달력 날짜로 (UTC getter로 읽으면 KST 연·월이 나온다). */
export const nowInKst = (): Date => new Date(Date.now() + KST_OFFSET_MS);

/** 학기 일련번호. 3~8월은 그 해 1학기, 9~12월과 이듬해 1~2월은 그 해 2학기. */
const termIndex = (d: Date): number => {
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  if (month >= 9) return year * 2 + 1;
  if (month >= 3) return year * 2;
  return (year - 1) * 2 + 1;
};

/** 기수: 입학 학기가 1기, 이후 3월·9월이 될 때마다 +1. */
export const cohortTerm = (start: Date, now: Date): number =>
  Math.max(0, termIndex(now) - termIndex(start)) + 1;
