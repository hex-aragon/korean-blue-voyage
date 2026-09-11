import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {makeOfficer} from './officer.js';
import {makeBridge as makeCockpit,updateBridge as updateCockpit} from './cockpit.js';
import {drawRadar} from './helm.js';
export {makeOfficer,officerPortrait} from './officer.js';
const mats=new Map();
function material(color){if(!mats.has(color))mats.set(color,new T.MeshStandardMaterial({color,roughness:.72,metalness:.12}));return mats.get(color);}
function box(g,x,y,z,w,h,d,c,round=false){const mesh=new T.Mesh(round?new RoundedBoxGeometry(w,h,d,2,Math.min(.04,w*.1,h*.1,d*.1)):new T.BoxGeometry(w,h,d),material(c));mesh.position.set(x,y,z);g.add(mesh);return mesh;}
function tube(g,a,b,r,c){const start=new T.Vector3(...a),end=new T.Vector3(...b),v=end.clone().sub(start),o=new T.Mesh(new T.CylinderGeometry(r,r,v.length(),12),material(c));o.position.copy(start.add(end).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());g.add(o);return o;}
function display(g,x,y,z,w,h,label){const face=new T.Group();face.position.set(x,y,z);face.rotation.x=-.16;g.add(face);box(face,0,0,0,w+.12,h+.12,.13,0x172328,true);const canvas=document.createElement('canvas');canvas.width=512;canvas.height=320;const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const screen=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:texture,toneMapped:false}));screen.position.z=.074;screen.userData.privateMaterial=true;screen.userData.ownedTexture=texture;face.add(screen);for(let i=0;i<5;i++)box(face,w*.15+i*.08,-h*.5-.035,.075,.028,.018,.015,i===0?0x8dcfa7:0x78817c);return {canvas,texture,label};}
function chair(g,x,z){tube(g,[x,0,z],[x,.65,z],.065,0x899491);box(g,x,.68,z,.66,.16,.65,0x222c31,true);const back=box(g,x,1.08,z+.27,.66,.75,.16,0x263238,true);back.rotation.x=.1;for(const side of [-1,1]){tube(g,[x+side*.34,.65,z],[x+side*.34,.96,z],.025,0x647473);box(g,x+side*.34,.96,z,.1,.07,.48,0x27343a,true);}tube(g,[x-.35,.08,z],[x+.35,.08,z],.035,0x566463);}
export function makeBridge(spec){
 if(spec.id==='yacht'){const result=makeCockpit(spec);result.cockpit=true;return result;}
 const g=new T.Group(),width=Math.max(6,spec.beam*.86),front=-2.6;g.name='walk-in-bridge';g.position.set(0,spec.bridgeY,spec.bridgeZ*spec.length);
 box(g,0,-.1,.4,width,.2,7.2,0x354847);for(let x=-width/2;x<width/2;x+=.6)box(g,x,.005,.4,.009,.006,7.2,0x54615c);
 box(g,0,3.3,.4,width+.3,.18,7.5,0xc1c2b5);for(let x=-width*.4;x<width*.5;x+=1.2)box(g,x,3.195,.4,.015,.025,7.1,0x91998f);
 box(g,0,.52,front,width,1.04,.2,0x737f74);box(g,0,3.05,front,width,.25,.27,0xb9c2b4);
 const pane=width/6;for(let i=0;i<=6;i++){const x=-width/2+i*pane;const post=box(g,x,2.02,front-.08,.095,2.02,.2,0xbac4b5);post.rotation.x=-.065;if(i<6){tube(g,[x+pane*.5,2.75,front+.12],[x+pane*.66,1.4,front+.12],.014,0x28373a);tube(g,[x+pane*.38,1.35,front+.13],[x+pane*.88,1.48,front+.13],.022,0x243439);}}
 for(const side of [-1,1]){box(g,side*width/2,.52,.4,.16,1.04,6.2,0x7e877b);for(const z of [-1,1,3.5])box(g,side*width/2,2.03,z,.15,2.2,.1,0xbac4b5);box(g,side*width/2,3.05,.4,.16,.25,6.4,0xb9c2b4);tube(g,[side*(width/2-.1),1.08,-2.2],[side*(width/2-.1),1.08,3.1],.035,0x8c9690);}
 box(g,0,1.6,3.9,width,3.2,.15,0x8e9687);box(g,width*.34,1.22,3.8,1.05,2.35,.1,0x566f68);box(g,width*.29,1.25,3.69,.045,.25,.06,0xc5cbbd);
 const screens=[],station=width*.17;
 ['ECDIS','X-BAND RADAR','CONNING','S-BAND RADAR','ENGINE / NAV'].forEach((label,i)=>{const x=(i-2)*station;box(g,x,.49,-1.85,station-.09,.92,1.28,0x6a7874,true);box(g,x,.99,-1.72,station,.12,1.5,0x2d4043,true);screens.push(display(g,x,i===2?1.28:1.45,-2.12,station*.82,i===2?.56:.79,label));box(g,x,.69,-1.15,station*.7,.04,.015,0x273e40);for(let row=0;row<3;row++)for(let col=0;col<9;col++)box(g,x-station*.32+col*station*.067,1.064,-1.52+row*.082,station*.051,.025,.059,0x13272d,true);const ball=new T.Mesh(new T.SphereGeometry(.061,12,8),material(0x7f918b));ball.position.set(x+station*.33,1.1,-1.31);g.add(ball);});
 // Central manual steering pedestal, with an engine telegraph to starboard.
 box(g,0,.55,-.5,.58,1.03,.63,0x65776f,true);const wheel=new T.Group();wheel.position.set(0,1.12,-.1);wheel.rotation.x=-.25;g.add(wheel);const rim=new T.Mesh(new T.TorusGeometry(.25,.032,12,48),material(0x15262c));wheel.add(rim);for(let i=0;i<3;i++){const spoke=box(wheel,0,.105,0,.025,.23,.028,0xa6b0a6);spoke.rotation.z=i*Math.PI*2/3;spoke.position.set(Math.sin(i*Math.PI*2/3)*.105,Math.cos(i*Math.PI*2/3)*.105,0);}box(wheel,0,0,.01,.14,.14,.07,0x728780,true);
 box(g,station*.72,.83,-.4,.47,.12,.6,0x243a40,true);const lever=new T.Group();lever.position.set(station*.72,.91,-.4);g.add(lever);tube(lever,[0,0,0],[0,.27,0],.025,0xb5bfb5);box(lever,0,.29,0,.18,.07,.09,0x1b3036,true);for(let i=0;i<7;i++)box(g,station*.72-.18,.9,-.65+i*.07,.07,.012,.008,0xd6d2b2);
 // VHF handset and chart table, kept outside the forward view.
 box(g,-width*.4,1.02,.3,.8,.2,.48,0x1b3037,true);box(g,-width*.4,1.18,.38,.5,.1,.12,0x263841,true);for(let i=0;i<10;i++)box(g,-width*.4+.3,1.13,.1+i*.024,.09,.025,.016,0x17292c);
 box(g,width*.36,.5,2.7,width*.24,1,1.4,0x647970,true);box(g,width*.36,1.03,2.7,width*.23,.035,1.3,0xd1cfaf);for(let i=0;i<8;i++)box(g,width*.36,1.052,2.2+i*.13,width*.2,.006,.008,0x819c9b);
 chair(g,-station,1.05);chair(g,station,1.65);const officer=makeOfficer();officer.position.set(-width*.4,0,1.6);officer.rotation.y=.15;g.add(officer);
 const overhead=display(g,0,2.87,-1.8,2.1,.29,'HEADING / RUDDER');overhead.canvas.width=768;overhead.canvas.height=128;
 for(const x of [-width*.3,width*.3]){const fixture=box(g,x,3.19,.65,1.05,.04,.18,0xd8dac7);fixture.material=new T.MeshBasicMaterial({color:0xd7dfca});fixture.userData.privateMaterial=true;}
 const eye=new T.Object3D();eye.position.set(0,1.98,1.7);g.add(eye);const light=new T.PointLight(0xe3ebd5,10,8,2);light.position.set(0,2.9,.6);g.add(light);
 const radarCanvas=document.createElement('canvas');radarCanvas.width=radarCanvas.height=320;
 return {group:g,eye,officer,wheel,lever,screens,overhead,radarCanvas,canvas:screens[2].canvas,texture:screens[2].texture,lastPaint:-1};
}
export function updateBridge(b,s,info,t,nav={}){
 if(b.cockpit)return updateCockpit(b,s,info,t);
 b.wheel.rotation.z=-s.rudder*2.35;b.lever.rotation.x=-s.throttle*.7;if(t-b.lastPaint<.16)return;b.lastPaint=t;
 const heading=((s.heading*180/Math.PI)%360+360)%360,kn=Math.abs(s.speed)/.5144;
 for(const [i,screen] of b.screens.entries()){const c=screen.canvas.getContext('2d');c.fillStyle='#0a141b';c.fillRect(0,0,512,320);c.fillStyle='#263940';c.fillRect(0,0,512,30);c.font='bold 17px monospace';c.fillStyle='#c7d5cd';c.fillText(screen.label,14,22);
 if(i===1||i===3){drawRadar(b.radarCanvas,s,nav.obstacles||[],nav.ports||[],nav.target||null,t,i===1?800:1600,false,nav.route||[],nav.world);c.drawImage(b.radarCanvas,0,0,320,320,20,33,270,270);c.fillStyle='#a3d0af';c.font='15px monospace';c.fillText('NORTH UP',326,70);c.fillText('HDG '+heading.toFixed(0),326,102);c.fillText('SPD '+kn.toFixed(1),326,130);c.fillText('RNG '+(i===1?'800m':'1600m'),326,165);c.fillText('TRAIL 3 MIN',326,230);}
 else if(i===0){c.fillStyle='#b7d5d3';c.fillRect(8,36,496,249);const scale=.11;for(const o of nav.obstacles||[]){if(o.radarHidden)continue;c.fillStyle='#a8ad87';if(o.radarRect){const q=o.radarRect;c.fillRect(256+(q.x-q.w/2-s.x)*scale,165+(q.z-q.d/2-s.z)*scale,q.w*scale,q.d*scale);continue;}c.beginPath();c.arc(256+(o.x-s.x)*scale,165+(o.z-s.z)*scale,Math.max(1,o.radius*scale),0,Math.PI*2);c.fill();}c.strokeStyle='#447c8f';for(let x=16;x<512;x+=48){c.beginPath();c.moveTo(x,36);c.lineTo(x,285);c.stroke();}c.strokeStyle='#b34f65';c.lineWidth=3;c.beginPath();c.moveTo(256,165);for(const p of nav.route||[])c.lineTo(256+(p.x-s.x)*scale,165+(p.z-s.z)*scale);c.stroke();c.fillStyle='#142e39';c.beginPath();c.moveTo(256+Math.sin(s.heading)*10,165-Math.cos(s.heading)*10);c.lineTo(251,173);c.lineTo(261,173);c.fill();c.font='14px monospace';c.fillText('GAME CHART / ROUTE MONITOR',15,309);}
 else{c.font='15px monospace';c.fillStyle='#88aaac';const rows=i===2?[['HEADING',heading.toFixed(1)+'°'],['SPEED',kn.toFixed(1)+' kn'],['RUDDER',(s.rudder*35).toFixed(1)+'°'],['ROLL / PITCH',(s.roll*180/Math.PI).toFixed(1)+' / '+(s.pitch*180/Math.PI).toFixed(1)]]:[['ENGINE ORDER',Math.round(s.throttle*100)+' %'],['DRAFT',info.draft.toFixed(1)+' m'],['STABILITY GM',info.gm.toFixed(2)+' m'],['STATUS',s.anchored?'ANCHOR':'UNDER WAY']];rows.forEach(([label,value],j)=>{c.fillStyle='#8caeb0';c.font='14px monospace';c.fillText(label,18,60+j*65);c.fillStyle='#d0e9bb';c.font='29px monospace';c.fillText(value,205,78+j*65);c.strokeStyle='#344951';c.beginPath();c.moveTo(14,91+j*65);c.lineTo(498,91+j*65);c.stroke();});}
 screen.texture.needsUpdate=true;}
 const c=b.overhead.canvas.getContext('2d');c.fillStyle='#142128';c.fillRect(0,0,768,128);c.font='22px monospace';c.fillStyle='#9aaea8';c.fillText('GYRO HEADING',18,32);c.fillText('RUDDER ANGLE',420,32);c.font='52px monospace';c.fillStyle='#e4d5a7';c.fillText(heading.toFixed(1)+'°',18,99);c.fillText((s.rudder*35).toFixed(1)+'°',420,99);b.overhead.texture.needsUpdate=true;
}
