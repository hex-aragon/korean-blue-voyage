import test from 'node:test';import assert from 'node:assert/strict';
import {COASTS,coastalStart,mapProjection} from '../src/coastal-race.js';
import {regions} from '../src/data.js';import {harborGroundHeight,harborPorts} from '../src/harbor-data.js';
import {makeCourse} from '../src/leisure.js';
test('west, south and east courses remain near each port and out of quay foundations',()=>{for(const coast of COASTS){const r=regions.find(r=>r.id===coast.id),center=coastalStart((x,z)=>harborGroundHeight(r,x,z)>0);assert.ok(center);assert.ok(Math.min(...harborPorts(r).map(p=>Math.hypot(center.x-p.x,center.z-p.z)))<1000);for(const g of makeCourse(center))assert.ok(harborGroundHeight(r,g.x,g.z)<0);}});
test('no clear coastal corridor returns no course rather than forcing land spawn',()=>assert.equal(coastalStart(()=>true),null));
test('chart fits all ports, the current craft and every gate even after travelling far',()=>{const points=[{x:9000,z:-9000},...harborPorts(regions.find(r=>r.id==='busan')),...makeCourse({x:-650,z:-600})];const project=mapProjection(points,320,230);for(const p of points){const [x,y]=project(p);assert.ok(x>=27&&x<=293);assert.ok(y>=27&&y<=203);}});
