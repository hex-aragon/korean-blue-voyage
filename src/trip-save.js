import {regions,portLocations} from './data.js';
import {makeMission} from './missions.js';
import {createVessel} from './physics.js';
export function tripSnapshot(region,spec,state,cargo,mission,completed){return {version:1,region:region.id,ship:spec.id,damage:state.damage||0,position:{x:state.x,z:state.z,heading:state.heading},cargo,mission:mission?{originRegion:mission.originRegion,destinationRegion:mission.destinationRegion,originPort:mission.origin.id,destinationPort:mission.id,phase:mission.phase}:null,completed};}
export function restoreTrip(trip,region,spec){
 if(!trip||trip.version!==1||trip.region!==region.id||trip.ship!==spec.id)return null;const p=trip.position,c=trip.cargo;
 if(!p||![p.x,p.z,p.heading].every(Number.isFinite)||Math.hypot(p.x,p.z)>9000||!c||!Array.isArray(c.bays)||c.bays.length!==6||!c.bays.every(n=>Number.isInteger(n)&&n>=0&&n<=3))return null;
 let mission=null;if(trip.mission){const m=trip.mission,origin=regions.find(r=>r.id===m.originRegion),destination=regions.find(r=>r.id===m.destinationRegion);if(!origin||!destination||!['loading','sailing','crossing','arrived'].includes(m.phase)||![origin.id,destination.id].includes(region.id))return null;const a=portLocations(origin).findIndex(p=>p.id===m.originPort),b=portLocations(destination).findIndex(p=>p.id===m.destinationPort);if(a<0||b<0)return null;mission=makeMission(origin,destination,a,b,spec);mission.phase=m.phase;}
 const done=trip.completed,port=done&&regions.flatMap(portLocations).find(p=>p.id===done.portId);const completed=port&&Number.isFinite(done.reward)&&done.reward>=0&&done.reward<100000?{name:port.name,portId:port.id,reward:done.reward}:null;
 return {state:{...createVessel(),...p,damage:Number.isFinite(trip.damage)?Math.max(0,Math.min(95,trip.damage)):0,anchored:true},cargo:{bays:[...c.bays],high:!!c.high,ballast:!!c.ballast},mission,completed};
}
