# 선종 조사와 모델링 기준

2026-09-11에 선사·조선사·연구기관의 공식 공개 자료를 확인했습니다. 아래는 게임에 반영한 관찰과 게임화한 부분을 구분한 기록입니다. 외부 사진이나 유료 3D 모델을 번들에 넣지 않았으며, 3D 형상·텍스처·미리보기는 코드로 생성했습니다.

| 참고 자료 | 확인한 특징 | 게임의 표현 |
|---|---|---|
| [Maersk: Ane Mærsk 명명 발표](https://www.maersk.com/news/articles/2024/01/26/maersk-names-first-vessel-of-its-large-methanol-enabled-fleet-ane-maersk) | 이 계열은 브릿지·거주구를 선수 쪽에 배치 | Nordic Pioneer: 선수 브릿지, 후방 적재갑판, 청색 도장. Ane Mærsk 자체를 복제한 모델은 아님 |
| [천경해운: SKY HOPE 공식 제원](https://www.ckline.com/en/service/ship/?svslcod=SKH1) | Full Container, 1,009 TEU, 전장 145.71 m, 폭 22.74 m | Sky Coast: 피더 컨테이너선 비례와 선미 거주구를 참고. 게임 길이 60 m, 폭 9.4 m의 창작선. 공식 페이지 속력 값은 유효 제원으로 사용하지 않음 |
| [Wallenius Marine: HERO PCTC](https://www.walleniusmarine.com/our-services/ship-design-newbuilding/ship-design/hero-class-pctc/) | 다층 차량갑판, 차량 운반, 파랑 관통형 선수의 설계 설명 | Aurora Drive: 높은 차량갑판, 선미 램프, 차가 이동하는 선적·하역 애니메이션. 갑판 수·수용량은 재현하지 않음 |
| [Stena Line: Stena Estrid](https://stenaline.com/about-us/our-ships/stena-estrid/) | 객실·여객 라운지 등 여객 서비스 | Hallyeo Islander: 여객 상부구조, 긴 창문 띠, 구명정, 차량 램프를 가진 일반적인 Ro-Pax 구성 |
| [Royal Caribbean: Oasis of the Seas](https://www.royalcaribbean.com/cruise-ships/oasis-of-the-seas) | 다층 여객선과 상부 레저·풀 데크 | Ocean Reverie: 다층 객실, 발코니, 수영장, 선베드, 구명정. Oasis급의 치수·특정 설계를 복제하지 않음 |
| [MOL: LNG carriers](https://www.mol.co.jp/en/various-vessels/lng_carrier/) | Moss형 구형 탱크와 멤브레인형 탱크 구분 | Polar Sphere: 구형 탱크 4기, 상부 작업대, 가스 배관 |
| [Damen: ASD Tug 2813](https://www.damen.com/vessels/tugs/asd-tugs/asd-tug-2813) | 넓은 선폭, 낮은 조타실, 예인·소방 작업 장비 | Harbour Guardian: 넓고 짧은 선체, 고무 방현재, 예인 윈치, 소방 모니터. 실제 ASD 추진기를 정확히 모사하지 않음 |
| [KIOST: R/V 이사부호](https://www.kordi.re.kr/lab/sub05_01.do) | 연구·관측 장비를 갖춘 해양조사선 | Haeyang Explorer: 작업 갑판, 선미 A프레임, 관측 장비, 위성 통신 돔. 이사부호의 축척 복제품은 아님 |
| [MOL: 선종 소개](https://www.mol.co.jp/en/various-vessels/), [벌크선](https://www.mol.co.jp/en/services/bulkshipping/), [탱커](https://www.mol.co.jp/en/services/tanker/) | 건화물 벌크 운송과 액체 화물 운송의 구분 | 기존 벌크선 해치·크레인, 원유선·케미컬선 배관·탱크 구획을 개선 |

## 선박 목록

13척: 세일링 요트, 일반 컨테이너선, 원유 운반선, 벌크선, 케미컬 탱커, PCTC 카캐리어, Ro-Pax 카페리, 크루즈 여객선, Moss형 LNG선, 항만 예인선, 해양 조사선, 머스크 참고형 컨테이너선, 천경해운 참고형 피더선.

## 3D 개선

- 64개 길이 방향 단면과 둥근 빌지로 만든 곡면 선체, 선수 벌브, 수선부 도장, 선미·타·프로펠러
- 강판 이음선과 약한 표면 흔적, 컨테이너 골판 및 문자, 티크 갑판의 절차적 텍스처
- 계단형 거주구, 창문과 발코니, 구명정·다빗, 난간·볼라드·앵커·마스트
- 선종별 브릿지 위치·높이와 실내 조종판, 선적량에 반응하는 선종별 화물 표현
- 카캐리어/카페리의 선미 램프와 차량 이동
- 실시간 환경광 반사와 데스크톱 선박 자체 그림자
- 반복 부품은 InstancedMesh로 묶음. 한 모델의 부품이 많아져도 부품 수만큼 draw call이 늘지 않음
- 갤러리 썸네일은 동일한 실제 3D 모델을 렌더링한 WebP. 게임 상태와 별개인 적재 예시라고 표시

## 범위

선사 이름·도장은 참고 표현이며 공식 제휴·승인·정밀 디지털 트윈을 뜻하지 않습니다. 모든 게임 전장·속력·흘수·하중 값은 플레이에 맞춘 설정입니다. 외형은 실제 선종의 인지 가능한 특징에 맞췄지만, 내부 구조·기관·추진·복원성은 교육용 근사 모델입니다. 예인선은 이번 버전에서 다른 배를 실제로 예인하지 않으며, 조사선은 실제 해저 측량 기능이 없습니다. 여객·차량·LNG도 공통의 가상 적재 단위와 운송 시스템을 사용합니다.
