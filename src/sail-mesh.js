import * as THREE from 'three';
import {sailDrive} from './sailing.js';
export function makeSail(spec){
 const rig=new THREE.Group();rig.name='sailing-rig';rig.position.set(0,spec.deck+1,-spec.length*.09);
 const geo=new THREE.PlaneGeometry(1,1,20,28),sail=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0xf4f0df,side:THREE.DoubleSide,roughness:.88}));sail.name='mainsail';sail.frustumCulled=false;sail.castShadow=true;sail.userData.privateMaterial=true;rig.add(sail);
 const boom=new THREE.Mesh(new THREE.CylinderGeometry(.065,.065,spec.length*.37,12),new THREE.MeshStandardMaterial({color:0xa6b8bb,metalness:.5,roughness:.4}));boom.rotation.x=Math.PI/2;boom.position.z=spec.length*.185;boom.userData.privateMaterial=true;rig.add(boom);return rig;
}
export function updateSail(ship,spec,s,t,dt,wind,direction){
 const rig=ship.getObjectByName('sailing-rig');if(!rig)return;
 const {relative,efficiency}=sailDrive(s,{wind,windDirection:direction}),area=s.sailArea||0,side=Math.sin(relative)>=0?1:-1,target=-side*(.18+(1-Math.abs(Math.sin(relative)))*.75);
 rig.rotation.y+=(target-rig.rotation.y)*Math.min(1,dt*2);
 const sail=rig.getObjectByName('mainsail'),p=sail.geometry.attributes.position,uv=sail.geometry.attributes.uv,height=spec.length*.88*area,width=spec.length*.37;
 for(let i=0;i<p.count;i++){const u=uv.getX(i),v=uv.getY(i),span=width*(1-v*.92),edge=u*Math.sin(Math.PI*v),flutter=(Math.sin(t*(3+wind*.2)-u*8+v*12)+.35*Math.sin(t*12+v*23))*edge*Math.min(.34,wind*.022)*(1-efficiency*.8)*area;const billow=side*Math.sin(Math.PI*u)*Math.sin(Math.PI*v)*width*.10*area*Math.min(1,wind/8);p.setXYZ(i,billow+flutter,v*height+(1-area)*Math.sin(u*42)*.06,u*span);}
 p.needsUpdate=true;sail.geometry.computeVertexNormals();sail.visible=true;
}
