// Non-SCI 논문 + 특허 + 단행본 — /publications/non-sci-patents 페이지가 import해 렌더링
/**
 * 추가/수정 절차:
 *   1. 배열 맨 위(index 0)에 entry 추가, 역연대기 유지.
 *   2. kind 필드로 종류 구분 ('non-sci' | 'patent' | 'book').
 *   3. kind에 따라 채워야 할 필드:
 *      - non-sci: authors / title / journal / volumePages
 *      - patent: inventors / title (영문 또는 한글) / titleEn (영문 부역) / patentNo / status
 *                 (한국 특허는 applicationNo + applicationDate, granted면 registrationNo + registrationDate)
 *      - book: authors / title / publisher / isbn
 *   4. link 필드는 모든 종류에서 공용 (있으면 표시).
 *
 * 데이터 출처: 이전 사이트 Non-SCI & Patents 페이지
 *   https://sites.google.com/site/skkustem/publications/personsnamesnewwebsitewinswobbyaward (2026-05-09 마이그레이션)
 */

export interface NonSciOrPatent {
  number: number;
  year: number;
  kind: 'non-sci' | 'patent' | 'book';
  title: string;
  titleEn?: string;
  link?: string;
  // patent 전용
  region?: 'Korea' | 'USA';
  inventors?: string;
  patentNo?: string;
  applicationNo?: string;
  applicationDate?: string;
  registrationNo?: string;
  registrationDate?: string;
  status?: 'Granted' | 'Applied';
  // non-sci / book 전용
  authors?: string;
  journal?: string;
  volumePages?: string;
  publisher?: string;
  isbn?: string;
  publicationDate?: string;
}

export const nonSciAndPatents: NonSciOrPatent[] = [
  // ─────────────── 2025 ───────────────
  {
    number: 29,
    year: 2025,
    kind: 'patent',
    region: 'USA',
    inventors: 'Young-Min Kim, Eunha Lee, Myoungho Jeong, Young-Hoon Kim, Sang-Hyeok Yang',
    title: 'Automated Mapping Method of Crystalline Structure and Orientation of Polycrystalline Material with Deep Learning',
    patentNo: 'US12487196B2',
    registrationDate: 'December 2, 2025',
    status: 'Granted',
    link: 'https://patents.google.com/patent/US12487196B2/en',
  },
  {
    number: 28,
    year: 2025,
    kind: 'patent',
    region: 'Korea',
    inventors: '김윤석, 강승훈, 김영민, 장우성, 김선국, 조해원',
    title: '플루오라이트 산화물에서의 이온빔 조사를 통한 결정구조 제어',
    titleEn: 'Crystal structure control via ion beam irradiation in fluorite oxides',
    applicationNo: '10-2022-0125937',
    applicationDate: 'October 4, 2022',
    registrationNo: '10-2751803',
    registrationDate: 'January 3, 2025',
    status: 'Granted',
  },

  // ─────────────── 2023 ───────────────
  {
    number: 27,
    year: 2023,
    kind: 'patent',
    region: 'Korea',
    inventors: '김영민, 이은하, 정명호, 김영훈, 양상혁',
    title: '딥러닝 기반 다결정 소재의 결정 구조 및 배향 자동 맵핑법',
    titleEn: 'Deep learning-based automated mapping of polycrystalline crystal structure and orientation',
    applicationNo: '10-2022-0060095',
    applicationDate: 'May 17, 2022',
    status: 'Applied',
  },

  // ─────────────── 2022 ───────────────
  {
    number: 26,
    year: 2022,
    kind: 'non-sci',
    authors: 'Su Jae Kim, Young-Hoon Kim, Young-Min Kim, Se-Young Jeong',
    title: 'Grain Boundaries and Twin Boundaries in Cu(111) Thin Films',
    journal: 'New Physics: Sae Mulli',
    volumePages: '72, 812-820',
    link: 'https://www.npsm-kps.org/journal/view.html?volume=72&number=11&spage=812&year=2022',
  },

  // ─────────────── 2021 ───────────────
  {
    number: 25,
    year: 2021,
    kind: 'patent',
    region: 'Korea',
    inventors: '김영민, 한경탁, 이한길',
    title: '이산화티타늄 코어-쉘 구조체 및 이의 제조 방법',
    titleEn: 'Titanium dioxide core-shell structure and manufacturing method',
    applicationNo: '10-2020-0020803',
    applicationDate: 'February 20, 2020',
    registrationNo: '10-2308030',
    registrationDate: 'September 27, 2021',
    status: 'Granted',
  },
  {
    number: 24,
    year: 2021,
    kind: 'patent',
    region: 'Korea',
    inventors: '박호석, 박재민, 강민수, 박태호, 고영훈, 김영민, 장우성, 나카니베즈, 푸리타',
    title: '포스포린-니켈 인화물 복합체 및 이의 제조방법',
    titleEn: 'Phosphorin-nickel phosphide complex and manufacturing method',
    applicationNo: '10-2021-0060412',
    applicationDate: 'May 11, 2021',
    status: 'Applied',
  },
  {
    number: 23,
    year: 2021,
    kind: 'non-sci',
    authors: 'Soo Ho Choi, Ji Hoon Choi, Chang Seok Oh, Gyeongtak Han, Hu Young Jeong, Young-Min Kim, Soo Min Kim, Ki Kang Kim',
    title: 'Universal transfer of 2D materials grown on Au substrate using sulfur intercalation',
    journal: 'Applied Science and Convergence Technology',
    volumePages: '30(2), 165-168',
    link: 'https://www.e-asct.org/journal/view.html?doi=10.5757/ASCT.2021.30.2.45',
  },
  {
    number: 22,
    year: 2021,
    kind: 'patent',
    region: 'Korea',
    inventors: '김윤석, 강승훈, 김세라, 양희준, 설대희, 김영민, 장우성, 이재광, 전세라',
    title: '점 결함 생성을 통한 원자 단위의 플렉소일렉트릭 효과 및 압전성 발현',
    titleEn: 'Atomic-level flexoelectric and piezoelectric effects via point defect generation',
    applicationNo: '10-2019-0073959',
    applicationDate: 'June 21, 2019',
    registrationNo: '10-2220805',
    registrationDate: 'February 22, 2021',
    status: 'Granted',
  },

  // ─────────────── 2020 ───────────────
  {
    number: 21,
    year: 2020,
    kind: 'patent',
    region: 'Korea',
    inventors: '김영민, 장우성, 이한길',
    title: '전이금속의 침입형 원자자리 도핑법에 의해 제조된 SnO2 나노입자',
    titleEn: 'SnO2 nanoparticles via interstitial-site doping of transition metals',
    applicationNo: '10-2019-0058530',
    applicationDate: 'May 20, 2019',
    registrationNo: '10-2190605',
    registrationDate: 'December 8, 2020',
    status: 'Granted',
  },
  {
    number: 20,
    year: 2020,
    kind: 'non-sci',
    authors: '김영민',
    title: '투과전자현미경 기반 돌연경계의 원자레벨 구조-화학 분석',
    titleEn: 'Atomic-level TEM analysis of grain boundaries',
    journal: '물리학과 첨단기술',
    volumePages: 'July/August, 13-20',
    link: 'https://webzine.kps.or.kr/?p=5_view&idx=40',
  },

  // ─────────────── 2019 ───────────────
  {
    number: 19,
    year: 2019,
    kind: 'patent',
    region: 'Korea',
    inventors: '심재현, 김영민, 오상호',
    title: '이차전지 양극 활물질용 전구체, 이의 제조 방법 및 이를 이용한 이차전지용 양극 활물질의 제조 방법',
    titleEn: 'Battery cathode active material precursor and manufacturing method',
    registrationNo: '10-2016156',
    registrationDate: 'August 23, 2019',
    status: 'Granted',
  },
  {
    number: 18,
    year: 2019,
    kind: 'book',
    authors: '김양수, 김영민, 송호준, 조덕용 (역)',
    title: '신판 처음배우는 전자상태 계산: DV-Xa 분자궤도법 입문',
    titleEn: 'Introduction to electronic state calculation (DV-Xα molecular orbital method) — translated',
    publisher: '전북대학교출판문화원',
    isbn: '979-11-6372-043-0',
    publicationDate: 'September 30, 2019',
  },

  // ─────────────── 2017 ───────────────
  {
    number: 17,
    year: 2017,
    kind: 'non-sci',
    authors: '김영민',
    title: '원자단위 분석 주사투과전자현미경',
    titleEn: 'Atomic-level analytical scanning transmission electron microscopy',
    journal: 'Ceramist',
    volumePages: '20(2), 66-73',
    link: 'http://www.ceramics.or.kr/ceramist/journal_view.php?pg=1&cd=&ty=&jn=&bn=&au=&ti=&su=&kw=&sd=&ed=&jc=594a1b598c2a6',
  },

  // ─────────────── 2010 ───────────────
  {
    number: 16,
    year: 2010,
    kind: 'non-sci',
    authors: 'Jin-Gyu Kim, Sang Ho Oh, Kyung Song, Seung Jo Yoo, Young-Min Kim',
    title: 'VirtualDub as a useful program for video recording in real-time TEM analysis',
    journal: 'Korean J. Electron Microsc.',
    volumePages: '40, 47',
    link: 'http://www.koreascience.or.kr/article/ArticleFullRecord.jsp?cn=JJHMBC_2010_v40n1_47',
  },

  // ─────────────── 2009 ───────────────
  {
    number: 15,
    year: 2009,
    kind: 'non-sci',
    authors: 'Sang Ho Oh, Joo-Hyoung Choi, Kyung Song, Jong-Man Jeung, Jin-Gyu Kim, In Keun Yu, Suk Jae Yoo, Young-Min Kim',
    title: 'Cross-sectional TEM specimen preparation of GaN-based thinfilm materials using alumina dummy filler',
    journal: 'Korean J. Electron Microsc.',
    volumePages: '39, 277',
    link: 'http://www.koreascience.or.kr/article/ArticleFullRecord.jsp?cn=JJHMBC_2009_v39n3_277',
  },
  {
    number: 14,
    year: 2009,
    kind: 'non-sci',
    authors: 'Young-Min Kim, Joo-Hyoung Choi, Kyung Song, Yang-Soo Kim, Youn-Joong Kim',
    title: 'Experimentally minimized contaminative condition of carbonaceous artifacts in transmission electron microscope',
    journal: 'Korean J. Electron Microsc.',
    volumePages: '39, 73',
    link: 'http://www.koreascience.or.kr/article/ArticleFullRecord.jsp?cn=JJHMBC_2009_v39n1_73',
  },
  {
    number: 13,
    year: 2009,
    kind: 'non-sci',
    authors: 'Jin-Gyu Kim, Young-Min Kim, Youn-Joong Kim, Sang-Hee Lee, Kimin Hong, Sang Ho Oh',
    title: 'Estimation of electron dose rate using CCD camera',
    journal: 'Korean J. Electron Microsc.',
    volumePages: '39, 79',
    link: 'http://www.koreascience.or.kr/article/ArticleFullRecord.jsp?cn=JJHMBC_2009_v39n1_79',
  },
  {
    number: 12,
    year: 2009,
    kind: 'non-sci',
    authors: 'H.J. Kim, W.J. Moon, Y.-M. Kim, K.S. Bae, J.S. Yoon, Y.M. Lee, J.S. Gook, Y.S. Kim',
    title: 'First principles study on factors determining battery voltages of TiS2 and TiO2',
    journal: 'J. Kor. Inst. Surf. Eng.',
    volumePages: '42(1), 8-12',
    link: 'http://www.koreascience.or.kr/article/ArticleFullRecord.jsp?cn=PMGHBJ_2009_v42n1_8',
  },

  // ─────────────── 2008 ───────────────
  {
    number: 11,
    year: 2008,
    kind: 'non-sci',
    authors: 'Young-Min Kim, Jin-Gyu Kim, Yang-Soo Kim, Sang Ho Oh, Youn-Joong Kim',
    title: 'Practical issues on in situ heating experiments in transmission electron microscope',
    journal: 'Korean J. Electron Microsc.',
    volumePages: '38, 383',
    link: 'http://www.koreascience.or.kr/article/ArticleFullRecord.jsp?cn=JJHMBC_2008_v38n4_383',
  },
  {
    number: 10,
    year: 2008,
    kind: 'non-sci',
    authors: 'Young-Min Kim, Yang-Soo Kim, Jin-Gyu Kim, Jeong Yong Lee, Youn-Joong Kim',
    title: 'Imaging plate technique for the electron diffraction study of a radiation-sensitive material under electron beam',
    journal: 'Korean J. Electron Microsc.',
    volumePages: '38, 185',
    link: 'http://www.koreascience.or.kr/article/ArticleFullRecord.jsp?cn=JJHMBC_2008_v38n3_185',
  },

  // ─────────────── 2007 ───────────────
  {
    number: 9,
    year: 2007,
    kind: 'non-sci',
    authors: 'Se Ahn Song, Liudmila I. Fedina, Hionsuck Baik, Youn-Joong Kim, Young-Min Kim, Anton K. Gutakovskii, Alexander V. Latyshev',
    title: 'New compositionally-ordered GeSi nanodots fabricated with 1250 keV electrons',
    journal: 'Adv. Mater. Res.',
    volumePages: '26-28, 1195',
  },
  {
    number: 8,
    year: 2007,
    kind: 'non-sci',
    authors: 'Young-Min Kim, Hyo-Sik Shim, Youn-Joong Kim',
    title: 'Measurement of spherical aberration coefficient of the objective lens in KBSI-HVEM',
    journal: 'Korean J. Electron Microsc.',
    volumePages: '37, 111',
    link: 'http://www.koreascience.or.kr/article/ArticleFullRecord.jsp?cn=JJHMBC_2007_v37n2_111',
  },
  {
    number: 7,
    year: 2007,
    kind: 'non-sci',
    authors: 'Chang-Kyu Lee, Jong-Sung Kwon, In-Chul Na, Byung-Il Han, Young-Min Kim, Jae-Gun Park',
    title: 'Dependency of electrical characteristics on Au nano-crystal size for non-volatile memory fabricated with Au nano-crystal embedded in PVK(poly(N-vinylcarbazole)) layer',
    journal: 'Solid State Phenom.',
    volumePages: '124-126, 33',
    link: 'http://www.scientific.net/SSP.124-126.33',
  },

  // ─────────────── 2006 ───────────────
  {
    number: 6,
    year: 2006,
    kind: 'non-sci',
    authors: 'Jin-Gyu Kim, Jong-Man Jeong, Young-Min Kim, Youn-Joong Kim',
    title: 'Reliability test of the TEM rotation holder for 3-D structure analysis',
    journal: 'Korean J. Electron Microsc.',
    volumePages: '36, 209',
    link: 'http://www.koreascience.or.kr/article/ArticleFullRecord.jsp?cn=JJHMBC_2006_v36n3_209',
  },
  {
    number: 5,
    year: 2006,
    kind: 'non-sci',
    authors: 'Jin-Gyu Kim, Young-Min Kim, Ji-Soo Kim, Youn-Joong Kim',
    title: 'HVEM application to electron crystallography: Structure refinement of SmZn0.67Sb2',
    journal: 'Korean J. Electron Microsc.',
    volumePages: '36 (Special Issue 1), 1',
    link: 'http://www.koreascience.or.kr/article/ArticleFullRecord.jsp?cn=JJHMBC_2006_v36nspc1_1',
  },

  // ─────────────── 2005 ───────────────
  {
    number: 4,
    year: 2005,
    kind: 'non-sci',
    authors: 'Young-Min Kim, Hyo-Sik Shim, Youn-Joong Kim',
    title: 'Enlargement of field-of-view (FOV) of the CCD camera by the current adjustment of the projection lens system in the KBSI-HVEM',
    journal: 'Korean J. Electron Microsc.',
    volumePages: '35, 289',
    link: 'http://www.koreascience.or.kr/article/ArticleFullRecord.jsp?cn=JJHMBC_2005_v35n4_98',
  },

  // ─────────────── 2004 ───────────────
  {
    number: 3,
    year: 2004,
    kind: 'non-sci',
    authors: 'Young-Min Kim, Jin-Gyu Kim, Youn-Joong Kim, Man-Hoi Hur, Kyung-Hoon Kwon',
    title: 'First remote operation of the high voltage electron microscope newly installed in KBSI',
    journal: 'Korean J. Electron Microsc.',
    volumePages: '34, 13',
    link: 'http://www.koreascience.or.kr/article/ArticleFullRecord.jsp?cn=JJHMBC_2004_v34n1_13',
  },

  // ─────────────── 2003 ───────────────
  {
    number: 2,
    year: 2003,
    kind: 'non-sci',
    authors: 'Young-Min Kim, Youn-Joong Kim',
    title: 'Accurate interpretation of electron diffraction data acquired by imaging plate',
    journal: 'Korean J. Electron Microsc.',
    volumePages: '33, 195',
    link: 'http://www.koreascience.or.kr/article/ArticleFullRecord.jsp?cn=JJHMBC_2003_v33n3_195',
  },

  // ─────────────── 2002 ───────────────
  {
    number: 1,
    year: 2002,
    kind: 'non-sci',
    authors: 'Young-Min Kim, Jong Man Jeung, Sujeong Lee, Youn-Joon Kim',
    title: 'TEM specimen preparation method of gibbsite powder for quantitative structure analysis',
    journal: 'Korean J. Electron Microsc.',
    volumePages: '32, 311',
    link: 'http://www.koreascience.or.kr/article/ArticleFullRecord.jsp?cn=JJHMBC_2002_v32n4_311',
  },
];
