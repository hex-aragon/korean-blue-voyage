# 항해 지도와 항만 구성

2026-09-11 업데이트. 게임에는 24개 해역, 75개 이름 있는 작업 수역이 있습니다. 같은 실제 항구가 기존 광역 해역과 새 항만 해역에 각각 등장하기도 하므로, 75개 모두 서로 다른 실제 항만이라는 뜻은 아닙니다.

## 실제 자료와 게임 배치의 구분

- **광역 항해도**: Natural Earth의 공개 해안선 데이터를 동경 115–144°, 북위 24–43°로 잘라 표시합니다. 항만 위치는 항만 또는 항만 권역을 나타내는 개략 위치입니다.
- **3D 항만**: 부두·방파제·컨테이너 크레인·탱크·여객터미널·도시·섬을 코드로 구성했습니다. 공식 배치도의 항만 종류와 구성을 참고했지만, 부두 위치·방향·길이·산 높이·수심을 실측 재현한 지오리퍼런스 3D 모델이나 포토그래메트리 모델은 아닙니다.
- **외해 이동**: 출항 지점까지 직접 항해한 뒤 긴 국가 간·국내 해역 간 구간을 압축 이동합니다. 화물을 보존한 채 도착 해역에서 다시 입항·하역합니다. 실제 정기항로·통관·국경 절차·항해 시간을 재현하지 않습니다.
- **거리**: 레이더와 미션 카드의 m는 게임 세계 거리입니다. 광역도상의 항만 간 실거리와 같지 않습니다.

## 참고 자료

| 자료 | 반영 범위 |
|---|---|
| [Natural Earth 1:50m 지리 자료](https://www.naturalearthdata.com/downloads/50m-physical-vectors/) · [원본 GeoJSON](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_land.geojson) | 한국·중국·일본 광역 항해도의 육지 윤곽. `public/maps/east-asia.json`에 축소 저장 |
| [Natural Earth 항만 자료](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/) | 일부 주요 항만 위치 교차 확인. 여기서 10m는 1:10,000,000 축척을 뜻하며 10 m 해상도가 아님 |
| [Natural Earth 이용 조건](https://www.naturalearthdata.com/about/terms-of-use/) | 공개 도메인 자료. 가공·배포 가능 |
| [부산항만공사 부산항 지도](https://busanpa.com/board/list.bpa?boardId=BBS_0000033&contentsSid=33&menuCd=DOM_000000105003004000) | 북항·감만·신항의 구분, 컨테이너 부두 경관 참고 |
| [인천항 안내도](https://eng.icpa.or.kr/content/view.do?contentKey=1082&menuKey=3866) | 내항·신항·여객 시설, 매립 부두와 산업항 경관 참고 |
| [여수광양항만공사](https://www.ygpa.or.kr/hmpg/ygpa/main.do) | 여수·광양의 항만 권역 구분 참고 |
| [상하이항 터미널 소개](https://en.portshanghai.com.cn/TeminalHanding/index.jhtml) | 양산·와이가오차오 등 터미널 구분, 대형 컨테이너 부두 참고 |
| [후쿠오카시 하카타항 부두 안내](https://www.city.fukuoka.lg.jp/kowan/somu/hakata-port/portmap.html) | 아일랜드시티·가시이파크포트·여객 부두 구분 참고 |
| [나고야항 항만 지도](https://www.port-of-nagoya.jp/english/aboutport/1001414.html) | 나고야 부두 구분과 항만 권역 참고 |

공식 지도 이미지·위성 영상·유료 3D 타일을 복사하거나 번들에 넣지 않았습니다. 항만 당국과 제휴한 게임이 아닙니다. 공식 자료로 조사하지 않은 세부 건물·장비·부두 형상은 일반적인 항만 시설을 바탕으로 한 창작 표현입니다.

## 해역 목록

- 한국 16개: 서해 5도, 서해, 남해, 동해, 한강, 낙동강, 부산, 인천, 평택·당진, 군산, 목포, 여수·광양, 울산, 포항, 동해·묵호, 제주.
- 중국 3개: 칭다오·산둥, 다롄, 상하이·닝보.
- 일본 5개: 하카타, 시모노세키·간몬, 고베·오사카, 나고야, 요코하마·도쿄만.

광역 해역 안의 웨이하이·옌타이·닝보·오사카·도쿄 등은 압축 배치된 작업 수역입니다. 지역별 독립 도시 전체를 실측 모델링한 것은 아닙니다.

## 데이터 재생성

Natural Earth 원본 `ne_50m_land.geojson`을 받은 뒤:

```sh
python3 scripts/build-atlas.py /path/to/ne_50m_land.geojson
```

항만별 렌더링은 `src/harbors.js`, 지역·부두 명칭은 `src/harbor-data.js`, 의뢰와 게이트는 `src/missions.js`가 담당합니다.
