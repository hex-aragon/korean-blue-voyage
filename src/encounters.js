import {seededRandom,routePoint} from './traffic.js';
import {clearLeg} from './navigation.js';
// Maintain a bounded visible population around the current voyage, not just the origin port.
const types=['pilot','fishing','tug','cargo','ferry','fishing','whale','shark','pilot','tug'];
export function populateEncounters(world,own,obstacles,ground,river=false){
 const random=world.encounterRandom??=seededRandom(world.seed^0x5eab123),before=world.contacts.length;
 world.contacts=world.contacts.filter(c=>!c.local||c.id===world.trackedId||Math.hypot(c.x-own.x,c.z-own.z)<1100);
 const target=river?5:10;
 for(let attempt=0;attempt<160&&world.contacts.filter(c=>c.local).length<target;attempt++){
  const index=(world.nextEncounter||0),kind=river?['pilot','tug','ferry'][index%3]:types[index%types.length],wild=['whale','shark'].includes(kind),radius=wild?16:kind==='cargo'||kind==='ferry'?32:18;
  // Fan ahead of the bow and on either beam; there is no spawn inside 160 m.
  const angle=own.heading-.35+(random()-.5)*1.6,range=180+random()*360;
  const x=own.x+Math.sin(angle)*range,z=own.z-Math.cos(angle)*range;
  const c={id:`encounter-${index}`,local:true,kind,name:{pilot:'도선선 · PILOT',fishing:'근해 어선',tug:'항만 예인선',cargo:'통항 화물선',ferry:'연안 여객선',whale:'수면의 고래',shark:'상어 · 관찰 안내'}[kind],cx:x,cz:z,rx:river?35:65+random()*85,rz:90+random()*150,phase:random()*Math.PI*2,direction:random()<.5?-1:1,cruise:wild?2.5+random()*2:kind==='pilot'?9:kind==='fishing'?4:6+random()*3,radius,status:'transit',trail:[]};
  Object.assign(c,routePoint(c));if(Math.hypot(c.x-own.x,c.z-own.z)<160||world.contacts.some(p=>Math.hypot(c.x-p.x,c.z-p.z)<radius+p.radius+45))continue;
  let safe=true;for(let i=0;i<48&&safe;i++){const a=routePoint(c,i*Math.PI/24),b=routePoint(c,(i+1)*Math.PI/24);if(!clearLeg(a,b,obstacles,radius+12))safe=false;for(const [dx,dz]of [[0,0],[radius,0],[-radius,0],[0,radius],[0,-radius]])if(ground(a.x+dx,a.z+dz)>-1||(river&&Math.abs(a.x+dx)>260))safe=false;}
  if(!safe)continue;c.heading=Math.atan2(-Math.sin(c.phase)*c.rx*c.direction,-Math.cos(c.phase)*c.rz*c.direction);c.speed=c.cruise;c.depth=wild?-.4:0;world.contacts.push(c);world.nextEncounter=index+1;
 }
 return world.contacts.length!==before;
}
