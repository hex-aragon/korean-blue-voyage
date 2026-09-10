# 윤슬 — Korean Blue Voyage

한국의 바다와 강에서 즐기는 Three.js 항해 + 힐링 브라우저 게임.

## 실행

```sh
npm ci
npm run dev
npm test
npm run build
```

Node.js 22 이상. `dist/`는 정적 파일만으로 동작합니다. Vite의 상대 경로 설정으로 GitHub Pages 프로젝트 경로에서도 실행됩니다. 외부 API 키나 유료 서비스가 필요하지 않습니다. Google Fonts 연결이 없으면 시스템 글꼴로 표시됩니다.

## 플레이

- `W / S` 엔진 출력, `A / D` 조타 (방향키도 지원)
- `Space` 닻, `C` 선상/추적 시점, `P` 자동 항해, `H` 물멍
- 화면 드래그: 카메라 회전 / 휠: 거리 조절
- 모바일: 하단 조타 버튼과 출력 슬라이더
- 선박: 요트, 컨테이너선, 유조선, 벌크선, 케미컬선
- 해역: 서해 5도(백령도·대청도·소청도·연평도·소연평도), 서해, 남해, 동해, 한강, 낙동강
- 의뢰: 수락 → 목적지 항해 → 반경 95m, 2.7 knots 미만 → 도착 확인·정산. 자동 항해는 도착하면 자동 정산합니다.
- 분위기: 한낮/노을/밤, 잔잔함/산들바람/거친 물결, 합성 파도·바람·엔진 소리
- 저장: 누적 거리, 수익, 완료 수, 선박과 해역을 localStorage에 저장. 위치와 진행 중 의뢰는 세션 단위입니다.
- 사진: 현재 3D 화면 PNG 다운로드
- 항해 배속: 하단 항해 1× 버튼으로 5× / 20× 전환 (물리는 작은 시간 간격으로 나누어 계산)

## 범위와 한계

실제 지명에서 영감을 받은 **별도 축약 해역**입니다. 실측 해안선·섬 간 거리·현실의 항로·항만·수심·기상·국경을 재현하지 않으며 실제 항해에 사용할 수 없습니다. 서해 5도 표기는 지명 선택을 의미하며 NLL 등의 경계선은 모델링하지 않습니다. 해역 전환은 메뉴로 이루어집니다. 파도 높이 함수와 배의 피치/롤, 추력, 관성, 조타, 해류, 바람, 해안 충돌을 근사하며 정밀 유체역학 시뮬레이터는 아닙니다. 강은 게임의 흘수 제한으로 요트만 허용합니다.

자동 항해는 목적지를 향해 조타·감속하고 충돌 시 해제됩니다. 장애물 우회 경로 계획은 아직 구현하지 않았습니다. 실제 조선 설계 모델 대신 코드로 만든 선박 모델입니다. Higgsfield 및 Blender MCP 에셋은 현재 버전에 사용하지 않았습니다.

## 검증

`npm test`는 가속/최고 속력, 닻, 정산 조건, 해안 충돌, 파도, 프레임 시간 제한을 확인합니다.
`node tests/browser-check.mjs`는 `127.0.0.1:5197`의 개발 서버와 설치된 Chrome으로 데스크톱·모바일 상호작용과 WebGL 콘솔 오류를 확인합니다.

## 배포

GitHub 저장소 Settings → Pages → Source를 GitHub Actions로 선택합니다. `main`에 푸시하면 테스트와 빌드 후 `.github/workflows/pages.yml`이 자동 배포합니다.

기술 참고: [Three.js Water](https://threejs.org/docs/pages/Water.html), [Three.js Sky](https://threejs.org/docs/pages/Sky.html), [GitHub Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## 구조

- `src/scene.js`: 3D 선박, 섬·강·항구, 수면 셰이더, 카메라, 항적
- `src/physics.js`: 독립적인 항해 물리와 정산 조건
- `src/data.js`: 선종, 해역, 기상 프리셋
- `src/audio.js`: Web Audio 절차적 사운드
- `src/main.js`: 입력, 화면, 의뢰, 저장, 게임 루프
- `MONETIZATION.md`: 수익화 확장 제안
