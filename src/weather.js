import {clamp} from './physics.js';
import {seededRandom} from './traffic.js';
// Compressed, fictional weather, with wind in m/s. Not a forecast or wave-height instrument.
export const WEATHER={calm:{name:'잔잔한 바다',wind:3,wave:.45,rain:0,storm:0},breeze:{name:'산들바람',wind:7,wave:1,rain:0,storm:.04},rough:{name:'거친 물결',wind:13,wave:2.4,rain:.12,storm:.35},squall:{name:'돌풍 · 소나기',wind:22,wave:3.8,rain:.75,storm:.72},typhoon:{name:'태풍 체험',wind:38,wave:6,rain:1,storm:1}};
export function createWeather(seed=42){return {time:0,mode:'dynamic',phase:'breeze',remaining:45,random:seededRandom(seed),wind:7,wave:1,rain:0,storm:0,direction:.9,group:1};}
export function stepWeather(w,dt,mode,region){
 dt=clamp(dt,0,.05);w.time+=dt;
 if(mode!==w.mode){w.mode=mode;w.remaining=45;w.phase=mode==='dynamic'?'breeze':mode;}
 if(mode==='dynamic'){w.remaining-=dt;if(w.remaining<=0){const choices=w.phase==='breeze'?['rough','squall']:w.phase==='rough'?['breeze','squall']:['rough','breeze'];w.phase=choices[Math.floor(w.random()*choices.length)];w.remaining=55+w.random()*55;}}
 const p=WEATHER[mode==='dynamic'?w.phase:mode]||WEATHER.breeze;
 const gust=1+(.08+.13*p.storm)*Math.sin(w.time*.37)+p.storm*.12*Math.sin(w.time*1.13);
 const blend=1-Math.exp(-dt/7),river=region.layout==='river';
 const targetWind=p.wind*(.75+region.wind/28)*gust;
 w.wind+=(targetWind-w.wind)*blend;w.wave+=((river?Math.min(.6,p.wave*.15):p.wave*(.75+region.wave*.25))-w.wave)*blend;
 w.rain+=(p.rain-w.rain)*blend;w.storm+=(p.storm-w.storm)*blend;
 w.direction=.9+Math.sin(w.time*.014)*(.2+w.storm*.7);
 // Several larger crests arriving as a wave group, rather than a sudden amplitude jump.
 w.group=1+w.storm*.38*Math.max(0,Math.sin(w.time*.095))**4;
 w.strength=river?Math.min(.84,w.wave*w.group):w.wave*w.group;w.name=p.name;return w;
}
