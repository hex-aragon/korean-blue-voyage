import * as T from 'three';
// A smooth, adult-proportioned dress-uniform character, facing local -Z.
const palette={navy:0x142639,seam:0x263d50,black:0x101923,white:0xedece4,skin:0xc99576,shade:0xb77f66,gold:0xc7a55a,hair:0x202329};
const materials=new Map();
function material(color){if(!materials.has(color))materials.set(color,new T.MeshStandardMaterial({color,roughness:color===palette.gold?.31:.67,metalness:color===palette.gold?.65:0}));return materials.get(color);}
export function makeOfficer(){
 const g=new T.Group();g.name='naval-dress-officer';
 function mesh(geometry,color,pos,scale){const o=new T.Mesh(geometry,material(color));o.position.set(...pos);if(scale)o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
 function oval(pos,scale,color){return mesh(new T.SphereGeometry(1,24,16),color,pos,scale);}
 function tube(points,r,color){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),24,r,8,false),color,[0,0,0]);}
 function form(rings,color){const verts=[],indices=[],n=40;for(const [y,rx,rz,cz=0] of rings)for(let i=0;i<n;i++){const a=i/n*Math.PI*2;verts.push(Math.cos(a)*rx,y,Math.sin(a)*rz+cz);}for(let j=0;j<rings.length-1;j++)for(let i=0;i<n;i++){const a=j*n+i,b=j*n+(i+1)%n;indices.push(a,a+n,b,b,a+n,b+n);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setIndex(indices);geo.computeVertexNormals();return mesh(geo,color,[0,0,0]);}
 function patch(points,color,depth=-.154){const shape=new T.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const o=mesh(new T.ShapeGeometry(shape),color,[0,0,depth]);o.material=new T.MeshStandardMaterial({color,roughness:.72,side:T.DoubleSide});o.userData.privateMaterial=true;return o;}
 // Tailored trousers, leather shoes, waist and tapered jacket. Height ~1.9 m.
 for(const side of [-1,1]){oval([side*.118,.44,.01],[.102,.405,.115],palette.navy);oval([side*.12,.065,-.055],[.106,.065,.193],palette.black);tube([[side*.118,.15,-.09],[side*.118,.4,-.106],[side*.118,.77,-.079]],.006,palette.seam);}
 form([[.75,.18,.1],[.79,.225,.13],[.9,.21,.132],[1.04,.22,.145],[1.20,.282,.155],[1.31,.265,.132],[1.355,.17,.10],[1.36,0,0]],palette.navy);
 oval([0,1.39,0],[.075,.11,.074],palette.skin);
 patch([[-.092,1.365],[.093,1.365],[.055,1.17],[0,1.115],[-.055,1.17]],palette.white);
 patch([[-.023,1.315],[.023,1.315],[.037,1.16],[0,1.108],[-.03,1.16]],palette.black,-.16);
 patch([[-.105,1.365],[-.19,1.30],[-.15,1.24],[-.11,1.255],[-.04,1.075],[-.02,1.19]],palette.seam,-.162);
 patch([[.105,1.365],[.19,1.30],[.15,1.24],[.11,1.255],[.04,1.075],[.02,1.19]],palette.seam,-.162);
 tube([[0,.8,-.134],[.045,.97,-.149],[.04,1.08,-.15]],.003,palette.seam);
 for(const x of [-.079,.079])for(const y of [.87,.965,1.06])oval([x,y,-.143],[.012,.012,.006],palette.gold);
 // Arms in a relaxed bridge watch stance, with gold cuff braid and individual fingers.
 for(const side of [-1,1]){const x=side*.29;oval([x,1.17,.008],[.10,.18,.113],palette.navy);tube([[x,1.18,0],[side*.34,1.015,-.014],[side*.35,.83,-.10]],.072,palette.navy);for(const y of [.855,.88,.905])tube([[side*.287,y,-.12],[side*.33,y,-.164],[side*.40,y,-.12]],.008,palette.gold);oval([side*.353,.766,-.117],[.055,.078,.035],palette.skin);for(let i=0;i<4;i++)oval([side*(.318+i*.019),.716+(i===0?.015:0),-.125],[.011,.043,.015],palette.skin);}
 // Epaulettes and suspended ceremonial cord.
 for(const side of [-1,1]){oval([side*.23,1.327,-.018],[.10,.025,.075],palette.black);for(let i=0;i<4;i++)tube([[side*(.18+i*.025),1.35,-.07],[side*(.18+i*.025),1.35,.04]],.008,palette.gold);}
 for(let j=0;j<3;j++)tube([[.24,1.31,-.06],[.31,1.16,-.14-j*.008],[.26,1.01,-.19-j*.007],[.16,1.05,-.177],[.145,1.22,-.158]],.006,palette.gold);
 // Ribbons and breast pocket above double-breasted buttons.
 for(let i=0;i<6;i++){const o=mesh(new T.BoxGeometry(.021,.017,.005),[0x854b45,0xd6c28a,0x346e8c][i%3],[-.16+(i%3)*.023,1.18-Math.floor(i/3)*.019,-.15]);o.rotation.y=-.13;}
 tube([[-.19,1.10,-.132],[-.08,1.10,-.15]],.005,palette.seam);
 // Shaped jaw, cheek planes and brow, not a spherical toy head.
 form([[1.424,0,0],[1.445,.053,.072,-.027],[1.47,.077,.088,-.02],[1.51,.10,.091,-.007],[1.56,.107,.098],[1.63,.108,.103],[1.69,.098,.095],[1.73,.073,.071],[1.75,0,0]],palette.skin);
 for(const side of [-1,1]){oval([side*.106,1.575,.005],[.021,.04,.028],palette.skin);oval([side*.112,1.575,-.013],[.009,.023,.009],palette.shade);oval([side*.048,1.59,-.089],[.036,.012,.013],0xe0c6b3);oval([side*.047,1.59,-.101],[.012,.010,.004],0x343c37);oval([side*.047,1.59,-.104],[.006,.008,.002],palette.black);oval([side*.044,1.594,-.106],[.0025,.0025,.001],palette.white);tube([[side*.022,1.615,-.095],[side*.046,1.62,-.102],[side*.076,1.611,-.081]],.006,palette.hair);}
 oval([0,1.567,-.105],[.019,.038,.019],palette.skin);oval([0,1.54,-.122],[.021,.013,.014],palette.skin);for(const x of [-.014,.014])oval([x,1.535,-.122],[.006,.003,.004],palette.shade);
 tube([[-.032,1.499,-.095],[0,1.496,-.105],[.032,1.499,-.095]],.004,0x986350);oval([0,1.483,-.097],[.032,.011,.008],palette.skin);
 // Hair under the cap, swept back above the ears.
 for(const side of [-1,1])oval([side*.089,1.667,.023],[.02,.055,.069],palette.hair);
 form([[1.697,.107,.105],[1.728,.122,.112],[1.75,.137,.125],[1.78,.13,.12],[1.797,.095,.095],[1.802,0,0]],palette.white);
 form([[1.692,.11,.104],[1.729,.12,.113]],palette.black);
 const visor=oval([0,1.695,-.103],[.125,.012,.082],palette.black);visor.rotation.x=-.13;
 tube([[-.105,1.725,-.07],[0,1.718,-.116],[.105,1.725,-.07]],.006,palette.gold);
 oval([0,1.748,-.122],[.017,.021,.004],palette.gold);tube([[0,1.738,-.127],[0,1.762,-.127]],.003,palette.white);
 for(const side of [-1,1])for(let i=0;i<4;i++)oval([side*(.03+i*.014),1.702,-.15],[.009,.003,.006],palette.gold);
 return g;
}
export const officerPortrait=`<img src="${import.meta.env.BASE_URL}officer.webp" alt="정모와 금장 견장, 남색 정복을 갖춘 3D 항해사" width="128" height="160">`;
