"""Original Blender-authored merchant accommodation, Three.js Y-up GLB export."""
import bpy, math, os
from mathutils import Vector
OUT=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'models')
old=bpy.data.collections.get('Yoonseul_Merchant_2026')
if old:
 for o in list(old.objects):bpy.data.objects.remove(o,do_unlink=True)
 bpy.data.collections.remove(old)
collection=bpy.data.collections.new('Yoonseul_Merchant_2026')
bpy.context.scene.collection.children.link(collection)
objects=[]
def mat(name,color,metal=0,rough=.5):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough;return m
ivory=mat('Warm marine enamel',(.72,.76,.72),.18,.36);edge=mat('Edge aluminium',(.39,.49,.50),.7,.27);deck=mat('Nonslip green deck',(.10,.19,.18),.12,.8);glass=mat('Blue smoked glazing',(.022,.075,.105),.7,.16);orange=mat('Rescue orange',(.9,.21,.035),.05,.36);black=mat('Rubber and fittings',(.022,.034,.037),.1,.58);white=mat('Antenna fiberglass',(.82,.86,.82),.08,.35);brass=mat('Brass hardware',(.58,.4,.17),.75,.3)
def xyz(p):return Vector((p[0],-p[2],p[1]))
def link(o,name,m):
 o.name=name
 for c in list(o.users_collection):c.objects.unlink(o)
 collection.objects.link(o);objects.append(o);o.data.materials.append(m);return o

def box(name,p,size,m,bevel=.04):
 bpy.ops.mesh.primitive_cube_add(size=1,location=xyz(p));o=link(bpy.context.object,name,m);o.dimensions=(size[0],size[2],size[1]);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 if bevel:
  mod=o.modifiers.new('Machined round edges','BEVEL');mod.width=min(bevel,min(size)*.25);mod.segments=3
  bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name)
  mod=o.modifiers.new('Weighted normals','WEIGHTED_NORMAL');bpy.ops.object.modifier_apply(modifier=mod.name)
 return o

def rod(name,a,b,r,m,verts=10):
 av,bv=xyz(a),xyz(b);bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=r,depth=(bv-av).length,location=(av+bv)/2);o=link(bpy.context.object,name,m);o.rotation_euler=(bv-av).to_track_quat('Z','Y').to_euler();
 for p in o.data.polygons:p.use_smooth=True
 return o

def orb(name,p,size,m):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=12,location=xyz(p));o=link(bpy.context.object,name,m);o.scale=(size[0],size[2],size[1]);
 for p in o.data.polygons:p.use_smooth=True
 return o

# 8.2 m accommodation below the separate interactive bridge.
box('Accommodation shell',(0,4.05,0),(8.2,8.1,8.8),ivory,.22)
for y in [1.7,3.65,5.6,7.55]:
 box('Promenade deck',(0,y-.82,0),(9.15,.14,9.55),deck,.06)
 for side in [-1,1]:
  for z in [-3,-1.5,0,1.5,3]:
   box('Cabin frame',(side*4.12,y,z),(.11,.87,1.02),edge,.04)
   box('Cabin glazing',(side*4.19,y,z),(.035,.67,.82),glass,.02)
  for z in [-4.65,-3.5,-2,-.5,1,2.5,4,4.65]:rod('Deck stanchion',(side*4.5,y-.73,z),(side*4.5,y+.14,z),.026,ivory)
  for h in [-.36,.13]:rod('Deck handrail',(side*4.5,y+h,-4.65),(side*4.5,y+h,4.65),.023,ivory)
 for x in [-3,-1.5,0,1.5,3]:
  box('Forward frame',(x,y,-4.44),(1.02,.87,.08),edge)
  box('Forward glazing',(x,y,-4.49),(.82,.67,.035),glass,.01)
 # exterior aft doors and ladders
 box('Watertight door',(2.8,y-.12,4.46),(1,1.65,.12),ivory,.09)
 rod('Door wheel vertical',(2.8,y-.3,4.57),(2.8,y+.15,4.57),.025,brass)
 box('Ventilator',(0,y,4.48),(1.3,.8,.15),edge)
 for j in range(8):box('Vent grille',(0,y-.32+j*.09,4.58),(1.17,.027,.03),black,.005)
 for j in range(9):
  box('Companionway step',(-3.4,y-.72+j*.2,4.95+j*.08),(1.1,.06,.25),deck,.02)
 rod('Stair rail',(-4,y-.1,4.9),(-4,y+1.5,5.6),.035,ivory)
box('Bridge wing underside',(0,8.05,0),(11.3,.28,11.2),ivory,.10)
for side in [-1,1]:
 # streamlined enclosed lifeboats hanging on davits, real rounded silhouettes
 orb('Enclosed survival craft',(side*5.2,5.75,1.3),(.68,.66,2.45),orange)
 orb('Lifeboat cabin',(side*5.2,6.12,1.1),(.52,.42,1.63),orange)
 for z in [.2,.8,1.4,2]:box('Lifeboat glazing',(side*5.71,6.19,z),(.025,.22,.32),glass,.015)
 for z in [-.2,2.8]:
  rod('Davit upright',(side*4.1,5,z),(side*4.1,7.1,z),.075,edge)
  rod('Davit outreach',(side*4.1,7.1,z),(side*5.2,7.1,z),.075,edge)
  rod('Lifeboat falls',(side*5.2,7.1,z),(side*5.2,6.25,z),.012,black)
 for z in [-3,3]:
  rod('Liferaft canister',(side*4.7,8.4,z-.45),(side*4.7,8.4,z+.45),.32,white,20)
  for off in [-.25,.25]:rod('Canister band',(side*4.7,8.1,z+off),(side*4.7,8.69,z+off),.022,edge)
# Mast clears the original bridge roof (3.3 m above bridge deck).
rod('Signal mast',(-2,11.55,0),(-2,16.4,0),.1,white,20)
for y,w in [(14,2.6),(15.6,1.8)]:rod('Radar scanner',(-2-w/2,y,0),(-2+w/2,y,0),.095,white,16)
for side in [-1,1]:rod('Mast stay',(-2,15.6,0),(-2+side*1.4,11.5,1.5),.014,edge)
orb('Satellite radome',(2.5,12.2,1),(.65,.65,.65),white)
rod('VHF aerial',(3,11.5,-1),(3,15,-1),.019,white)
# Join by material: keep the browser draw count bounded.
bpy.ops.object.select_all(action='DESELECT')
for m in [ivory,edge,deck,glass,orange,black,white,brass]:
 group=[o for o in list(collection.objects) if o.data.materials[0]==m]
 if not group:continue
 for o in group:o.select_set(True)
 bpy.context.view_layer.objects.active=group[0];bpy.ops.object.join();group[0].name='Merchant '+m.name;bpy.ops.object.select_all(action='DESELECT')
for o in collection.objects:o.select_set(True)
os.makedirs(OUT,exist_ok=True)
bpy.ops.export_scene.gltf(filepath=OUT+'/merchant-accommodation.glb',export_format='GLB',use_selection=True,export_yup=True,export_apply=True)
print('YOONSEUL_EXPORT',len(collection.objects),sum(len(o.data.polygons) for o in collection.objects),os.path.getsize(OUT+'/merchant-accommodation.glb'))
