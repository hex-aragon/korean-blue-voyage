import {makeOfficer} from './officer.js';
export {makeOfficer,officerPortrait} from './officer.js';
import * as THREE from 'three';
const mats=new Map();
function m(c){if(!mats.has(c))mats.set(c,new THREE.MeshStandardMaterial({color:c,roughness:.65}));return mats.get(c);}
function box(g,x,y,z,w,h,d,c){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m(c));o.position.set(x,y,z);g.add(o);return o;}
function cyl(g,x,y,z,r,h,c){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,12),m(c));o.position.set(x,y,z);g.add(o);return o;}
export function makeBridge(spec){
 const g=new THREE.Group(),yacht=spec.id==='yacht';
 const width=yacht?3.3:spec.beam*.74,base=spec.bridgeY,z=spec.bridgeZ*spec.length;
 g.position.set(0,base,z);g.name='walk-in-bridge';
 box(g,0,-.12,.2,width,.18,yacht?3:5,0x7a7463);
 if(!yacht){
 // Window openings are real geometry, so the horizon remains unobstructed.
 box(g,0,.46,-1.85,width,.95,.17,0x425958);box(g,0,3.9,.2,width+.35,.2,4.8,0xc4c5b3);
 for(const x of [-width/2,-width/6,width/6,width/2])box(g,x,2.4,-1.86,.13,3,.17,0xc0c9bc);
 for(const side of [-1,1]){box(g,side*width/2,.45,.2,.15,.9,4.3,0x425958);box(g,side*width/2,2.4,2.25,.15,3,.15,0xb9c2b6);}
 box(g,0,.45,2.3,width,.9,.13,0x455b59);
 }
 const consoleWidth=Math.min(width*.87,6.8);
 box(g,0,.65,-1.1,consoleWidth,.85,1.05,0x213c41);const desktop=box(g,0,1.13,-1.13,consoleWidth,.11,1.16,0x436164);desktop.rotation.x=.13;
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const screenMaterial=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});
 const screen=new THREE.Mesh(new THREE.PlaneGeometry(consoleWidth*.93,.61),screenMaterial);screen.position.set(0,1.24,-1.19);screen.rotation.x=-.52;screen.userData.privateMaterial=true;g.add(screen);
 const wheel=new THREE.Group();wheel.position.set(yacht?0:-.7,1.1,-.42);wheel.rotation.x=-.27;
 const rim=new THREE.Mesh(new THREE.TorusGeometry(.29,.036,8,32),m(0x192c32));wheel.add(rim);
 for(let i=0;i<6;i++){const spoke=box(wheel,0,0,0,.027,.53,.025,0x8c978c);spoke.rotation.z=i*Math.PI/3;}
 const hub=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.08,12),m(0xb1b6a5));hub.rotation.x=Math.PI/2;wheel.add(hub);g.add(wheel);
 const lever=box(g,consoleWidth*.4,1.26,-.53,.055,.36,.06,0xc7cbbb);box(g,consoleWidth*.4,1.47,-.53,.2,.09,.1,0x1a292f);
 const officer=makeOfficer();officer.position.set(yacht?-.65:-width*.32,0,.05);g.add(officer);
 const eye=new THREE.Object3D();eye.position.set(0,2.35,yacht?1.0:1.25);g.add(eye);
 return {group:g,eye,officer,wheel,lever,canvas,texture,lastPaint:-1};
}
export function updateBridge(bridge,s,info,t){
 bridge.wheel.rotation.z=-s.rudder*2.35;bridge.lever.rotation.x=-s.throttle*.5;
 if(t-bridge.lastPaint<.15)return;bridge.lastPaint=t;
 const c=bridge.canvas.getContext('2d');c.fillStyle='#091e23';c.fillRect(0,0,1024,256);
 c.strokeStyle='#225b59';c.lineWidth=2;for(const x of [256,512,768]){c.beginPath();c.moveTo(x,15);c.lineTo(x,240);c.stroke();}
 c.font='19px sans-serif';c.fillStyle='#8fbfb3';['SPEED / kn','HEADING','ROLL / PITCH','GM / m'].forEach((n,i)=>c.fillText(n,i*256+22,38));
 c.fillStyle='#c7edcb';c.font='56px monospace';c.fillText((Math.abs(s.speed)/.5144).toFixed(1),22,112);c.fillText(String(((Math.round(s.heading*180/Math.PI)%360)+360)%360).padStart(3,'0')+'°',278,112);c.font='30px monospace';c.fillText((s.roll*180/Math.PI).toFixed(1)+'° / '+(s.pitch*180/Math.PI).toFixed(1)+'°',535,104);c.fillStyle=info.gm<.5?'#ffa58e':'#c7edcb';c.font='56px monospace';c.fillText(info.gm.toFixed(2),790,112);
 c.fillStyle='#648c80';c.font='18px sans-serif';c.fillText('ENGINE '+Math.round(s.throttle*100)+'%',22,173);c.fillText('RUDDER '+Math.round(s.rudder*35)+'°',278,173);c.fillText('DRAFT '+info.draft.toFixed(1)+' m',790,173);
 c.save();c.translate(637,178);c.rotate(-s.roll);c.strokeStyle='#d4b978';c.lineWidth=4;c.beginPath();c.moveTo(-63,0);c.lineTo(63,0);c.stroke();c.restore();bridge.texture.needsUpdate=true;
}
