import {clamp,waveHeight} from './physics.js';
// Deliberately simplified teaching model; not a hydrostatic loading computer.
export const BAY_NAMES=['선수 좌현','선수 우현','중앙 좌현','중앙 우현','선미 좌현','선미 우현'];
export const emptyCargo=()=>({bays:[0,0,0,0,0,0],high:false,ballast:false});
export const cargoUnits=c=>c.bays.reduce((a,b)=>a+b,0);
export const liquidShip=s=>['tanker','chemical','lng'].includes(s.kind||s.id);
export function cargoPreset(id){return {bays:id==='list'?[3,0,3,0,3,0]:[2,2,2,2,2,2],high:id==='high',ballast:false};}
export function stability(ship,cargo){
 const base=ship.mass*100,unit=base*.08,ballast=cargo.ballast?base*.32:0;
 let mass=base+ballast,yMoment=base*ship.beam*.34+ballast*ship.beam*.045,xMoment=0,zMoment=0,freeSurface=0;
 cargo.bays.forEach((n,i)=>{const m=n*unit;mass+=m;const y=liquidShip(ship)?ship.beam*(.12+n*.1):ship.beam*(cargo.high?.98:.2);yMoment+=m*y;xMoment+=m*(i%2?1:-1)*ship.beam*.28;zMoment+=m*(Math.floor(i/2)-1)*ship.length*.23;if(liquidShip(ship)&&n>0&&n<3)freeSurface+=ship.beam*.035;});
 const kg=yMoment/mass,km=ship.beam*.55,correction=freeSurface*base/mass,gm=km-kg-correction,cgX=xMoment/mass,cgZ=zMoment/mass;
 const draft=ship.draft*(.55+.45*cargoUnits(cargo)/18+(cargo.ballast?.12:0));
 return {mass,kg,km,gm,cgX,cgZ,draft,freeSurface:correction,units:cargoUnits(cargo),list:gm>0?Math.atan2(cgX,gm):0,period:gm>0?2*Math.PI*(ship.beam*.38)/Math.sqrt(9.81*gm):Infinity,status:gm<=0?'복원력 상실':gm<ship.beam*.075?'복원력 부족':Math.abs(cgX/gm)>.15?'편중 적재':'안정'};
}
export function rightingLever(info,roll){return info.gm*Math.sin(roll)-info.cgX*Math.cos(roll);}
export function stepAttitude(s,ship,cargo,env,t,dt){
 dt=clamp(dt,0,.05);const info=stability(ship,cargo),B=ship.beam,L=ship.length;
 const sx=Math.cos(s.heading)*B*.5,sz=Math.sin(s.heading)*B*.5;
 const slope=(waveHeight(s.x+sx,s.z+sz,t,env.wave)-waveHeight(s.x-sx,s.z-sz,t,env.wave))/B;
 const torque=-slope*B*.65+s.rudder*s.speed*.06+(info.gm<=0?.015:0);
 s.rollVelocity+=(-9.81*rightingLever(info,s.roll)/(B*.38)**2+torque*.3-s.rollVelocity*.34)*dt;
 s.roll=clamp(s.roll+s.rollVelocity*dt,-1.1,1.1);
 const dx=Math.sin(s.heading)*L*.35,dz=-Math.cos(s.heading)*L*.35;
 const pitchTarget=(waveHeight(s.x+dx,s.z+dz,t,env.wave)-waveHeight(s.x-dx,s.z-dz,t,env.wave))/(L*.7)+info.cgZ/(L*.6);
 s.pitchVelocity+=((pitchTarget-s.pitch)*1.2-s.pitchVelocity*.7)*dt;s.pitch=clamp(s.pitch+s.pitchVelocity*dt,-.35,.35);
 s.heave=waveHeight(s.x,s.z,t,env.wave)-(info.draft-ship.draft*.55)*.18;
 if(Math.abs(s.roll)>.95){s.capsized=true;s.throttle=0;s.speed*=Math.exp(-dt*2);}
 return info;
}
export function canHandleCargo(s,ports){return s.anchored&&Math.abs(s.speed)<1.4&&ports.some(p=>Math.hypot(s.x-p.x,s.z-p.z)<95);}
