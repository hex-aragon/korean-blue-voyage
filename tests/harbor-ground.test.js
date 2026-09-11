import test from 'node:test';
import assert from 'node:assert/strict';
import {harborRegions,harborPorts,harborGroundHeight} from '../src/harbor-data.js';
test('모든 항만의 건물·야드 아래는 수면보다 높은 연속 지반이다',()=>{for(const r of harborRegions)for(const p of harborPorts(r)){for(const dx of [560,780,1010])for(const dz of [-220,0,220])assert.equal(harborGroundHeight(r,p.x+dx,p.z+dz),7);assert.equal(harborGroundHeight(r,p.x+280,p.z),7);assert(harborGroundHeight(r,p.x,p.z)<0);assert(harborGroundHeight(r,p.x,p.z+46)<0);}});
