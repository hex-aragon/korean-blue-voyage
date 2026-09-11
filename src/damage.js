import {clamp} from './physics.js';
import {clearLeg} from './navigation.js';
export function applyImpact(s,speed,t){
 if(t-(s.lastImpact??-100)<2.5||speed<.35)return 0;
 const loss=clamp(5+speed*2.2,6,55);s.damage=clamp((s.damage||0)+loss,0,95);s.lastImpact=t;s.speed=0;s.throttle=0;return loss;
}
export function repairTap(s,t){if(!s.damage||Math.abs(s.speed)>1.4||t-(s.lastRepair??-1)<.12)return false;s.damage=Math.max(0,s.damage-8);s.lastRepair=t;s.throttle=0;s.anchored=true;return true;}
export function repairByCrew(s,dt){s.damage=Math.max(0,(s.damage||0)-dt*9);}
export function rescueRoute(s,obstacles,ground){
 // Fictional dispatch: find a water corridor to a stand-off point without crossing land.
 for(let i=0;i<24;i++){const a=s.heading+Math.PI+i*Math.PI/12,sn=Math.sin(a),cs=-Math.cos(a),end={x:s.x+sn*100,z:s.z+cs*100},start={x:s.x+sn*460,z:s.z+cs*460};
 if(!clearLeg(start,end,obstacles,24))continue;let safe=true;for(let j=0;j<=24;j++){const x=start.x+(end.x-start.x)*j/24,z=start.z+(end.z-start.z)*j/24;for(const [dx,dz]of [[0,0],[24,0],[-24,0],[0,24],[0,-24]])if(ground(x+dx,z+dz)>-1)safe=false;}if(safe)return [start,end];}
 return null;
}
export function stepRescue(c,dt){
 if(c.status!=='responding')return;const target=c.rescuePath[1],dx=target.x-c.x,dz=target.z-c.z,d=Math.hypot(dx,dz),move=Math.min(d,dt*16);c.heading=Math.atan2(dx,-dz);c.speed=d>2?16:0;c.vx=Math.sin(c.heading)*c.speed;c.vz=-Math.cos(c.heading)*c.speed;if(d>2){c.x+=dx/d*move;c.z+=dz/d*move;}else{c.status='assisting';c.speed=c.vx=c.vz=0;}
}
