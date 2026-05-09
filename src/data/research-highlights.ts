// Lab의 research highlights — /research 페이지가 import해 렌더링
/**
 * 새 highlight 추가 절차:
 *   1. 배열 맨 위(index 0)에 entry 한 개 추가 — 역연대기 순서 유지.
 *   2. 필수 필드: year / title / summary / journal / volumePages / doi.
 *   3. 선택 필드:
 *      - codeUrl: 공개 코드 리포 URL (예: 'https://github.com/SKKU-STEM/...')
 *      - mention: 외부 인정/코버리지 한 줄 (예: 'Physics World — ...', '2022 Top 10 ...')
 *      - mentionUrl: mention에 클릭 가능한 외부 링크가 있을 때
 *      - image: 대표 이미지 파일명 (`src/assets/research/<filename>` 안의 jpg/png/webp).
 *               4:3 비율 권장. 자세한 규칙은 src/assets/research/README.md 참고.
 *      - imageAlt: 이미지 alt 텍스트 (미설정 시 title 사용)
 *   4. 저장하면 dev 서버 HMR로, 빌드 시에는 /research 페이지에 자동 반영.
 *      연도별 그룹핑/sticky year column/jump nav 모두 자동 갱신.
 *
 * 데이터 출처: 이전 SKKU-STEM 사이트 Research 페이지
 *   https://sites.google.com/site/skkustem/clients (2026-05-09 마이그레이션)
 */

export interface ResearchHighlight {
  year: number;
  title: string;
  summary: string;
  journal: string;
  volumePages: string;
  doi: string;
  codeUrl?: string;
  mention?: string;
  mentionUrl?: string;
  image?: string;
  imageAlt?: string;
}

export const highlights: ResearchHighlight[] = [
  {
    year: 2026,
    title:
      'A growth mechanism for grain-boundary-free ultraflat silver thin films',
    summary:
      'STEM revealed a feasible mechanism for a breakthrough in metal thin-film epitaxy, enabling wafer-scale growth of atomically flat, grain-boundary-free Ag films on Cu buffers with a 13% lattice mismatch.',
    journal: 'Reports on Progress in Physics',
    volumePages: '89(2), 028002',
    doi: 'https://iopscience.iop.org/article/10.1088/1361-6633/ae3e3d',
    mention: 'Physics World — Strain engineered single crystal silver films',
    mentionUrl: 'https://physicsworld.com/a/strain-engineered-single-crystal-silver-films/',
  },
  {
    year: 2026,
    title: 'A machine learning solution for electrode characterization',
    summary:
      'Machine learning-driven electron spectroscopic imaging (ESI) approach enables nanoscale visualization and statistical analysis of structural degradation in PEMFC electrodes.',
    journal: 'Applied Catalysis B: Environment and Energy',
    volumePages: '382, 125911',
    doi: 'https://www.sciencedirect.com/science/article/abs/pii/S092633732500894X',
  },
  {
    year: 2025,
    title: 'Sparse section imaging-based deep learning electron tomography',
    summary:
      'Deep learning-empowered electron tomography visualizes the 3D structure of porous carbon supports in PEMFC with only a few image frames, reducing data requirements by more than 95%.',
    journal: 'Journal of Energy Chemistry',
    volumePages: '104, 795-806',
    doi: 'https://doi.org/10.1016/j.jechem.2025.01.018',
  },
  {
    year: 2024,
    title: 'Revealing the role of oxygen vacancy in an oxide solid electrolyte',
    summary:
      'The hidden role of the oxygen vacancy (V_O) in facilitating Li-ion transport in lithium lanthanum titanate solid electrolytes was unveiled. The V_O is directionally interconnected to form a 2D network parallel to the c-plane.',
    journal: 'ACS Energy Letters',
    volumePages: '9(11), 5606-5615',
    doi: 'https://pubs.acs.org/doi/10.1021/acsenergylett.4c02078',
  },
  {
    year: 2024,
    title: '4D STEM-based domain mapping for perovskite solar cells',
    summary:
      '4D STEM-based crystallographic domain mapping unfolded the mystery of aging-induced efficiency improvement of perovskite solar cells, revealing that aging can induce partial lattice strain relaxation.',
    journal: 'ACS Energy Letters',
    volumePages: '9(7), 3618-3627',
    doi: 'https://doi.org/10.1021/acsenergylett.4c01233',
  },
  {
    year: 2023,
    title:
      'The interplay of structure-cation defect-oxygen vacancy in doped HfO2 film',
    summary:
      'Multimodal 4D-STEM (PA)CBED/EDX/EELS at multiple length scales revealed the complicated interplay of structure, cation defects, and oxygen vacancies in La-doped HfO2 films.',
    journal: 'ACS Nano',
    volumePages: '17(19), 19076-19086',
    doi: 'https://pubs.acs.org/doi/10.1021/acsnano.3c04983',
  },
  {
    year: 2023,
    title: 'Unveiling self-oxidation resistance mechanism of a curved Cu surface',
    summary:
      'Pico-scale precision electron microscopy revealed that porous copper nanostructures self-regulate giant oxidation resistance by constructing a curved surface that generates a series of monoatomic steps.',
    journal: 'Advanced Materials',
    volumePages: '35(42), 2210564',
    doi: 'https://onlinelibrary.wiley.com/doi/10.1002/adma.202210564',
  },
  {
    year: 2023,
    title: 'Deep learning catalyst particle analysis with Attention U-Net',
    summary:
      'Proposes a rapid, automated, and reliable analytical method for the morphological distribution of Pt-based electrocatalyst nanoparticles using deep learning processing.',
    journal: 'Materials Today Energy',
    volumePages: '36, 101348',
    doi: 'https://www.sciencedirect.com/science/article/abs/pii/S2468606923001041',
    codeUrl: 'https://github.com/SKKU-STEM/PMA-Net',
  },
  {
    year: 2023,
    title: 'Elucidating the growth mechanism of a single crystal Cu thin film',
    summary:
      'Electron microscopy describes in detail the initial growth of copper thin films required for mono-atom step-level flat surfaces (MSFSs). Deposition by atomic sputtering epitaxy leads to the coherent merging of trillions of islands.',
    journal: 'Nature Communications',
    volumePages: '14, 685',
    doi: 'https://www.nature.com/articles/s41467-023-36301-w',
  },
  {
    year: 2023,
    title: 'Single particle-level spectroscopic mapping for defect distributions',
    summary:
      'Computation-aided STEM-EELS showed that the distributions of surface oxygen vacancies and reduced Ti valencies enclosing a stoichiometric core were responsible for enhanced photocatalytic activity.',
    journal: 'Applied Catalysis B-Environmental',
    volumePages: '322, 122140',
    doi: 'https://www.sciencedirect.com/science/article/abs/pii/S0926337322010815',
  },
  {
    year: 2022,
    title: 'Segmented electron tomography for PEM-fuel cell analysis',
    summary:
      'Advanced segmented electron tomography visualizes the 3D structure of carbon supports in proton exchange membrane fuel cells (PEM-FCs) and explains structural degradation phenomena.',
    journal: 'Journal of Energy Chemistry',
    volumePages: '74, 359-367',
    doi: 'https://www.sciencedirect.com/science/article/pii/S2095495622004132',
  },
  {
    year: 2022,
    title: 'Mechanism for ion enhanced polarization in doped HfO2',
    summary:
      'A multimodal investigation based on microscopy and spectroscopy showed that ferroelectric properties improve when films of hafnium oxide are bombarded with a beam of helium ions.',
    journal: 'Science',
    volumePages: '376(6594), 731-738',
    doi: 'https://www.science.org/doi/10.1126/science.abk3195',
  },
  {
    year: 2022,
    title: 'Hybrid deep learning crystallography with 4D-STEM',
    summary:
      'Deep learning crystallographic analysis unequivocally addresses structure problems for sub-10 nm polycrystalline hafnium zirconium oxide thin films.',
    journal: 'Small',
    volumePages: '18(18), 2107620',
    doi: 'https://onlinelibrary.wiley.com/doi/10.1002/smll.202107620',
  },
  {
    year: 2022,
    title: 'Superb oxidation resistance of Cu uncovered by electron microscopy',
    summary:
      'Comprehensive atomic-resolution microscopy revealed that wafer-scale Cu(111) single-crystal thin films free of multilayer step edges show a semi-permanent oxidation resistance.',
    journal: 'Nature',
    volumePages: '603(7901), 434-438',
    doi: 'https://www.nature.com/articles/s41586-021-04375-5',
    mention:
      '2022 Top 10 Nanotechnology Research Excellence (Nanotechnology Research Council)',
  },
  {
    year: 2022,
    title: 'Unveiled doping mechanisms in oxide catalysts',
    summary:
      'Electron microscopy and spectroscopy combined with theoretical modeling can directly resolve the site-specific doping phenomena of transition metals in SnO2 nanoparticles.',
    journal: 'Applied Catalysis B-Environmental',
    volumePages: '305, 121083',
    doi: 'https://www.sciencedirect.com/science/article/abs/pii/S0926337322000236',
  },
  {
    year: 2021,
    title:
      'Deep learning algorithm for automated defect quantification in 2D TMDs',
    summary:
      'A deep learning-assisted quantification algorithm reduces the heavy load of data processing for researchers, which has hindered the pace of design and development of two-dimensional transition metal dichalcogenides.',
    journal: 'Advanced Science',
    volumePages: '8, 2101099',
    doi: 'https://onlinelibrary.wiley.com/doi/10.1002/advs.202101099',
    codeUrl:
      'https://github.com/SKKU-STEM/2D_TMD_Quantification_with_Deeplearning',
  },
  {
    year: 2021,
    title: 'Picoscale precision lattice strain analysis for multidomain 2D TMDs',
    summary:
      'STEM-based statistical lattice strain analysis provided the first demonstration of successful control of the lattice structure of anisotropic ReS2, resulting in isotropic responses.',
    journal: 'ACS Nano',
    volumePages: '15, 13770-13780',
    doi: 'https://pubs.acs.org/doi/10.1021/acsnano.1c05316',
  },
  {
    year: 2021,
    title:
      'Atomic-scale chemical mapping of Cu dopants (0.2 at.%) in a thermoelectric alloy by STEM-EDX',
    summary:
      'Successfully mapped copper dopants added at 0.2 at.% into a multi-component thermoelectric alloy (Bi2Te2.7Se0.3) system using advanced energy dispersive X-ray spectroscopy (EDX) spectrum imaging.',
    journal: 'Materials Today Physics',
    volumePages: '17, 100347',
    doi: 'https://www.sciencedirect.com/science/article/abs/pii/S2542529321000080',
  },
  {
    year: 2021,
    title: 'Cation vacancy mapping by STEM-EDX',
    summary:
      'STEM-EDX chemical mapping provides an atomic-level picture of what truly occurs with cation vacancies at an oxide interface — Sr and Ti vacancies in SrTiO3 film and Nb ions diffused from a Nb:SrTiO3 substrate.',
    journal: 'Materials Today Physics',
    volumePages: '16, 100302',
    doi: 'https://www.sciencedirect.com/science/article/abs/pii/S2542529320301267',
  },
  {
    year: 2020,
    title: 'High-resolution STEM-EELS analysis of doped ZnO nanoparticles',
    summary:
      'Atomic-scale STEM observations combined with site-specific electron energy loss spectroscopy revealed that two transition metal ions substitute for Zn, in different valence states (Cr3+ and Co2+).',
    journal: 'Journal of Materials Chemistry A',
    volumePages: '8, 25345-25354',
    doi: 'https://pubs.rsc.org/en/content/articlelanding/2020/ta/d0ta08367d',
  },
  {
    year: 2020,
    title: 'Atomic resolution analysis of nanoparticles by STEM-EELS/EDX',
    summary:
      'STEM-EELS/EDX-based work revealed that surface oxygen vacancies in anatase-type Fe@TiO2 nanoparticles for superior photocatalytic activities can be readily controlled by simple pH treatment.',
    journal: 'Applied Surface Science',
    volumePages: '507, 144916',
    doi: 'https://www.sciencedirect.com/science/article/abs/pii/S016943321933733X',
  },
  {
    year: 2019,
    title: '3D electron tomography for Li ion batteries',
    summary:
      'Demonstrates how the geometrical parameters of active cathode materials are inextricably linked to their battery performance, based on multimodal/multiscale characterizations.',
    journal: 'ACS Applied Materials & Interfaces',
    volumePages: '11, 4017',
    doi: 'https://pubs.acs.org/doi/10.1021/acsami.8b19902',
  },
  {
    year: 2018,
    title: 'Atom counting analysis for 2D materials',
    summary:
      'Investigates the hitherto unsolved conundrum of how organic chemicals can heal chalcogen vacancies in MoS2 monolayer at the atomic scale, observing chalcogen vacancy healing by an organic molecule.',
    journal: 'Nano Letters',
    volumePages: '18(7), 4523',
    doi: 'https://pubs.acs.org/doi/abs/10.1021/acs.nanolett.8b01714',
  },
  {
    year: 2018,
    title: 'Oxygen octahedral tilt mapping for complex oxide thin films',
    summary:
      'Provides the first demonstration of octahedra-derived multiferroic properties that can be stabilized in a thin film form without the help of complex chemical modifications.',
    journal: 'Advanced Functional Materials',
    volumePages: '19, 1800839',
    doi: 'https://onlinelibrary.wiley.com/doi/abs/10.1002/adfm.201800839',
  },
  {
    year: 2018,
    title: 'Valence state mapping for Li ion batteries',
    summary:
      'Using atom-resolved STEM-EDX/EELS, this study reveals that the electrochemical properties of Li(NixCoyMnz)O2 (NCM) materials are decisively determined by the interplay of combined cation disordering.',
    journal: 'Journal of Materials Chemistry A',
    volumePages: '6, 16111',
    doi: 'https://pubs.rsc.org/en/content/articlelanding/2018/ta/c8ta04731f',
  },
  {
    year: 2017,
    title: 'Atomic-resolution chemical mapping for energy materials',
    summary:
      'Atomic-resolution STEM-EDX chemical mapping was conducted for the direct visualization of atomic-scale interstitial and antisite defects in complete single-phase Ti1-xHfxNiSn1-ySby half-Heusler (HH) thermoelectric alloys.',
    journal: 'Advanced Materials',
    volumePages: '29, 1702091',
    doi: 'https://onlinelibrary.wiley.com/doi/full/10.1002/adma.201702091',
  },
  {
    year: 2014,
    title: 'Polarization mapping for ferroelectric materials',
    summary:
      'By a combination of microscopy and spectroscopy techniques, we directly observed for the first time the field effect in a ferroelectric material that exhibits switchable electrical polarization at the ferroelectric–electrode interface.',
    journal: 'Nature Materials',
    volumePages: '13, 1019',
    doi: 'https://www.nature.com/articles/nmat4058',
  },
  {
    year: 2012,
    title: 'Oxygen vacancy mapping for solid oxide fuel cell cathode materials',
    summary:
      'Local oxygen stoichiometry in functional oxides has been a long-standing challenge. The method developed in this work quantifies oxygen vacancy distribution and homogeneity, which directly control the operation of solid-oxide fuel cells.',
    journal: 'Nature Materials',
    volumePages: '11, 888',
    doi: 'https://www.nature.com/articles/nmat3393',
  },
];
