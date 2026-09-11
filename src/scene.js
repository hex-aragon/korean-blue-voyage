import * as THREE from 'three';
import {Water} from 'three/addons/objects/Water.js';
import {Sky} from 'three/addons/objects/Sky.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {makeShip,makeCargo,updateVesselDetails,disposeVessel} from './vessels.js';
import {waveHeight} from './physics.js';
import {portLocations} from './data.js';
import {makeBridge,updateBridge} from './bridge.js';
import {stability,liquidShip} from './stability.js';
const mat=(color,roughness=.65)=>new THREE.MeshStandardMaterial({color,roughness});
const materials=new Map();
function material(color){if(!materials.has(color))materials.set(color,mat(color));return materials.get(color);}
function box(group,x,y,z,w,h,d,color){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material(color));m.position.set(x,y,z);group.add(m);return m;}
function cylinder(group,x,y,z,r,h,color,segments=12){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),material(color));m.position.set(x,y,z);group.add(m);return m;}
function seeded(seed){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
function disposeGroup(group){disposeVessel(group);}
export class OceanScene{
 constructor(container){
 this.scene=new THREE.Scene();this.scene.fog=new THREE.FogExp2(0x93c2c8,.00010);
 this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));this.renderer.setSize(innerWidth,innerHeight);this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.72;container.append(this.renderer.domElement);
 const pmrem=new THREE.PMREMGenerator(this.renderer),studio=new RoomEnvironment();this.environment=pmrem.fromScene(studio,.03);this.scene.environment=this.environment.texture;this.scene.environmentIntensity=.32;studio.dispose();pmrem.dispose();this.renderer.shadowMap.enabled=innerWidth>700;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 this.camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.2,18000);
 this.sky=new Sky();this.sky.scale.setScalar(15000);this.scene.add(this.sky);const u=this.sky.material.uniforms;u.turbidity.value=4;u.rayleigh.value=2;u.mieCoefficient.value=.005;u.mieDirectionalG.value=.84;
 this.sky.material.uniforms.mood={value:1};
 this.sky.material.fragmentShader=this.sky.material.fragmentShader.replace('uniform float mieDirectionalG;', 'uniform float mieDirectionalG;\nuniform float mood;').replace('gl_FragColor = vec4( retColor, 1.0 );', `
 float altitude=pow(max(direction.y,0.0),0.55);
 vec3 horizon=mood>1.5?vec3(.035,.08,.16):(mood>.5?vec3(1.0,.48,.23):vec3(.55,.8,.93));
 vec3 zenith=mood>1.5?vec3(.003,.012,.04):(mood>.5?vec3(.055,.19,.31):vec3(.035,.27,.6));
 vec3 painted=mix(horizon,zenith,smoothstep(0.0,.8,altitude));
 float glow=pow(max(dot(direction,vSunDirection),0.0),48.0);
 painted+=vec3(1.0,.53,.18)*glow*(mood>.5?.4:.15);
 float disk=smoothstep(.99983,.99991,dot(direction,vSunDirection));
 painted+=vec3(5.0,3.1,1.1)*disk;
 if(mood>1.5){vec2 cell=floor(direction.xz/max(direction.y,.02)*350.0);float star=step(.9985,fract(sin(dot(cell,vec2(127.1,311.7)))*43758.5453));painted+=star*smoothstep(.08,.3,direction.y)*.8;}
 gl_FragColor=vec4(painted,1.0);
 `);
 this.sun=new THREE.Vector3();this.light=new THREE.DirectionalLight(0xffe6bf,2.5);this.light.castShadow=true;this.light.shadow.mapSize.set(1024,1024);this.light.shadow.camera.left=-90;this.light.shadow.camera.right=90;this.light.shadow.camera.top=90;this.light.shadow.camera.bottom=-90;this.light.shadow.camera.near=1;this.light.shadow.camera.far=900;this.light.shadow.normalBias=.05;this.scene.add(this.light,this.light.target);this.scene.add(new THREE.HemisphereLight(0xb7d9e5,0x425b56,1.4));
 const normals=new THREE.TextureLoader().load(import.meta.env.BASE_URL+'waternormals.jpg');normals.wrapS=normals.wrapT=THREE.RepeatWrapping;
 this.water=new Water(new THREE.PlaneGeometry(22000,22000,260,260),{textureWidth:512,textureHeight:512,waterNormals:normals,sunDirection:new THREE.Vector3(),sunColor:0xffedcf,waterColor:0x176777,distortionScale:3.2,fog:true});
 this.water.rotation.x=-Math.PI/2;this.water.material.uniforms.waveStrength={value:1};
 this.water.material.vertexShader=this.water.material.vertexShader.replace('#include <common>','#include <common>\nuniform float waveStrength;').replace('mirrorCoord = modelMatrix * vec4( position, 1.0 );',`vec3 p=position; vec4 wp=modelMatrix*vec4(p,1.0); p.z+=waveStrength*(sin(wp.x*.022+wp.z*.014-time*1.2)*.72+sin(wp.x*.051-wp.z*.027-time*1.7)*.3+sin(wp.z*.085+wp.x*.03-time*2.1)*.12); mirrorCoord = modelMatrix * vec4(p,1.0);`).replace('modelViewMatrix * vec4( position, 1.0 )','modelViewMatrix * vec4( p, 1.0 )');
 this.scene.add(this.water);this.land=new THREE.Group();this.scene.add(this.land);this.obstacles=[];this.portMeshes=[];
 this.wakePositions=new Float32Array(900*3);this.wakeLife=new Float32Array(900);this.wakeGeo=new THREE.BufferGeometry();this.wakeGeo.setAttribute('position',new THREE.BufferAttribute(this.wakePositions,3));this.wake=new THREE.Points(this.wakeGeo,new THREE.PointsMaterial({color:0xc6eeeb,size:1.8,transparent:true,opacity:.33,depthWrite:false}));this.wake.frustumCulled=false;this.scene.add(this.wake);this.wakeIndex=0;
 this.orbit=.38;this.zoom=1;this.lookPitch=0;this.cameraMode=0;this.cameraSnap=true;this.setTime('sunset');
 window.addEventListener('resize',()=>{this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight);});
 let dragging=false,px=0,py=0;this.renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;px=e.clientX;py=e.clientY;this.renderer.domElement.setPointerCapture(e.pointerId);});this.renderer.domElement.addEventListener('pointermove',e=>{if(dragging){this.orbit-=(e.clientX-px)*.005;if(this.cameraMode===1){this.orbit=THREE.MathUtils.clamp(this.orbit,-1.1,1.1);this.lookPitch=THREE.MathUtils.clamp(this.lookPitch+(e.clientY-py)*.002,-.22,.28);}px=e.clientX;py=e.clientY;}});this.renderer.domElement.addEventListener('pointerup',()=>dragging=false);this.renderer.domElement.addEventListener('pointercancel',()=>dragging=false);this.renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();this.zoom=THREE.MathUtils.clamp(this.zoom+e.deltaY*.001,.5,2.3);},{passive:false});
 }
 setTime(mode){this.sky.material.uniforms.mood.value={day:0,sunset:1,night:2}[mode];const elevation={day:34,sunset:7,night:-5}[mode];this.sun.setFromSphericalCoords(1,THREE.MathUtils.degToRad(90-elevation),THREE.MathUtils.degToRad(150));this.sky.material.uniforms.sunPosition.value.copy(this.sun);this.water.material.uniforms.sunDirection.value.copy(this.sun).normalize();this.light.position.copy(this.sun).multiplyScalar(500);this.light.intensity=mode==='night'?.25:2.5;this.renderer.toneMappingExposure=mode==='night'?.24:.72;this.scene.fog.color.set(mode==='night'?0x263f58:mode==='sunset'?0xb2b9b0:0x8dc6d3);}
 setCamera(mode){this.cameraMode=mode;this.orbit=mode===1?0:.38;this.lookPitch=0;this.cameraSnap=true;}
 setShip(spec){if(this.ship){this.scene.remove(this.ship);disposeGroup(this.ship);this.bridge?.texture.dispose();}this.spec=spec;this.ship=makeShip(spec);this.ship.rotation.order='YXZ';this.bridge=makeBridge(spec);this.ship.add(this.bridge.group);this.cargoGroup=new THREE.Group();this.ship.add(this.cargoGroup);this.cargoKey='';this.scene.add(this.ship);this.wakeLife.fill(0);this.wakePositions.fill(0);this.cameraSnap=true;
 this.lift=box(this.ship,0,-20,0,2.8,2,3.2,0xd8b26e);this.lift.visible=false;
 }
 syncCargo(cargo){const key=JSON.stringify(cargo);if(key===this.cargoKey)return;this.cargoKey=key;this.ship.remove(this.cargoGroup);disposeGroup(this.cargoGroup);this.cargoGroup=makeCargo(this.spec,cargo);this.ship.add(this.cargoGroup);}

 setRegion(region){
 disposeGroup(this.land);this.region=region;this.obstacles=[];this.portMeshes=[];this.water.material.uniforms.waterColor.value.set(region.color);const rand=seeded(region.seed);
 const addIsland=(x,z,r,h)=>{
 const geo=new THREE.SphereGeometry(1,34,18,0,Math.PI*2,0,Math.PI/2);const pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const vx=pos.getX(i),vy=pos.getY(i),vz=pos.getZ(i);const noise=1+.09*Math.sin(vx*13+vz*9)+.06*Math.cos(vz*19);pos.setXYZ(i,vx*r*noise,vy*h*(.84+.16*Math.sin(vx*8+vz*5))-2,vz*r*noise);}geo.computeVertexNormals();const colors=[];for(let i=0;i<pos.count;i++){const y=pos.getY(i);const c=new THREE.Color(y<4?0xaaa88c:y<10?0x556a50:0x385749);c.multiplyScalar(.85+rand()*.25);colors.push(c.r,c.g,c.b);}geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}));mesh.userData.privateMaterial=true;mesh.position.set(x,0,z);this.land.add(mesh);this.obstacles.push({x,z,radius:r*.9});
 };
 if(region.layout==='river'){
 for(const side of [-1,1]){box(this.land,side*860,-4,-2500,1100,10,13000,0x607651);for(let i=0;i<70;i++){const x=side*(380+rand()*550),z=800-i*100;box(this.land,x,12,z,15+rand()*25,20+rand()*65,20+rand()*25,region.id==='han'?0x9ba8a5:0x768878);}}
 // Bridge leaves a clear navigable channel underneath.
 box(this.land,0,37,-1350,1200,3,16,0xbac4bb);for(const x of [-310,310])box(this.land,x,17,-1350,10,36,12,0x83958e);
 }else{
 for(let i=0;i<(region.layout==='open'?8:23);i++){const side=i%2?1:-1;const x=side*(550+rand()*2400),z=450-rand()*6000;const r=90+rand()*210;addIsland(x,z,r,40+rand()*190);}
 }
 const ports=portLocations(region);ports.forEach((p,i)=>{
 if(region.layout==='river')p.x=(i%2?1:-1)*225;
 else addIsland(p.x+230,p.z-60,125,45+i*12);
 box(this.land,p.x+80,2,p.z,85,4,20,0x7f8e8b);box(this.land,p.x+110,5,p.z-18,22,7,20,0xdbd8c8);
 box(this.land,p.x+86,15,p.z+24,2,28,2,0xc2a875);box(this.land,p.x+50,29,p.z+24,74,2,2,0xb9a070);
 const tower=cylinder(this.land,p.x+110,14,p.z-35,3,23,0xeee9d8);cylinder(this.land,tower.position.x,26,tower.position.z,4,2,0x334e56);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(58,.65,6,72),new THREE.MeshBasicMaterial({color:0xa2ded1,transparent:true,opacity:.7}));ring.rotation.x=Math.PI/2;ring.position.set(p.x,1.2,p.z);ring.userData.privateMaterial=true;this.land.add(ring);this.portMeshes.push(ring);
 });this.ports=ports;return ports;
 }
 update(s,t,dt,strength,cargo,handling=null){
 this.water.material.uniforms.time.value=t;this.water.material.uniforms.waveStrength.value=strength;
 const ship=this.ship;if(!ship)return;const h=s.heave||0;ship.position.set(s.x,h,s.z);ship.rotation.set(s.pitch,-s.heading,-s.roll,'YXZ');
 this.light.position.copy(this.sun).multiplyScalar(350).add(ship.position);this.light.target.position.copy(ship.position);updateVesselDetails(ship,this.spec,t,handling);
 this.syncCargo(cargo);updateBridge(this.bridge,s,stability(this.spec,cargo),t);
 this.lift.visible=!!handling&&!['carcarrier','ferry','cruise','lng','tanker','chemical'].includes(this.spec.kind);if(handling){const p=handling.progress;this.lift.position.set(18*(1-p),6+Math.sin(p*Math.PI)*14,-this.spec.length*.15);}

 if(Math.abs(s.speed)>.3){for(let j=0;j<5;j++){const i=this.wakeIndex++%900,behind=this.spec.length*.46;this.wakePositions[i*3]=s.x-Math.sin(s.heading)*behind+(Math.random()-.5)*this.spec.beam;this.wakePositions[i*3+2]=s.z+Math.cos(s.heading)*behind+(Math.random()-.5)*2;this.wakeLife[i]=1;}}
 for(let i=0;i<900;i++){this.wakeLife[i]=Math.max(0,this.wakeLife[i]-dt*.065);this.wakePositions[i*3+1]=this.wakeLife[i]>0?waveHeight(this.wakePositions[i*3],this.wakePositions[i*3+2],t,strength)+.35:-10;}this.wakeGeo.attributes.position.needsUpdate=true;
 this.portMeshes.forEach(r=>r.position.y=1.6+Math.sin(t)*.35);
 const L=this.spec.length,angle=s.heading+this.orbit;let desired;
 if(this.cameraMode===1){
 ship.updateMatrixWorld(true);desired=this.bridge.eye.getWorldPosition(new THREE.Vector3());this.camera.position.copy(desired);
 const world=ship.getWorldQuaternion(new THREE.Quaternion());const look=new THREE.Quaternion().setFromEuler(new THREE.Euler(-.035+this.lookPitch,-this.orbit,0,'YXZ'));
 this.camera.quaternion.copy(world.multiply(look));this.camera.fov=innerWidth<650?78:68;
 }else{const d=(L*.9+14)*this.zoom*(innerWidth<650?1.18:1);desired=new THREE.Vector3(s.x-Math.sin(angle)*d,h+d*.42+this.spec.bridgeY*.24,s.z+Math.cos(angle)*d);this.camera.position.lerp(desired,this.cameraSnap?1:1-Math.exp(-dt*5));this.camera.up.set(0,1,0);this.camera.lookAt(s.x,this.spec.bridgeY*.43,s.z-L*.02);this.camera.fov=55;}
 this.camera.updateProjectionMatrix();this.cameraSnap=false;

 this.renderer.render(this.scene,this.camera);
 }
 screenshot(){this.renderer.render(this.scene,this.camera);const a=document.createElement('a');a.download='윤슬-항해.png';a.href=this.renderer.domElement.toDataURL('image/png');a.click();}
}
