// Continuous circle contact: stop at the first surface, even when a frame crosses it.
export function stopAtCircles(s,from,circles,padding=0){
 const dx=s.x-from.x,dz=s.z-from.z,a=dx*dx+dz*dz;let first=1,hit=null;
 for(const c of circles){const radius=c.radius+padding,ox=from.x-c.x,oz=from.z-c.z,b=ox*dx+oz*dz,q=ox*ox+oz*oz-radius*radius;
  if(q<0){if(b>=0)continue;first=0;hit=c;continue;}
  if(!a||b>=0)continue;const disc=b*b-a*q;if(disc<0)continue;const u=(-b-Math.sqrt(disc))/a;if(u>=0&&u<=first){first=u;hit=c;}
 }
 if(hit){const u=Math.max(0,first-.001/(Math.sqrt(a)||1));s.x=from.x+dx*u;s.z=from.z+dz*u;s.speed=0;s.throttle=0;}return hit;
}
// Sample narrow terrain/track boundaries along motion, then refine first contact.
export function stopAtBoundary(s,from,blocked){
 const dx=s.x-from.x,dz=s.z-from.z,n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.5));
 if(blocked(from.x,from.z)){if(!blocked(s.x,s.z))return false;s.x=from.x;s.z=from.z;s.speed=0;s.throttle=0;return true;}
 for(let i=1;i<=n;i++){if(!blocked(from.x+dx*i/n,from.z+dz*i/n))continue;let lo=(i-1)/n,hi=i/n;for(let j=0;j<14;j++){const m=(lo+hi)/2;if(blocked(from.x+dx*m,from.z+dz*m))hi=m;else lo=m;}s.x=from.x+dx*lo;s.z=from.z+dz*lo;s.speed=0;s.throttle=0;return true;}return false;
}
