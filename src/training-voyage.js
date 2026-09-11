// Contextual, original exam-style tasks; game thresholds are not certification criteria.
export const TRAINING_STEPS=[
 {id:'plan',name:'항해 계획',subject:'항해 기초 · 거리와 속력',action:'항해도를 열어 목적지와 경유 항로를 확인하세요.'},
 {id:'cargo',name:'선적과 복원성',subject:'선화 운송 · 선박 운용',action:'미션 화물 6단위를 선적한 뒤 화물·복원력 화면에서 GM과 편중 여부를 확인하세요.'},
 {id:'helm',name:'브릿지 명령',subject:'해사 영어 · 항해사 직무',action:'전진 수동 항해 중 우현 타각 10°(게임 허용 8~12°)를 1초 유지한 뒤 중앙으로 되돌리세요. 주변 여유 수역을 먼저 확인하세요.'},
 {id:'radar',name:'레이더 당직',subject:'항해 기기 · 연속 관측',action:'레이더에서 선박 표적 하나를 선택하고 같은 표적을 8초 연속 추적하세요. 화면의 거리·CPA/TCPA 추세를 함께 보세요.'},
 {id:'weather',name:'기상 변화 대응',subject:'선박 운용 · 안전 관리',action:'바람과 파도가 커집니다. 수동 전진 중 레버를 25% 이하로 줄여 5 kn 미만을 5초 유지하세요. 닻 정지는 인정하지 않습니다.'},
 {id:'arrival',name:'입항과 화물 인도',subject:'항만 물류 · 선화 운송',action:'금색 목적지까지 항해하고 감속·정박한 뒤 계약 화물을 하역하세요. 자동 항해를 사용할 수 있습니다.'}
];
const rounded=(v,n=1)=>Number(v.toFixed(n));
function buildTrainingQuestion(phase,ctx){
 const grade=ctx.grade||4;
 if(phase===0){const nm=rounded(Math.max(.1,ctx.distance/1852),2),kn=grade<=2?9:12,answer=rounded(nm/kn*60);return {kind:'number',prompt:`목적지까지 직선거리 ${nm} NM, 계획 속력 ${kn} kn. 조류·우회·가감속을 제외한 이론 항해 시간은 몇 분인가요?`,answer,tolerance:.11,unit:'분',explain:`시간(분) = 거리(NM) ÷ 속력(kn) × 60 = ${answer}분. 실제 ETA는 경유 항로와 기상·교통·조류 때문에 달라집니다.`,hint:'1 kn은 1시간에 1해리(1,852 m)를 가는 속력입니다.'};}
 if(phase===1){const km=rounded(ctx.km,2),kg=rounded(ctx.kg,2),free=rounded(ctx.freeSurface,2),answer=rounded(km-kg-free,2);return {kind:'number',prompt:`현재 적재: KM ${km.toFixed(2)} m, KG ${kg.toFixed(2)} m, 자유수면 보정 ${free.toFixed(2)} m. 보정 GM은 몇 m인가요?`,answer,tolerance:.011,unit:'m',explain:`GM = KM − KG − 자유수면 보정 = ${answer.toFixed(2)} m. 양수여도 고박·흘수·선체 강도·대각도 복원성을 별도로 검토합니다.`,hint:'무게중심이 올라가거나 자유수면 영향이 커지면 유효 GM은 작아집니다.'};}
 if(phase===2)return {kind:'choice',prompt:'“Starboard ten.” 명령을 받았습니다. 어떤 조작을 해야 하나요?',options:['타를 우현 10°로 놓고 복창·실행 확인','침로를 무조건 10° 증가','기관 출력을 10% 증가'],answer:0,explain:'타각 명령은 침로 명령과 다릅니다. 실제 선회량은 속력·시간·선박 특성에 따라 달라집니다.',hint:'Starboard는 우현입니다. 먼저 타각 지시인지 침로 지시인지 구별하세요.'};
 if(phase===3)return {kind:'choice',prompt:'표적을 관측해 계산한 CPA가 줄어듭니다. 무엇을 뜻하나요?',options:['충돌이 반드시 발생한다','현재 상대 운동이 계속될 때 예상 최근접거리가 줄어든다','표적과 지금 거리가 CPA와 같다'],answer:1,explain:'CPA는 예측 최근접거리입니다. TCPA와 거리·방위 변화를 반복 확인하고 육안 경계도 유지해야 합니다. 선박이 변침하면 예측값도 바뀝니다.',hint:'예측값과 현재 측정값을 구별하세요.'};
 if(phase===4)return {kind:'choice',prompt:'바람이 강해지고 선수 충격이 커졌습니다. 항해 일정이 빠듯할 때도 우선할 판단은?',options:['화물과 선체 응답·주변 교통을 보며 속력·침로·회피 계획 재검토','빠르게 통과하도록 항상 전속','모든 선박은 파도를 정횡으로 받으면 안전'],answer:0,explain:'보편적인 한 가지 안전 침로는 없습니다. 여기서는 감속을 연습하지만 실제 황천 운용은 파향·주기·선체 상태를 함께 판단합니다.',hint:'도착 시간보다 선박과 사람의 상태를 먼저 살펴보세요.'};
 return {kind:'choice',prompt:'선박이 부두에 가까워졌습니다. 화물 인도 전 확인으로 적절한 것은?',options:['정지와 계류·작업 안전, 화물 수량·상태와 인도 조건을 확인','목적지 반경에 들어왔으니 이동 중 하역','선적 수량과 관계없이 보상부터 수령'],answer:0,explain:'항만 작업에는 선박·터미널 간 협의와 안전 확인이 필요합니다. 게임은 저속 정박과 계약 화물 수량을 확인한 뒤 하역합니다.',hint:'도착, 작업 준비, 인도 완료는 서로 다른 단계입니다.'};
}
export function trainingQuestion(phase,ctx){const context={};for(const key of ['distance','km','kg','freeSurface','grade'])context[key]=Number.isFinite(ctx[key])?ctx[key]:key==='grade'?4:0;return {...buildTrainingQuestion(phase,context),phase,context};}
export function newTraining(ctx){return {phase:0,status:'question',grade:ctx.grade||4,question:trainingQuestion(0,ctx),attempts:0,firstTry:0,incidents:0,actions:0,history:[],review:[],startDeliveries:ctx.deliveries,region:ctx.region,ship:ctx.ship,seconds:0,turned:false,target:null,weatherBefore:null};}
export function answerTraining(run,value){if(run.status!=='question'&&run.status!=='review')return null;const q=run.status==='review'?run.review[0]:run.question;const correct=q.kind==='number'?String(value).trim()!==''&&Number.isFinite(Number(value))&&Math.abs(Number(value)-q.answer)<=q.tolerance:Number(value)===q.answer;
 if(run.status==='review'){if(correct){run.review.shift();if(!run.review.length)run.status='complete';}return {correct,explain:q.explain};}
 run.attempts++;if(correct){if(run.attempts===1)run.firstTry++;else run.review.push({...q});run.status='practice';run.history.push({phase:run.phase,attempts:run.attempts,answer:q.answer});}return {correct,explain:q.explain};}
export function advanceTraining(run,ctx){run.actions++;run.phase++;run.seconds=0;run.turned=false;run.target=null;run.attempts=0;
 if(run.phase>=TRAINING_STEPS.length){run.status=run.review.length?'review':'complete';return;}
 run.status='question';run.question=trainingQuestion(run.phase,ctx);
}
export function practiceTraining(run,ctx,event){if(run.status!=='practice')return false;const s=ctx.state;
 if(s.damage||s.capsized){run.seconds=0;run.turned=false;return false;}
 if(run.phase===0)return event==='chart';
 if(run.phase===1)return event==='cargo'&&ctx.units>=6&&ctx.gm>0&&ctx.stable;
 if(run.phase===2){if(ctx.manual&&!s.anchored&&s.speed>0&&s.rudder*35>=8&&s.rudder*35<=12){run.seconds+=ctx.dt||0;if(run.seconds>=1)run.turned=true;}else if(!run.turned)run.seconds=0;return run.turned&&ctx.manual&&!s.anchored&&s.speed>0&&Math.abs(s.rudder)<.02;}
 if(run.phase===3){const c=ctx.tracked;if(!c||['whale','shark','coastguard'].includes(c.kind)||Math.hypot(c.x-s.x,c.z-s.z)>3200){run.seconds=0;run.target=null;return false;}if(run.target!==c.id){run.target=c.id;run.seconds=0;}run.seconds+=ctx.dt||0;return run.seconds>=8;}
 if(run.phase===4){if(ctx.wind>=10&&ctx.manual&&!s.anchored&&s.speed>0&&s.speed<5*.5144&&s.throttle>=0&&s.throttle<=.25)run.seconds+=ctx.dt||0;else run.seconds=0;return run.seconds>=5;}
 return event==='delivered'&&ctx.deliveries>run.startDeliveries;
}
export function trainingScore(run){return Math.max(0,Math.round(run.firstTry*10+run.actions*5-Math.min(run.incidents,6)*5));}
export function restoreTrainingBook(raw){const book={xp:0,log:[],run:null};if(!raw||typeof raw!=='object')return book;book.xp=Number.isFinite(raw.xp)?Math.max(0,raw.xp):0;book.log=Array.isArray(raw.log)?raw.log.filter(r=>r&&Number.isFinite(r.score)&&typeof r.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(r.date)).slice(0,8).map(r=>({score:Math.max(0,Math.min(90,r.score)),date:r.date,grade:[1,2,3,4].includes(r.grade)?r.grade:4,firstTry:Math.max(0,Math.min(6,Number(r.firstTry)||0)),incidents:Math.max(0,Number(r.incidents)||0)})):[];
 // Regenerate active question from live state on resume; no HTML or arbitrary prompts restored.
 const r=raw.run;if(r&&Number.isInteger(r.phase)&&r.phase>=0&&r.phase<=6&&[4,3,2,1].includes(r.grade)&&typeof r.region==='string'&&typeof r.ship==='string')book.run={...r,status:r.phase===6?'review':r.status==='practice'?'practice':'question',seconds:0,turned:false,target:null,attempts:Math.max(0,Number(r.attempts)||0),review:Array.isArray(r.review)?r.review.filter(q=>Number.isInteger(q.phase)&&q.phase>=0&&q.phase<6&&q.context).slice(0,6).map(q=>trainingQuestion(q.phase,q.context)):[],history:Array.isArray(r.history)?r.history.filter(h=>Number.isInteger(h.phase)&&h.phase>=0&&h.phase<6).slice(0,6):[],firstTry:Number.isFinite(r.firstTry)?Math.min(6,Math.max(0,r.firstTry)):0,actions:Math.min(r.phase,Math.max(0,Number(r.actions)||0)),incidents:Math.max(0,Number(r.incidents)||0)};if(book.run?.phase===6&&!book.run.review.length)book.run=null;return book;
}
