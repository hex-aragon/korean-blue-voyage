import {stopAtCircles,stopAtBoundary} from './collision.js';
export const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
export function waveHeight(x,z,t,strength=1){return strength*(Math.sin(x*0.022+z*0.014-t*1.2)*0.72+Math.sin(x*0.051-z*0.027-t*1.7)*0.3+Math.sin(z*0.085+x*0.03-t*2.1)*0.12+Math.sin(x*.007+z*.010-t*.52)*.35);}
export function createVessel(){return {x:0,z:100,speed:0,heading:0,rudder:0,throttle:0,anchored:false,distance:0,roll:0,pitch:0,rollVelocity:0,pitchVelocity:0,heave:0,heaveVelocity:0,waterlineOffset:0,capsized:false,damage:0};}
export function stepVessel(s,ship,env,dt,input){
 dt=clamp(dt,0,0.05);
 s.throttle=clamp(s.throttle+(input.throttle||0)*dt*0.35,-0.3,1);
 s.rudder+=(clamp(input.steer||0,-1,1)-s.rudder)*Math.min(1,dt*2.2);
 const windAssist=ship.id==='yacht'?Math.max(0,Math.cos(s.heading-(env.windDirection??.9)))*env.wind*0.035:0;
 const lever=Math.abs(s.throttle),cruise=clamp((lever-.3)/.7,0,1),lowSpeedRatio=(ship.referenceSpeed||ship.maxSpeed)/ship.maxSpeed;
 const condition=s.throttle<0?Math.max(.45,1-(s.damage||0)*.006):Math.max(.12,1-(s.damage||0)*.009);
 const target=s.anchored?0:condition*s.throttle*(ship.maxSpeed*0.5144)*(lowSpeedRatio+(1-lowSpeedRatio)*cruise*cruise*(3-2*cruise))*(1+windAssist);
 const response=s.anchored?1.6:ship.accel*(Math.abs(target)<Math.abs(s.speed)?.46:.38)/(env.loadFactor||1);
 s.speed+=(target-s.speed)*(1-Math.exp(-dt*response));
 s.heading+=s.rudder*ship.turn*clamp(s.speed/5,-0.4,1)*dt;
 if(!s.anchored){const current=env.river?0.48:0.12;const dx=Math.sin(s.heading)*s.speed*dt+Math.sin(env.windDirection??.9)*env.wind*0.004/ship.mass*dt;const dz=-Math.cos(s.heading)*s.speed*dt+current*dt-Math.cos(env.windDirection??.9)*env.wind*.004/ship.mass*dt;s.x+=dx;s.z+=dz;s.distance+=Math.hypot(dx,dz);}
 return s;
}
export function canDock(s,port){return Math.hypot(s.x-port.x,s.z-port.z)<95&&Math.abs(s.speed)<1.4;}
export function applyBoundary(s,region,obstacles,from=null,padding=10){
 if(from){const hit=stopAtCircles(s,from,obstacles,padding);const edge=stopAtBoundary(s,from,(x,z)=>region.layout==='river'&&Math.abs(x)>285||Math.hypot(x,z)>9000);return !!hit||edge;}
 let hit=false;if(region.layout==='river'&&Math.abs(s.x)>285){s.x=clamp(s.x,-285,285);hit=true;}
 for(const o of obstacles){const d=Math.hypot(s.x-o.x,s.z-o.z);if(d<o.radius+padding){const a=Math.atan2(s.z-o.z,s.x-o.x);s.x=o.x+Math.cos(a)*(o.radius+padding+.001);s.z=o.z+Math.sin(a)*(o.radius+padding+.001);hit=true;}}
 const d=Math.hypot(s.x,s.z);if(d>9000){s.x*=9000/d;s.z*=9000/d;hit=true;}if(hit){s.speed=0;s.throttle=0;}return hit;
}
