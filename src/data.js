export const ships = [
 {id:'yacht',name:'요트',en:'Serein 38',type:'바람을 따라가는 작은 여행',length:17,beam:4.6,mass:1,maxSpeed:13,accel:1.6,turn:0.48,draft:1.8,color:0xf0ede3,cargo:'섬 여행',reward:1200},
 {id:'container',name:'컨테이너선',en:'Blue Horizon',type:'수평선 너머로 이어지는 교역',length:58,beam:11,mass:5,maxSpeed:22,accel:0.7,turn:0.19,draft:8,color:0x263d4d,cargo:'컨테이너 운송',reward:4800},
 {id:'tanker',name:'유조선',en:'Amber Tide',type:'묵직한 관성, 느긋한 항해',length:66,beam:13,mass:7,maxSpeed:16,accel:0.45,turn:0.12,draft:11,color:0x8f3027,cargo:'원유 운송',reward:6200},
 {id:'bulk',name:'벌크선',en:'Terra Maris',type:'세계를 움직이는 원자재',length:60,beam:12,mass:6,maxSpeed:18,accel:0.6,turn:0.15,draft:9,color:0x244d49,cargo:'곡물 운송',reward:5200},
 {id:'chemical',name:'케미컬선',en:'Silver Current',type:'정교한 운항의 즐거움',length:47,beam:9,mass:4,maxSpeed:19,accel:0.8,turn:0.22,draft:7,color:0x38536d,cargo:'화학제품 운송',reward:5600},
];
export const regions = [
 {id:'five',name:'서해 5도',en:'West Sea Islands',label:'백령도 앞바다',lat:37.96,lon:124.68,color:0x176777,seed:12,wave:0.9,depth:35,wind:7.2,ports:['백령도','대청도','소청도','연평도','소연평도'],desc:'다섯 섬 사이, 느리게 흐르는 시간',layout:'islands'},
 {id:'west',name:'서해',en:'West Sea',label:'태안 · 안면도',lat:36.55,lon:126.24,color:0x1f727a,seed:34,wave:0.65,depth:26,wind:5.4,ports:['태안항','안면도','군산항'],desc:'낮은 섬과 금빛 노을의 바다',layout:'islands'},
 {id:'south',name:'남해',en:'South Sea',label:'통영 · 한려수도',lat:34.79,lon:128.38,color:0x127e82,seed:78,wave:0.55,depth:48,wind:4.8,ports:['통영항','비진도','욕지도','거제항'],desc:'푸른 섬을 따라 이어지는 항로',layout:'islands'},
 {id:'east',name:'동해',en:'East Sea',label:'울릉도 앞바다',lat:37.47,lon:130.89,color:0x125582,seed:61,wave:1.45,depth:280,wind:9.1,ports:['울릉도','독도 해역','동해항'],desc:'깊고 푸른 물결, 탁 트인 수평선',layout:'open'},
 {id:'han',name:'한강',en:'Han River',label:'여의도 · 반포',lat:37.52,lon:126.94,color:0x366f77,seed:24,wave:0.16,depth:5,wind:3.1,ports:['여의나루','반포나루','잠실나루'],desc:'도시의 일상에서 잠시 멀어지는 길',layout:'river'},
 {id:'nakdong',name:'낙동강',en:'Nakdong River',label:'을숙도 · 낙동강 하구',lat:35.1,lon:128.94,color:0x387f7b,seed:92,wave:0.22,depth:6,wind:3.8,ports:['을숙도','삼락나루','화명나루'],desc:'갈대와 강바람 사이의 쉼',layout:'river'},
];
export const weatherPresets={calm:{name:'잔잔한 바다',wave:0.45,wind:0.55},breeze:{name:'산들바람',wave:1,wind:1},rough:{name:'거친 물결',wave:2.4,wind:1.8}};
export function portLocations(region){return region.ports.map((name,i)=>({name,x:Math.sin(i*1.35)*780,z:-300-i*530}));}
