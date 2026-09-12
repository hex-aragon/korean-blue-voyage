// Wind direction is the direction the air travels toward, in game heading coordinates.
export function sailDrive(s,env){
 const wind=Math.max(0,env.wind||0),relative=Math.atan2(Math.sin((env.windDirection??.9)-s.heading),Math.cos((env.windDirection??.9)-s.heading));
 const from=Math.PI-Math.abs(relative),efficiency=from<Math.PI/4?0:Math.sin(Math.min(Math.PI/2,(from-Math.PI/4)*1.35))*(.65+.35*Math.sin(from));
 return {relative,efficiency,speed:Math.min(7,wind*.65)*efficiency*Math.max(0,Math.min(1,s.sailArea||0))};
}
export function stepSail(s,dt){const target=Math.max(0,Math.min(1,s.sailTarget||0)),area=s.sailArea||0;s.sailArea=area+Math.sign(target-area)*Math.min(Math.abs(target-area),dt*.4);}
