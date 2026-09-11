// Original learning scenarios, not reproduced examination questions or license assessments.
export const SOURCES={
 exam:['한국해양수산연수원 · 시험 과목','https://www.alime.or.kr/member/recommand/seamanExam_myContentsList.do'],
 english:['IMO · 표준해사통신영어 SMCP','https://www.imo.org/en/ourwork/safety/pages/standardmarinecommunicationphrases.aspx'],
 cargo:['IMO · 화물 적부와 고박','https://www.imo.org/en/ourwork/safety/pages/cargosecuring-default.aspx'],
 stability:['IMO · 선박 설계와 복원성','https://www.imo.org/en/ourwork/safety/pages/shipdesignandstability-default.aspx'],
 casualty:['MAIB · Alfred 좌초 조사 §2.8.1','https://assets.publishing.service.gov.uk/media/6757092b43b2de5fee8daea7/2024-3-Alfred-Report.pdf'],
 rules:['IMO · 국제해상충돌예방규칙','https://www.imo.org/en/ourwork/safety/pages/preventing-collisions.aspx']
};
const q=(id,grade,subject,title,question,options,answer,explain,source,practice)=>({id,grade,subject,title,question,options,answer,explain,source,practice});
export const courses=[
 q('4-english',4,'해사영어','타 중앙 명령','“Midships.”를 들었습니다. 무엇을 해야 할까요?',['선박을 항로 한가운데로 이동','타를 중앙에 놓고 명령을 복창','기관을 전속으로 변경'],1,'타각 명령과 선박 위치 명령을 구별합니다. 복창은 명령의 오해를 줄이고, 실행 결과도 확인해야 합니다.','english','helm'),
 q('4-cargo',4,'선화운송','낮고 고른 적재','같은 화물을 높은 갑판으로 옮기면 작은 경사에서의 GM은 보통 어떻게 될까요?',['KG가 올라가 GM이 작아진다','화물량이 같으면 GM도 같다','항상 GM이 커진다'],0,'KM이 같다는 가정에서 GM = KM − KG입니다. 실제 적재 계획에는 흘수·선체 강도·고박도 함께 검토합니다.','stability','cargo'),
 q('4-operation',4,'선박운용','전진 타력','기관 레버를 중립으로 내렸는데 배가 움직입니다. 이유는?',['즉시 멈추어야 하므로 고장이다','후진 명령과 같은 뜻이다','관성으로 전진 타력이 남는다'],2,'기관 출력과 선박 속력은 다릅니다. 미리 감속하고 남은 거리·바람·조류를 확인하세요.','rules','slow'),
 q('4-emergency',4,'사고 대응','접촉 직후','충돌 직후 가장 적절한 판단은?',['무조건 전속 후진','추가 위험을 줄이며 인명·손상·침수 상태 확인','화물 도착 시간부터 맞추기'],1,'상황을 파악하고 선장·당직팀에 알립니다. 조종·기관 사용은 추가 손상 가능성을 고려해야 합니다. 게임의 수리 버튼은 실제 손상 복구를 단순화한 것입니다.','casualty','radar'),
 q('3-english',3,'해사영어','기관 명령 확인','“Stop engines.”를 들었을 때 무엇을 뜻하나요?',['기관 정지 명령이며 선체는 타력으로 이동할 수 있다','이미 선체가 멈췄다는 보고','전속 후진하라는 명령'],0,'기관 명령을 복창하고 실행 상태를 확인합니다. 속력·위치·조류는 별도로 관측해야 합니다.','english','slow'),
 q('3-cargo',3,'선화운송','고박과 복원성','GM이 양수이고 화물이 고르게 놓였습니다. 출항해도 될까요?',['다른 확인 없이 출항','GM이 클수록 고박은 필요 없다','고박 상태·적재 한도·운항 조건도 확인'],2,'복원성이 있어도 화물이 이동하면 위험해집니다. 승인된 화물고박지침서와 해당 화물의 적재 조건을 확인합니다.','cargo','cargo'),
 q('3-operation',3,'선박운용','레이더 한 장의 함정','표적과 거리가 멀고 현재 CPA가 커 보입니다. 적절한 행동은?',['레이더 관측 종료','육안·레이더로 계속 관측하고 추세 확인','모든 상황에서 침로 유지'],1,'단일 관측으로 위험을 단정하지 않습니다. CPA/TCPA는 상대 운동 예측이며 변침·가감속 시 달라집니다.','rules','radar'),
 q('3-emergency',3,'사고 대응','좌초 후 무조건 후진?','암초에 얹혔지만 기관은 작동합니다. 먼저 할 일은?',['손상 평가 전에 전속 후진','수밀성·침수·복원성·주변 상태를 평가하고 이탈 계획 수립','더 세게 전진'],1,'Alfred 사고 조사에서는 손상 확인 전 이초 시도가 침수 위험을 키웠다고 지적했습니다. 실제 이초는 상태·조석·기상·지원 수단을 검토한 결정입니다. 게임은 수리 뒤 안전 수역으로 옮겨 자동 전진하는 편의 기능을 제공합니다.','casualty','radar'),
 q('2-english',2,'해사영어','이해하지 못한 무전','상대 선박의 말이 불분명합니다. “Say again.”의 의도는?',['수신 내용을 다시 말해 달라는 요청','동의했으니 실행하라는 뜻','무전을 종료하라는 뜻'],0,'추측으로 조종하지 않고 반복·확인을 요청합니다. 이 게임은 음성 무전 평가 대신 짧은 상황 이해 문제를 제공합니다.','english','radar'),
 q('2-cargo',2,'선화운송','자유수면 영향','액체 화물이 일부만 찬 탱크에서 움직입니다. 검토해야 할 것은?',['선색에 따른 가시성','자유수면이 유효 GM을 낮추는 영향','액체는 복원성에 영향 없음'],1,'부분 적재 탱크의 자유수면 효과를 보정해야 합니다. 무조건 탱크를 채우라는 뜻은 아니며 흘수·강도·화물 조건도 검토합니다.','stability','cargo'),
 q('2-operation',2,'선박운용','황천에서의 선택','파랑이 커지고 선수 충격이 심해졌습니다. 판단 방향은?',['도착 시간을 위해 무조건 가속','항상 파도에 직각으로 항해','속력·침로·기상 회피와 화물 상태를 종합 검토'],2,'모든 배에 같은 침로·속력이 안전하지는 않습니다. 파주기·방향·선체 응답과 주변 교통을 함께 봅니다. 실습의 감속 수치는 게임 목표입니다.','stability','slow'),
 q('2-emergency',2,'사고 대응','이탈 전 재평가','응급 방수 후 누수가 줄었습니다. 곧바로 항해해도 될까요?',['추가 침수·수밀성·복원성과 지원 필요성을 재평가','수리했으므로 항상 전속 항해','경보만 끄면 된다'],0,'방수 조치와 항해 가능 판정은 다릅니다. 실제 복항에는 손상 범위에 맞는 점검과 관계자 판단이 필요합니다.','casualty','helm'),
 q('1-english',1,'해사영어','조난 상황 전달','즉각적인 도움이 필요한 중대하고 임박한 위험입니다. 통신의 우선 목적은?',['정확한 식별·위치·위험·필요 지원을 전달','부두 예약만 변경','불확실한 상태를 숨기기'],0,'조난 통신은 상대가 상황과 지원 필요를 이해하도록 명확해야 합니다. 실제 호출은 선박의 GMDSS 절차와 상황에 따릅니다.','english','radar'),
 q('1-cargo',1,'선화운송','출항 승인 판단','적재 계획의 최종 검토에서 어떤 접근이 적절한가요?',['GM 한 값만 확인','강도·흘수·복원성·고박·화물 특성과 항해 조건을 함께 확인','화물 수량만 맞추기'],1,'화물 안전은 복수 조건을 동시에 만족해야 합니다. 게임의 6개 적재 구역은 원리를 배우는 모형이며 실제 적하계산기를 대체하지 않습니다.','cargo','cargo'),
 q('1-operation',1,'선박운용','당직팀 의사결정','좁은 수로에서 기상과 교통이 악화됩니다. 팀 운용으로 적절한 것은?',['자동 항해에 맡기고 관측 중단','지연을 감수하더라도 위험을 공유하고 계획·역할·중단 기준을 재검토','레이더 거리 숫자 하나만으로 계속 운항'],1,'관측과 계획은 계속 갱신해야 합니다. 항해 일정만으로 안전을 판단하지 않습니다.','rules','slow'),
 q('1-emergency',1,'사고 대응','응급 복구와 복항','구조 지원을 받아 선체가 안정됐습니다. 실제 복항 결정은?',['게임처럼 내구도 100%면 자동 복항','기상만 맑으면 즉시 출항','선체·기관·안전 상태와 필요한 검사·지원 계획을 검토'],2,'게임 자동 복구는 플레이를 이어가기 위한 생략입니다. 실제 수리·검사·예인·이초는 사고와 선박에 맞게 계획합니다.','casualty','helm')
];
export const practices={
 helm:{title:'타 중앙 복귀',text:'수동 항해 중 조타기를 20% 이상 돌린 뒤 중앙 버튼을 누르세요. 타가 실제로 중앙으로 돌아오는지 확인합니다.'},
 cargo:{title:'적재 전후 GM 비교',text:'항구에 정박 → 화물 메뉴에서 높은 적재와 낮은 적재를 비교하세요. 액체선은 부분 적재와 만재를 비교하세요. 화물 작업 완료 뒤 GM이 0.05 m 이상 달라지면 기록합니다.'},
 radar:{title:'연속 표적 관측',text:'레이더에서 선박 표적을 선택하고 항해 화면에서 8초간 추적하세요. 표적이 3,200 m 안에 있어야 합니다. 접촉하면 관측 시간을 다시 셉니다.'},
 slow:{title:'전진 타력과 감속',text:'수동 항해에서 6 kn 이상으로 움직인 뒤 레버를 25% 이하로 내려 4 kn 미만까지 감속하세요. 닻이나 충돌로 정지하면 인정하지 않습니다.'}
};
export function restoreAcademy(raw={}){const ids=courses.map(c=>c.id);return {passed:[...new Set(Array.isArray(raw?.passed)?raw.passed.filter(id=>ids.includes(id)):[])],practiced:[...new Set(Array.isArray(raw?.practiced)?raw.practiced.filter(id=>ids.includes(id)):[])]};}
export function answerCourse(book,id,index){const c=courses.find(c=>c.id===id);if(!c)return false;const ok=c.answer===index;if(ok&&!book.passed.includes(id))book.passed.push(id);return ok;}
export function startPractice(id,s,gm){const c=courses.find(c=>c.id===id);return c?{id,kind:c.practice,gm,turned:false,moving:false,seconds:0,target:null}:null;}
export function stepPractice(p,s,{gm,tracked,dt,manual=true,cargoChanged=false}){
 if(!p)return false;
 if(s.damage||s.capsized){p.seconds=0;p.moving=false;p.turned=false;return false;}
 if(p.kind==='cargo')return cargoChanged&&s.anchored&&Math.abs(gm-p.gm)>.05;
 if(p.kind==='helm'){if(manual&&!s.anchored&&Math.abs(s.rudder)>.2)p.turned=true;return p.turned&&manual&&!s.anchored&&Math.abs(s.rudder)<.02;}
 if(p.kind==='slow'){if(!manual||s.anchored){p.moving=false;return false;}if(s.speed>6*.5144)p.moving=true;return p.moving&&s.throttle>=0&&s.throttle<=.25&&s.speed<4*.5144;}
 if(p.kind==='radar'){if(!tracked||Math.hypot(tracked.x-s.x,tracked.z-s.z)>3200||['whale','shark','coastguard'].includes(tracked.kind)){p.seconds=0;p.target=null;return false;}if(p.target!==tracked.id){p.target=tracked.id;p.seconds=0;}p.seconds+=dt;return p.seconds>=8;}
 return false;
}
