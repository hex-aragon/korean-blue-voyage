// Coordinates locate each district on the geographic atlas. Navigable layouts are compressed game scenes.
const def=(id,name,en,country,lat,lon,profile,ports,seed,extra={})=>({id,name,en,country,lat,lon,profile,ports,seed,layout:'harbor',label:ports.join(' · '),wave:.5,wind:5,depth:40,color:0x246b79,desc:{container:'컨테이너 크레인과 넓은 접안 수역',estuary:'하구의 평평한 해안과 산업 부두',industrial:'탱크와 사일로가 이어지는 산업항',island:'섬의 능선과 여객 터미널',urban:'도시 스카이라인과 여객 부두',channel:'양쪽 육지 사이의 해협 항로'}[profile],exit:{x:-350,z:-2500,name:'외해 출항 지점'},...extra});
export const harborRegions=[
 def('busan','부산항','Busan','KR',35.10,129.04,'container',['부산 북항','감만부두','부산 신항'],101,{wave:.65,source:'https://busanpa.com/board/list.bpa?boardId=BBS_0000033&contentsSid=33&menuCd=DOM_000000105003004000'}),
 def('incheon','인천항','Incheon','KR',37.45,126.60,'estuary',['인천 내항','인천 신항','국제여객터미널'],102,{color:0x497e7e,source:'https://eng.icpa.or.kr/content/view.do?contentKey=1082&menuKey=3866'}),
 def('pyeongtaek','평택·당진항','Pyeongtaek–Dangjin','KR',36.97,126.82,'estuary',['평택 자동차부두','당진 철강부두','평택 컨테이너부두'],103),
 def('gunsan','군산항','Gunsan','KR',35.9597,126.5881,'estuary',['군산 외항','군산 자동차부두','장항항'],104),
 def('mokpo','목포항','Mokpo','KR',34.77,126.37,'island',['목포 여객터미널','목포 신항','삼학도 부두'],105,{color:0x327a7b}),
 def('gwangyang','여수·광양항','Yeosu–Gwangyang','KR',34.90,127.67,'industrial',['광양 컨테이너부두','여수항','여천 탱크터미널'],106,{source:'https://www.ygpa.or.kr/hmpg/ygpa/main.do'}),
 def('ulsan','울산항','Ulsan','KR',35.4878,129.3856,'industrial',['울산 본항','온산항','미포항'],107,{color:0x1b6b84,wave:.8}),
 def('pohang','포항항','Pohang','KR',36.0197,129.4028,'industrial',['포항 구항','영일만항','포항 신항'],108,{color:0x1c658a,wave:.9}),
 def('donghae','동해·묵호항','Donghae–Mukho','KR',37.52,129.13,'industrial',['동해항','묵호항','삼척항'],109,{color:0x1b5c86,wave:1}),
 def('jeju','제주 해역','Jeju','KR',33.52,126.54,'island',['제주항','서귀포항','성산포항'],110,{color:0x168c91,wave:.75,volcano:true}),
 def('qingdao','칭다오·산둥','Qingdao–Shandong','CN',36.0958,120.3170,'container',['칭다오 첸완항','웨이하이항','옌타이항'],201,{color:0x387c87}),
 def('dalian','다롄항','Dalian','CN',38.9336,121.6504,'industrial',['다롄항','다야오완항','뤼순항'],202,{color:0x2c6e85}),
 def('shanghai','상하이·닝보','Shanghai–Ningbo','CN',30.63,122.07,'container',['상하이 양산항','와이가오차오항','닝보·저우산항'],203,{color:0x527d78,source:'https://en.portshanghai.com.cn/TeminalHanding/index.jhtml'}),
 def('hakata','하카타항','Hakata','JP',33.63,130.40,'urban',['하카타 국제여객부두','아일랜드시티','가시이파크포트'],301,{source:'https://www.city.fukuoka.lg.jp/kowan/somu/hakata-port/portmap.html'}),
 def('shimonoseki','시모노세키·간몬','Kanmon Strait','JP',33.9344,130.9011,'channel',['시모노세키항','모지항','기타큐슈항'],302,{wave:.3}),
 def('kobe','고베·오사카','Kobe–Osaka','JP',34.6842,135.2381,'urban',['고베 포트아일랜드','롯코아일랜드','오사카항'],303),
 def('nagoya','나고야항','Nagoya','JP',35.05,136.87,'container',['나고야 가든부두','긴조부두','도비시마부두'],304,{source:'https://www.port-of-nagoya.jp/english/aboutport/1001414.html'}),
 def('yokohama','요코하마·도쿄만','Yokohama–Tokyo Bay','JP',35.4364,139.6674,'urban',['요코하마 오산바시','혼모쿠부두','도쿄 오이부두'],305),
];
export const countries={KR:'한국',CN:'중국',JP:'일본'};
export function harborPorts(region){return region.ports.map((name,i)=>({id:`${region.id}-${i}`,regionId:region.id,name,x:[0,-340,110][i],z:[-300,-990,-1640][i],kind:i===1&&region.profile==='industrial'?'tank':region.profile,berth:`${i+1}번 작업 수역`}));}
export const seaGate=region=>region.exit||{x:-350,z:-2500,name:'외해 출항 지점'};
