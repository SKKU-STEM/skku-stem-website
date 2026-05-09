// Lab facilities (instruments) — /facilities 페이지가 import해 렌더링
/**
 * 새 장비 추가:
 *   1. 배열에 entry 추가 (메인 장비를 위에 두는 식의 의도된 순서)
 *   2. 필수 필드: slug / title / model / description / photoCount
 *   3. 선택 필드: highlights (스펙 bullet), location
 *   4. 사진은 src/assets/facilities/<slug>-<i>.{jpg,jpeg,png,webp} 형태로 저장
 *      자세한 명명 규칙은 src/assets/facilities/README.md 참고
 *
 * 데이터 출처: 이전 사이트 Facilities 페이지
 *   https://sites.google.com/site/skkustem/services (2026-05-09 마이그레이션)
 */

export interface FacilityEquipment {
  slug: string;          // src/assets/facilities/<slug>-<i>.jpg 의 prefix
  title: string;
  model: string;
  description: string;
  highlights?: string[]; // 짧은 스펙 bullet (옵션)
  location?: string;
  photoCount: number;
}

export const facilityEquipment: FacilityEquipment[] = [
  {
    slug: 'jeol-arm300f',
    title: '300-kV Grand ARM Transmission Electron Microscope',
    model: 'JEOL JEM-ARM300F',
    description:
      'The JEOL JEM-ARM300F transmission electron microscope exceeds the atomic-resolution boundaries available in commercial TEMs. With 63 pm resolution at 300 kV and full aberration correction, it is designed for atom-by-atom imaging and chemical mapping of advanced materials.',
    highlights: [
      '300 kV accelerating voltage',
      '63 pm STEM resolution',
      'Aberration-corrected probe',
      'Atom-by-atom characterization and chemical mapping',
    ],
    photoCount: 3,
  },
  {
    slug: 'jeol-arm200f',
    title: '200-kV Atomic Resolution Analytical TEM',
    model: 'JEOL JEM-ARM200F',
    description:
      'A high-performance 200 kV TEM featuring a Schottky field-emission cathode, Cs correctors for spherical-aberration correction, and a motorized five-axis goniometer. It delivers STEM resolution better than 0.08 nm and TEM resolution of 0.11 nm, with EDS, EELS, and optional electron tomography via TEMography software.',
    highlights: [
      '200 kV Schottky field-emission cathode',
      'Cs correctors (spherical-aberration corrected)',
      'STEM 0.08 nm / TEM 0.11 nm resolution',
      'EDS · EELS · electron tomography (TEMography)',
      'Motorized five-axis goniometer',
    ],
    photoCount: 3,
  },
];
