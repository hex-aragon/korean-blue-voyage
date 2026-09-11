// Fictional, seeded traffic in compressed game waters. Never live AIS or a COLREG solver.
import {clearLeg} from './navigation.js';
const TAU=Math.PI*2;
export function seededRandom(seed){let n=seed>>>0;return ()=>{n+=0x6D2B79F5;let t=Math.imul(n^n>>>15,1|n);t^=t+Math.imul(t^t>>>7,61|t);return ((t^t>>>14)>>>0)/4294967296;};}
export function routePoint(c,phase=c.phase){return {x:c.cx+Math.cos(phase)*c.rx,z:c.cz+Math.sin(phase)*c.rz};}
function safeLoop(c,obstacles){for(let i=0;i<64;i++)if(!clearLeg(routePoint(c,i*TAU/64),routePoint(c,(i+1)*TAU/64),obstacles,c.radius+30))return false;return true;}
export function createTraffic(region,obstacles=[],seed=Math.floor(Math.random()*4294967296)){
 const world={time:0,seed,contacts:[],hazards:[],trackedId:null};
 if(region.layout==='river')return world;
 const random=seededRandom(seed),contacts=world.contacts;
 const lanes=[[-440,-430,140,190,'tug'],[-1120,-650,70,330,'cargo'],[-490,-1340,160,370,'fishing'],[-430,-2530,470,110,'ferry'],[-340,-3030,260,230,'towing'],[-420,-2130,120,270,'research'],[-790,-530,110,220,'fishing']];
 const names={tug:'항만 예인선 · 이동',cargo:'연안 화물선',fishing:'어선 · 어구 회수 후 이동',ferry:'정기 여객선',towing:'예인선 + 바지선',research:'해양 조사선 · 이동'};
 lanes.forEach(([cx,cz,rx,rz,kind],i)=>{
  const c={id:`traffic-${i}`,kind,name:names[kind],cx:cx+(random()-.5)*90,cz:cz+(random()-.5)*100,rx:rx*(.85+random()*.3),rz:rz*(.85+random()*.3),phase:random()*TAU,direction:random()<.5?-1:1,cruise:kind==='towing'?2.2:kind==='tug'?4:kind==='fishing'?2.5:4.5+random()*1.5,radius:kind==='towing'?32:kind==='fishing'||kind==='tug'?17:38,status:kind==='towing'?'towing':'transit'};
  // A tow remains inside a conservative swept corridor, including its 95 m tow.
  if(!safeLoop({...c,radius:c.radius+(kind==='towing'?110:0)},obstacles))return;
  Object.assign(c,routePoint(c));c.heading=Math.atan2(-Math.sin(c.phase)*c.rx*c.direction,-Math.cos(c.phase)*c.rz*c.direction);c.speed=c.cruise;contacts.push(c);
 });
 const sites=[{id:'net-1',kind:'net',name:'양망 작업 · 어망',x:-175+(random()-.5)*50,z:-710+(random()-.5)*90,radius:70},{id:'work-1',kind:'workzone',name:'수중 조사 작업 구역',x:-840+(random()-.5)*60,z:-1480+(random()-.5)*100,radius:85},{id:'drift-1',kind:'debris',name:'표류 목재',x:-460+(random()-.5)*120,z:-1100+(random()-.5)*100,radius:18}];
 world.hazards=sites.filter(h=>obstacles.every(o=>Math.hypot(o.x-h.x,o.z-h.z)>o.radius+h.radius+40));
 for(const h of world.hazards){if(h.kind==='debris')continue;contacts.push({id:`operator-${h.id}`,kind:h.kind==='net'?'fishing':'research',name:h.kind==='net'?'어구로 조종이 제한된 조업선':'수중 장비 작업선 · 조종 제한',x:h.x+(h.kind==='net'?65:0),z:h.z,heading:0,speed:0,radius:18,status:h.kind==='net'?'fishing':'restricted',site:h.id});}
 contacts.push({id:'whale-1',kind:'whale',name:'고래 보호 수역',x:-550,z:-2080,heading:1,speed:2,radius:30},{id:'whale-2',kind:'whale',name:'고래 보호 수역',x:150,z:-2870,heading:1,speed:2,radius:25});
 // Avoid placing working gear across a roaming ship's circuit.
 world.contacts=contacts.filter(c=>!c.rx||safeLoop({...c,radius:c.radius+(c.kind==='towing'?110:0)},world.hazards));
 return world;
}
function pointSegmentDistance(p,a,b){const dx=b.x-a.x,dz=b.z-a.z,f=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz||1)));return Math.hypot(p.x-a.x-dx*f,p.z-a.z-dz*f);}
export function towEnd(c){return {x:c.x-Math.sin(c.heading)*95,z:c.z+Math.cos(c.heading)*95};}
export function stepTraffic(world,dt,own=null){world.time+=dt;for(const c of world.contacts){const old={x:c.x,z:c.z};if(c.kind==='whale'){const a=world.time*.018+(c.id==='whale-2'?2:0);c.x=-570+Math.cos(a)*260;c.z=(c.id==='whale-2'?-2800:-2400)+Math.sin(a)*115;c.heading=Math.atan2(-260*Math.sin(a),-115*Math.cos(a));
 const dx=own?c.x-own.x:0,dz=own?c.z-own.z:0,d=Math.hypot(dx,dz),push=own?Math.max(0,150-d):0,blend=1-Math.exp(-dt*2);
 c.avoidX=(c.avoidX||0)+((d>0?dx/d*push:push)-(c.avoidX||0))*blend;c.avoidZ=(c.avoidZ||0)+((d>0?dz/d*push:0)-(c.avoidZ||0))*blend;c.x+=c.avoidX;c.z+=c.avoidZ;
 c.depth=Math.min(0,Math.sin(world.time*.16+(c.id==='whale-2'?2:0))*9);c.visible=c.depth>-3;
 }else if(c.rx){
  const tangent=Math.hypot(c.rx*Math.sin(c.phase),c.rz*Math.cos(c.phase));
  const candidate=routePoint(c,c.phase+c.direction*c.cruise*dt/tangent);
  // Game-only anti-overlap courtesy stop; not a legal stand-on/give-way decision.
  const nextPhase=c.phase+c.direction*c.cruise*dt/tangent,nextHeading=Math.atan2(-Math.sin(nextPhase)*c.rx*c.direction,-Math.cos(nextPhase)*c.rz*c.direction);
  const ownDistance=own?(c.kind==='towing'?pointSegmentDistance(own,candidate,towEnd({...candidate,heading:nextHeading})):Math.hypot(candidate.x-own.x,candidate.z-own.z)):Infinity;
  const currentOwnDistance=own?(c.kind==='towing'?pointSegmentDistance(own,c,towEnd(c)):Math.hypot(c.x-own.x,c.z-own.z)):Infinity;
  const blocked=own&&(own.assisted||Math.abs(own.speed||0)<.6)&&ownDistance<c.radius+(own.assisted?220:85)&&ownDistance<currentOwnDistance;
  const other=world.contacts.some(p=>p!==c&&p.kind!=='whale'&&Math.hypot(candidate.x-p.x,candidate.z-p.z)<c.radius+p.radius+15&&Math.hypot(candidate.x-p.x,candidate.z-p.z)<Math.hypot(c.x-p.x,c.z-p.z));
  if(!blocked&&!other){c.phase+=c.direction*c.cruise*dt/tangent;Object.assign(c,candidate);c.heading=Math.atan2(-Math.sin(c.phase)*c.rx*c.direction,-Math.cos(c.phase)*c.rz*c.direction);}
  c.speed=blocked||other?0:c.cruise;
 }
 c.vx=dt>0?(c.x-old.x)/dt:0;c.vz=dt>0?(c.z-old.z)/dt:0;
 }}
export function contactSolution(c,state,beam=10){const dx=c.x-state.x,dz=c.z-state.z,distance=Math.hypot(dx,dz),vx=(c.vx??Math.sin(c.heading||0)*(c.speed||0))-Math.sin(state.heading)*state.speed,vz=(c.vz??-Math.cos(c.heading||0)*(c.speed||0))+Math.cos(state.heading)*state.speed,v2=vx*vx+vz*vz,rawTcpa=v2>.01?-(dx*vx+dz*vz)/v2:0,tcpa=Math.max(0,rawTcpa),cpa=Math.hypot(dx+vx*tcpa,dz+vz*tcpa),margin=c.radius+beam*.5+20;
 return {...c,distance,cpa,tcpa,rawTcpa,bearing:(Math.atan2(dx,-dz)*180/Math.PI+360)%360,danger:distance<margin+30||(rawTcpa>0&&rawTcpa<90&&cpa<margin&&distance<350),collision:distance<c.radius+beam*.5};}
export function trafficAdvisory(world,state,beam=10){let closest=null;const targets=[...world.contacts,...world.hazards];for(const tow of world.contacts.filter(c=>c.kind==='towing')){const end=towEnd(tow),dx=end.x-tow.x,dz=end.z-tow.z,f=Math.max(0,Math.min(1,((state.x-tow.x)*dx+(state.z-tow.z)*dz)/(dx*dx+dz*dz)));targets.push({...tow,id:`line-${tow.id}`,kind:'towline',name:'예인줄 · 바지선 사이 진입 금지',x:tow.x+dx*f,z:tow.z+dz*f,radius:22});}
 for(const c of targets){const s=contactSolution(c,state,beam);if(s.distance<350&&(!closest||Number(s.collision)>Number(closest.collision)||s.collision===closest.collision&&(Number(s.danger)>Number(closest.danger)||s.danger===closest.danger&&s.distance<closest.distance)))closest=s;}return closest;}
