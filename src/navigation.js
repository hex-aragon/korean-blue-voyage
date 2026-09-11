function segmentDistance(a,b,p){const dx=b.x-a.x,dz=b.z-a.z,l=dx*dx+dz*dz;const t=l?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/l)):0;return Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz);}
export function clearLeg(a,b,obstacles,clearance=30){return obstacles.every(o=>segmentDistance(a,b,o)>o.radius+clearance);}
// A small visibility graph around circular island exclusion zones.
export function planRoute(start,goal,obstacles,clearance=30){
 const relevant=obstacles.filter(o=>o.x>Math.min(start.x,goal.x)-650&&o.x<Math.max(start.x,goal.x)+650&&o.z>Math.min(start.z,goal.z)-650&&o.z<Math.max(start.z,goal.z)+650);
 if(clearLeg(start,goal,relevant,clearance))return [{x:goal.x,z:goal.z}];
 const nodes=[{x:start.x,z:start.z},{x:goal.x,z:goal.z}];
 for(const o of relevant)for(let i=0;i<16;i++){const a=i*Math.PI/8,r=(o.radius+clearance)/Math.cos(Math.PI/16)+8;const p={x:o.x+Math.cos(a)*r,z:o.z+Math.sin(a)*r};if(relevant.every(q=>Math.hypot(p.x-q.x,p.z-q.z)>q.radius+clearance))nodes.push(p);}
 const dist=nodes.map(()=>Infinity),previous=nodes.map(()=>-1),visited=new Set();dist[0]=0;
 for(let count=0;count<nodes.length;count++){let u=-1;for(let i=0;i<nodes.length;i++)if(!visited.has(i)&&(u===-1||dist[i]<dist[u]))u=i;if(u===-1||!Number.isFinite(dist[u]))break;if(u===1){const route=[];while(u!==0){route.unshift(nodes[u]);u=previous[u];}return route;}visited.add(u);for(let v=0;v<nodes.length;v++){if(visited.has(v)||!clearLeg(nodes[u],nodes[v],relevant,clearance))continue;const d=dist[u]+Math.hypot(nodes[u].x-nodes[v].x,nodes[u].z-nodes[v].z);if(d<dist[v]){dist[v]=d;previous[v]=u;}}}
 return null;
}
