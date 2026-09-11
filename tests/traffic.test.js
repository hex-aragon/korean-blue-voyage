import test from 'node:test';
import assert from 'node:assert/strict';
import {createTraffic,stepTraffic,trafficAdvisory} from '../src/traffic.js';
test('어선과 상선은 지정 수역을 왕복하고 고래는 잠수한다',()=>{const w=createTraffic({layout:'harbor'}),start=w.contacts.map(c=>[c.x,c.z]);for(let i=0;i<600;i++)stepTraffic(w,.05);assert.equal(w.contacts.length,6);assert(w.contacts.every((c,i)=>Math.hypot(c.x-start[i][0],c.z-start[i][1])>1));assert(w.contacts.filter(c=>c.kind==='whale').some(c=>c.depth<0));});
test('선박 교차 접근을 예측하고 먼 배는 경고하지 않는다',()=>{const s={x:0,z:0,heading:0,speed:5};const w={contacts:[{x:100,z:-100,heading:-Math.PI/2,speed:5,radius:20}],hazards:[]};assert(trafficAdvisory(w,s).danger);w.contacts[0].x=1000;assert.equal(trafficAdvisory(w,s),null);});
test('그물 접촉과 강의 생태 구분을 적용한다',()=>{const w=createTraffic({layout:'harbor'}),h=w.hazards[0];assert(trafficAdvisory(w,{x:h.x,z:h.z,heading:0,speed:0}).collision);assert.equal(createTraffic({layout:'river'}).contacts.length,0);});
test('부두를 가로지르는 NPC 항로를 제외한다',()=>{const w=createTraffic({layout:'harbor'},[{x:-650,z:-1000,radius:400}]);assert(w.contacts.filter(c=>c.kind!=='whale').length<4);});
