import {contactSolution} from './traffic.js';
export const RULES_URL='https://navcen.uscg.gov/navigation-rules-amalgamated';
export const lessons=[
 {id:'lookout',title:'경계와 충돌 위험',rule:'Rules 5 · 6 · 7 · 8',question:'레이더의 CPA가 크게 나오면 경계를 끝내도 될까요?',options:['아니요. 육안·청각과 반복 관측을 함께 사용한다','네. 한 번 계산한 CPA면 충분하다'],answer:0,explain:'CPA는 최근접 거리, TCPA는 그때까지의 시간입니다. 현재 운동이 유지된다는 예측이므로 변침·변속하면 달라집니다. 충분한 정보로 계속 판단하세요.'},
 {id:'headon',title:'마주치는 두 동력선',rule:'Rules 11 · 14 · 16',question:'서로 보이는 개방 수역, 두 동력선이 거의 정면으로 접근하며 충돌 위험이 있습니다.',options:['양쪽 모두 좌현으로 변침','양쪽 모두 우현으로 변침해 서로의 좌현을 두고 통과'],answer:1,explain:'조기에 뚜렷하게 행동하고 안전하게 벗어날 때까지 효과를 확인합니다. 이 문제는 좁은 수로·통항분리수역·제한시계 상황이 아닙니다.'},
 {id:'crossing',title:'우현에서 오는 배',rule:'Rules 11 · 15 · 16',question:'서로 보이는 두 동력선의 횡단 상황. 내 우현에 상대선이 있고 충돌 위험이 있습니다.',options:['내가 피항하며 가능하면 상대 선수 앞 횡단을 피한다','속력만 높여 상대 선수 앞을 지난다'],answer:0,explain:'피항선은 일찍 충분히 떨어지는 행동을 합니다. 특정 변침 각도나 고정 거리 하나가 모든 상황의 정답은 아닙니다.'},
 {id:'standon',title:'유지선의 책임',rule:'Rule 17',question:'상대 피항선이 적절히 행동하지 않고 계속 접근하면?',options:['유지선이므로 충돌 직전까지 아무것도 하지 않는다','상대가 조치하지 않음이 명백하면 스스로 회피할 수 있다'],answer:1,explain:'피항선만으로 충돌을 피할 수 없을 만큼 가까워지면 유지선도 최선의 협력 동작을 해야 합니다. 유지선은 절대적인 통행권이 아닙니다.'},
 {id:'overtaking',title:'추월은 완전히 벗어날 때까지',rule:'Rule 13',question:'상대선 정횡 뒤 22.5°를 넘는 방향에서 따라잡는 배의 역할은?',options:['추월하는 배가 완전히 지나 충분히 멀어질 때까지 피한다','나란히 서는 순간 횡단 규칙으로 바뀐다'],answer:0,explain:'추월 여부가 의심되면 추월로 보고 행동합니다. 뒤따르던 배가 옆으로 나왔다고 피항 의무가 끝나지는 않습니다.'},
 {id:'working',title:'선종보다 현재 작업',rule:'Rules 3 · 18 · 24 · 26 · 27',question:'어선과 예인선은 언제나 조종능력제한선일까요?',options:['네. 선종만 보면 된다','아니요. 실제 어구·작업이 조종에 미치는 제한을 확인한다'],answer:1,explain:'조종을 제한하는 어구로 조업 중인 어선과 이동 중인 어선을 구별합니다. 예인도 진로 이탈 능력이 심하게 제한되는 작업인지가 중요합니다. 예인줄과 작업 장비 가까이 들어가지 마세요.'}
];
export function restoreSchool(raw){return {passed:Array.isArray(raw?.passed)?[...new Set(raw.passed.filter(id=>lessons.some(l=>l.id===id)))]:[],log:Array.isArray(raw?.log)?raw.log.filter(r=>typeof r.name==='string'&&typeof r.success==='boolean'&&Number.isFinite(r.minClearance)&&Number.isFinite(r.travel)).slice(0,12).map(r=>({...r,name:r.name.slice(0,60)})):[]};}
export function beginWatch(c,state){return {id:c.id,name:c.name,observed:false,time:0,minClearance:Infinity,travel:0,entered:false,auto:false,unsafe:false,start:{x:state.x,z:state.z},previous:{x:state.x,z:state.z}};}
export function observeWatch(task,c,state){if(!c||c.id!==task.id)return false;const s=contactSolution(c,state);if(s.distance>700)return false;task.observed=true;task.observedAt=s.distance;return true;}
// This measures a game exercise, never compliance with COLREG or professional competence.
export function stepWatch(task,world,state,beam,dt,autopilot,collision=false){const c=world.contacts.find(c=>c.id===task.id);if(!c)return {done:true,cancelled:true};task.time+=dt;
 const moved=Math.hypot(state.x-task.previous.x,state.z-task.previous.z);task.previous={x:state.x,z:state.z};if(!state.anchored&&task.observed)task.travel+=moved;
 const s=contactSolution(c,state,beam),clearance=s.distance-c.radius-beam/2-(c.kind==='towing'?95:0);task.minClearance=Math.min(task.minClearance,clearance);task.auto ||=autopilot;task.unsafe ||=collision||clearance<35;
 if(s.distance<350)task.entered=true;
 if(task.time>360||task.entered&&s.distance>460){const success=task.observed&&task.observedAt>=250&&task.travel>=120&&!task.auto&&!task.unsafe&&task.time<=360;
  return {done:true,success,name:task.name,minClearance:Math.round(task.minClearance),travel:Math.round(task.travel),reason:success?'관측 후 직접 조선하며 충분한 여유를 유지했습니다.':task.unsafe?'선박·작업 구역에 너무 가까워졌습니다.':task.auto?'자동 항해가 사용되었습니다. 다음에는 직접 조타해 보세요.':!task.observed?'표적 확인을 하지 않았습니다.':task.observedAt<250?'발견이 늦었습니다. 더 멀리서 확인하세요.':task.travel<120?'직접 항해한 거리가 부족합니다.': '시간이 끝났습니다. 항로에서 만나는 표적으로 다시 시도하세요.'};}
 return {done:false,solution:s};}
export function watchHint(c){if(c.kind==='towline'||c.kind==='towing')return '예인선과 바지선 사이로 들어가지 마세요';if(c.kind==='net'||c.status==='fishing')return '양망 작업 · 부표와 어구 바깥으로 우회';if(c.kind==='workzone'||c.status==='restricted')return '수중 장비 작업 · 작업 구역 바깥으로 우회';if(c.kind==='whale')return '감속하고 관찰 거리를 확보하세요';return '방위 변화와 접근 추세를 반복 관측하세요';}
