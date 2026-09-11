import * as T from 'three';
import {harborPorts} from './harbor-data.js';
// District silhouettes inspired by port plans; compact navigable geometry, not surveyed quays.
export function buildHarbor(region,land){
 const ports=harborPorts(region),obstacles=[],rings=[],batches=new Map();let seed=region.seed;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const box=(x,y,z,w,h,d,color,angle=0)=>{const k='b'+color;if(!batches.has(k))batches.set(k,{geo:new T.BoxGeometry(1,1,1),color,items:[]});batches.get(k).items.push({x,y,z,w,h,d,angle});};
 const cyl=(x,y,z,r,h,color)=>{const k='c'+color;if(!batches.has(k))batches.set(k,{geo:new T.CylinderGeometry(1,1,1,20),color,items:[]});batches.get(k).items.push({x,y,z,w:r,h,d:r,angle:0});};
 const beam=(a,b,width,color)=>{const dir=new T.Vector3().subVectors(new T.Vector3(...b),new T.Vector3(...a));const g=new T.Mesh(new T.CylinderGeometry(width,width,dir.length(),8),new T.MeshStandardMaterial({color,roughness:.7}));g.position.copy(new T.Vector3(...a).add(new T.Vector3(...b)).multiplyScalar(.5));g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize());g.userData.privateMaterial=true;land.add(g);};
 function hill(x,z,r,h,volcano=false){const geo=volcano?new T.ConeGeometry(r,h,64):new T.SphereGeometry(1,36,20,0,Math.PI*2,0,Math.PI/2);const m=new T.Mesh(geo,new T.MeshStandardMaterial({color:region.volcano?0x436654:0x476250,roughness:1}));if(volcano)m.position.set(x,h/2-8,z);else{m.scale.set(r,h,r);m.position.set(x,-5,z);}m.userData.privateMaterial=true;land.add(m);obstacles.push({x,z,radius:r*.95});}
 function crane(x,z){const blue=region.country==='CN'?0x557b9b:region.country==='JP'?0xb77060:0x6ba6ad;for(const dz of [-13,13]){beam([x,3,z+dz],[x+10,58,z+dz],1.7,blue);beam([x+45,3,z+dz],[x+35,58,z+dz],1.7,blue);box(x+12,63,z+dz,126,3,2.7,blue);beam([x+20,77,z+dz],[x-49,63,z+dz],.35,0x8c989b);}box(x+23,59,z,30,8,36,blue);box(x+20,72,z,3,20,3,blue);box(x-33,40,z,2,42,1,0x7b8984);box(x-33,19,z,18,2,10,0xd8b463);}
 function sign(port){const c=document.createElement('canvas');c.width=512;c.height=96;const ctx=c.getContext('2d');ctx.fillStyle='#143543';ctx.fillRect(0,0,512,96);ctx.strokeStyle='#bcd2c6';ctx.lineWidth=3;ctx.strokeRect(3,3,506,90);ctx.fillStyle='#eef2df';ctx.textAlign='center';ctx.font='bold 32px sans-serif';ctx.fillText(port.name,256,43);ctx.font='22px sans-serif';ctx.fillStyle='#dac28a';ctx.fillText(port.berth+' · 화물 선적 / 하역',256,78);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(new T.PlaneGeometry(82,15.4),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide}));mesh.rotation.y=-Math.PI/2;mesh.position.set(port.x+67,20,port.z);mesh.userData.privateMaterial=true;mesh.userData.ownedTexture=tex;land.add(mesh);}
 for(const [i,p] of ports.entries()){
  const x=p.x,z=p.z;box(x+280,1,z,430,5,300,0x7b8989);box(x+480,0,z,300,4,510,0x77816c);box(x+290,4,z+119,410,.25,15,0x3f525a);for(let k=0;k<16;k++)box(x+88+k*25,4.2,z+119,12,.12,.5,0xdddac4);
  for(const dx of [125,225,325,425])for(const dz of [-90,0,90])obstacles.push({x:x+dx,z:z+dz,radius:55,radarHidden:dx!==125||dz!==-90,...(dx===125&&dz===-90?{radarRect:{x:x+280,z,w:430,d:300}}:{})});
  for(const dz of [-140,-100,-60,60,100,140]){cyl(x+69,4,z+dz,2.2,3,0xb9ab76);box(x+64,0,z+dz,2,5,12,0x263f45);}
  const profile=region.profile;
  if(profile==='industrial'){
   for(let a=0;a<3;a++)for(let b=0;b<3;b++){const xx=x+180+a*74,zz=z-70+b*65;cyl(xx,18,zz,24,31,0xc0c4bd);cyl(xx,34,zz,24.5,2,0xd1d0c3);box(xx,8,zz,70,2,2,0xabaf9e);}
   for(let j=0;j<3;j++){cyl(x+490+j*40,55,z-120,7,105,0x829194);cyl(x+490+j*40,104,z-120,7.2,8,0xae6f5b);}box(x+480,19,z+30,170,34,80,0x5c727b);
  }else if(profile==='urban'||profile==='island'){
   box(x+210,15,z,180,26,65,0xe0e2d7);box(x+210,30,z,197,5,75,0xb7c8c5);for(let j=0;j<16;j++)box(x+126+j*11,20,z-33,7,12,.4,0x466f80);for(let j=0;j<3;j++){box(x+115,7,z-90+j*85,95,5,20,0x9faca4);}
   if(profile==='urban'&&i===0){cyl(x+390,46,z-110,8,92,0xc08673);cyl(x+390,80,z-110,21,9,0xbac9c3);cyl(x+390,107,z-110,2,40,0xa8bdc4);}
  }else{
   for(const dz of [-75,20,105])crane(x+102,z+dz);
   for(let a=0;a<7;a++)for(let b=0;b<7;b++){const xx=x+205+a*31;for(let level=0;level<2+(a+b)%2;level++){const yy=7+level*7,zz=z-90+b*27,col=[0x466f82,0xa77758,0xb2b9a9,0x4e8076][(a+b+level)%4];box(xx,yy,zz,27,6.7,13,col);
 for(let rib=0;rib<12;rib++)for(const side of [-1,1])box(xx-12+rib*2.15,yy,zz+side*6.55,.25,5.7,.2,col);
 for(const side of [-1,1]){box(xx-13.6,yy,zz+side*2.6,.15,5.8,.18,0xc5c6b6);box(xx,yy+3.1,zz+side*6.5,27,.2,.2,0x657773);}}}
  }
  for(let j=0;j<20;j++){const xx=x+560+rand()*450,zz=z-220+rand()*420,height=(profile==='urban'?35:12)+rand()*(profile==='urban'?130:48);const bw=18+rand()*25,bd=22+rand()*20;box(xx,height/2,zz,bw,height,bd,[0x879ca1,0x9daaa5,0x6f8991][j%3]);for(let floor=9;floor<height;floor+=9){box(xx-bw/2-.2,floor,zz,.5,3,bd*.77,0x4f6b7b);box(xx,floor,zz-bd/2-.2,bw*.77,3,.5,0x4f6b7b);}}
  sign(p);const ring=new T.Mesh(new T.TorusGeometry(62,.9,6,64),new T.MeshBasicMaterial({color:0x8bb9ae,transparent:true,opacity:.35}));ring.rotation.x=-Math.PI/2;ring.position.set(x,1,z);ring.userData.privateMaterial=true;land.add(ring);rings.push(ring);
 }
 // Wide navigable entrance, marked by two lighted breakwaters.
 for(const side of [-1,1]){const x=side===1?520:-920;box(x,0,-2100,180,6,32,0x788984);for(let i=0;i<3;i++)obstacles.push({x:x-60+i*60,z:-2100,radius:27});cyl(x+(side===1?-90:90),8,-2100,4,16,side===1?0xede7d4:0xa86655);cyl(x+(side===1?-90:90),17,-2100,4,3,side===1?0x70b894:0xc87462);}

 // Surrounding terrain is rendered from bundled open elevation data.
 if(region.profile==='estuary'){for(let j=0;j<4;j++){const sand=new T.Mesh(new T.CylinderGeometry(370,400,3,40),new T.MeshStandardMaterial({color:0x99947a,roughness:1}));sand.scale.z=.6;sand.position.set(-1700-j*240,0,-600-j*550);sand.userData.privateMaterial=true;land.add(sand);obstacles.push({x:sand.position.x,z:sand.position.z,radius:380});}}
 if(region.profile==='channel'){hill(-1900,-700,650,160);for(const side of [-1,1]){box(side*1250,72,-1850,18,150,18,0xb6c4c4);beam([side*1250,145,-1850],[0,80,-1850],.7,0xb4c7c4);}box(0,76,-1850,2600,6,25,0x9fadb0);}
 for(const {geo,color,items} of batches.values()){const m=new T.MeshStandardMaterial({color,roughness:.78});const mesh=new T.InstancedMesh(geo,m,items.length),dummy=new T.Object3D();items.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.scale.set(p.w,p.h,p.d);dummy.rotation.set(0,p.angle,0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});m.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 harborPosition;').replace('#include <project_vertex>','#include <project_vertex>\nharborPosition=(modelMatrix*instanceMatrix*vec4(position,1.0)).xyz;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 harborPosition;').replace('#include <color_fragment>',`#include <color_fragment>
 float grain=fract(sin(dot(floor(harborPosition*14.0),vec3(12.9898,78.233,37.719)))*43758.5453);
 float weathering=sin(harborPosition.x*.41+harborPosition.z*.36)*sin(harborPosition.y*.3);
 diffuseColor.rgb*=.88+grain*.15+weathering*.06;`);};mesh.userData.privateMaterial=true;mesh.receiveShadow=true;land.add(mesh);}
 return {ports,obstacles,rings};
}
