import test from 'node:test';import assert from 'node:assert/strict';
import {createWeather,stepWeather} from '../src/weather.js';
const sea={layout:'open',wave:1,wind:7};
test('태풍은 풍속·비·파도가 순간 이동하지 않고 점진적으로 발달한다',()=>{const w=createWeather();stepWeather(w,.05,'typhoon',sea);assert(w.wind<8);assert(w.wave<1.1);for(let i=0;i<1800;i++)stepWeather(w,.05,'typhoon',sea);assert(w.wind>25);assert(w.strength>5);assert(w.rain>.99);assert(w.storm>.99);});
test('자동 날씨는 재현 가능하며 태풍은 사용자가 선택한다',()=>{const a=createWeather(42),b=createWeather(42),phases=new Set();for(let i=0;i<18000;i++){stepWeather(a,.05,'dynamic',sea);stepWeather(b,.05,'dynamic',sea);phases.add(a.phase);assert.equal(a.wind,b.wind);assert.notEqual(a.phase,'typhoon');}assert(phases.size>=3);});
test('잔잔한 모드로 돌아오면 폭우와 파도가 가라앉고 강은 파고를 제한한다',()=>{const w=createWeather();for(let i=0;i<2000;i++)stepWeather(w,.05,'typhoon',sea);for(let i=0;i<2000;i++)stepWeather(w,.05,'calm',sea);assert(w.rain<.001);assert(w.strength<.5);const river=createWeather();for(let i=0;i<2000;i++)stepWeather(river,.05,'typhoon',{...sea,layout:'river'});assert(river.strength<.84);});

test('태풍에서 자동 날씨로 전환하면 심한 날씨가 다시 예약되지 않는다',()=>{const w=createWeather();stepWeather(w,.05,'typhoon',sea);stepWeather(w,.05,'dynamic',sea);assert.equal(w.phase,'breeze');});
