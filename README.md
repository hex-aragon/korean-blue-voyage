# 윤슬 — Korean Blue Voyage

한국·중국·일본의 항구와 바다, 한국의 강에서 즐기는 Three.js 항해 + 힐링 브라우저 게임.

[플레이](https://hex-aragon.github.io/korean-blue-voyage/)

## 시작

```sh
npm ci
npm run dev -- --port 5197 --strictPort
npm test
npm run build
```

Node.js 22 이상. `dist/`는 GitHub Pages 프로젝트 경로에서 동작하는 정적 파일입니다. 외부 API 키나 유료 서비스가 필요하지 않습니다. Google Fonts 연결이 없으면 시스템 글꼴로 표시됩니다.

## 브릿지와 조작

- 기본 시점은 **3인칭**입니다. 처음에는 항구에 정박합니다. **속도 레버를 위로 올리거나 ‘출항’을 누르면 닻을 자동으로 올리고 움직입니다.**
- 레버 아래쪽은 후진, 중간의 중립은 추진력을 끕니다. **정박** 버튼은 닻을 내려 감속·정지합니다.
- **조타기**를 마우스나 손가락으로 돌리면 조타각이 유지됩니다. ‘중앙 정렬’로 직진 조타에 복귀합니다. 키보드 초점에서는 좌우 화살표·Home도 지원합니다.
- **레이더**는 북쪽을 위로 놓고 게임 속 해안·항구·내 배·의뢰 목적지를 표시합니다. 범위 버튼으로 400/800/1600 m를 선택합니다. 실측 레이더·AIS 데이터는 아닙니다.
- 항해사는 곡면 얼굴과 팔다리, 남색 정복, 정모, 금장 견장·수장·장식끈을 갖춘 창작 3D 캐릭터입니다. 하단 초상도 동일 모델을 렌더링했습니다.
- **1인칭 브릿지**: 창틀, 콘솔, 움직이는 조타륜, 속력·방위·롤링·피칭·GM 계기. 선박의 회전과 흔들림을 따라가는 카메라입니다.
- **3인칭 선박**: 수평선과 하늘이 넓게 보이는 낮은 시점에서 선박, 화물과 작은 제복 항해사를 관찰합니다.
- 화면 좌우 드래그: 둘러보기 / 위아래 드래그: 시점 높이 / 휠: 3인칭 거리 / 상단 버튼 또는 `C`: 시점 전환
- `W / S`: 속도 레버, `A / D`: 조타, `Space`: 출항·정박, `P`: 자동 항해, `H`: 물멍
- 모바일: 하단의 회전 조타기·세로 속도 레버·레이더. 지도·화물·선박·환경은 상단 **메뉴** 안에 있습니다.
- HUD의 롤링/피칭 수치를 누르면 복원력 화면이 열립니다.
- 항해 배속: 1× / 5× / 20×. 이동 물리는 작은 간격으로 계산하며, 파도와 자세 운동은 관찰하기 쉽도록 실제 시간으로 유지합니다.
- 메뉴를 열면 이동만 멈추고 흔들림은 계속됩니다. 일시정지는 이동·자세·화물 작업을 함께 멈춥니다. 레버로 추진력을 주면 항해 일시정지가 해제됩니다.

## 미션 항해와 자유 항해

처음에는 **미션 항해**가 선택됩니다. 신규 플레이는 부산 북항의 선적 의뢰로 시작합니다. 첫 화면의 **선적 시작** → 금색 레이더 항로 → 목적지에서 **정박** → **하역 시작**을 따라가세요. 미션 카드가 장소·거리·방위를 표시하고, 3D 금색 원과 안내판이 실제 게임 작업 위치를 표시합니다. 레이더 범위 밖의 경유지는 테두리 화살표로 안내합니다.

**메뉴 → 운송 의뢰 → 다른 의뢰 고르기**에서 국내·해외 목적지와 도착 부두를 선택합니다. 예: 부산에서 선적 → 외해 출항 지점 → **도착 해역으로** → 하카타 입항 수역 → 여객부두 하역. 긴 외해 구간은 압축 이동하며 화물은 유지됩니다. 수동 조타와 자동 항해를 모두 지원합니다.

**자유 항해**는 첫 화면 또는 메뉴에서 선택합니다. 목표 없이 돌아다니거나 항해도에서 다른 해역으로 이동합니다. **메뉴 → 항해도**의 한국·중국·일본 필터로 24개 해역을 선택할 수 있습니다. 미션 모드에서 해역을 직접 바꾸면 기존 의뢰와 화물을 초기화하고 해당 지역의 새 미션을 시작합니다.

## 선적, 하역과 운송

**메뉴 → 운송 의뢰 → 의뢰 받기 → 출발 항구에서 선적 → 목적지 항해 → 하역 시작** 순서입니다. 하역 3초가 끝나야 보상이 지급됩니다. 자동 항해는 항구 도착 후 정박하고 하역을 기다립니다. 선적·하역 중에는 출항과 선박·해역 변경이 잠깁니다.

화물 작업 조건은 항구 반경 95 m 이내, 속력 2.7 kn 미만, 닻 내림입니다. 의뢰 화물은 6단위이고 수익은 게임의 가상 재화입니다.

**메뉴 → 화물·복원력**에서 선수·중앙·선미 × 좌현·우현 6개 구획에 각각 0~3단위를 싣고 내릴 수 있습니다. 작업에는 진행 표시와 갑판의 운반 화물 애니메이션이 있습니다. 높은 갑판 배치, 낮은 밸러스트, 탱크의 부분 적재 등을 비교할 수 있습니다.

## 복원력 실습

- **낮고 고르게 / 높이 쌓기**: 같은 12단위의 적재 높이를 바꿔 KG와 GM, 롤링 응답을 비교합니다.
- **좌현에 몰기**: 평균 횡경사와 그 주위의 롤링을 관찰합니다.
- **선수 집중 적재**: 피칭 외에 선수 하강 트림이 생깁니다.
- **액체 부분 적재**: 유조선·케미컬선·LNG선의 덜 찬 탱크에 자유수면 보정이 생깁니다.
- **밸러스트**: 낮은 무게가 G를 낮추지만 질량과 흘수는 늘어납니다.
- 음의 GM과 큰 기울기가 지속되면 학습용 복귀 화면으로 전환합니다. 항구 복귀는 화물과 진행 중 의뢰를 초기화합니다.

G는 무게중심, M은 작은 경사에서의 메타센터입니다. 게임은 가정한 KM과 하중 모멘트로 KG를 계산하고 GM에서 자유수면 보정을 뺍니다. 작은 각도 복원정 `GZ = GM·sin(φ) − TCG·cos(φ)`를 감쇠가 있는 횡동요 모델에 연결합니다. 모든 선체 계수·질량·단위·흘수 관계는 교육을 위한 설정값입니다. 실선 복원성 자료, 규정 판정, 큰 경사에서의 정밀 GZ 곡선 또는 전복 예측이 아닙니다.

참고: [IMO 선박 설계와 복원성](https://www.imo.org/en/ourwork/safety/pages/shipdesignandstability-default.aspx), [MCA 복원성 교육 항목](https://www.gov.uk/government/publications/master-yacht-written-examination-syllabuses/stability-examination-syllabus).

## 콘텐츠와 저장

선박 13척: 요트, 컨테이너선, 유조선, 벌크선, 케미컬선, 카캐리어, 카페리, 크루즈선, LNG선, 예인선, 조사선, 머스크 참고형, 천경해운 참고형.

**메뉴 → 선박 선택**에서 실제 3D 모델의 적재 예시와 선종별 특징을 보고, **3D로 둘러보기 / 브릿지 승선 / 기본 화물 싣기**를 선택할 수 있습니다. [선종 조사와 모델링 기준](./SHIP_RESEARCH.md)에 공식 참고 자료와 게임화한 부분을 정리했습니다.
해역: 한국 16개, 중국 3개, 일본 5개. 총 24개 해역과 75개 이름 있는 작업 수역입니다. [항만 목록과 지도 참고 자료](./MAP_REFERENCES.md)를 참고하세요.
분위기: 한낮/노을/밤, 세 가지 바람·파도, 합성 바다·바람·엔진 소리, 사진 PNG 저장.

누적 거리·수익·완료 수·선박·해역·모드·현재 위치·화물·진행 중 의뢰를 localStorage에 저장합니다. 새로고침하면 저장 위치에서 정박한 상태로 이어집니다. 아직 끝나지 않은 선적·하역은 다시 시작하며, 완료 보상은 중복 지급하지 않습니다.

## 범위와 한계

광역 해안선 지도는 Natural Earth 자료를 사용하고, 3D 항만은 실제 지명과 항만 자료에서 영감을 받은 **별도 축약 해역**입니다. 3D 장면의 지형·항만·수심·기상·국경을 실측 재현하지 않습니다. 실제 항해나 적재 판단에 사용할 수 없습니다. 서해 5도 표기는 지명 선택을 의미하며 NLL 등의 경계선은 모델링하지 않습니다. 강은 요트만 허용합니다.

자동 항로는 섬을 원형 제외 구역으로 근사해 우회합니다. 제한된 관성 조타와 충돌 정지가 있으며, 전문 충돌 회피·실제 해도 기반 항로가 아닙니다. 화물의 체결·이동·액체 슬로싱 형상·크레인 하중은 정밀 시뮬레이션하지 않습니다. 캐릭터·선박·브릿지는 코드로 만든 모델이며 Higgsfield/Blender 에셋은 사용하지 않았습니다.

## 검증과 배포

`npm test`: 이동 물리, 복원성, 정수 중 감쇠, 편중 평형, 음의 GM, 선적 조건, 섬 우회 항로.
`node tests/browser-check.mjs`: Chrome에서 시점·모바일·적재 높이 비교·화물 잠금·모든 선종.
`node tests/fleet-check.mjs`: 13척의 1·3인칭, 분류 필터, 램프 작동, 모바일 화면.
`node tests/generate-fleet.mjs`: 개발 서버에서 동일 모델의 WebP 미리보기를 다시 생성.
`node tests/voyage-check.mjs`: 실제 선적 → 항해 → 하역 → 보상 → 새로고침 저장 복원.
브라우저 테스트는 기본적으로 `127.0.0.1:5197`을 사용합니다. `VOYAGE_URL`로 배포 URL도 지정할 수 있습니다.

GitHub Pages의 source를 GitHub Actions로 지정합니다. `main` 푸시 시 `.github/workflows/pages.yml`이 테스트·빌드·배포합니다.

주요 파일: `vessels.js` 선종별 모델과 인스턴싱, `scene.js` 3D 렌더링, `bridge.js` 브릿지와 항해사, `stability.js` 복원성, `education.js` 학습 그림, `navigation.js` 항로, `physics.js` 이동, `main.js` 게임과 UI.

[수익화 구상](./MONETIZATION.md) · [서드파티 표기](./THIRD_PARTY_NOTICES.md)

`node tests/helm-check.mjs`: 기본 3인칭, 실제 마우스·터치 드래그, 닻 자동 해제, 위치 이동·선회·정지, 레이더 범위, 모바일 가로·세로 화면.

`node tests/generate-officer.mjs`: 3D 항해사 모델에서 투명 WebP 초상을 다시 생성합니다.

`node tests/international-check.mjs`: 부산 → 하카타 선적·출항·해역 이동·새로고침 복원·도착 하역·정산, 잘못된 해역의 정산 차단, 자유 모드·중국 해역.

`node tests/world-check.mjs`: 18개 신규 항만의 출항·입항·부두 간 72개 안전 경로와 6개 경관 프로필 렌더링.

### 살아 있는 바다 (v1.5)

- 18개 항만에 번들된 공개 고도 지형, 움직이는 구름, 선회 항적과 컨테이너 골조 디테일.
- 최대 4척의 어선·화물선·여객선과 2마리 고래. 부두를 통과하는 NPC 항로는 생성하지 않음. 강에는 바다 고래를 배치하지 않음.
- 주황 어망/표류 목재는 회피 대상. 레이더의 흰 선박, 주황 장애물, 파란 고래 관찰 안내와 접근 경고를 참고. 파란 고래는 게임 안내이며 레이더 탐지 재현이 아님.
- 상대 운동으로 35초 내 최근접 접근을 예측. 자동 항해는 위험 시 감속, 접촉 시 정지하여 수동 회피 가능. 현실 COLREG 전체를 구현한 훈련 장비는 아님.
- NPC 시간은 플레이/시간 배속과 함께 전진하고 메뉴·정지 상태에서는 멈춤.

검증: `npm test`, `node tests/living-sea-check.mjs`, `node tests/helm-check.mjs`, `node tests/voyage-check.mjs`.

### v1.6 항해 속도감

게임 최고 속력을 기존 대비 약 35% 높이고 가속 반응을 약 2.1배로 조정했다. 레버 30% 이하·후진은 기존 목표 속도를 유지하여 접안을 돕는다. 최고 속력은 실제 선박 제원과 구분되는 게임 설정이다. 속력에 따라 3인칭 시야가 최대 7도 넓어지고 카메라가 조금 낮아지며 선수 앞을 바라본다. 선수 물보라·항적과 기관 회전음·풍절음도 속력에 반응한다.

### v1.7 고동과 항해 BGM

레이더 아래 고동 버튼 또는 F로 선박 크기에 맞는 고동을 울린다(4초 간격). 오리지널 합성 패드 BGM과 48~69초 간격의 먼 고동을 바다·바람·기관음에 혼합한다. 환경 설정에서 BGM과 먼 고동을 각각 끄거나 BGM 음량을 조절할 수 있다. 전체 소리 끄기는 모두 음소거한다. 녹음 파일을 사용하지 않는 Web Audio 합성음이며 실제 항해 신호를 재현하는 훈련 기능은 아니다.

### v1.8 항만 지반·브릿지

부두 상면을 게임 수면 기준 +7m로 높이고, 모든 야드·건물 아래에 연결된 매립 지반과 안벽을 넣었다. 강둑과 강변 건물도 수면 위로 높였다. 브릿지는 BRIDGE_REFERENCES.md의 실제 장비/내부 사진을 참고하여 독립형 5개 모니터, 와이퍼, 천장 계기, 조타대, 기관 레버, 당직 의자를 재구성했다.

기본 항해는 3× 시간 압축이며 침로 아래 버튼으로 3→8→20→1× 순환한다. 1×는 원래 시뮬레이션 시간이다. 배속은 이동·가속과 주변 선박에 적용되며 파도·카메라·오디오는 실시간이다. 고동은 음량과 중고역을 올리고 울리는 동안 배경음을 낮춘다.

### v1.9 — 움직이는 항만과 항해 실습 수첩

- 해역 진입마다 시드 기반으로 달라지는 예인선·바지선·화물선·여객선·이동 어선·조사선의 순환 교통. 양망 어선과 수중 장비 작업선은 작업 지점을 유지합니다.
- 예인줄과 바지선 사이, 부표 어망, 작업 경계를 회피하는 플레이. 선박·작업 상태를 구분하는 레이더 표시와 안내를 추가했습니다.
- **메뉴 → 당직 항해 실습**에서 타선을 선택하면 1× 관측을 시작합니다. 청록색 표적, 방위, CPA/TCPA를 확인하고 직접 조타해 통과하면 최소 여유 거리와 항해 기록을 복기합니다.
- 정면·횡단·추월·유지선·경계·작업선 상태의 6개 퀴즈, 공식 원문 링크, 브라우저에 저장되는 학습 이력.
- 국제규칙을 참고한 입문 게임입니다. 실제 항법 판정 AI나 공인 훈련기는 아니며 거리·시간·점수는 게임 난이도 값입니다. [자료별 적용 범위와 단순화](NAVIGATION_REFERENCES.md)를 확인하세요.

검증: `npm test`, `node tests/watch-school-check.mjs`, `node tests/traffic-world-check.mjs`, `node tests/living-sea-check.mjs`, `node tests/international-check.mjs`. 지형·모델 검사 스크립트는 개발 서버 5197을 사용하며, 일반 브라우저 검사는 `VOYAGE_URL`로 배포 주소를 지정할 수 있습니다.

### v1.10 — 파도와 선체의 접촉 효과

선체 좌우 12곳의 파도 접근·롤링·피칭을 계산해 물보라와 거품을 만듭니다. 물방울은 중력으로 떨어져 다시 수면 거품이 되고, 선미 교란과 회전 항적은 물 위에 남아 퍼지다가 사라집니다. 선수 재입수 때는 물보라가 더 크게 일어납니다. 정박 중에도 입사 파도에 반응합니다.

배 근처 수면을 2 m 격자로 세밀하게 만들고 파도 기울기·파봉 거품을 반영했습니다. 상하 운동은 선박 크기·적재량에 따른 관성과 감쇠를 적용하고, 충돌 강도에 따라 물소리도 변합니다. 모바일·주변 선박의 입자 한도를 별도로 두었습니다. **메뉴 → 환경 설정 → 거친 물결**에서 효과를 쉽게 볼 수 있습니다.

[물리 개념·구현·단순화 범위](HYDRODYNAMICS_REFERENCES.md). 검증: `npm test`, `node tests/foam-check.mjs`, `node tests/foam-model-check.mjs`.

## v1.11 — Traffic and changing weather

Outer-approach traffic now joins the harbor circuits with container ships, tankers, bulkers, car carriers, ferries and service vessels. Radar opens at 3.2 km, extends to 6.4 km, shows motion history and 60-second vectors, and supports tapping a vessel to inspect CPA/TCPA. Orange overlays identify working gear and obstacles.

The compact weather button opens calm, breeze, rough sea, squall, typhoon and automatic weather. Clouds, directional rain, visibility, gusts, wind heel, long swell and crest groups change smoothly together. Severe typhoon weather is opt-in. The physical water spectrum is shared with hull motion and foam.

See [weather and traffic sources / model limits](WEATHER_TRAFFIC_REFERENCES.md). `npm test` checks the models; `node tests/weather-traffic-check.mjs` checks radar, storm transitions, recovery, pause and mobile layout against a running preview (or `VOYAGE_URL`).

## v1.12 — Visible traffic throughout a voyage

A bounded encounter population follows the voyage area: up to ten nearby contacts (five service boats in rivers), with randomized safe circuits and replacements when distant contacts leave the area. Pilot launches and surface-observation sharks join fishing boats, tugs, cargo ships, ferries and whales. The default follow camera faces toward the navigable side of the departure harbor. Models are added and removed incrementally without rebuilding existing wakes.

The procedural sky is now camera-centered at every voyage position, including distant waters. HDR background switching was removed; clouds, water color and sunlight, hemisphere illumination, exposure and haze all respond to the same weather value. Severe storms fully replace the warm sky palette. Marine wildlife uses blue learning overlays and is excluded from ship watchkeeping targets.

Regression: `tests/encounters.test.js` checks population bounds, replenishment, movement and safe terrain; `tests/visible-sea-check.mjs` checks visible contacts at 7 km, storm panoramas and mobile layout.

## v1.13 — Collision, repair and rescue

Collisions reduce hull condition according to impact speed, leave a localized hull dent/scuff, play an impact sound and reduce propulsion. A cooldown prevents damage on every frame of one contact. Reverse propulsion remains available even with severe damage, and moving away from a vessel overlap is allowed.

The damage card offers free repeated repair (+8 condition per press while stopped), a fictional Coast Guard dispatch, and a one-button astern escape. The rescue boat uses a checked water corridor, appears in blue on radar with flashing beacons, stops 100 game metres away and completes game-only automatic repair. Requesting rescue focuses the third-person view toward the approaching boat. It does not contact any real emergency service. Cargo, missions and earned money are preserved; hull damage persists on reload. Capsize recovery remains the separate existing port-return flow.

`tests/damage.test.js` covers impact severity/cooldown, repair, damaged astern propulsion, rescue route/arrival and save persistence. `tests/damage-check.mjs` drives a real quay collision, repairs, reverses, checks preserved cargo and runs dispatch-to-repair on mobile.

### v1.14 — 수리 후 자동 재출항 · 해기사 학습 항해

사고 뒤 남아 있던 닻·후진 출력·1× 배속을 복구한다. 수동/구조대 수리 완료 시 지형·장애물·타선·전방 수역을 확인한 위치로 옮겨 전진 65%로 재개하며 화물과 미션을 유지한다. “무조건 후진” 안내는 제거했다. 실제 좌초 대응과 게임용 자동 복구의 차이는 사고 대응 학습에서 설명한다.

메뉴 → **해기사 학습 항해**에서 4~1급을 선택한다. 해사영어·선화운송·선박운용·사고 대응 16개 창작 문제와 조타·감속·레이더·GM 비교 실습, 최초 완료 XP 및 저장 기능을 제공한다. 급수별 난이도는 자체 구성이고 공식 기출·전 범위 시험 대비는 아니다. 분석과 공식 참고 문서는 [MARITIME_ACADEMY_REFERENCES.md](MARITIME_ACADEMY_REFERENCES.md)를 참고한다.

검증: `npm test`, `npm run build`, `node tests/damage-check.mjs`, `node tests/academy-check.mjs`, `node tests/voyage-check.mjs`.
