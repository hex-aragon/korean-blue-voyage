import test from 'node:test';import assert from 'node:assert/strict';
import {stopAtCircles,stopAtBoundary} from '../src/collision.js';
import {applyBoundary} from '../src/physics.js';
test('고속으로 장애물을 가로질러도 앞에서 정지한다',()=>{const s={x:100,z:0,speed:100,throttle:1};assert.ok(stopAtCircles(s,{x:-100,z:0},[{x:0,z:0,radius:5}],1));assert.ok(s.x<-6);assert.equal(s.speed,0);assert.equal(s.throttle,0);});
test('접촉 후 재가속도 차단하며 후진으로 멀어질 수 있다',()=>{const c=[{x:0,z:0,radius:5}],from={x:-5.001,z:0},s={x:10,z:0,speed:20,throttle:1};assert.ok(stopAtCircles(s,from,c));const back={x:-10,z:0,speed:-2,throttle:-.3};assert.equal(stopAtCircles(back,{x:s.x,z:s.z},c),null);assert.equal(back.speed,-2);});
test('여러 물체 중 가장 먼저 만나는 표면에서 멈춘다',()=>{const s={x:100,z:0,speed:100};stopAtCircles(s,{x:-100,z:0},[{x:30,z:0,radius:10},{x:0,z:0,radius:5}]);assert.ok(s.x<-5&&s.x>-5.01);});
test('좁은 지형과 강변을 한 프레임에 건너뛰지 않는다',()=>{const s={x:20,z:0,speed:30,throttle:1};assert.ok(stopAtBoundary(s,{x:-20,z:0},x=>x>=0&&x<=2));assert.ok(s.x<0&&s.x>-.01);const river={x:300,z:0,speed:20,throttle:1};assert.ok(applyBoundary(river,{layout:'river'},[],{x:280,z:0}));assert.ok(river.x<=285);assert.equal(river.speed,0);});
