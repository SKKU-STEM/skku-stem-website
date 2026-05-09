// Gallery 이벤트 메타데이터 — /gallery 페이지가 import해 렌더링
/**
 * 새 이벤트 추가:
 *   1. 배열 맨 위(index 0)에 entry 추가 — 역연대기 유지
 *   2. 필수 필드: slug / year / date / title / photoCount
 *   3. 선택: titleEn / location / participants / awards
 *   4. 사진은 src/assets/gallery/<slug>-<i>.{jpg,jpeg,png,webp} 형태로 저장
 *      자세한 명명 규칙은 src/assets/gallery/README.md 참고
 *
 * 데이터 출처: 이전 사이트 Group Photos 페이지
 *   https://sites.google.com/site/skkustem/upcoming-seminars (2026-05-09 마이그레이션)
 *
 * 사진 호스팅 변경: 옛 페이지는 Google CDN(lh3.googleusercontent.com)에서 호스팅했으나
 *   외부에서 직접 다운로드 시 403 Forbidden을 반환. 따라서 이 사이트에서는 사용자가
 *   브라우저로 옛 페이지에서 우클릭 저장 후 src/assets/gallery/에 드롭하는 방식으로 옮긴다.
 */

export interface GalleryEvent {
  slug: string;          // src/assets/gallery/<slug>-<i>.jpg 의 prefix
  year: number;
  date: string;          // verbatim, e.g. "Feb. 10–13, 2026"
  title: string;         // 영문 또는 한글 (이전 사이트 표기 그대로)
  titleEn?: string;      // 한글 제목인 경우 영문 부역
  location?: string;
  participants?: string; // verbatim, e.g. "Min-Hyoung Jung – Oral; Sang-Hyeok Yang – Poster"
  awards?: string;       // verbatim, e.g. "Best Oral Award (SF10): Young-Hoon Kim, $300"
  photoCount: number;    // 옛 페이지 기준 사진 수 — 페이지가 이만큼 슬롯을 표시
}

export const galleryEvents: GalleryEvent[] = [
  // ─────────────── 2026 ───────────────
  {
    slug: '2026-eels-school',
    year: 2026,
    date: 'Feb. 10–13, 2026',
    title: 'European EELS & EFTEM School',
    location: 'TU Graz, Austria',
    participants: 'Eun-Byeol Park, Yerin Jeon',
    photoCount: 1,
  },
  {
    slug: '2026-bk-thesis',
    year: 2026,
    date: 'Jan. 15, 2026',
    title: 'The 11th BK DOES Thesis Competition',
    location: 'Suwon, Korea',
    awards:
      'Oral, Excellence award: 전예린 (Yerin Jeon) · Poster, Encouragement award: 박은별 (Eun-Byeol Park)',
    photoCount: 5,
  },

  // ─────────────── 2025 ───────────────
  {
    slug: '2025-graduation-feb25',
    year: 2025,
    date: 'Feb. 25–26, 2025',
    title: 'Gathering to celebrate the graduation',
    photoCount: 2,
  },
  {
    slug: '2025-ksm-fall',
    year: 2025,
    date: 'Nov. 20–21, 2025',
    title: '2025년 한국현미경학회 추계학술대회',
    titleEn: 'Korean Society of Microscopy Fall Conference 2025',
    location: 'Osong Convention center, Cheongju, Korea',
    participants: 'Sang-Hyeok Yang — Oral presentation',
    photoCount: 1,
  },
  {
    slug: '2025-ksas-fall',
    year: 2025,
    date: 'Nov. 5–7, 2025',
    title: '2025년 한국표면분석학회',
    titleEn: 'Korean Surface Analysis Society 2025',
    location: 'KW Convention center, Daejeon, Korea',
    participants: 'Daehee Yang, Seon Je Kim — Oral presentations',
    photoCount: 4,
  },
  {
    slug: '2025-mm',
    year: 2025,
    date: 'July 27–31, 2025',
    title: 'Microscopy & Microanalysis 2025 (M&M2025)',
    location: 'Salt Lake City, Utah',
    participants:
      'Min-Hyoung Jung — Oral presentation; Sang-Hyeok Yang — Poster presentation',
    photoCount: 3,
  },
  {
    slug: '2025-cnms',
    year: 2025,
    date: 'Jun. 4–16, 2025',
    title: '2025 CNMS User Project',
    location: 'Oak Ridge National Laboratory, Tennessee',
    participants: 'Sang-Hyeok Yang, Min-Hyoung Jung, Eun-Byeol Park, Yerin Jeon',
    photoCount: 1,
  },
  {
    slug: '2025-ksm-spring',
    year: 2025,
    date: 'May 28–30, 2025',
    title: '2025년 한국현미경학회 춘계학술대회',
    titleEn: 'Korean Society of Microscopy Spring Conference 2025',
    location: 'Yonsei University, Korea',
    photoCount: 3,
  },
  {
    slug: '2025-fellowship',
    year: 2025,
    date: 'Feb. 19, 2025',
    title: '2024 SKKU Fellowship 교수 선정',
    titleEn: '2024 SKKU Fellowship — Prof. Y.-M. Kim',
    photoCount: 1,
  },
  {
    slug: '2025-graduation-feb24',
    year: 2025,
    date: 'Feb. 24, 2025',
    title: 'Gathering to celebrate the graduation',
    photoCount: 6,
  },
  {
    slug: '2025-bk-thesis',
    year: 2025,
    date: 'Feb. 6–7, 2025',
    title: '2024 BK 논문경진대회 (10th BK DOES Thesis Competition)',
    location: 'Konjiam, Korea',
    awards:
      'Oral, Encouragement award: 주현아 (Hyeon-Ah Ju) · Poster, Excellence awards: 주현아 (Hyeon-Ah Ju), 정민형 (Min-Hyoung Jung)',
    photoCount: 5,
  },

  // ─────────────── 2024 ───────────────
  {
    slug: '2024-dinner-dec26',
    year: 2024,
    date: 'Dec. 26, 2024',
    title: 'Group dinner',
    photoCount: 1,
  },
  {
    slug: '2024-yearend',
    year: 2024,
    date: 'Dec. 5, 2024',
    title: 'Gathering for the year-end dinner',
    photoCount: 2,
  },
  {
    slug: '2024-enge',
    year: 2024,
    date: 'Nov. 24–27, 2024',
    title: '2024 Electronic Materials and Nanotechnology (ENGE)',
    location: 'Jeju, Korea',
    participants:
      'Oral (15-0512): Min-Hyoung Jung · Posters (1-0575, 11-0495): Eun-Byeol Park, Yerin Jeon',
    photoCount: 4,
  },
  {
    slug: '2024-ksm-spring',
    year: 2024,
    date: 'May 30–31, 2024',
    title: '2024년 한국현미경학회 춘계학술대회',
    titleEn: 'Korean Society of Microscopy Spring Conference 2024',
    location: 'Hongcheon, Korea',
    participants:
      'Oral (KSM2024-137): Min-Hyoung Jung · Oral (KSM2024-138): Sang-Hyeok Yang · Poster (KSM2024-142): Yerin Jeon',
    photoCount: 2,
  },
  {
    slug: '2024-kcers-spring',
    year: 2024,
    date: 'Apr. 17–19, 2024',
    title: '2024년 한국세라믹학회 춘계학술대회',
    titleEn: 'Korean Ceramic Society Spring Conference 2024',
    location: 'Busan, Korea',
    awards:
      'KcerS Excellence award (Oral, 제 2024-32호): 주현아 (Hyeon-Ah Ju)',
    photoCount: 2,
  },
  {
    slug: '2024-hiking-spring',
    year: 2024,
    date: 'April 9, 2024',
    title: 'Spring hiking, Gwanggyosan',
    photoCount: 1,
  },
  {
    slug: '2024-commencement-winter',
    year: 2024,
    date: 'Feb. 2024',
    title: '2024학년도 겨울 학위수여식',
    titleEn: 'Commencement Winter 2024',
    participants: 'Wooseon and Young-Hoon — Congratulations on your graduation!',
    photoCount: 2,
  },
  {
    slug: '2024-samsung-humantech',
    year: 2024,
    date: 'Feb. 7, 2024',
    title: '제 30회 삼성휴먼테크논문대상',
    titleEn: '30th Samsung Humantech Paper Award',
    location: 'Samsung Electronics Co., Ltd.',
    awards:
      'Encouragement Prize (₩2,000,000): 주현아 (Hyeon-Ah Ju), 박은별 (Eun-Byeol Park)',
    photoCount: 3,
  },
  {
    slug: '2024-bk-thesis',
    year: 2024,
    date: 'Jan. 12, 2024',
    title: 'The 9th BK DOES Thesis Competition',
    location: 'Suwon, Korea',
    awards:
      'Oral, Grand Prize (₩2,000,000): 김영훈 (Young-Hoon Kim) · Poster, Excellence Award: 정민형 (Min-Hyoung Jung)',
    photoCount: 2,
  },

  // ─────────────── 2023 ───────────────
  {
    slug: '2023-dinner-nov06',
    year: 2023,
    date: 'November 6, 2023',
    title: 'Group Dinner',
    location: 'Novotel Ambassador The Square Suwon',
    photoCount: 2,
  },
  {
    slug: '2023-skku-paper',
    year: 2023,
    date: '2023',
    title: '2023 SKKU 대학원생 논문대상',
    titleEn: '2023 SKKU Graduate Student Paper Award',
    location: 'SKKU, Korea',
    awards: 'Excellence award (₩4,000,000): 김선제 (Seon Je Kim)',
    photoCount: 3,
  },
  {
    slug: '2023-imc20',
    year: 2023,
    date: 'Sep. 10–15, 2023',
    title: 'The 20th International Microscopy Congress (IMC20)',
    location: 'Busan, Korea',
    photoCount: 2,
  },
  {
    slug: '2023-mm',
    year: 2023,
    date: 'Jul. 23–27, 2023',
    title: 'Microscopy & Microanalysis 2023 (M&M2023)',
    location: 'Minneapolis, Minnesota',
    awards: 'M&M Student Scholar Award ($1,000): Young-Hoon Kim',
    participants: 'Oral presentations: Young-Hoon Kim, Seon Je Kim',
    photoCount: 2,
  },
  {
    slug: '2023-group-jun15',
    year: 2023,
    date: 'June 15, 2023',
    title: 'Group photo',
    photoCount: 1,
  },
  {
    slug: '2023-group-may31',
    year: 2023,
    date: 'May 31, 2023',
    title: 'Group photo',
    photoCount: 4,
  },
  {
    slug: '2023-eels-training',
    year: 2023,
    date: 'Apr. 3–6, 2023',
    title: '2023 EELS & EFTEM Analysis Training School',
    location: 'Pleasanton, California',
    participants: 'Sang-Hyeok Yang, Daehee Yang',
    photoCount: 3,
  },
  {
    slug: '2023-samsung-humantech',
    year: 2023,
    date: 'Feb. 20, 2023',
    title: '제 29회 삼성휴먼테크논문대상',
    titleEn: '29th Samsung Humantech Paper Award',
    location: 'Samsung Electronics Co., Ltd.',
    awards:
      'Silver Prize (₩7,000,000): 김영훈 (Young-Hoon Kim, 1st author)',
    photoCount: 2,
  },
  {
    slug: '2023-commencement-winter',
    year: 2023,
    date: 'Feb. 2023',
    title: '2023학년도 겨울 학위수여식',
    titleEn: 'Commencement Winter 2023',
    participants: 'Woo-Sung — Congratulations on your Graduation!',
    photoCount: 1,
  },
  {
    slug: '2023-bk21-award',
    year: 2023,
    date: '2023',
    title: '2022년도 4단계 BK21 사업 우수 참여인력 표창',
    titleEn: '2022 BK21 Phase 4 Outstanding Participant Award',
    awards:
      '장우성 (Woo-Sung Jang) — 부총리 겸 교육부장관 표창 (Deputy Prime Minister and Minister of Education Award)',
    photoCount: 16,
  },
  {
    slug: '2023-bk-thesis',
    year: 2023,
    date: 'Jan. 12–13, 2023',
    title: '2022 BK 논문경진대회',
    titleEn: 'The 8th BK DOES Thesis Competition',
    location: 'Konjiam, Korea',
    awards:
      'Oral, Excellence award (₩1,500,000): 장우성 (Woo-Sung Jang) · Oral, Encouragement (₩1,000,000): 김영훈 (Young-Hoon Kim) · Poster, Grand award (₩1,000,000): 김영훈 (Young-Hoon Kim) · Poster, Encouragement (₩500,000 each): 장우성 (Woo-Sung Jang), 양상혁 (Sang-Hyeok Yang)',
    photoCount: 5,
  },

  // ─────────────── 2022 ───────────────
  {
    slug: '2022-research-promotion',
    year: 2022,
    date: '2022',
    title: '2022년 기초연구진흥유공자 포상',
    titleEn: '2022 Basic Research Promotion Distinguished Service Award',
    awards: '제22-03458호 — 김영민 교수, 과학기술정보통신부장관표창',
    photoCount: 2,
  },
  {
    slug: '2022-top10-nano',
    year: 2022,
    date: '2022',
    title: '2022년 10대 나노기술 우수연구개발성과 선정',
    titleEn: '2022 Top 10 Nanotechnology R&D Achievements',
    awards: '정세영 교수 (부산대학교), 김영민 교수 (성균관대학교)',
    photoCount: 2,
  },
  {
    slug: '2022-kcers-fall',
    year: 2022,
    date: 'Oct. 26–28, 2022',
    title: '2022년 한국세라믹학회 추계학술대회',
    titleEn: 'Korean Ceramic Society Fall Conference 2022',
    location: 'Seoul, Korea',
    awards:
      'PACRIM award (제 2022-143호, ₩1,000,000): Young-Hoon Kim (Oral presentation)',
    photoCount: 2,
  },
  {
    slug: '2022-hiking-fall',
    year: 2022,
    date: 'Sept. 30, 2022',
    title: 'Fall hiking — group photo',
    photoCount: 1,
  },
  {
    slug: '2022-commencement-summer',
    year: 2022,
    date: 'Aug. 2022',
    title: '2022학년도 여름 학위수여식',
    titleEn: 'Commencement Summer 2022',
    participants: 'Congratulations on your Graduation!',
    photoCount: 4,
  },
  {
    slug: '2022-ksm-spring',
    year: 2022,
    date: 'June 30 – July 1, 2022',
    title: '2022년 한국현미경학회 춘계학술대회',
    titleEn: 'Korean Society of Microscopy Spring Conference 2022',
    location: 'Daegu, Korea',
    awards:
      'Excellence awards (KSM2022-179, KSM2022-181): 김영훈 (Young-Hoon Kim), 최우선 (Wooseon Choi)',
    participants:
      'Oral presentations: 최우선 (MS4-15), 장우성 (MS5-12), 양상혁 (MS3-13), 김영훈 (MS3-15), 홍정아 (MS2-11), 김선제 (MS4-14) · Special session 6: Prof. Young-Min Kim',
    photoCount: 9,
  },
  {
    slug: '2022-ytn-stem',
    year: 2022,
    date: '2022',
    title: '김영훈 — STEM 실험 시연',
    titleEn: 'Young-Hoon Kim — STEM experiment demonstration',
    location: 'YTN 사이언스 — K 사이언티스트',
    photoCount: 3,
  },
  {
    slug: '2022-mrs',
    year: 2022,
    date: 'May 8–13, 2022',
    title: '2022년 미국재료학회 (MRS)',
    titleEn: 'Materials Research Society (MRS) 2022',
    location: 'Salt Lake City',
    awards:
      'Best Oral Presentation Award (SF10, $300): 김영훈 (Young-Hoon Kim) · Best Poster Award (SF10, $300): 양상혁 (Sang-Hyeok Yang)',
    participants:
      'Oral presentations (SF10, EQ02): 최우선 (Wooseon Choi), 장우성 (Woo-Sung Jang), 정민형 (Min-Hyoung Jung)',
    photoCount: 8,
  },
  {
    slug: '2022-research-matters',
    year: 2022,
    date: 'Mar. 11, 2022',
    title: '제 2회 대학원연구성과경진대회',
    titleEn: 'The 2nd SKKU Research Matters',
    awards: '1st Prize (Presidential Award, ₩2,000,000): 장우성 (Woo-Sung Jang)',
    photoCount: 2,
  },
  {
    slug: '2022-samsung-humantech',
    year: 2022,
    date: 'Feb. 15, 2022',
    title: '제 28회 삼성휴먼테크논문대상',
    titleEn: '28th Samsung Humantech Paper Award',
    location: 'Samsung Electronics Co., Ltd.',
    awards:
      'Bronze Prize (₩5,000,000): 김영훈 (Young-Hoon Kim, 1st author), 양상혁 (Sang-Hyeok Yang, 1st co-author)',
    photoCount: 2,
  },

  // ─────────────── 2021 ───────────────
  {
    slug: '2021-kcers-fall',
    year: 2021,
    date: 'Nov. 3–5, 2021',
    title: '2021년 한국세라믹학회 추계학술대회',
    titleEn: 'Korean Ceramic Society Fall Conference 2021',
    location: 'Jeju, Korea',
    participants:
      'Keynote: Prof. Young-Min Kim — "Deep learning electron crystallography for polycrystalline high-k oxide ultrathin films" · Orals: Young-Hoon Kim, Wooseon Choi, Min-Hyoung Jung, Sang-Hyeok Yang',
    awards:
      'PACRIM Award (Oral, ₩1,000,000): Woo-Sung Jang · KcerS Excellence (Poster): Young-Hoon Kim · Yang Song Poster Award: Hyeon-Ah Ju',
    photoCount: 13,
  },
  {
    slug: '2021-skku-paper',
    year: 2021,
    date: '2021',
    title: '2021 SKKU 대학원생 논문대상',
    titleEn: '2021 SKKU Graduate Student Paper Award',
    location: 'SKKU, Korea',
    awards: 'Encouragement Award (₩4,000,000): Wooseon Choi',
    photoCount: 2,
  },
  {
    slug: '2021-bk-thesis',
    year: 2021,
    date: '2021',
    title: '2021 BK 논문경진대회 (The 7th BK DOES Thesis Competition)',
    location: 'SKKU, Korea',
    awards:
      'Oral Encouragement (₩1,000,000): Sang-Hyeok Yang · Poster Encouragement: Young-Hoon Kim (₩800,000), Wooseon Choi (₩600,000)',
    photoCount: 4,
  },

  // ─────────────── 2020 ───────────────
  {
    slug: '2020-ksm-fall',
    year: 2020,
    date: '2020',
    title: 'The 2020 Autumn Korea Society of Microscopy',
    location: 'Pyeongchang, Korea',
    participants:
      'Jung A. Hong, Seon Je Kim, Woo-Sung Jang, Min-Hyoung Jung, Daehee Yang',
    awards: 'Best Poster Award: Woo-Sung Jang',
    photoCount: 5,
  },
  {
    slug: '2020-enge',
    year: 2020,
    date: '2020',
    title:
      'The 6th International Conference on Electronic Materials and Nanotechnology for Green Environment (ENGE)',
    location: 'Jeju, Korea',
    participants: 'Oral presentations: Young-Hoon Kim, Sang-Hyeok Yang',
    photoCount: 2,
  },
  {
    slug: '2020-muju-school',
    year: 2020,
    date: 'Jan. 12–16, 2020',
    title: 'The 6th Muju International Winter School Series (MIWS2-2020)',
    location: 'Deogyusan Resort, Muju, Korea',
    participants:
      'Poster presentations: Wooseon Choi, Woo-Sung Jang, Gyeongtak Han, Young-Hoon Kim',
    photoCount: 4,
  },

  // ─────────────── 2019 ───────────────
  {
    slug: '2019-hiking-fall',
    year: 2019,
    date: 'October 2019',
    title: 'Fall hiking with a new member',
    participants: 'Welcoming Daehee Yang',
    photoCount: 1,
  },
  {
    slug: '2019-eels-training',
    year: 2019,
    date: '2019',
    title: 'EELS & EFTEM Analysis Training School',
    location: 'Pleasanton, California',
    participants: 'Woo-Sung Jang, Young-Hoon Kim',
    photoCount: 1,
  },
  {
    slug: '2019-group-feb',
    year: 2019,
    date: 'February 2019',
    title: 'Group photo with new members',
    participants:
      'Gyeongtak Han, Woo-Sung Jang, Hyeon-Ah Ju, Seon Je Kim, Young-Min Kim (PI), Wooseon Choi, Min-Hyoung Jung, Sang-Hyeok Yang, Young-Hoon Kim, Yong In Kim',
    photoCount: 1,
  },
  {
    slug: '2019-kcers',
    year: 2019,
    date: '2019',
    title: 'The Korean Ceramic Society',
    location: 'Seoul, Korea',
    participants: 'Poster presentations: Woo-Sung Jang, Wooseon Choi',
    photoCount: 2,
  },

  // ─────────────── 2018 ───────────────
  {
    slug: '2018-imc19',
    year: 2018,
    date: '2018',
    title: 'International Microscopy Congress 19 (IMC19)',
    location: 'Sydney, Australia',
    participants:
      'Gyeongtak Han, Young-Hoon Kim, Yong In Kim, Young-Min Kim (PI), Wooseon Choi, Woo-Sung Jang · Oral presentations: Young-Hoon Kim, Woo-Sung Jang',
    photoCount: 6,
  },
];
