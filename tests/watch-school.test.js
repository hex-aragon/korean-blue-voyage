import test from 'node:test';import assert from 'node:assert/strict';
import {beginWatch,observeWatch,stepWatch,restoreSchool} from '../src/watch-school.js';
const c={id:'ship',name:'연습선',x:0,z:0,heading:0,speed:0,radius:20},world={contacts:[c]};
function run({auto=false,collision=false,observe=true,late=false,anchored=false}={}){const s={x:150,z:late?100:500,speed:4,heading:0,anchored};const t=beginWatch(c,s);if(observe)observeWatch(t,c,s);let result;for(let z=s.z;z>=-500;z-=5){s.z=z;result=stepWatch(t,world,s,10,.2,auto,collision);if(result.done)break;}return result;}
test('관측하고 직접 충분한 간격을 유지해 통과하면 기록한다',()=>{const r=run();assert(r.done&&r.success);assert.equal(r.minClearance,125);assert(r.travel>120);});
test('자동항해·접촉·늦은 발견·미확인·정박은 통과 실적으로 인정하지 않는다',()=>{for(const config of [{auto:true},{collision:true},{observe:false},{late:true},{anchored:true}])assert.equal(run(config).success,false);});
test('해역에서 표적이 없어지면 취소하고 저장 값을 검증한다',()=>{const t=beginWatch(c,{x:0,z:500});assert(stepWatch(t,{contacts:[]},{},10,.1,false).cancelled);assert.deepEqual(restoreSchool({passed:['fake','working','working'],log:[{name:'bad',success:true,minClearance:Infinity,travel:20}]}),{passed:['working'],log:[]});});
