import {stopAtCircles,stopAtBoundary} from './collision.js';
export function courseFeatures(gates){const barriers=[],ramps=[],rails=[];for(let i=0;i<gates.length-1;i++){const a=gates[i],b=gates[i+1],dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz),nx=-dz/len,nz=dx/len;rails.push({a,b,nx,nz});if(i===0||i===3)ramps.push({x:a.x+dx*.52,z:a.z+dz*.52,heading:Math.atan2(dx,-dz),width:12,length:18});if(i===1||i===4||i===5)barriers.push({x:a.x+dx*.52+nx*9,z:a.z+dz*.52+nz*9,radius:7});}const posts=[];for(let i=1;i<gates.length;i++){const g=gates[i],a=gates[i-1],angle=Math.atan2(g.x-a.x,-(g.z-a.z));for(const side of [-1,1])posts.push({x:g.x+Math.cos(angle)*29*side,z:g.z+Math.sin(angle)*29*side,radius:2.3});}return {rails,ramps,barriers,posts};}
export function segmentDistance(p,a,b){const dx=b.x-a.x,dz=b.z-a.z,l=dx*dx+dz*dz,u=l?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/l)):0;return Math.hypot(p.x-a.x-u*dx,p.z-a.z-u*dz);}
export function stepRaceFeatures(run,s,dt){s.jumpHeight??=0;s.jumpVelocity??=0;run.features??=courseFeatures(run.gates);run.featureClock=(run.featureClock||0)+dt;let event=null;if(s.jumpHeight>0||s.jumpVelocity>0){s.jumpVelocity-=9.81*dt;s.jumpHeight=Math.max(0,s.jumpHeight+s.jumpVelocity*dt);if(!s.jumpHeight){s.jumpVelocity=0;event='land';}}if(run.phase!=='racing')return event;
const from=run.previous||s;for(const ramp of run.features.ramps){const heading=Math.abs(Math.atan2(Math.sin(s.heading-ramp.heading),Math.cos(s.heading-ramp.heading)));if(!s.jumpHeight&&s.speed>7&&heading<.6&&segmentDistance(ramp,from,s)<6&&run.featureClock-(run.lastJump??-10)>2){s.jumpVelocity=Math.min(11,5+s.speed*.18);s.jumpHeight=.05;run.lastJump=run.featureClock;run.jumps=(run.jumps||0)+1;event='jump';}}
return resolveRaceCollision(run,s,from)||event;}
export function resolveRaceCollision(run,s,from){
 if(run.phase!=='racing')return null;run.features??=courseFeatures(run.gates);
 const hit=(s.jumpHeight||0)<2&&stopAtCircles(s,from,run.features.barriers,1);
 const post=stopAtCircles(s,from,run.features.posts,1);
 const off=stopAtBoundary(s,from,(x,z)=>run.features.rails.every(r=>segmentDistance({x,z},r.a,r.b)>37));
 if(!hit&&!post&&!off)return null;
 if((run.featureClock||0)-(run.lastHit??-10)>2){run.penalty+=2;run.lastHit=run.featureClock||0;}
 return hit||post?'obstacle':'rail';
}
