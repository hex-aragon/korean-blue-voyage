import {ships} from './data.js';
// Shared with the renderer: radar radii are advisory ranges, never solid hulls.
export function trafficModel(c){
 const kind=c.modelKind||(c.kind==='towing'?'tug':c.kind==='cargo'?'container':c.kind);
 const source=ships.find(s=>s.kind===kind)||ships[1];
 const scale=c.local?(c.kind==='cargo'?.85:c.kind==='ferry'?.65:.95):c.id?.startsWith('outer-')?(['container','bulk','tanker','carcarrier'].includes(kind)?1.1:kind==='ferry'?.85:.9):kind==='container'||kind==='ferry'?.45:.9;
 return {source,scale,spec:['fishing','pilot'].includes(c.kind)?{length:26,beam:8}:{...source,length:source.length*scale,beam:source.beam*scale,draft:source.draft*scale}};
}
const transform=(points,p)=>{const a=p.heading||0,c=Math.cos(a),s=Math.sin(a);return points.map(([x,z])=>({x:p.x+x*c-z*s,z:p.z+x*s+z*c}));};
export function hullPolygon(p,spec){const L=spec.length,B=spec.beam;const side=[0,.06,.13,.21,.27,.86,1].map(u=>{const f=u<.27?Math.pow(Math.sin(u/.27*Math.PI/2),.78):u>.86?1-(u-.86)*1.5:1;return [Math.max(.02,f)*B*.5,(u-.5)*L];});return transform([...side,...side.slice().reverse().map(([x,z])=>[-x,z])],p);}
export const rectangle=(p,w,l)=>transform([[-w/2,-l/2],[w/2,-l/2],[w/2,l/2],[-w/2,l/2]],p);
const circle=(p,r)=>Array.from({length:12},(_,i)=>({x:p.x+Math.cos(i*Math.PI/6)*r,z:p.z+Math.sin(i*Math.PI/6)*r}));
export function physicalTargets(world){const targets=[];const add=(source,polygon)=>targets.push({source,polygon});
 for(const c of world.contacts){if(c.kind==='coastguard')continue;if(['whale','shark'].includes(c.kind)){if((c.depth||0)<-2)continue;add(c,hullPolygon(c,{length:c.kind==='whale'?20:12,beam:c.kind==='whale'?4.8:2.5}));}else add(c,hullPolygon(c,trafficModel(c).spec));
  if(c.kind==='towing'){const [barge,rope]=transform([[0,95],[0,45.5]],c);add(c,rectangle({...barge,heading:c.heading},17,38));add(c,rectangle({...rope,heading:c.heading},.4,65));}
 }
 for(const h of world.hazards){if(h.kind==='net'){add(h,rectangle(h,120,1));for(const x of [-60,60])add(h,circle({x:h.x+x,z:h.z},1.5));}
 else if(h.kind==='workzone'){for(let i=0;i<12;i++)add(h,circle({x:h.x+Math.cos(i*Math.PI/6)*h.radius,z:h.z+Math.sin(i*Math.PI/6)*h.radius},1.6));}
 else if(h.kind==='debris'){for(let i=0;i<6;i++)add(h,rectangle({x:h.x+(i-3)*2,z:h.z+i%2*3,heading:Math.PI/2-i*.4},1.8,12));}}
 return targets;
}
// Continuous separating-axis sweep: narrow hulls, earliest impact, no tunnelling.
export function sweepPolygons(a,b,dx,dz){let enter=-Infinity,leave=Infinity;let penetration=Infinity,escape=null;
 for(const poly of [a,b])for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],ex=q.x-p.x,ez=q.z-p.z,len=Math.hypot(ex,ez);if(!len)continue;const nx=-ez/len,nz=ex/len,aa=a.map(v=>v.x*nx+v.z*nz),bb=b.map(v=>v.x*nx+v.z*nz),amin=Math.min(...aa),amax=Math.max(...aa),bmin=Math.min(...bb),bmax=Math.max(...bb),v=dx*nx+dz*nz;
 const overlap=Math.min(amax-bmin,bmax-amin);if(overlap<penetration){penetration=overlap;escape=(amax-bmin<bmax-amin?-1:1)*v;}
 if(Math.abs(v)<1e-10){if(amax<=bmin||bmax<=amin)return null;continue;}
 const t1=(bmin-amax)/v,t2=(bmax-amin)/v;enter=Math.max(enter,Math.min(t1,t2));leave=Math.min(leave,Math.max(t1,t2));if(enter>leave)return null;
 }
 if(leave<=0||enter>1)return null;
 if(enter<0&&escape>=0)return null; // Existing overlap: allow separating motion, no stationary repeat.
 return Math.max(0,enter);
}
export function stopAtHulls(state,from,targets,spec){const dx=state.x-from.x,dz=state.z-from.z;const own=hullPolygon({...from,heading:state.heading},spec);let first=Infinity,hit=null;
 for(const target of targets){const prior=target.source.collisionFrom,tx=prior?target.source.x-prior.x:0,tz=prior?target.source.z-prior.z:0;const polygon=tx||tz?target.polygon.map(p=>({x:p.x-tx,z:p.z-tz})):target.polygon;const u=sweepPolygons(own,polygon,dx-tx,dz-tz);if(u!==null&&u<first){first=u;hit=target.source;}}
 if(hit){const u=Math.max(0,first-.001/(Math.hypot(dx,dz)||1));state.x=from.x+dx*u;state.z=from.z+dz*u;state.speed=0;state.throttle=0;}return hit;
}
