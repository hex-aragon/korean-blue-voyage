import {test} from 'node:test';import assert from 'node:assert/strict';import {planRoute,clearLeg} from '../src/navigation.js';
test('출발 항구의 섬을 우회하고 각 구간에 여유 수역을 확보한다',()=>{const start={x:0,z:-254},goal={x:760,z:-830},islands=[{x:230,z:-360,radius:112.5},{x:990,z:-890,radius:112.5}];const route=planRoute(start,goal,islands,55);assert(route.length>1);let previous=start;for(const next of route){assert(clearLeg(previous,next,islands,55));previous=next;}assert.deepEqual(route.at(-1),goal);});
test('열린 수역에서는 목적지로 바로 항해한다',()=>{assert.deepEqual(planRoute({x:0,z:0},{x:0,z:500},[]),[{x:0,z:500}]);});
