// Higgsfield 공식 SDK로 Seedance 2.5 text-to-video를 한 번 생성해 영상 URL을 출력하는 예제(유료 호출)
// 실행: npm run higgsfield:example  (자격 증명은 .env.local 의 HF_CREDENTIALS 에서 런타임에 읽는다)
import { config, higgsfield, APIError, HiggsfieldError } from '@higgsfield/client/v2';

const MODEL = 'bytedance/seedance-2.5/text-to-video';

if (!process.env.HF_CREDENTIALS) {
  console.error('HF_CREDENTIALS가 없습니다. .env.local 에 KEY_ID:KEY_SECRET 형식으로 넣어 주세요.');
  process.exit(1);
}

// 영상 생성은 기본 폴링 한도(5분)를 넘길 수 있어 15분으로 늘린다
config({ credentials: process.env.HF_CREDENTIALS, maxPollTime: 15 * 60 * 1000 });

try {
  const result = await higgsfield.subscribe(MODEL, {
    input: {
      prompt: 'A cinematic scene at sunset',
      duration: 5,
      resolution: '720p',
      aspect_ratio: '16:9',
    },
    withPolling: true,
  });

  // SDK는 completed·failed·nsfw 에서 폴링을 멈춘다. completed + 영상 URL 일 때만 성공으로 본다.
  const url = result.video?.url;
  if (result.status === 'completed' && url) {
    console.log(`completed  request_id=${result.request_id}`);
    console.log(url);
  } else {
    const reason = result.status === 'nsfw' ? '모더레이션(nsfw)으로 거부됨' : `상태 ${result.status}`;
    console.error(`생성 실패: ${reason}  request_id=${result.request_id}`);
    process.exit(1);
  }
} catch (err) {
  // 오류 객체 전체를 찍으면 요청 헤더(자격 증명)가 섞일 수 있어 이름·메시지·HTTP 상태만 출력한다.
  // canceled 는 SDK 폴링이 멈추지 않아 TimeoutError 로 이곳에 온다.
  if (err instanceof HiggsfieldError) {
    const status = err instanceof APIError ? ` (HTTP ${err.statusCode})` : '';
    console.error(`생성 실패: ${err.name}${status}: ${err.message}`);
  } else {
    console.error(`생성 실패: ${err instanceof Error ? err.message : String(err)}`);
  }
  process.exit(1);
}
