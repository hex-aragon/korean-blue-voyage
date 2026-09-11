import * as THREE from 'three';
const mats=new Map();
function m(c){if(!mats.has(c))mats.set(c,new THREE.MeshStandardMaterial({color:c,roughness:.65}));return mats.get(c);}
function box(g,x,y,z,w,h,d,c){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m(c));o.position.set(x,y,z);g.add(o);return o;}
function cyl(g,x,y,z,r,h,c){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,12),m(c));o.position.set(x,y,z);g.add(o);return o;}
export function makeOfficer(){
 const g=new THREE.Group();
 box(g,-.14,.42,0,.2,.7,.24,0x172a3f);box(g,.14,.42,0,.2,.7,.24,0x172a3f);
 box(g,-.14,.09,-.075,.22,.13,.39,0x13212b);box(g,.14,.09,-.075,.22,.13,.39,0x13212b);
 box(g,0,1.01,0,.61,.6,.33,0xf4efe3);box(g,0,.74,-.02,.59,.055,.36,0x1b2b3c);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.22,16,12),m(0xd8a77e));head.position.set(0,1.58,0);g.add(head);
 cyl(g,0,1.79,0,.26,.07,0xfaf2df);cyl(g,0,1.735,0,.23,.05,0x192c40);box(g,0,1.73,-.23,.34,.025,.2,0x192c40);
 box(g,0,1.735,-.244,.075,.055,.02,0xc8ab58);box(g,0,1.11,-.173,.06,.29,.02,0x1f3144);
 for(const x of [-.28,.28]){box(g,x,1.325,0,.13,.035,.26,0x233746);for(let i=0;i<3;i++)box(g,x,1.347,-.085+i*.07,.13,.013,.025,0xe2bc67);const arm=box(g,x*1.3,1.03,-.1,.16,.53,.18,0xf4efe3);arm.rotation.x=-.35;box(g,x*1.3,.78,-.2,.15,.13,.15,0xd8a77e);}
 for(const x of [-.08,.08])box(g,x,1.60,-.208,.025,.025,.012,0x21333c);
 return g;
}
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
 bridge.wheel.rotation.z=-s.rudder*.9;bridge.lever.rotation.x=-s.throttle*.5;
 if(t-bridge.lastPaint<.15)return;bridge.lastPaint=t;
 const c=bridge.canvas.getContext('2d');c.fillStyle='#091e23';c.fillRect(0,0,1024,256);
 c.strokeStyle='#225b59';c.lineWidth=2;for(const x of [256,512,768]){c.beginPath();c.moveTo(x,15);c.lineTo(x,240);c.stroke();}
 c.font='19px sans-serif';c.fillStyle='#8fbfb3';['SPEED / kn','HEADING','ROLL / PITCH','GM / m'].forEach((n,i)=>c.fillText(n,i*256+22,38));
 c.fillStyle='#c7edcb';c.font='56px monospace';c.fillText((Math.abs(s.speed)/.5144).toFixed(1),22,112);c.fillText(String(((Math.round(s.heading*180/Math.PI)%360)+360)%360).padStart(3,'0')+'°',278,112);c.font='30px monospace';c.fillText((s.roll*180/Math.PI).toFixed(1)+'° / '+(s.pitch*180/Math.PI).toFixed(1)+'°',535,104);c.fillStyle=info.gm<.5?'#ffa58e':'#c7edcb';c.font='56px monospace';c.fillText(info.gm.toFixed(2),790,112);
 c.fillStyle='#648c80';c.font='18px sans-serif';c.fillText('ENGINE '+Math.round(s.throttle*100)+'%',22,173);c.fillText('RUDDER '+Math.round(s.rudder*35)+'°',278,173);c.fillText('DRAFT '+info.draft.toFixed(1)+' m',790,173);
 c.save();c.translate(637,178);c.rotate(-s.roll);c.strokeStyle='#d4b978';c.lineWidth=4;c.beginPath();c.moveTo(-63,0);c.lineTo(63,0);c.stroke();c.restore();bridge.texture.needsUpdate=true;
}
export const officerPortrait=`<svg viewBox="0 0 64 72" role="img" aria-label="흰 제복과 견장을 착용한 항해사"><path d="M8 72V53Q9 43 25 42h14q16 1 17 11v19" fill="#edeadf"/><path d="m24 43 8 9 8-9-4 22h-8" fill="#243c4c"/><path d="m23 43-7 6 10 11 6-8m9-9 7 6-10 11-6-8" fill="#fff8e8"/><path d="M25 34h14v13l-7 5-7-5" fill="#bc8867"/><ellipse cx="32" cy="26" rx="14" ry="17" fill="#d9ac84"/><path d="M17 21q-2-15 15-15t15 15" fill="#293b43"/><path d="M13 13Q32-4 51 13l-4 11H17Z" fill="#fbf6e5"/><path d="M17 20h30v6H17z" fill="#213849"/><path d="M18 26q14 9 28 0" fill="#152c3b"/><path d="m32 16 3 4-3 3-3-3Z" fill="#dfba62"/><circle cx="27" cy="30" r="1.2" fill="#26333b"/><circle cx="37" cy="30" r="1.2" fill="#26333b"/><path d="M28 37q4 3 8 0" stroke="#9b6756" fill="none"/><path d="M9 48h13v6H9zm33 0h13v6H42z" fill="#243c4b"/><path d="M11 49v4m4-4v4m4-4v4m25-4v4m4-4v4m4-4v4" stroke="#d7b85e" stroke-width="2"/></svg>`;
