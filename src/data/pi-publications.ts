// Prof. Young-Min Kim의 selected publications — /people/pi 페이지가 import해 렌더링
/**
 * 새 논문 추가 절차:
 *   1. 해당 섹션 배열(`microscopyMaterialsScience` 또는 `aiMicroscopy`)
 *      맨 위(index 0)에 entry 한 개 추가 — 역연대기 순서 유지.
 *   2. 필수 필드: authors / title / journal / year.
 *   3. 선택 필드: volumePages / doi.
 *      - volumePages 예: '89(2), 028002' / '16, 1462' / '603(7901), 434-438'.
 *      - doi: full URL (예: 'https://doi.org/10.1038/s41467-025-12345-6'). 없으면 키 자체를 생략.
 *   4. authors는 plain 문자열. 이전 사이트 표기 그대로:
 *      - 동등 기여자는 이름 뒤에 † (예: 'Su Jae Kim†, Seon Je Kim†')
 *      - 교신저자는 이름 뒤에 * (예: 'Young-Min Kim*')
 *      페이지 하단에 † / * 의미를 안내하는 풋노트가 자동 표기되므로 별도 설명 불필요.
 *   5. 저장하면 dev 서버가 HMR로, 빌드 시에는 /people/pi 페이지에 자동 반영.
 *
 * 데이터 출처: 이전 SKKU-STEM 사이트 PI 페이지
 *   https://sites.google.com/site/skkustem/contact-us (2026-05-09 마이그레이션)
 */

export interface Publication {
  authors: string;
  title: string;
  journal: string;
  year: number;
  volumePages?: string;
  doi?: string;
}

export const microscopyMaterialsScience: Publication[] = [
  {
    authors:
      'Su Jae Kim†, Seon Je Kim†, Young-Hoon Kim†, Tae-In Jeong†, Min-Hyoung Jung, Hee-Beom Lee, Jongkyoon Park, Sehyeon Kim, Ganbat Duvjir, Yousil Lee, Jegon Lee, Woo Seok Choi, Jungdae Kim, Hu Young Jeong, Seungchul Kim*, Se-Young Jeong*, Young-Min Kim*',
    title:
      'Homoepitaxy-like heteroepitaxy via monolayer interface achieves grain-boundary-free ultraflat silver thin films',
    journal: 'Reports on Progress in Physics',
    year: 2026,
    volumePages: '89(2), 028002',
  },
  {
    authors:
      'Su Jae Kim†, Young-Hoon Kim†, Bipin Lamichhane†, Binod Regmi, Yousil Lee, Sang-Hyeok Yang, Seon Je Kim, Min-Hyoung Jung, Jae Hyuck Jang, Hu Young Jeong, Miaofang Chi, Maeng-Je Seong, Hak Soo Choi, Seong-Gon Kim*, Young-Min Kim*, Se-Young Jeong*',
    title:
      'An impermeable copper surface monolayer with high-temperature oxidation resistance',
    journal: 'Nature Communications',
    year: 2025,
    volumePages: '16, 1462',
  },
  {
    authors:
      'Hyeon-Ah Ju†, Eun-Byeol Park†, Jaejin Hwang†, Young-Hoon Kim†, Min-Hyoung Jung, Min-Ji Yang, Seon Je Kim, Jaehan Lee, In Kim, Yoo-Shin Kim, Songhun Yoon, Jae Hyuck Jang, Hu Young Jeong, Jaekwang Lee*, Jae-Hyun Shim*, Young-Min Kim*',
    title:
      'Oxygen vacancy-induced directional ordering of Li-ion pathways for enhanced ion-conducting solid electrolytes',
    journal: 'ACS Energy Letters',
    year: 2024,
    volumePages: '9(11), 5606-5615',
  },
  {
    authors:
      'Sooeun Shin, Sang-Hyeok Yang, Seongrok Seo, Hyoungmin Park, Urasawadee Amornkitbamrung, Yongjae In, Canjie Wang, Tomoya Nakamura, Atsushi Wakamiya, Young-Min Kim*, Hyunjung Shin*',
    title:
      'Uneven strain relaxation in formamidinium lead triiodide (FAPbI3) films upon aging',
    journal: 'ACS Energy Letters',
    year: 2024,
    volumePages: '9(7), 3618-3627',
  },
  {
    authors:
      'Pavan Pujar†, Haewon Cho†, Young-Hoon Kim†, Nicolò Zagni†, Eunha Lee, Srinivas Gandla, Pavan Nukala*, Young-Min Kim*, Muhammad Ashraful Alam*, Sunkook Kim*',
    title:
      'An aqueous route to oxygen-deficient wake-up-free La-doped HfO2 ferroelectrics for negative capacitance field effect transistors',
    journal: 'ACS Nano',
    year: 2023,
    volumePages: '17(19), 19076-19086',
  },
  {
    authors:
      'Young-Hoon Kim†, Seong-Gon Kim†, Seunghun Lee†, Miyeon Cheon, Su Jae Kim, Kideuk Nam, Bipin Lamichhane, Sung Heum Park, Min-Hyoung Jung, Ji-Soo Kim, Yu-Seong Seo, Taewoo Ha, Jungseek Hwang, Hu Young Jeong, Yusil Lee, Young Hee Lee, Young-Min Kim*, Se-Young Jeong*',
    title:
      'Self-oxidation resistance of the curved surface of achromatic copper',
    journal: 'Advanced Materials',
    year: 2023,
    volumePages: '35(42), 2210564',
  },
  {
    authors:
      'Taewoo Ha†, Yu-Seong Seo†, Teun-Teun Kim†, Bipin Lamichhane, Young-Hoon Kim, Su Jae Kim, Yousil Lee, Jong Chan Kim, Sang Eon Park, Kyung Ik Sim, Jae Hoon Kim, Yong In Kim, Seon Je Kim, Hu Young Jeong, Young Hee Lee, Seong-Gon Kim*, Young-Min Kim*, Jungseek Hwang*, Se-Young Jeong*',
    title:
      'Coherent consolidation of trillions of nucleations for mono-atom step-level flat surfaces',
    journal: 'Nature Communications',
    year: 2023,
    volumePages: '14, 685',
  },
  {
    authors:
      'Woo-Sung Jang†, Vy Ngoc Pham†, Sang-Hyeok Yang, Jaeyoon Baik, Hangil Lee*, Young-Min Kim*',
    title:
      'Enhanced selective photocatalytic oxidation of a bio-derived platform chemical with vacancy-induced core-shell anatase TiO2 nanoparticles',
    journal: 'Applied Catalysis B-Environmental',
    year: 2023,
    volumePages: '322, 122140',
  },
  {
    authors:
      'Seunghun Kang†, Woo-Sung Jang†, Anna N. Morozovska†, Owoong Kwon, Yeongrok Jin, Young-Hoon Kim, Hagyoul Bae, Chenxi Wang, Sang-Hyeok Yang, Alex Belianinov, Steven Randolph, Eugene A. Eliseev, Liam Collins, Yeehyun Park, Sanghyun Jo, Min-Hyoung Jung, Kyoung-June Go, Hae Won Cho, Si-Young Choi, Jae Hyuck Jang, Sunkook Kim, Hu Young Jeong, Jaekwang Lee, Olga S. Ovchinnikova, Jinseong Heo*, Sergei V. Kalinin*, Young-Min Kim*, Yunseok Kim*',
    title:
      'Highly enhanced ferroelectricity in HfO2-based ferroelectric thin film by light ion bombardment',
    journal: 'Science',
    year: 2022,
    volumePages: '376(6594), 731-738',
  },
  {
    authors:
      'Su Jae Kim†, Yong In Kim†, Bipin Lamichhane†, Young-Hoon Kim, Yousil Lee, Chae Ryong Cho, Miyeon Cheon, Jong Chan Kim, Hu Young Jeong, Taewoo Ha, Young Hee Lee, Seong-Gon Kim*, Young-Min Kim*, Se-Young Jeong*',
    title: 'Flat-surface-assisted and self-regulated oxidation resistance of Cu(111)',
    journal: 'Nature',
    year: 2022,
    volumePages: '603(7901), 434-438',
  },
  {
    authors:
      'Woo-Sung Jang†, Yeongrok Jin†, Young-Hoon Kim†, Sang-Hyeok Yang, Seon Je Kim, Jung A. Hong, Jaeyoon Baik, Jaekwang Lee*, Hangil Lee*, Young-Min Kim*',
    title:
      'Site-selective doping mechanisms for the enhanced photocatalytic activity of tin oxide nanoparticles',
    journal: 'Applied Catalysis B-Environmental',
    year: 2022,
    volumePages: '305, 121083',
  },
  {
    authors:
      'Taewon Min†, Wooseon Choi†, Jinsol Seo†, Gyeongtak Han, Kyung Song, Sangwoo Ryu, Hyungwoo Lee, Jungwoo Lee, Kitae Eom, Chang-Beom Eom, Hu Young Jeong, Young-Min Kim*, Jaekwang Lee*, Sang Ho Oh*',
    title:
      'Cooperative evolution of polar distortion and nonpolar rotation of oxygen octahedra in oxide heterostructures',
    journal: 'Science Advances',
    year: 2021,
    volumePages: '7(17), eabe9053',
  },
  {
    authors:
      'Young-Min Kim*,†, Kyu Hyoung Lee†, Liangwei Fu†, Min-Wook Oh, Sang-Hyeok Yang, Shoucong Ning, Gyeongtak Han, Min Young Kim, Ji-Soo Kim, Myoungho Jeong, Jaeduck Jang, Eunha Lee, Okunishi Eiji, Sawada Hidetaka, Sang-il Kim, Stephen J. Pennycook, Young Hee Lee, Sung Wng Kim*',
    title:
      'Atomic-scale chemical mapping of copper dopants in Bi2Te2.7Se0.3 thermoelectric alloy',
    journal: 'Materials Today Physics',
    year: 2021,
    volumePages: '17, 100347',
  },
  {
    authors:
      'Ganesh Ghimire†, Krishna P. Dhakal†, Wooseon Choi†, Yonas Assefa Esthete†, Seon Je Kim, Tran Thu Trang, Hyoyoung Lee, Heejun Yang, Dinh Loc Duong, Young-Min Kim*, Jeongyong Kim*',
    title:
      'Doping-mediated lattice-engineering of monolayer ReS2 for modulating in-plane anisotropy of optical and transport properties',
    journal: 'ACS Nano',
    year: 2021,
    volumePages: '15(8), 13770-13780',
  },
  {
    authors:
      'Ki Sung Kim†, Young-Min Kim†, Hyeona Mun†, Jisoo Kim, Jucheol Park, Albina Y. Borisevich, Kyu Hyoung Lee, Sung Wng Kim*',
    title:
      'Direct observation of inherent atomic-scale defect disorders responsible for high thermoelectric performance of Ti1-xHfxNiSn1-ySby half-Heusler alloys',
    journal: 'Advanced Materials',
    year: 2017,
    volumePages: '29, 1702091',
  },
  {
    authors:
      'Young-Min Kim, Anna N. Morozovska, Eugene A. Eliseev, Mark P. Oxley, Rohan Mishra, Sverre M. Selbach, Tor Grande, Sokrates T. Pantelides, Sergei V. Kalinin, Albina Y. Borisevich',
    title:
      'Direct observation of ferroelectric field effect and vacancy-controlled screening at the BiFeO3-LaxSr1-xMnO3 interface',
    journal: 'Nature Materials',
    year: 2014,
    volumePages: '13, 1019-1025',
  },
  {
    authors:
      'Young-Min Kim, Amit Kumar, Alison Hatt, Anna N. Morozovska, Alexander Tselev, Michael D. Biegalski, Ilya Ivanov, Eugene A. Eliseev, Stephen J. Pennycook, James M. Rondinelli, Sergei V. Kalinin, Albina Y. Borisevich',
    title: 'Interplay of octahedral tilts and polar order in BiFeO3 films',
    journal: 'Advanced Materials',
    year: 2013,
    volumePages: '25(17), 2497-2504',
  },
  {
    authors:
      'Young-Min Kim, Jun He, Michael D. Biegalski, Hailemariam Ambaye, Valeria Lauter, Hans M. Christen, Sokrates T. Pantelides, Stephen J. Pennycook, Sergei V. Kalinin, Albina Y. Borisevich',
    title:
      'Probing oxygen vacancy concentration and homogeneity in solid-oxide-fuel-cell cathode materials on the subunit-cell level',
    journal: 'Nature Materials',
    year: 2012,
    volumePages: '11, 888-894',
  },
];

export const aiMicroscopy: Publication[] = [
  {
    authors:
      'Daehee Yang†, Young-Hoon Kim†, Hyo June Lee†, Sang-Hyeok Yang, Min Hyoung Jung, Eun-Byeol Park, Hangsik Kim, Yerin Jeon, Yuseong Heo, Ka Hyun Kim, Sungyong Cho, Yun Sik Kang, Ki Kang Kim, Hangil Lee, Sung-Dae Yim, Jae Hyuck Jang*, Sungchul Lee*, Young-Min Kim*',
    title:
      'Integrated probing of cycling-induced degradation of multi-component electrode in hydrogen fuel cells via machine learning-empowered spectroscopic imaging',
    journal: 'Applied Catalysis B: Environment and Energy',
    year: 2026,
    volumePages: '382, 125911',
  },
  {
    authors:
      'Sang-Hyeok Yang†, Yerin Jeon†, Min-Hyoung Jung†, Sungyong Cho†, Eun-Byeol Park, Daehee Yang, Hyo June Lee, Yun Sik Kang, Chang Hyun Lee, Sung-Dae Yim*, Hu Young Jeong*, Sungchul Lee*, Young-Min Kim*',
    title:
      'Sparse section imaging-based deep learning electron tomography of porous carbon supports in proton exchange membrane fuel cells',
    journal: 'Journal of Energy Chemistry',
    year: 2025,
    volumePages: '104, 795-806',
  },
  {
    authors:
      'Hee-Beom Lee†, Min-Hyoung Jung†, Young-Hoon Kim, Eun-Byeol Park, Woo-Sung Jang, Seon-Je Kim, Ki-ju Choi, Ji-young Park, Kee-bum Hwang, Jae-Hyun Shim, Songhun Yoon*, Young-Min Kim*',
    title:
      'Deep learning image segmentation for the reliable porosity measurement of high-capacity Ni-based oxide cathode secondary particles',
    journal: 'Journal of Analytical Science and Technology',
    year: 2023,
    volumePages: '14, 47',
  },
  {
    authors:
      'Sang-Hyeok Yang†, Eun-Byeol Park†, Sung Yong Cho†, Yun Sik Kang, Hyeon-Ah Ju, Yerin Jeon, Daehee Yang, Sung-Dae Yim*, Sungchul Lee*, Young-Min Kim*',
    title:
      'Deep learning morphological distribution analysis of metal alloy catalysts in proton exchange membrane fuel cells',
    journal: 'Materials Today Energy',
    year: 2023,
    volumePages: '36, 101348',
  },
  {
    authors:
      'Young-Hoon Kim†, Sang-Hyeok Yang†, Myoungho Jeong†, Min-Hyoung Jung, Daehee Yang, Hyangsook Lee, Taehwan Moon, Jinseong Heo, Hu Young Jeong, Eunha Lee*, Young-Min Kim*',
    title:
      'Hybrid deep learning crystallographic mapping of polymorphic phases in polycrystalline Hf0.5Zr0.5O2 thin films',
    journal: 'Small',
    year: 2022,
    volumePages: '18(18), 2107620',
  },
  {
    authors:
      'Sang-Hyeok Yang, Wooseon Choi, Byeong Wook Cho, Frederick Osei-Tutu Agyapong-Fordjour, Sehwan Park, Seok Joon Yun, Hyung-Jin Kim, Young-Kyu Han, Young Hee Lee, Ki Kang Kim, Young-Min Kim*',
    title:
      'Deep learning-assisted quantification of atomic dopants and defects in 2D materials',
    journal: 'Advanced Science',
    year: 2021,
    volumePages: '8(16), 2101099',
  },
];
