export class SeaAudio{
 constructor(){this.active=false;this.volume=.45;}
 async toggle(){if(!this.ctx)this.init();await this.ctx.resume();this.active=!this.active;this.master.gain.setTargetAtTime(this.active?this.volume:0,this.ctx.currentTime,.3);return this.active;}
 init(){const ctx=this.ctx=new AudioContext();this.master=ctx.createGain();this.master.gain.value=0;this.master.connect(ctx.destination);const buffer=ctx.createBuffer(1,ctx.sampleRate*6,ctx.sampleRate);const data=buffer.getChannelData(0);let brown=0;for(let i=0;i<data.length;i++){brown=(brown+.03*(Math.random()*2-1))/1.03;data[i]=brown*4;}
 const noise=ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;this.filter=ctx.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=650;this.surf=ctx.createGain();this.surf.gain.value=.45;noise.connect(this.filter).connect(this.surf).connect(this.master);noise.start();
 const windNoise=ctx.createBufferSource();windNoise.buffer=buffer;windNoise.loop=true;this.wind=ctx.createBiquadFilter();this.wind.type='bandpass';this.wind.frequency.value=1400;this.wind.Q.value=.4;const wg=this.windGain=ctx.createGain();wg.gain.value=.3;windNoise.connect(this.wind).connect(wg).connect(this.master);windNoise.start();
 this.engine=ctx.createOscillator();this.engine.type='sine';this.engine.frequency.value=45;this.engineGain=ctx.createGain();this.engineGain.gain.value=0;this.engine.connect(this.engineGain).connect(this.master);this.engine.start();this.harmonic=ctx.createOscillator();this.harmonic.type='triangle';this.harmonicGain=ctx.createGain();this.harmonicGain.gain.value=0;this.harmonic.connect(this.harmonicGain).connect(this.master);this.harmonic.start();}
 update(t,speed,wind,yacht,throttle=0){if(!this.ctx)return;const now=this.ctx.currentTime,velocity=Math.abs(speed),pace=Math.min(1,velocity/15),rpm=Math.min(1,Math.abs(throttle)*.6+pace*.4);
 this.surf.gain.setTargetAtTime(.27+.1*Math.sin(t*.45)+wind*.012+pace*.22,now,.3);
 this.filter.frequency.setTargetAtTime(500+Math.sin(t*.4)*120+wind*20+pace*1100,now,.3);
 this.wind.frequency.setTargetAtTime(900+wind*35+pace*1900,now,.4);this.windGain.gain.setTargetAtTime(.15+wind*.009+pace*.3,now,.4);
 this.engine.frequency.setTargetAtTime(32+rpm*68,now,.25);this.engineGain.gain.setTargetAtTime(yacht?0:Math.min(.15,rpm*.15),now,.25);
 this.harmonic.frequency.setTargetAtTime(64+rpm*136,now,.25);this.harmonicGain.gain.setTargetAtTime(yacht?0:rpm*.035,now,.25);}
 setVolume(v){this.volume=v;if(this.ctx)this.master.gain.setTargetAtTime(this.active?v:0,this.ctx.currentTime,.1);}
}
