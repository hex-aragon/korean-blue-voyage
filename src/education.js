import {stability,rightingLever} from './stability.js';
export function drawStability(canvas,s,ship,cargo){
 if(!canvas)return;const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height,info=stability(ship,cargo),cx=w*.3,cy=h*.58;
 c.clearRect(0,0,w,h);c.fillStyle='#142e37';c.fillRect(0,0,w,h);
 c.strokeStyle='#538b98';c.lineWidth=2;c.beginPath();c.moveTo(0,cy+14);c.lineTo(w*.57,cy+14);c.stroke();c.fillStyle='#28546180';c.fillRect(0,cy+15,w*.57,h);
 c.save();c.translate(cx,cy);c.rotate(s.roll);c.fillStyle='#c0c8b8';c.beginPath();c.moveTo(-61,-13);c.lineTo(61,-13);c.lineTo(42,34);c.lineTo(-42,34);c.closePath();c.fill();
 for(let i=0;i<6;i++)for(let j=0;j<cargo.bays[i];j++){c.fillStyle=i%2?'#cda875':'#689da4';c.fillRect((i%2?1:-1)*29-11,-23-j*(cargo.high?18:6),22,cargo.high?15:5);}
 const scale=9,Gy=32-info.kg*scale,My=32-info.km*scale,Gx=info.cgX*scale;
 c.strokeStyle='#e9ba72';c.setLineDash([4,3]);c.beginPath();c.moveTo(Gx,Gy);c.lineTo(0,My);c.stroke();c.setLineDash([]);
 for(const [x,y,label,color] of [[Gx,Gy,'G','#f0bd72'],[0,My,'M','#8acfc4']]){c.fillStyle=color;c.beginPath();c.arc(x,y,4,0,Math.PI*2);c.fill();c.font='bold 13px sans-serif';c.fillText(label,x+8,y+4);}
 c.restore();c.font='12px sans-serif';c.fillStyle='#b0c6c1';c.fillText('좌현',22,h-15);c.fillText('우현',w*.49,h-15);
 const x=w*.64,base=h*.65;c.strokeStyle='#456a72';c.beginPath();c.moveTo(x-10,base);c.lineTo(w-12,base);c.stroke();c.beginPath();c.moveTo(x,25);c.lineTo(x,h-20);c.stroke();c.strokeStyle='#d8b67a';c.beginPath();for(let i=0;i<=30;i++){const gz=rightingLever(info,i*Math.PI/180);const px=x+i*(w*.29/30),py=base-gz*23;if(i===0)c.moveTo(px,py);else c.lineTo(px,py);}c.stroke();c.fillStyle='#c9d8ca';c.font='12px sans-serif';c.fillText('복원정 GZ',x,18);c.fillText('0°',x,base+17);c.fillText('30°',w-37,base+17);c.fillStyle='#91afa8';c.font='10px sans-serif';c.fillText('작은 각도 근사',x,h-9);
}
export function lessonText(info,s,cargo){
 if(info.gm<=0)return 'G가 M보다 높습니다. 작은 기울기도 커질 수 있어요. 항구에서 화물을 낮추고 균등하게 배치해 보세요.';
 if(Math.abs(info.cgX)>.15)return '한쪽 화물의 무게 때문에 평균 기울기가 생겼어요. 이것이 횡경사입니다. 좌우 화물을 고르게 나눠 보세요.';
 if(info.freeSurface>.05)return '덜 찬 탱크의 액체가 이동하면 유효 GM이 줄어듭니다. 같은 배에서 빈 탱크·가득 찬 탱크와 비교하세요.';
 if(cargo.high)return '높은 화물이 G를 올리고 GM을 줄였어요. 낮게 배치했을 때와 흔들림·복원 속도를 비교해 보세요.';
 if(cargo.ballast)return '낮은 곳의 밸러스트가 G를 낮췄습니다. GM은 늘지만 무게와 흘수도 증가해요.';
 return '좌우 흔들림은 롤링, 앞뒤 흔들림은 피칭입니다. GM이 양수이면 작은 기울기를 되돌리는 복원 모멘트가 생깁니다.';
}
