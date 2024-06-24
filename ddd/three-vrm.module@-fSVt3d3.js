import{O as Ee,b as N,o as de,b5 as $n,b7 as Et,b6 as en,j as z,G as re,V as g,b8 as qn,h as wt,D as St,M as At,ap as Le,as as dt,a0 as L,E as ct,Q as w,c as Xn,b9 as Gn,ba as k,U as Yn,d as oe,a4 as F,e as Qn,av as U,bb as Zn,B as Z,L as Jn,bc as Kn}from"./ddd@DwDq534T.js";/*!
 * @pixiv/three-vrm v2.1.1
 * VRM file loader for three.js.
 *
 * Copyright (c) 2019-2024 pixiv Inc.
 * @pixiv/three-vrm is distributed under MIT License
 * https://github.com/pixiv/three-vrm/blob/release/LICENSE
 *//*!
 * @pixiv/three-vrm-core v2.1.1
 * The implementation of core features of VRM, for @pixiv/three-vrm
 *
 * Copyright (c) 2020-2024 pixiv Inc.
 * @pixiv/three-vrm-core is distributed under MIT License
 * https://github.com/pixiv/three-vrm/blob/release/LICENSE
 */class Pt extends Ee{get overrideBlinkAmount(){return this.overrideBlink==="block"?0<this.weight?1:0:this.overrideBlink==="blend"?this.weight:0}get overrideLookAtAmount(){return this.overrideLookAt==="block"?0<this.weight?1:0:this.overrideLookAt==="blend"?this.weight:0}get overrideMouthAmount(){return this.overrideMouth==="block"?0<this.weight?1:0:this.overrideMouth==="blend"?this.weight:0}constructor(e){super(),this.weight=0,this.isBinary=!1,this.overrideBlink="none",this.overrideLookAt="none",this.overrideMouth="none",this._binds=[],this.name=`VRMExpression_${e}`,this.expressionName=e,this.type="VRMExpression",this.visible=!1}addBind(e){this._binds.push(e)}applyWeight(e){var t;let n=this.isBinary?this.weight<=.5?0:1:this.weight;n*=(t=e?.multiplier)!==null&&t!==void 0?t:1,this._binds.forEach(i=>i.applyWeight(n))}clearAppliedWeight(){this._binds.forEach(e=>e.clearAppliedWeight())}}function S(d,e,t,n){function i(r){return r instanceof t?r:new t(function(o){o(r)})}return new(t||(t=Promise))(function(r,o){function s(u){try{a(n.next(u))}catch(c){o(c)}}function l(u){try{a(n.throw(u))}catch(c){o(c)}}function a(u){u.done?r(u.value):i(u.value).then(s,l)}a((n=n.apply(d,e||[])).next())})}function tn(d,e,t){var n,i;const r=d.parser.json,o=(n=r.nodes)===null||n===void 0?void 0:n[e];if(o==null)return console.warn(`extractPrimitivesInternal: Attempt to use nodes[${e}] of glTF but the node doesn't exist`),null;const s=o.mesh;if(s==null)return null;const l=(i=r.meshes)===null||i===void 0?void 0:i[s];if(l==null)return console.warn(`extractPrimitivesInternal: Attempt to use meshes[${s}] of glTF but the mesh doesn't exist`),null;const a=l.primitives.length,u=[];return t.traverse(c=>{u.length<a&&c.isMesh&&u.push(c)}),u}function Lt(d,e){return S(this,void 0,void 0,function*(){const t=yield d.parser.getDependency("node",e);return tn(d,e,t)})}function It(d){return S(this,void 0,void 0,function*(){const e=yield d.parser.getDependencies("node"),t=new Map;return e.forEach((n,i)=>{const r=tn(d,i,n);r!=null&&t.set(i,r)}),t})}function bt(d,e){var t,n;const i=parseInt(k,10);let r=null;if(i>=133)r=(n=(t=d.associations.get(e))===null||t===void 0?void 0:t.materials)!==null&&n!==void 0?n:null;else{const s=d.associations.get(e);s?.type==="materials"&&(r=s.index)}return r}const st={Aa:"aa",Ih:"ih",Ou:"ou",Ee:"ee",Oh:"oh",Blink:"blink",Happy:"happy",Angry:"angry",Sad:"sad",Relaxed:"relaxed",LookUp:"lookUp",Surprised:"surprised",LookDown:"lookDown",LookLeft:"lookLeft",LookRight:"lookRight",BlinkLeft:"blinkLeft",BlinkRight:"blinkRight",Neutral:"neutral"};function nn(d){return Math.max(Math.min(d,1),0)}class we{get expressions(){return this._expressions.concat()}get expressionMap(){return Object.assign({},this._expressionMap)}get presetExpressionMap(){const e={},t=new Set(Object.values(st));return Object.entries(this._expressionMap).forEach(([n,i])=>{t.has(n)&&(e[n]=i)}),e}get customExpressionMap(){const e={},t=new Set(Object.values(st));return Object.entries(this._expressionMap).forEach(([n,i])=>{t.has(n)||(e[n]=i)}),e}constructor(){this.blinkExpressionNames=["blink","blinkLeft","blinkRight"],this.lookAtExpressionNames=["lookLeft","lookRight","lookUp","lookDown"],this.mouthExpressionNames=["aa","ee","ih","oh","ou"],this._expressions=[],this._expressionMap={}}copy(e){return this._expressions.concat().forEach(n=>{this.unregisterExpression(n)}),e._expressions.forEach(n=>{this.registerExpression(n)}),this.blinkExpressionNames=e.blinkExpressionNames.concat(),this.lookAtExpressionNames=e.lookAtExpressionNames.concat(),this.mouthExpressionNames=e.mouthExpressionNames.concat(),this}clone(){return new we().copy(this)}getExpression(e){var t;return(t=this._expressionMap[e])!==null&&t!==void 0?t:null}registerExpression(e){this._expressions.push(e),this._expressionMap[e.expressionName]=e}unregisterExpression(e){const t=this._expressions.indexOf(e);t===-1&&console.warn("VRMExpressionManager: The specified expressions is not registered"),this._expressions.splice(t,1),delete this._expressionMap[e.expressionName]}getValue(e){var t;const n=this.getExpression(e);return(t=n?.weight)!==null&&t!==void 0?t:null}setValue(e,t){const n=this.getExpression(e);n&&(n.weight=nn(t))}getExpressionTrackName(e){const t=this.getExpression(e);return t?`${t.name}.weight`:null}update(){const e=this._calculateWeightMultipliers();this._expressions.forEach(t=>{t.clearAppliedWeight()}),this._expressions.forEach(t=>{let n=1;const i=t.expressionName;this.blinkExpressionNames.indexOf(i)!==-1&&(n*=e.blink),this.lookAtExpressionNames.indexOf(i)!==-1&&(n*=e.lookAt),this.mouthExpressionNames.indexOf(i)!==-1&&(n*=e.mouth),t.applyWeight({multiplier:n})})}_calculateWeightMultipliers(){let e=1,t=1,n=1;return this._expressions.forEach(i=>{e-=i.overrideBlinkAmount,t-=i.overrideLookAtAmount,n-=i.overrideMouthAmount}),e=Math.max(0,e),t=Math.max(0,t),n=Math.max(0,n),{blink:e,lookAt:t,mouth:n}}}const se={Color:"color",EmissionColor:"emissionColor",ShadeColor:"shadeColor",MatcapColor:"matcapColor",RimColor:"rimColor",OutlineColor:"outlineColor"},ei={_Color:se.Color,_EmissionColor:se.EmissionColor,_ShadeColor:se.ShadeColor,_RimColor:se.RimColor,_OutlineColor:se.OutlineColor},ti=new N;class ce{constructor({material:e,type:t,targetValue:n,targetAlpha:i}){this.material=e,this.type=t,this.targetValue=n,this.targetAlpha=i??1;const r=this._initColorBindState(),o=this._initAlphaBindState();this._state={color:r,alpha:o}}applyWeight(e){const{color:t,alpha:n}=this._state;if(t!=null){const{propertyName:i,deltaValue:r}=t,o=this.material[i];o?.add(ti.copy(r).multiplyScalar(e))}if(n!=null){const{propertyName:i,deltaValue:r}=n;this.material[i]!=null&&(this.material[i]+=r*e)}}clearAppliedWeight(){const{color:e,alpha:t}=this._state;if(e!=null){const{propertyName:n,initialValue:i}=e,r=this.material[n];r?.copy(i)}if(t!=null){const{propertyName:n,initialValue:i}=t;this.material[n]!=null&&(this.material[n]=i)}}_initColorBindState(){var e,t,n;const{material:i,type:r,targetValue:o}=this,s=this._getPropertyNameMap(),l=(t=(e=s?.[r])===null||e===void 0?void 0:e[0])!==null&&t!==void 0?t:null;if(l==null)return console.warn(`Tried to add a material color bind to the material ${(n=i.name)!==null&&n!==void 0?n:"(no name)"}, the type ${r} but the material or the type is not supported.`),null;const u=i[l].clone(),c=new N(o.r-u.r,o.g-u.g,o.b-u.b);return{propertyName:l,initialValue:u,deltaValue:c}}_initAlphaBindState(){var e,t,n;const{material:i,type:r,targetAlpha:o}=this,s=this._getPropertyNameMap(),l=(t=(e=s?.[r])===null||e===void 0?void 0:e[1])!==null&&t!==void 0?t:null;if(l==null&&o!==1)return console.warn(`Tried to add a material alpha bind to the material ${(n=i.name)!==null&&n!==void 0?n:"(no name)"}, the type ${r} but the material or the type does not support alpha.`),null;if(l==null)return null;const a=i[l],u=o-a;return{propertyName:l,initialValue:a,deltaValue:u}}_getPropertyNameMap(){var e,t;return(t=(e=Object.entries(ce._propertyNameMapMap).find(([n])=>this.material[n]===!0))===null||e===void 0?void 0:e[1])!==null&&t!==void 0?t:null}}ce._propertyNameMapMap={isMeshStandardMaterial:{color:["color","opacity"],emissionColor:["emissive",null]},isMeshBasicMaterial:{color:["color","opacity"]},isMToonMaterial:{color:["color","opacity"],emissionColor:["emissive",null],outlineColor:["outlineColorFactor",null],matcapColor:["matcapFactor",null],rimColor:["parametricRimColorFactor",null],shadeColor:["shadeColorFactor",null]}};class Ut{constructor({primitives:e,index:t,weight:n}){this.primitives=e,this.index=t,this.weight=n}applyWeight(e){this.primitives.forEach(t=>{var n;((n=t.morphTargetInfluences)===null||n===void 0?void 0:n[this.index])!=null&&(t.morphTargetInfluences[this.index]+=this.weight*e)})}clearAppliedWeight(){this.primitives.forEach(e=>{var t;((t=e.morphTargetInfluences)===null||t===void 0?void 0:t[this.index])!=null&&(e.morphTargetInfluences[this.index]=0)})}}const Ot=new de;class he{constructor({material:e,scale:t,offset:n}){var i,r;this.material=e,this.scale=t,this.offset=n;const o=(i=Object.entries(he._propertyNamesMap).find(([s])=>e[s]===!0))===null||i===void 0?void 0:i[1];o==null?(console.warn(`Tried to add a texture transform bind to the material ${(r=e.name)!==null&&r!==void 0?r:"(no name)"} but the material is not supported.`),this._properties=[]):(this._properties=[],o.forEach(s=>{var l;const a=(l=e[s])===null||l===void 0?void 0:l.clone();if(!a)return null;e[s]=a;const u=a.offset.clone(),c=a.repeat.clone(),f=n.clone().sub(u),h=t.clone().sub(c);this._properties.push({name:s,initialOffset:u,deltaOffset:f,initialScale:c,deltaScale:h})}))}applyWeight(e){this._properties.forEach(t=>{const n=this.material[t.name];n!==void 0&&(n.offset.add(Ot.copy(t.deltaOffset).multiplyScalar(e)),n.repeat.add(Ot.copy(t.deltaScale).multiplyScalar(e)))})}clearAppliedWeight(){this._properties.forEach(e=>{const t=this.material[e.name];t!==void 0&&(t.offset.copy(e.initialOffset),t.repeat.copy(e.initialScale))})}}he._propertyNamesMap={isMeshStandardMaterial:["map","emissiveMap","bumpMap","normalMap","displacementMap","roughnessMap","metalnessMap","alphaMap"],isMeshBasicMaterial:["map","specularMap","alphaMap"],isMToonMaterial:["map","normalMap","emissiveMap","shadeMultiplyTexture","rimMultiplyTexture","outlineWidthMultiplyTexture","uvAnimationMaskTexture"]};const ni=new Set(["1.0","1.0-beta"]);class pe{get name(){return"VRMExpressionLoaderPlugin"}constructor(e){this.parser=e}afterRoot(e){return S(this,void 0,void 0,function*(){e.userData.vrmExpressionManager=yield this._import(e)})}_import(e){return S(this,void 0,void 0,function*(){const t=yield this._v1Import(e);if(t)return t;const n=yield this._v0Import(e);return n||null})}_v1Import(e){var t,n;return S(this,void 0,void 0,function*(){const i=this.parser.json;if(!(((t=i.extensionsUsed)===null||t===void 0?void 0:t.indexOf("VRMC_vrm"))!==-1))return null;const o=(n=i.extensions)===null||n===void 0?void 0:n.VRMC_vrm;if(!o)return null;const s=o.specVersion;if(!ni.has(s))return console.warn(`VRMExpressionLoaderPlugin: Unknown VRMC_vrm specVersion "${s}"`),null;const l=o.expressions;if(!l)return null;const a=new Set(Object.values(st)),u=new Map;l.preset!=null&&Object.entries(l.preset).forEach(([f,h])=>{if(h!=null){if(!a.has(f)){console.warn(`VRMExpressionLoaderPlugin: Unknown preset name "${f}" detected. Ignoring the expression`);return}u.set(f,h)}}),l.custom!=null&&Object.entries(l.custom).forEach(([f,h])=>{if(a.has(f)){console.warn(`VRMExpressionLoaderPlugin: Custom expression cannot have preset name "${f}". Ignoring the expression`);return}u.set(f,h)});const c=new we;return yield Promise.all(Array.from(u.entries()).map(([f,h])=>S(this,void 0,void 0,function*(){var v,p,_,m,R,T,M;const x=new Pt(f);if(e.scene.add(x),x.isBinary=(v=h.isBinary)!==null&&v!==void 0?v:!1,x.overrideBlink=(p=h.overrideBlink)!==null&&p!==void 0?p:"none",x.overrideLookAt=(_=h.overrideLookAt)!==null&&_!==void 0?_:"none",x.overrideMouth=(m=h.overrideMouth)!==null&&m!==void 0?m:"none",(R=h.morphTargetBinds)===null||R===void 0||R.forEach(E=>S(this,void 0,void 0,function*(){var y;if(E.node===void 0||E.index===void 0)return;const I=yield Lt(e,E.node),A=E.index;if(!I.every(P=>Array.isArray(P.morphTargetInfluences)&&A<P.morphTargetInfluences.length)){console.warn(`VRMExpressionLoaderPlugin: ${h.name} attempts to index morph #${A} but not found.`);return}x.addBind(new Ut({primitives:I,index:A,weight:(y=E.weight)!==null&&y!==void 0?y:1}))})),h.materialColorBinds||h.textureTransformBinds){const E=[];e.scene.traverse(y=>{const I=y.material;I&&E.push(I)}),(T=h.materialColorBinds)===null||T===void 0||T.forEach(y=>S(this,void 0,void 0,function*(){E.filter(A=>{const P=bt(this.parser,A);return y.material===P}).forEach(A=>{x.addBind(new ce({material:A,type:y.type,targetValue:new N().fromArray(y.targetValue),targetAlpha:y.targetValue[3]}))})})),(M=h.textureTransformBinds)===null||M===void 0||M.forEach(y=>S(this,void 0,void 0,function*(){E.filter(A=>{const P=bt(this.parser,A);return y.material===P}).forEach(A=>{var P,b;x.addBind(new he({material:A,offset:new de().fromArray((P=y.offset)!==null&&P!==void 0?P:[0,0]),scale:new de().fromArray((b=y.scale)!==null&&b!==void 0?b:[1,1])}))})}))}c.registerExpression(x)}))),c})}_v0Import(e){var t;return S(this,void 0,void 0,function*(){const n=this.parser.json,i=(t=n.extensions)===null||t===void 0?void 0:t.VRM;if(!i)return null;const r=i.blendShapeMaster;if(!r)return null;const o=new we,s=r.blendShapeGroups;if(!s)return o;const l=new Set;return yield Promise.all(s.map(a=>S(this,void 0,void 0,function*(){var u;const c=a.presetName,f=c!=null&&pe.v0v1PresetNameMap[c]||null,h=f??a.name;if(h==null){console.warn("VRMExpressionLoaderPlugin: One of custom expressions has no name. Ignoring the expression");return}if(l.has(h)){console.warn(`VRMExpressionLoaderPlugin: An expression preset ${c} has duplicated entries. Ignoring the expression`);return}l.add(h);const v=new Pt(h);e.scene.add(v),v.isBinary=(u=a.isBinary)!==null&&u!==void 0?u:!1,a.binds&&a.binds.forEach(_=>S(this,void 0,void 0,function*(){var m;if(_.mesh===void 0||_.index===void 0)return;const R=[];(m=n.nodes)===null||m===void 0||m.forEach((M,x)=>{M.mesh===_.mesh&&R.push(x)});const T=_.index;yield Promise.all(R.map(M=>S(this,void 0,void 0,function*(){var x;const E=yield Lt(e,M);if(!E.every(y=>Array.isArray(y.morphTargetInfluences)&&T<y.morphTargetInfluences.length)){console.warn(`VRMExpressionLoaderPlugin: ${a.name} attempts to index ${T}th morph but not found.`);return}v.addBind(new Ut({primitives:E,index:T,weight:.01*((x=_.weight)!==null&&x!==void 0?x:100)}))})))}));const p=a.materialValues;p&&p.length!==0&&p.forEach(_=>{if(_.materialName===void 0||_.propertyName===void 0||_.targetValue===void 0)return;const m=[];e.scene.traverse(T=>{if(T.material){const M=T.material;Array.isArray(M)?m.push(...M.filter(x=>(x.name===_.materialName||x.name===_.materialName+" (Outline)")&&m.indexOf(x)===-1)):M.name===_.materialName&&m.indexOf(M)===-1&&m.push(M)}});const R=_.propertyName;m.forEach(T=>{if(R==="_MainTex_ST"){const x=new de(_.targetValue[0],_.targetValue[1]),E=new de(_.targetValue[2],_.targetValue[3]);E.y=1-E.y-x.y,v.addBind(new he({material:T,scale:x,offset:E}));return}const M=ei[R];if(M){v.addBind(new ce({material:T,type:M,targetValue:new N().fromArray(_.targetValue),targetAlpha:_.targetValue[3]}));return}console.warn(R+" is not supported")})}),o.registerExpression(v)}))),o})}}pe.v0v1PresetNameMap={a:"aa",e:"ee",i:"ih",o:"oh",u:"ou",blink:"blink",joy:"happy",angry:"angry",sorrow:"sad",fun:"relaxed",lookup:"lookUp",lookdown:"lookDown",lookleft:"lookLeft",lookright:"lookRight",blink_l:"blinkLeft",blink_r:"blinkRight",neutral:"neutral"};const Sr={None:"none",Block:"block",Blend:"blend"};class D{constructor(e,t){this._firstPersonOnlyLayer=D.DEFAULT_FIRSTPERSON_ONLY_LAYER,this._thirdPersonOnlyLayer=D.DEFAULT_THIRDPERSON_ONLY_LAYER,this._initializedLayers=!1,this.humanoid=e,this.meshAnnotations=t}copy(e){if(this.humanoid!==e.humanoid)throw new Error("VRMFirstPerson: humanoid must be same in order to copy");return this.meshAnnotations=e.meshAnnotations.map(t=>({meshes:t.meshes.concat(),type:t.type})),this}clone(){return new D(this.humanoid,this.meshAnnotations).copy(this)}get firstPersonOnlyLayer(){return this._firstPersonOnlyLayer}get thirdPersonOnlyLayer(){return this._thirdPersonOnlyLayer}setup({firstPersonOnlyLayer:e=D.DEFAULT_FIRSTPERSON_ONLY_LAYER,thirdPersonOnlyLayer:t=D.DEFAULT_THIRDPERSON_ONLY_LAYER}={}){this._initializedLayers||(this._firstPersonOnlyLayer=e,this._thirdPersonOnlyLayer=t,this.meshAnnotations.forEach(n=>{n.meshes.forEach(i=>{n.type==="firstPersonOnly"?(i.layers.set(this._firstPersonOnlyLayer),i.traverse(r=>r.layers.set(this._firstPersonOnlyLayer))):n.type==="thirdPersonOnly"?(i.layers.set(this._thirdPersonOnlyLayer),i.traverse(r=>r.layers.set(this._thirdPersonOnlyLayer))):n.type==="auto"&&this._createHeadlessModel(i)})}),this._initializedLayers=!0)}_excludeTriangles(e,t,n,i){let r=0;if(t!=null&&t.length>0)for(let o=0;o<e.length;o+=3){const s=e[o],l=e[o+1],a=e[o+2],u=t[s],c=n[s];if(u[0]>0&&i.includes(c[0])||u[1]>0&&i.includes(c[1])||u[2]>0&&i.includes(c[2])||u[3]>0&&i.includes(c[3]))continue;const f=t[l],h=n[l];if(f[0]>0&&i.includes(h[0])||f[1]>0&&i.includes(h[1])||f[2]>0&&i.includes(h[2])||f[3]>0&&i.includes(h[3]))continue;const v=t[a],p=n[a];v[0]>0&&i.includes(p[0])||v[1]>0&&i.includes(p[1])||v[2]>0&&i.includes(p[2])||v[3]>0&&i.includes(p[3])||(e[r++]=s,e[r++]=l,e[r++]=a)}return r}_createErasedMesh(e,t){const n=new $n(e.geometry.clone(),e.material);n.name=`${e.name}(erase)`,n.frustumCulled=e.frustumCulled,n.layers.set(this._firstPersonOnlyLayer);const i=n.geometry,r=i.getAttribute("skinIndex"),o=r instanceof Et?[]:r.array,s=[];for(let p=0;p<o.length;p+=4)s.push([o[p],o[p+1],o[p+2],o[p+3]]);const l=i.getAttribute("skinWeight"),a=l instanceof Et?[]:l.array,u=[];for(let p=0;p<a.length;p+=4)u.push([a[p],a[p+1],a[p+2],a[p+3]]);const c=i.getIndex();if(!c)throw new Error("The geometry doesn't have an index buffer");const f=Array.from(c.array),h=this._excludeTriangles(f,u,s,t),v=[];for(let p=0;p<h;p++)v[p]=f[p];return i.setIndex(v),e.onBeforeRender&&(n.onBeforeRender=e.onBeforeRender),n.bind(new en(e.skeleton.bones,e.skeleton.boneInverses),new z),n}_createHeadlessModelForSkinnedMesh(e,t){const n=[];if(t.skeleton.bones.forEach((r,o)=>{this._isEraseTarget(r)&&n.push(o)}),!n.length){t.layers.enable(this._thirdPersonOnlyLayer),t.layers.enable(this._firstPersonOnlyLayer);return}t.layers.set(this._thirdPersonOnlyLayer);const i=this._createErasedMesh(t,n);e.add(i)}_createHeadlessModel(e){if(e.type==="Group")if(e.layers.set(this._thirdPersonOnlyLayer),this._isEraseTarget(e))e.traverse(t=>t.layers.set(this._thirdPersonOnlyLayer));else{const t=new re;t.name=`_headless_${e.name}`,t.layers.set(this._firstPersonOnlyLayer),e.parent.add(t),e.children.filter(n=>n.type==="SkinnedMesh").forEach(n=>{const i=n;this._createHeadlessModelForSkinnedMesh(t,i)})}else if(e.type==="SkinnedMesh"){const t=e;this._createHeadlessModelForSkinnedMesh(e.parent,t)}else this._isEraseTarget(e)&&(e.layers.set(this._thirdPersonOnlyLayer),e.traverse(t=>t.layers.set(this._thirdPersonOnlyLayer)))}_isEraseTarget(e){return e===this.humanoid.getRawBoneNode("head")?!0:e.parent?this._isEraseTarget(e.parent):!1}}D.DEFAULT_FIRSTPERSON_ONLY_LAYER=9;D.DEFAULT_THIRDPERSON_ONLY_LAYER=10;const ii=new Set(["1.0","1.0-beta"]);class rn{get name(){return"VRMFirstPersonLoaderPlugin"}constructor(e){this.parser=e}afterRoot(e){return S(this,void 0,void 0,function*(){const t=e.userData.vrmHumanoid;if(t!==null){if(t===void 0)throw new Error("VRMFirstPersonLoaderPlugin: vrmHumanoid is undefined. VRMHumanoidLoaderPlugin have to be used first");e.userData.vrmFirstPerson=yield this._import(e,t)}})}_import(e,t){return S(this,void 0,void 0,function*(){if(t==null)return null;const n=yield this._v1Import(e,t);if(n)return n;const i=yield this._v0Import(e,t);return i||null})}_v1Import(e,t){var n,i;return S(this,void 0,void 0,function*(){const r=this.parser.json;if(!(((n=r.extensionsUsed)===null||n===void 0?void 0:n.indexOf("VRMC_vrm"))!==-1))return null;const s=(i=r.extensions)===null||i===void 0?void 0:i.VRMC_vrm;if(!s)return null;const l=s.specVersion;if(!ii.has(l))return console.warn(`VRMFirstPersonLoaderPlugin: Unknown VRMC_vrm specVersion "${l}"`),null;const a=s.firstPerson;if(!a)return null;const u=[],c=yield It(e);return Array.from(c.entries()).forEach(([f,h])=>{var v;const p=a.meshAnnotations?a.meshAnnotations.find(_=>_.node===f):void 0;u.push({meshes:h,type:(v=p?.type)!==null&&v!==void 0?v:"both"})}),new D(t,u)})}_v0Import(e,t){var n;return S(this,void 0,void 0,function*(){const i=this.parser.json,r=(n=i.extensions)===null||n===void 0?void 0:n.VRM;if(!r)return null;const o=r.firstPerson;if(!o)return null;const s=[],l=yield It(e);return Array.from(l.entries()).forEach(([a,u])=>{const c=i.nodes[a],f=o.meshAnnotations?o.meshAnnotations.find(h=>h.mesh===c.mesh):void 0;s.push({meshes:u,type:this._convertV0FlagToV1Type(f?.firstPersonFlag)})}),new D(t,s)})}_convertV0FlagToV1Type(e){return e==="FirstPersonOnly"?"firstPersonOnly":e==="ThirdPersonOnly"?"thirdPersonOnly":e==="Auto"?"auto":"both"}}const Ar={Auto:"auto",Both:"both",ThirdPersonOnly:"thirdPersonOnly",FirstPersonOnly:"firstPersonOnly"},Nt=new g,Ct=new g,ri=new w;class Vt extends re{constructor(e){super(),this.vrmHumanoid=e,this._boneAxesMap=new Map,Object.values(e.humanBones).forEach(t=>{const n=new qn(1);n.matrixAutoUpdate=!1,n.material.depthTest=!1,n.material.depthWrite=!1,this.add(n),this._boneAxesMap.set(t,n)})}dispose(){Array.from(this._boneAxesMap.values()).forEach(e=>{e.geometry.dispose(),e.material.dispose()})}updateMatrixWorld(e){Array.from(this._boneAxesMap.entries()).forEach(([t,n])=>{t.node.updateWorldMatrix(!0,!1),t.node.matrixWorld.decompose(Nt,ri,Ct);const i=Nt.set(.1,.1,.1).divide(Ct);n.matrix.copy(t.node.matrixWorld).scale(i)}),super.updateMatrixWorld(e)}}const Ze=["hips","spine","chest","upperChest","neck","head","leftEye","rightEye","jaw","leftUpperLeg","leftLowerLeg","leftFoot","leftToes","rightUpperLeg","rightLowerLeg","rightFoot","rightToes","leftShoulder","leftUpperArm","leftLowerArm","leftHand","rightShoulder","rightUpperArm","rightLowerArm","rightHand","leftThumbMetacarpal","leftThumbProximal","leftThumbDistal","leftIndexProximal","leftIndexIntermediate","leftIndexDistal","leftMiddleProximal","leftMiddleIntermediate","leftMiddleDistal","leftRingProximal","leftRingIntermediate","leftRingDistal","leftLittleProximal","leftLittleIntermediate","leftLittleDistal","rightThumbMetacarpal","rightThumbProximal","rightThumbDistal","rightIndexProximal","rightIndexIntermediate","rightIndexDistal","rightMiddleProximal","rightMiddleIntermediate","rightMiddleDistal","rightRingProximal","rightRingIntermediate","rightRingDistal","rightLittleProximal","rightLittleIntermediate","rightLittleDistal"],Pr={Hips:"hips",Spine:"spine",Chest:"chest",UpperChest:"upperChest",Neck:"neck",Head:"head",LeftEye:"leftEye",RightEye:"rightEye",Jaw:"jaw",LeftUpperLeg:"leftUpperLeg",LeftLowerLeg:"leftLowerLeg",LeftFoot:"leftFoot",LeftToes:"leftToes",RightUpperLeg:"rightUpperLeg",RightLowerLeg:"rightLowerLeg",RightFoot:"rightFoot",RightToes:"rightToes",LeftShoulder:"leftShoulder",LeftUpperArm:"leftUpperArm",LeftLowerArm:"leftLowerArm",LeftHand:"leftHand",RightShoulder:"rightShoulder",RightUpperArm:"rightUpperArm",RightLowerArm:"rightLowerArm",RightHand:"rightHand",LeftThumbMetacarpal:"leftThumbMetacarpal",LeftThumbProximal:"leftThumbProximal",LeftThumbDistal:"leftThumbDistal",LeftIndexProximal:"leftIndexProximal",LeftIndexIntermediate:"leftIndexIntermediate",LeftIndexDistal:"leftIndexDistal",LeftMiddleProximal:"leftMiddleProximal",LeftMiddleIntermediate:"leftMiddleIntermediate",LeftMiddleDistal:"leftMiddleDistal",LeftRingProximal:"leftRingProximal",LeftRingIntermediate:"leftRingIntermediate",LeftRingDistal:"leftRingDistal",LeftLittleProximal:"leftLittleProximal",LeftLittleIntermediate:"leftLittleIntermediate",LeftLittleDistal:"leftLittleDistal",RightThumbMetacarpal:"rightThumbMetacarpal",RightThumbProximal:"rightThumbProximal",RightThumbDistal:"rightThumbDistal",RightIndexProximal:"rightIndexProximal",RightIndexIntermediate:"rightIndexIntermediate",RightIndexDistal:"rightIndexDistal",RightMiddleProximal:"rightMiddleProximal",RightMiddleIntermediate:"rightMiddleIntermediate",RightMiddleDistal:"rightMiddleDistal",RightRingProximal:"rightRingProximal",RightRingIntermediate:"rightRingIntermediate",RightRingDistal:"rightRingDistal",RightLittleProximal:"rightLittleProximal",RightLittleIntermediate:"rightLittleIntermediate",RightLittleDistal:"rightLittleDistal"},oi={hips:null,spine:"hips",chest:"spine",upperChest:"chest",neck:"upperChest",head:"neck",leftEye:"head",rightEye:"head",jaw:"head",leftUpperLeg:"hips",leftLowerLeg:"leftUpperLeg",leftFoot:"leftLowerLeg",leftToes:"leftFoot",rightUpperLeg:"hips",rightLowerLeg:"rightUpperLeg",rightFoot:"rightLowerLeg",rightToes:"rightFoot",leftShoulder:"upperChest",leftUpperArm:"leftShoulder",leftLowerArm:"leftUpperArm",leftHand:"leftLowerArm",rightShoulder:"upperChest",rightUpperArm:"rightShoulder",rightLowerArm:"rightUpperArm",rightHand:"rightLowerArm",leftThumbMetacarpal:"leftHand",leftThumbProximal:"leftThumbMetacarpal",leftThumbDistal:"leftThumbProximal",leftIndexProximal:"leftHand",leftIndexIntermediate:"leftIndexProximal",leftIndexDistal:"leftIndexIntermediate",leftMiddleProximal:"leftHand",leftMiddleIntermediate:"leftMiddleProximal",leftMiddleDistal:"leftMiddleIntermediate",leftRingProximal:"leftHand",leftRingIntermediate:"leftRingProximal",leftRingDistal:"leftRingIntermediate",leftLittleProximal:"leftHand",leftLittleIntermediate:"leftLittleProximal",leftLittleDistal:"leftLittleIntermediate",rightThumbMetacarpal:"rightHand",rightThumbProximal:"rightThumbMetacarpal",rightThumbDistal:"rightThumbProximal",rightIndexProximal:"rightHand",rightIndexIntermediate:"rightIndexProximal",rightIndexDistal:"rightIndexIntermediate",rightMiddleProximal:"rightHand",rightMiddleIntermediate:"rightMiddleProximal",rightMiddleDistal:"rightMiddleIntermediate",rightRingProximal:"rightHand",rightRingIntermediate:"rightRingProximal",rightRingDistal:"rightRingIntermediate",rightLittleProximal:"rightHand",rightLittleIntermediate:"rightLittleProximal",rightLittleDistal:"rightLittleIntermediate"};function on(d){return d.invert?d.invert():d.inverse(),d}const $=new g,q=new w;class at{constructor(e){this.humanBones=e,this.restPose=this.getAbsolutePose()}getAbsolutePose(){const e={};return Object.keys(this.humanBones).forEach(t=>{const n=t,i=this.getBoneNode(n);i&&($.copy(i.position),q.copy(i.quaternion),e[n]={position:$.toArray(),rotation:q.toArray()})}),e}getPose(){const e={};return Object.keys(this.humanBones).forEach(t=>{const n=t,i=this.getBoneNode(n);if(!i)return;$.set(0,0,0),q.identity();const r=this.restPose[n];r?.position&&$.fromArray(r.position).negate(),r?.rotation&&on(q.fromArray(r.rotation)),$.add(i.position),q.premultiply(i.quaternion),e[n]={position:$.toArray(),rotation:q.toArray()}}),e}setPose(e){Object.entries(e).forEach(([t,n])=>{const i=t,r=this.getBoneNode(i);if(!r)return;const o=this.restPose[i];o&&(n?.position&&(r.position.fromArray(n.position),o.position&&r.position.add($.fromArray(o.position))),n?.rotation&&(r.quaternion.fromArray(n.rotation),o.rotation&&r.quaternion.multiply(q.fromArray(o.rotation))))})}resetPose(){Object.entries(this.restPose).forEach(([e,t])=>{const n=this.getBoneNode(e);n&&(t?.position&&n.position.fromArray(t.position),t?.rotation&&n.quaternion.fromArray(t.rotation))})}getBone(e){var t;return(t=this.humanBones[e])!==null&&t!==void 0?t:void 0}getBoneNode(e){var t,n;return(n=(t=this.humanBones[e])===null||t===void 0?void 0:t.node)!==null&&n!==void 0?n:null}}const Je=new g,si=new w,ai=new g;class Se extends at{static _setupTransforms(e){const t=new Ee;t.name="VRMHumanoidRig";const n={},i={},r={};Ze.forEach(s=>{var l;const a=e.getBoneNode(s);if(a){const u=new g,c=new w;a.updateWorldMatrix(!0,!1),a.matrixWorld.decompose(u,c,Je),n[s]=u,i[s]=a.quaternion.clone();const f=new w;(l=a.parent)===null||l===void 0||l.matrixWorld.decompose(Je,f,Je),r[s]=f}});const o={};return Ze.forEach(s=>{var l;const a=e.getBoneNode(s);if(a){const u=n[s];let c=s,f;for(;f==null&&(c=oi[c],c!=null);)f=n[c];const h=new Ee;h.name="Normalized_"+a.name,(c?(l=o[c])===null||l===void 0?void 0:l.node:t).add(h),h.position.copy(u),f&&h.position.sub(f),o[s]={node:h}}}),{rigBones:o,root:t,parentWorldRotations:r,boneRotations:i}}constructor(e){const{rigBones:t,root:n,parentWorldRotations:i,boneRotations:r}=Se._setupTransforms(e);super(t),this.original=e,this.root=n,this._parentWorldRotations=i,this._boneRotations=r}update(){Ze.forEach(e=>{const t=this.original.getBoneNode(e);if(t!=null){const n=this.getBoneNode(e),i=this._parentWorldRotations[e],r=si.copy(i).invert(),o=this._boneRotations[e];if(t.quaternion.copy(n.quaternion).multiply(i).premultiply(r).multiply(o),e==="hips"){const s=n.getWorldPosition(ai);t.parent.updateWorldMatrix(!0,!1);const l=t.parent.matrixWorld,a=s.applyMatrix4(l.invert());t.position.copy(a)}}})}}class Ae{get restPose(){return console.warn("VRMHumanoid: restPose is deprecated. Use either rawRestPose or normalizedRestPose instead."),this.rawRestPose}get rawRestPose(){return this._rawHumanBones.restPose}get normalizedRestPose(){return this._normalizedHumanBones.restPose}get humanBones(){return this._rawHumanBones.humanBones}get rawHumanBones(){return this._rawHumanBones.humanBones}get normalizedHumanBones(){return this._normalizedHumanBones.humanBones}get normalizedHumanBonesRoot(){return this._normalizedHumanBones.root}constructor(e,t){var n;this.autoUpdateHumanBones=(n=t?.autoUpdateHumanBones)!==null&&n!==void 0?n:!0,this._rawHumanBones=new at(e),this._normalizedHumanBones=new Se(this._rawHumanBones)}copy(e){return this.autoUpdateHumanBones=e.autoUpdateHumanBones,this._rawHumanBones=new at(e.humanBones),this._normalizedHumanBones=new Se(this._rawHumanBones),this}clone(){return new Ae(this.humanBones,{autoUpdateHumanBones:this.autoUpdateHumanBones}).copy(this)}getAbsolutePose(){return console.warn("VRMHumanoid: getAbsolutePose() is deprecated. Use either getRawAbsolutePose() or getNormalizedAbsolutePose() instead."),this.getRawAbsolutePose()}getRawAbsolutePose(){return this._rawHumanBones.getAbsolutePose()}getNormalizedAbsolutePose(){return this._normalizedHumanBones.getAbsolutePose()}getPose(){return console.warn("VRMHumanoid: getPose() is deprecated. Use either getRawPose() or getNormalizedPose() instead."),this.getRawPose()}getRawPose(){return this._rawHumanBones.getPose()}getNormalizedPose(){return this._normalizedHumanBones.getPose()}setPose(e){return console.warn("VRMHumanoid: setPose() is deprecated. Use either setRawPose() or setNormalizedPose() instead."),this.setRawPose(e)}setRawPose(e){return this._rawHumanBones.setPose(e)}setNormalizedPose(e){return this._normalizedHumanBones.setPose(e)}resetPose(){return console.warn("VRMHumanoid: resetPose() is deprecated. Use either resetRawPose() or resetNormalizedPose() instead."),this.resetRawPose()}resetRawPose(){return this._rawHumanBones.resetPose()}resetNormalizedPose(){return this._normalizedHumanBones.resetPose()}getBone(e){return console.warn("VRMHumanoid: getBone() is deprecated. Use either getRawBone() or getNormalizedBone() instead."),this.getRawBone(e)}getRawBone(e){return this._rawHumanBones.getBone(e)}getNormalizedBone(e){return this._normalizedHumanBones.getBone(e)}getBoneNode(e){return console.warn("VRMHumanoid: getBoneNode() is deprecated. Use either getRawBoneNode() or getNormalizedBoneNode() instead."),this.getRawBoneNode(e)}getRawBoneNode(e){return this._rawHumanBones.getBoneNode(e)}getNormalizedBoneNode(e){return this._normalizedHumanBones.getBoneNode(e)}update(){this.autoUpdateHumanBones&&this._normalizedHumanBones.update()}}const li={Hips:"hips",Spine:"spine",Head:"head",LeftUpperLeg:"leftUpperLeg",LeftLowerLeg:"leftLowerLeg",LeftFoot:"leftFoot",RightUpperLeg:"rightUpperLeg",RightLowerLeg:"rightLowerLeg",RightFoot:"rightFoot",LeftUpperArm:"leftUpperArm",LeftLowerArm:"leftLowerArm",LeftHand:"leftHand",RightUpperArm:"rightUpperArm",RightLowerArm:"rightLowerArm",RightHand:"rightHand"},ui=new Set(["1.0","1.0-beta"]),Dt={leftThumbProximal:"leftThumbMetacarpal",leftThumbIntermediate:"leftThumbProximal",rightThumbProximal:"rightThumbMetacarpal",rightThumbIntermediate:"rightThumbProximal"};class sn{get name(){return"VRMHumanoidLoaderPlugin"}constructor(e,t){this.parser=e,this.helperRoot=t?.helperRoot,this.autoUpdateHumanBones=t?.autoUpdateHumanBones}afterRoot(e){return S(this,void 0,void 0,function*(){e.userData.vrmHumanoid=yield this._import(e)})}_import(e){return S(this,void 0,void 0,function*(){const t=yield this._v1Import(e);if(t)return t;const n=yield this._v0Import(e);return n||null})}_v1Import(e){var t,n;return S(this,void 0,void 0,function*(){const i=this.parser.json;if(!(((t=i.extensionsUsed)===null||t===void 0?void 0:t.indexOf("VRMC_vrm"))!==-1))return null;const o=(n=i.extensions)===null||n===void 0?void 0:n.VRMC_vrm;if(!o)return null;const s=o.specVersion;if(!ui.has(s))return console.warn(`VRMHumanoidLoaderPlugin: Unknown VRMC_vrm specVersion "${s}"`),null;const l=o.humanoid;if(!l)return null;const a=l.humanBones.leftThumbIntermediate!=null||l.humanBones.rightThumbIntermediate!=null,u={};l.humanBones!=null&&(yield Promise.all(Object.entries(l.humanBones).map(([f,h])=>S(this,void 0,void 0,function*(){let v=f;const p=h.node;if(a){const m=Dt[v];m!=null&&(v=m)}const _=yield this.parser.getDependency("node",p);if(_==null){console.warn(`A glTF node bound to the humanoid bone ${v} (index = ${p}) does not exist`);return}u[v]={node:_}}))));const c=new Ae(this._ensureRequiredBonesExist(u),{autoUpdateHumanBones:this.autoUpdateHumanBones});if(e.scene.add(c.normalizedHumanBonesRoot),this.helperRoot){const f=new Vt(c);this.helperRoot.add(f),f.renderOrder=this.helperRoot.renderOrder}return c})}_v0Import(e){var t;return S(this,void 0,void 0,function*(){const i=(t=this.parser.json.extensions)===null||t===void 0?void 0:t.VRM;if(!i)return null;const r=i.humanoid;if(!r)return null;const o={};r.humanBones!=null&&(yield Promise.all(r.humanBones.map(l=>S(this,void 0,void 0,function*(){const a=l.bone,u=l.node;if(a==null||u==null)return;const c=yield this.parser.getDependency("node",u);if(c==null){console.warn(`A glTF node bound to the humanoid bone ${a} (index = ${u}) does not exist`);return}const f=Dt[a],h=f??a;if(o[h]!=null){console.warn(`Multiple bone entries for ${h} detected (index = ${u}), ignoring duplicated entries.`);return}o[h]={node:c}}))));const s=new Ae(this._ensureRequiredBonesExist(o),{autoUpdateHumanBones:this.autoUpdateHumanBones});if(e.scene.add(s.normalizedHumanBonesRoot),this.helperRoot){const l=new Vt(s);this.helperRoot.add(l),l.renderOrder=this.helperRoot.renderOrder}return s})}_ensureRequiredBonesExist(e){const t=Object.values(li).filter(n=>e[n]==null);if(t.length>0)throw new Error(`VRMHumanoidLoaderPlugin: These humanoid bones are required but not exist: ${t.join(", ")}`);return e}}class Ft extends Z{constructor(){super(),this._currentTheta=0,this._currentRadius=0,this.theta=0,this.radius=0,this._currentTheta=0,this._currentRadius=0,this._attrPos=new U(new Float32Array(65*3),3),this.setAttribute("position",this._attrPos),this._attrIndex=new U(new Uint16Array(3*63),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let e=!1;this._currentTheta!==this.theta&&(this._currentTheta=this.theta,e=!0),this._currentRadius!==this.radius&&(this._currentRadius=this.radius,e=!0),e&&this._buildPosition()}_buildPosition(){this._attrPos.setXYZ(0,0,0,0);for(let e=0;e<64;e++){const t=e/63*this._currentTheta;this._attrPos.setXYZ(e+1,this._currentRadius*Math.sin(t),0,this._currentRadius*Math.cos(t))}this._attrPos.needsUpdate=!0}_buildIndex(){for(let e=0;e<63;e++)this._attrIndex.setXYZ(e*3,0,e+1,e+2);this._attrIndex.needsUpdate=!0}}class di extends Z{constructor(){super(),this.radius=0,this._currentRadius=0,this.tail=new g,this._currentTail=new g,this._attrPos=new U(new Float32Array(294),3),this.setAttribute("position",this._attrPos),this._attrIndex=new U(new Uint16Array(194),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let e=!1;this._currentRadius!==this.radius&&(this._currentRadius=this.radius,e=!0),this._currentTail.equals(this.tail)||(this._currentTail.copy(this.tail),e=!0),e&&this._buildPosition()}_buildPosition(){for(let e=0;e<32;e++){const t=e/16*Math.PI;this._attrPos.setXYZ(e,Math.cos(t),Math.sin(t),0),this._attrPos.setXYZ(32+e,0,Math.cos(t),Math.sin(t)),this._attrPos.setXYZ(64+e,Math.sin(t),0,Math.cos(t))}this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.setXYZ(96,0,0,0),this._attrPos.setXYZ(97,this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let e=0;e<32;e++){const t=(e+1)%32;this._attrIndex.setXY(e*2,e,t),this._attrIndex.setXY(64+e*2,32+e,32+t),this._attrIndex.setXY(128+e*2,64+e,64+t)}this._attrIndex.setXY(192,96,97),this._attrIndex.needsUpdate=!0}}const ge=new w,Bt=new w,ae=new g,Ht=new g,Wt=Math.sqrt(2)/2,ci=new w(0,0,-Wt,Wt),hi=new g(0,1,0);class fi extends re{constructor(e){super(),this.matrixAutoUpdate=!1,this.vrmLookAt=e;{const t=new Ft;t.radius=.5;const n=new wt({color:65280,transparent:!0,opacity:.5,side:St,depthTest:!1,depthWrite:!1});this._meshPitch=new At(t,n),this.add(this._meshPitch)}{const t=new Ft;t.radius=.5;const n=new wt({color:16711680,transparent:!0,opacity:.5,side:St,depthTest:!1,depthWrite:!1});this._meshYaw=new At(t,n),this.add(this._meshYaw)}{const t=new di;t.radius=.1;const n=new Le({color:16777215,depthTest:!1,depthWrite:!1});this._lineTarget=new dt(t,n),this._lineTarget.frustumCulled=!1,this.add(this._lineTarget)}}dispose(){this._meshYaw.geometry.dispose(),this._meshYaw.material.dispose(),this._meshPitch.geometry.dispose(),this._meshPitch.material.dispose(),this._lineTarget.geometry.dispose(),this._lineTarget.material.dispose()}updateMatrixWorld(e){const t=L.DEG2RAD*this.vrmLookAt.yaw;this._meshYaw.geometry.theta=t,this._meshYaw.geometry.update();const n=L.DEG2RAD*this.vrmLookAt.pitch;this._meshPitch.geometry.theta=n,this._meshPitch.geometry.update(),this.vrmLookAt.getLookAtWorldPosition(ae),this.vrmLookAt.getLookAtWorldQuaternion(ge),ge.multiply(this.vrmLookAt.getFaceFrontQuaternion(Bt)),this._meshYaw.position.copy(ae),this._meshYaw.quaternion.copy(ge),this._meshPitch.position.copy(ae),this._meshPitch.quaternion.copy(ge),this._meshPitch.quaternion.multiply(Bt.setFromAxisAngle(hi,t)),this._meshPitch.quaternion.multiply(ci);const{target:i,autoUpdate:r}=this.vrmLookAt;i!=null&&r&&(i.getWorldPosition(Ht).sub(ae),this._lineTarget.geometry.tail.copy(Ht),this._lineTarget.geometry.update(),this._lineTarget.position.copy(ae)),super.updateMatrixWorld(e)}}const pi=new g,mi=new g;function lt(d,e){return d.matrixWorld.decompose(pi,e,mi),e}function Re(d){return[Math.atan2(-d.z,d.x),Math.atan2(d.y,Math.sqrt(d.x*d.x+d.z*d.z))]}function kt(d){const e=Math.round(d/2/Math.PI);return d-2*Math.PI*e}const zt=new g(0,0,1),vi=new g,_i=new g,gi=new g,Mi=new w,Ke=new w,jt=new w,xi=new w,et=new ct;class Ie{get yaw(){return this._yaw}set yaw(e){this._yaw=e,this._needsUpdate=!0}get pitch(){return this._pitch}set pitch(e){this._pitch=e,this._needsUpdate=!0}get euler(){return console.warn("VRMLookAt: euler is deprecated. use getEuler() instead."),this.getEuler(new ct)}constructor(e,t){this.offsetFromHeadBone=new g,this.autoUpdate=!0,this.faceFront=new g(0,0,1),this.humanoid=e,this.applier=t,this._yaw=0,this._pitch=0,this._needsUpdate=!0,this._restHeadWorldQuaternion=this.getLookAtWorldQuaternion(new w)}getEuler(e){return e.set(L.DEG2RAD*this._pitch,L.DEG2RAD*this._yaw,0,"YXZ")}copy(e){if(this.humanoid!==e.humanoid)throw new Error("VRMLookAt: humanoid must be same in order to copy");return this.offsetFromHeadBone.copy(e.offsetFromHeadBone),this.applier=e.applier,this.autoUpdate=e.autoUpdate,this.target=e.target,this.faceFront.copy(e.faceFront),this}clone(){return new Ie(this.humanoid,this.applier).copy(this)}reset(){this._yaw=0,this._pitch=0,this._needsUpdate=!0}getLookAtWorldPosition(e){const t=this.humanoid.getRawBoneNode("head");return e.copy(this.offsetFromHeadBone).applyMatrix4(t.matrixWorld)}getLookAtWorldQuaternion(e){const t=this.humanoid.getRawBoneNode("head");return lt(t,e)}getFaceFrontQuaternion(e){if(this.faceFront.distanceToSquared(zt)<.01)return e.copy(this._restHeadWorldQuaternion).invert();const[t,n]=Re(this.faceFront);return et.set(0,.5*Math.PI+t,n,"YZX"),e.setFromEuler(et).premultiply(xi.copy(this._restHeadWorldQuaternion).invert())}getLookAtWorldDirection(e){return this.getLookAtWorldQuaternion(Ke),this.getFaceFrontQuaternion(jt),e.copy(zt).applyQuaternion(Ke).applyQuaternion(jt).applyEuler(this.getEuler(et))}lookAt(e){const t=Mi.copy(this._restHeadWorldQuaternion).multiply(on(this.getLookAtWorldQuaternion(Ke))),n=this.getLookAtWorldPosition(_i),i=gi.copy(e).sub(n).applyQuaternion(t).normalize(),[r,o]=Re(this.faceFront),[s,l]=Re(i),a=kt(s-r),u=kt(o-l);this._yaw=L.RAD2DEG*a,this._pitch=L.RAD2DEG*u,this._needsUpdate=!0}update(e){this.target!=null&&this.autoUpdate&&this.lookAt(this.target.getWorldPosition(vi)),this._needsUpdate&&(this._needsUpdate=!1,this.applier.applyYawPitch(this._yaw,this._pitch))}}Ie.EULER_ORDER="YXZ";const yi=new g(0,0,1),C=new w,K=new w,O=new ct(0,0,0,"YXZ");class Te{constructor(e,t,n,i,r){this.humanoid=e,this.rangeMapHorizontalInner=t,this.rangeMapHorizontalOuter=n,this.rangeMapVerticalDown=i,this.rangeMapVerticalUp=r,this.faceFront=new g(0,0,1),this._restQuatLeftEye=new w,this._restQuatRightEye=new w,this._restLeftEyeParentWorldQuat=new w,this._restRightEyeParentWorldQuat=new w;const o=this.humanoid.getRawBoneNode("leftEye"),s=this.humanoid.getRawBoneNode("rightEye");o&&(this._restQuatLeftEye.copy(o.quaternion),lt(o.parent,this._restLeftEyeParentWorldQuat)),s&&(this._restQuatRightEye.copy(s.quaternion),lt(s.parent,this._restRightEyeParentWorldQuat))}applyYawPitch(e,t){const n=this.humanoid.getRawBoneNode("leftEye"),i=this.humanoid.getRawBoneNode("rightEye"),r=this.humanoid.getNormalizedBoneNode("leftEye"),o=this.humanoid.getNormalizedBoneNode("rightEye");n&&(t<0?O.x=-L.DEG2RAD*this.rangeMapVerticalDown.map(-t):O.x=L.DEG2RAD*this.rangeMapVerticalUp.map(t),e<0?O.y=-L.DEG2RAD*this.rangeMapHorizontalInner.map(-e):O.y=L.DEG2RAD*this.rangeMapHorizontalOuter.map(e),C.setFromEuler(O),this._getWorldFaceFrontQuat(K),r.quaternion.copy(K).multiply(C).multiply(K.invert()),C.copy(this._restLeftEyeParentWorldQuat),n.quaternion.copy(r.quaternion).multiply(C).premultiply(C.invert()).multiply(this._restQuatLeftEye)),i&&(t<0?O.x=-L.DEG2RAD*this.rangeMapVerticalDown.map(-t):O.x=L.DEG2RAD*this.rangeMapVerticalUp.map(t),e<0?O.y=-L.DEG2RAD*this.rangeMapHorizontalOuter.map(-e):O.y=L.DEG2RAD*this.rangeMapHorizontalInner.map(e),C.setFromEuler(O),this._getWorldFaceFrontQuat(K),o.quaternion.copy(K).multiply(C).multiply(K.invert()),C.copy(this._restRightEyeParentWorldQuat),i.quaternion.copy(o.quaternion).multiply(C).premultiply(C.invert()).multiply(this._restQuatRightEye))}lookAt(e){console.warn("VRMLookAtBoneApplier: lookAt() is deprecated. use apply() instead.");const t=L.RAD2DEG*e.y,n=L.RAD2DEG*e.x;this.applyYawPitch(t,n)}_getWorldFaceFrontQuat(e){if(this.faceFront.distanceToSquared(yi)<.01)return e.identity();const[t,n]=Re(this.faceFront);return O.set(0,.5*Math.PI+t,n,"YZX"),e.setFromEuler(O)}}Te.type="bone";class ut{constructor(e,t,n,i,r){this.expressions=e,this.rangeMapHorizontalInner=t,this.rangeMapHorizontalOuter=n,this.rangeMapVerticalDown=i,this.rangeMapVerticalUp=r}applyYawPitch(e,t){t<0?(this.expressions.setValue("lookDown",0),this.expressions.setValue("lookUp",this.rangeMapVerticalUp.map(-t))):(this.expressions.setValue("lookUp",0),this.expressions.setValue("lookDown",this.rangeMapVerticalDown.map(t))),e<0?(this.expressions.setValue("lookLeft",0),this.expressions.setValue("lookRight",this.rangeMapHorizontalOuter.map(-e))):(this.expressions.setValue("lookRight",0),this.expressions.setValue("lookLeft",this.rangeMapHorizontalOuter.map(e)))}lookAt(e){console.warn("VRMLookAtBoneApplier: lookAt() is deprecated. use apply() instead.");const t=L.RAD2DEG*e.y,n=L.RAD2DEG*e.x;this.applyYawPitch(t,n)}}ut.type="expression";class $t{constructor(e,t){this.inputMaxValue=e,this.outputScale=t}map(e){return this.outputScale*nn(e/this.inputMaxValue)}}const Ri=new Set(["1.0","1.0-beta"]),Me=.01;class an{get name(){return"VRMLookAtLoaderPlugin"}constructor(e,t){this.parser=e,this.helperRoot=t?.helperRoot}afterRoot(e){return S(this,void 0,void 0,function*(){const t=e.userData.vrmHumanoid;if(t===null)return;if(t===void 0)throw new Error("VRMLookAtLoaderPlugin: vrmHumanoid is undefined. VRMHumanoidLoaderPlugin have to be used first");const n=e.userData.vrmExpressionManager;if(n!==null){if(n===void 0)throw new Error("VRMLookAtLoaderPlugin: vrmExpressionManager is undefined. VRMExpressionLoaderPlugin have to be used first");e.userData.vrmLookAt=yield this._import(e,t,n)}})}_import(e,t,n){return S(this,void 0,void 0,function*(){if(t==null||n==null)return null;const i=yield this._v1Import(e,t,n);if(i)return i;const r=yield this._v0Import(e,t,n);return r||null})}_v1Import(e,t,n){var i,r,o;return S(this,void 0,void 0,function*(){const s=this.parser.json;if(!(((i=s.extensionsUsed)===null||i===void 0?void 0:i.indexOf("VRMC_vrm"))!==-1))return null;const a=(r=s.extensions)===null||r===void 0?void 0:r.VRMC_vrm;if(!a)return null;const u=a.specVersion;if(!Ri.has(u))return console.warn(`VRMLookAtLoaderPlugin: Unknown VRMC_vrm specVersion "${u}"`),null;const c=a.lookAt;if(!c)return null;const f=c.type==="expression"?1:10,h=this._v1ImportRangeMap(c.rangeMapHorizontalInner,f),v=this._v1ImportRangeMap(c.rangeMapHorizontalOuter,f),p=this._v1ImportRangeMap(c.rangeMapVerticalDown,f),_=this._v1ImportRangeMap(c.rangeMapVerticalUp,f);let m;c.type==="expression"?m=new ut(n,h,v,p,_):m=new Te(t,h,v,p,_);const R=this._importLookAt(t,m);return R.offsetFromHeadBone.fromArray((o=c.offsetFromHeadBone)!==null&&o!==void 0?o:[0,.06,0]),R})}_v1ImportRangeMap(e,t){var n,i;let r=(n=e?.inputMaxValue)!==null&&n!==void 0?n:90;const o=(i=e?.outputScale)!==null&&i!==void 0?i:t;return r<Me&&(console.warn("VRMLookAtLoaderPlugin: inputMaxValue of a range map is too small. Consider reviewing the range map!"),r=Me),new $t(r,o)}_v0Import(e,t,n){var i,r,o,s;return S(this,void 0,void 0,function*(){const a=(i=this.parser.json.extensions)===null||i===void 0?void 0:i.VRM;if(!a)return null;const u=a.firstPerson;if(!u)return null;const c=u.lookAtTypeName==="BlendShape"?1:10,f=this._v0ImportDegreeMap(u.lookAtHorizontalInner,c),h=this._v0ImportDegreeMap(u.lookAtHorizontalOuter,c),v=this._v0ImportDegreeMap(u.lookAtVerticalDown,c),p=this._v0ImportDegreeMap(u.lookAtVerticalUp,c);let _;u.lookAtTypeName==="BlendShape"?_=new ut(n,f,h,v,p):_=new Te(t,f,h,v,p);const m=this._importLookAt(t,_);return u.firstPersonBoneOffset?m.offsetFromHeadBone.set((r=u.firstPersonBoneOffset.x)!==null&&r!==void 0?r:0,(o=u.firstPersonBoneOffset.y)!==null&&o!==void 0?o:.06,-((s=u.firstPersonBoneOffset.z)!==null&&s!==void 0?s:0)):m.offsetFromHeadBone.set(0,.06,0),m.faceFront.set(0,0,-1),_ instanceof Te&&_.faceFront.set(0,0,-1),m})}_v0ImportDegreeMap(e,t){var n,i;const r=e?.curve;JSON.stringify(r)!=="[0,0,0,1,1,1,1,0]"&&console.warn("Curves of LookAtDegreeMap defined in VRM 0.0 are not supported");let o=(n=e?.xRange)!==null&&n!==void 0?n:90;const s=(i=e?.yRange)!==null&&i!==void 0?i:t;return o<Me&&(console.warn("VRMLookAtLoaderPlugin: xRange of a degree map is too small. Consider reviewing the degree map!"),o=Me),new $t(o,s)}_importLookAt(e,t){const n=new Ie(e,t);if(this.helperRoot){const i=new fi(n);this.helperRoot.add(i),i.renderOrder=this.helperRoot.renderOrder}return n}}const Lr={Bone:"bone",Expression:"expression"};function Ti(d,e){return typeof d!="string"||d===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(d)&&(e=e.replace(/(^https?:\/\/[^/]+).*/i,"$1")),/^(https?:)?\/\//i.test(d)||/^data:.*,.*$/i.test(d)||/^blob:.*$/i.test(d)?d:e+d)}const Ei=new Set(["1.0","1.0-beta"]);class ln{get name(){return"VRMMetaLoaderPlugin"}constructor(e,t){var n,i,r;this.parser=e,this.needThumbnailImage=(n=t?.needThumbnailImage)!==null&&n!==void 0?n:!0,this.acceptLicenseUrls=(i=t?.acceptLicenseUrls)!==null&&i!==void 0?i:["https://vrm.dev/licenses/1.0/"],this.acceptV0Meta=(r=t?.acceptV0Meta)!==null&&r!==void 0?r:!0}afterRoot(e){return S(this,void 0,void 0,function*(){e.userData.vrmMeta=yield this._import(e)})}_import(e){return S(this,void 0,void 0,function*(){const t=yield this._v1Import(e);if(t!=null)return t;const n=yield this._v0Import(e);return n??null})}_v1Import(e){var t,n,i;return S(this,void 0,void 0,function*(){const r=this.parser.json;if(!(((t=r.extensionsUsed)===null||t===void 0?void 0:t.indexOf("VRMC_vrm"))!==-1))return null;const s=(n=r.extensions)===null||n===void 0?void 0:n.VRMC_vrm;if(s==null)return null;const l=s.specVersion;if(!Ei.has(l))return console.warn(`VRMMetaLoaderPlugin: Unknown VRMC_vrm specVersion "${l}"`),null;const a=s.meta;if(!a)return null;const u=a.licenseUrl;if(!new Set(this.acceptLicenseUrls).has(u))throw new Error(`VRMMetaLoaderPlugin: The license url "${u}" is not accepted`);let f;return this.needThumbnailImage&&a.thumbnailImage!=null&&(f=(i=yield this._extractGLTFImage(a.thumbnailImage))!==null&&i!==void 0?i:void 0),{metaVersion:"1",name:a.name,version:a.version,authors:a.authors,copyrightInformation:a.copyrightInformation,contactInformation:a.contactInformation,references:a.references,thirdPartyLicenses:a.thirdPartyLicenses,thumbnailImage:f,licenseUrl:a.licenseUrl,avatarPermission:a.avatarPermission,allowExcessivelyViolentUsage:a.allowExcessivelyViolentUsage,allowExcessivelySexualUsage:a.allowExcessivelySexualUsage,commercialUsage:a.commercialUsage,allowPoliticalOrReligiousUsage:a.allowPoliticalOrReligiousUsage,allowAntisocialOrHateUsage:a.allowAntisocialOrHateUsage,creditNotation:a.creditNotation,allowRedistribution:a.allowRedistribution,modification:a.modification,otherLicenseUrl:a.otherLicenseUrl}})}_v0Import(e){var t;return S(this,void 0,void 0,function*(){const i=(t=this.parser.json.extensions)===null||t===void 0?void 0:t.VRM;if(!i)return null;const r=i.meta;if(!r)return null;if(!this.acceptV0Meta)throw new Error("VRMMetaLoaderPlugin: Attempted to load VRM0.0 meta but acceptV0Meta is false");let o;return this.needThumbnailImage&&r.texture!=null&&r.texture!==-1&&(o=yield this.parser.getDependency("texture",r.texture)),{metaVersion:"0",allowedUserName:r.allowedUserName,author:r.author,commercialUssageName:r.commercialUssageName,contactInformation:r.contactInformation,licenseName:r.licenseName,otherLicenseUrl:r.otherLicenseUrl,otherPermissionUrl:r.otherPermissionUrl,reference:r.reference,sexualUssageName:r.sexualUssageName,texture:o??void 0,title:r.title,version:r.version,violentUssageName:r.violentUssageName}})}_extractGLTFImage(e){var t;return S(this,void 0,void 0,function*(){const i=(t=this.parser.json.images)===null||t===void 0?void 0:t[e];if(i==null)return console.warn(`VRMMetaLoaderPlugin: Attempt to use images[${e}] of glTF as a thumbnail but the image doesn't exist`),null;let r=i.uri;if(i.bufferView!=null){const s=yield this.parser.getDependency("bufferView",i.bufferView),l=new Blob([s],{type:i.mimeType});r=URL.createObjectURL(l)}return r==null?(console.warn(`VRMMetaLoaderPlugin: Attempt to use images[${e}] of glTF as a thumbnail but the image couldn't load properly`),null):yield new Kn().loadAsync(Ti(r,this.parser.options.path)).catch(s=>(console.error(s),console.warn("VRMMetaLoaderPlugin: Failed to load a thumbnail image"),null))})}}class un{constructor(e){this.scene=e.scene,this.meta=e.meta,this.humanoid=e.humanoid,this.expressionManager=e.expressionManager,this.firstPerson=e.firstPerson,this.lookAt=e.lookAt}update(e){this.humanoid.update(),this.lookAt&&this.lookAt.update(e),this.expressionManager&&this.expressionManager.update()}}class Ir{get name(){return"VRMC_vrm"}constructor(e,t){var n,i,r,o,s;this.parser=e;const l=t?.helperRoot,a=t?.autoUpdateHumanBones;this.expressionPlugin=(n=t?.expressionPlugin)!==null&&n!==void 0?n:new pe(e),this.firstPersonPlugin=(i=t?.firstPersonPlugin)!==null&&i!==void 0?i:new rn(e),this.humanoidPlugin=(r=t?.humanoidPlugin)!==null&&r!==void 0?r:new sn(e,{helperRoot:l,autoUpdateHumanBones:a}),this.lookAtPlugin=(o=t?.lookAtPlugin)!==null&&o!==void 0?o:new an(e,{helperRoot:l}),this.metaPlugin=(s=t?.metaPlugin)!==null&&s!==void 0?s:new ln(e)}afterRoot(e){return S(this,void 0,void 0,function*(){yield this.metaPlugin.afterRoot(e),yield this.humanoidPlugin.afterRoot(e),yield this.expressionPlugin.afterRoot(e),yield this.lookAtPlugin.afterRoot(e),yield this.firstPersonPlugin.afterRoot(e);const t=e.userData.vrmMeta,n=e.userData.vrmHumanoid;if(t&&n){const i=new un({scene:e.scene,expressionManager:e.userData.vrmExpressionManager,firstPerson:e.userData.vrmFirstPerson,humanoid:n,lookAt:e.userData.vrmLookAt,meta:t});e.userData.vrmCore=i}})}}class wi extends un{constructor(e){super(e),this.materials=e.materials,this.springBoneManager=e.springBoneManager,this.nodeConstraintManager=e.nodeConstraintManager}update(e){super.update(e),this.nodeConstraintManager&&this.nodeConstraintManager.update(),this.springBoneManager&&this.springBoneManager.update(e),this.materials&&this.materials.forEach(t=>{t.update&&t.update(e)})}}function xe(d,e,t,n){function i(r){return r instanceof t?r:new t(function(o){o(r)})}return new(t||(t=Promise))(function(r,o){function s(u){try{a(n.next(u))}catch(c){o(c)}}function l(u){try{a(n.throw(u))}catch(c){o(c)}}function a(u){u.done?r(u.value):i(u.value).then(s,l)}a((n=n.apply(d,e||[])).next())})}/*!
 * @pixiv/three-vrm-materials-mtoon v2.1.1
 * MToon (toon material) module for @pixiv/three-vrm
 *
 * Copyright (c) 2020-2024 pixiv Inc.
 * @pixiv/three-vrm-materials-mtoon is distributed under MIT License
 * https://github.com/pixiv/three-vrm/blob/release/LICENSE
 */function G(d,e,t,n){function i(r){return r instanceof t?r:new t(function(o){o(r)})}return new(t||(t=Promise))(function(r,o){function s(u){try{a(n.next(u))}catch(c){o(c)}}function l(u){try{a(n.throw(u))}catch(c){o(c)}}function a(u){u.done?r(u.value):i(u.value).then(s,l)}a((n=n.apply(d,e||[])).next())})}var Si=`// #define PHONG

varying vec3 vViewPosition;

#ifndef FLAT_SHADED
  varying vec3 vNormal;
#endif

#include <common>

// #include <uv_pars_vertex>
#ifdef MTOON_USE_UV
  varying vec2 vUv;

  // COMPAT: pre-r151 uses a common uvTransform
  #if THREE_VRM_THREE_REVISION < 151
    uniform mat3 uvTransform;
  #endif
#endif

// #include <uv2_pars_vertex>
// COMAPT: pre-r151 uses uv2 for lightMap and aoMap
#if THREE_VRM_THREE_REVISION < 151
  #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
    attribute vec2 uv2;
    varying vec2 vUv2;
    uniform mat3 uv2Transform;
  #endif
#endif

// #include <displacementmap_pars_vertex>
// #include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#ifdef USE_OUTLINEWIDTHMULTIPLYTEXTURE
  uniform sampler2D outlineWidthMultiplyTexture;
  uniform mat3 outlineWidthMultiplyTextureUvTransform;
#endif

uniform float outlineWidthFactor;

void main() {

  // #include <uv_vertex>
  #ifdef MTOON_USE_UV
    // COMPAT: pre-r151 uses a common uvTransform
    #if THREE_VRM_THREE_REVISION >= 151
      vUv = uv;
    #else
      vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
    #endif
  #endif

  // #include <uv2_vertex>
  // COMAPT: pre-r151 uses uv2 for lightMap and aoMap
  #if THREE_VRM_THREE_REVISION < 151
    #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
      vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;
    #endif
  #endif

  #include <color_vertex>

  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>

  // we need this to compute the outline properly
  objectNormal = normalize( objectNormal );

  #include <defaultnormal_vertex>

  #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED
    vNormal = normalize( transformedNormal );
  #endif

  #include <begin_vertex>

  #include <morphtarget_vertex>
  #include <skinning_vertex>
  // #include <displacementmap_vertex>
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>

  vViewPosition = - mvPosition.xyz;

  float outlineTex = 1.0;

  #ifdef OUTLINE
    #ifdef USE_OUTLINEWIDTHMULTIPLYTEXTURE
      vec2 outlineWidthMultiplyTextureUv = ( outlineWidthMultiplyTextureUvTransform * vec3( vUv, 1 ) ).xy;
      outlineTex = texture2D( outlineWidthMultiplyTexture, outlineWidthMultiplyTextureUv ).g;
    #endif

    #ifdef OUTLINE_WIDTH_WORLD
      float worldNormalLength = length( transformedNormal );
      vec3 outlineOffset = outlineWidthFactor * outlineTex * worldNormalLength * objectNormal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( outlineOffset + transformed, 1.0 );
    #endif

    #ifdef OUTLINE_WIDTH_SCREEN
      vec3 clipNormal = ( projectionMatrix * modelViewMatrix * vec4( objectNormal, 0.0 ) ).xyz;
      vec2 projectedNormal = normalize( clipNormal.xy );
      projectedNormal.x *= projectionMatrix[ 0 ].x / projectionMatrix[ 1 ].y;
      gl_Position.xy += 2.0 * outlineWidthFactor * outlineTex * projectedNormal.xy;
    #endif

    gl_Position.z += 1E-6 * gl_Position.w; // anti-artifact magic
  #endif

  #include <worldpos_vertex>
  // #include <envmap_vertex>
  #include <shadowmap_vertex>
  #include <fog_vertex>

}`,Ai=`// #define PHONG

uniform vec3 litFactor;

uniform float opacity;

uniform vec3 shadeColorFactor;
#ifdef USE_SHADEMULTIPLYTEXTURE
  uniform sampler2D shadeMultiplyTexture;
  uniform mat3 shadeMultiplyTextureUvTransform;
#endif

uniform float shadingShiftFactor;
uniform float shadingToonyFactor;

#ifdef USE_SHADINGSHIFTTEXTURE
  uniform sampler2D shadingShiftTexture;
  uniform mat3 shadingShiftTextureUvTransform;
  uniform float shadingShiftTextureScale;
#endif

uniform float giEqualizationFactor;

uniform vec3 parametricRimColorFactor;
#ifdef USE_RIMMULTIPLYTEXTURE
  uniform sampler2D rimMultiplyTexture;
  uniform mat3 rimMultiplyTextureUvTransform;
#endif
uniform float rimLightingMixFactor;
uniform float parametricRimFresnelPowerFactor;
uniform float parametricRimLiftFactor;

#ifdef USE_MATCAPTEXTURE
  uniform vec3 matcapFactor;
  uniform sampler2D matcapTexture;
  uniform mat3 matcapTextureUvTransform;
#endif

uniform vec3 emissive;
uniform float emissiveIntensity;

uniform vec3 outlineColorFactor;
uniform float outlineLightingMixFactor;

#ifdef USE_UVANIMATIONMASKTEXTURE
  uniform sampler2D uvAnimationMaskTexture;
  uniform mat3 uvAnimationMaskTextureUvTransform;
#endif

uniform float uvAnimationScrollXOffset;
uniform float uvAnimationScrollYOffset;
uniform float uvAnimationRotationPhase;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>

// #include <uv_pars_fragment>
#if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )
  varying vec2 vUv;
#endif

// #include <uv2_pars_fragment>
// COMAPT: pre-r151 uses uv2 for lightMap and aoMap
#if THREE_VRM_THREE_REVISION < 151
  #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
    varying vec2 vUv2;
  #endif
#endif

#include <map_pars_fragment>

#ifdef USE_MAP
  uniform mat3 mapUvTransform;
#endif

// #include <alphamap_pars_fragment>

#if THREE_VRM_THREE_REVISION >= 132
  #include <alphatest_pars_fragment>
#endif

#include <aomap_pars_fragment>
// #include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>

#ifdef USE_EMISSIVEMAP
  uniform mat3 emissiveMapUvTransform;
#endif

// #include <envmap_common_pars_fragment>
// #include <envmap_pars_fragment>
// #include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>

// #include <bsdfs>
// COMPAT: pre-r151 doesn't have BRDF_Lambert in <common>
#if THREE_VRM_THREE_REVISION < 151
  vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
    return RECIPROCAL_PI * diffuseColor;
  }
#endif

#include <lights_pars_begin>

#if THREE_VRM_THREE_REVISION >= 132
  #include <normal_pars_fragment>
#endif

// #include <lights_phong_pars_fragment>
varying vec3 vViewPosition;

#if THREE_VRM_THREE_REVISION < 132
  #ifndef FLAT_SHADED
    varying vec3 vNormal;
  #endif
#endif

struct MToonMaterial {
  vec3 diffuseColor;
  vec3 shadeColor;
  float shadingShift;
};

float linearstep( float a, float b, float t ) {
  return clamp( ( t - a ) / ( b - a ), 0.0, 1.0 );
}

/**
 * Convert NdotL into toon shading factor using shadingShift and shadingToony
 */
float getShading(
  const in float dotNL,
  const in float shadow,
  const in float shadingShift
) {
  float shading = dotNL;
  shading = shading + shadingShift;
  shading = linearstep( -1.0 + shadingToonyFactor, 1.0 - shadingToonyFactor, shading );
  shading *= shadow;
  return shading;
}

/**
 * Mix diffuseColor and shadeColor using shading factor and light color
 */
vec3 getDiffuse(
  const in MToonMaterial material,
  const in float shading,
  in vec3 lightColor
) {
  #ifdef DEBUG_LITSHADERATE
    return vec3( BRDF_Lambert( shading * lightColor ) );
  #endif

  #if THREE_VRM_THREE_REVISION < 132
    #ifndef PHYSICALLY_CORRECT_LIGHTS
      lightColor *= PI;
    #endif
  #endif

  vec3 col = lightColor * BRDF_Lambert( mix( material.shadeColor, material.diffuseColor, shading ) );

  // The "comment out if you want to PBR absolutely" line
  #ifdef V0_COMPAT_SHADE
    col = min( col, material.diffuseColor );
  #endif

  return col;
}

// COMPAT: pre-r156 uses a struct GeometricContext
#if THREE_VRM_THREE_REVISION >= 157
  void RE_Direct_MToon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in MToonMaterial material, const in float shadow, inout ReflectedLight reflectedLight ) {
    float dotNL = clamp( dot( geometryNormal, directLight.direction ), -1.0, 1.0 );
    vec3 irradiance = directLight.color;

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;

    irradiance *= dotNL;

    float shading = getShading( dotNL, shadow, material.shadingShift );

    // toon shaded diffuse
    reflectedLight.directDiffuse += getDiffuse( material, shading, directLight.color );
  }

  void RE_IndirectDiffuse_MToon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in MToonMaterial material, inout ReflectedLight reflectedLight ) {
    // indirect diffuse will use diffuseColor, no shadeColor involved
    reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;
  }
#else
  void RE_Direct_MToon( const in IncidentLight directLight, const in GeometricContext geometry, const in MToonMaterial material, const in float shadow, inout ReflectedLight reflectedLight ) {
    float dotNL = clamp( dot( geometry.normal, directLight.direction ), -1.0, 1.0 );
    vec3 irradiance = directLight.color;

    #if THREE_VRM_THREE_REVISION < 132
      #ifndef PHYSICALLY_CORRECT_LIGHTS
        irradiance *= PI;
      #endif
    #endif

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;

    irradiance *= dotNL;

    float shading = getShading( dotNL, shadow, material.shadingShift );

    // toon shaded diffuse
    reflectedLight.directDiffuse += getDiffuse( material, shading, directLight.color );
  }

  void RE_IndirectDiffuse_MToon( const in vec3 irradiance, const in GeometricContext geometry, const in MToonMaterial material, inout ReflectedLight reflectedLight ) {
    // indirect diffuse will use diffuseColor, no shadeColor involved
    reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;
  }
#endif

#define RE_Direct RE_Direct_MToon
#define RE_IndirectDiffuse RE_IndirectDiffuse_MToon
#define Material_LightProbeLOD( material ) (0)

#include <shadowmap_pars_fragment>
// #include <bumpmap_pars_fragment>

// #include <normalmap_pars_fragment>
#ifdef USE_NORMALMAP

  uniform sampler2D normalMap;
  uniform mat3 normalMapUvTransform;
  uniform vec2 normalScale;

#endif

// COMPAT: USE_NORMALMAP_OBJECTSPACE used to be OBJECTSPACE_NORMALMAP in pre-r151
#if defined( USE_NORMALMAP_OBJECTSPACE ) || defined( OBJECTSPACE_NORMALMAP )

  uniform mat3 normalMatrix;

#endif

// COMPAT: USE_NORMALMAP_TANGENTSPACE used to be TANGENTSPACE_NORMALMAP in pre-r151
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( TANGENTSPACE_NORMALMAP ) )

  // Per-Pixel Tangent Space Normal Mapping
  // http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html

  // three-vrm specific change: it requires \`uv\` as an input in order to support uv scrolls

  // Temporary compat against shader change @ Three.js r126, r151
  #if THREE_VRM_THREE_REVISION >= 151

    mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {

      vec3 q0 = dFdx( eye_pos.xyz );
      vec3 q1 = dFdy( eye_pos.xyz );
      vec2 st0 = dFdx( uv.st );
      vec2 st1 = dFdy( uv.st );

      vec3 N = surf_norm;

      vec3 q1perp = cross( q1, N );
      vec3 q0perp = cross( N, q0 );

      vec3 T = q1perp * st0.x + q0perp * st1.x;
      vec3 B = q1perp * st0.y + q0perp * st1.y;

      float det = max( dot( T, T ), dot( B, B ) );
      float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );

      return mat3( T * scale, B * scale, N );

    }

  #elif THREE_VRM_THREE_REVISION >= 126

    vec3 perturbNormal2Arb( vec2 uv, vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {

      vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
      vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
      vec2 st0 = dFdx( uv.st );
      vec2 st1 = dFdy( uv.st );

      vec3 N = normalize( surf_norm );

      vec3 q1perp = cross( q1, N );
      vec3 q0perp = cross( N, q0 );

      vec3 T = q1perp * st0.x + q0perp * st1.x;
      vec3 B = q1perp * st0.y + q0perp * st1.y;

      // three-vrm specific change: Workaround for the issue that happens when delta of uv = 0.0
      // TODO: Is this still required? Or shall I make a PR about it?
      if ( length( T ) == 0.0 || length( B ) == 0.0 ) {
        return surf_norm;
      }

      float det = max( dot( T, T ), dot( B, B ) );
      float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );

      return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );

    }

  #else

    vec3 perturbNormal2Arb( vec2 uv, vec3 eye_pos, vec3 surf_norm, vec3 mapN ) {

      // Workaround for Adreno 3XX dFd*( vec3 ) bug. See #9988

      vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
      vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
      vec2 st0 = dFdx( uv.st );
      vec2 st1 = dFdy( uv.st );

      float scale = sign( st1.t * st0.s - st0.t * st1.s ); // we do not care about the magnitude

      vec3 S = ( q0 * st1.t - q1 * st0.t ) * scale;
      vec3 T = ( - q0 * st1.s + q1 * st0.s ) * scale;

      // three-vrm specific change: Workaround for the issue that happens when delta of uv = 0.0
      // TODO: Is this still required? Or shall I make a PR about it?

      if ( length( S ) == 0.0 || length( T ) == 0.0 ) {
        return surf_norm;
      }

      S = normalize( S );
      T = normalize( T );
      vec3 N = normalize( surf_norm );

      #ifdef DOUBLE_SIDED

        // Workaround for Adreno GPUs gl_FrontFacing bug. See #15850 and #10331

        bool frontFacing = dot( cross( S, T ), N ) > 0.0;

        mapN.xy *= ( float( frontFacing ) * 2.0 - 1.0 );

      #else

        mapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );

      #endif

      mat3 tsn = mat3( S, T, N );
      return normalize( tsn * mapN );

    }

  #endif

#endif

// #include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

// == post correction ==========================================================
void postCorrection() {
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>
}

// == main procedure ===========================================================
void main() {
  #include <clipping_planes_fragment>

  vec2 uv = vec2(0.5, 0.5);

  #if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )
    uv = vUv;

    float uvAnimMask = 1.0;
    #ifdef USE_UVANIMATIONMASKTEXTURE
      vec2 uvAnimationMaskTextureUv = ( uvAnimationMaskTextureUvTransform * vec3( uv, 1 ) ).xy;
      uvAnimMask = texture2D( uvAnimationMaskTexture, uvAnimationMaskTextureUv ).b;
    #endif

    uv = uv + vec2( uvAnimationScrollXOffset, uvAnimationScrollYOffset ) * uvAnimMask;
    float uvRotCos = cos( uvAnimationRotationPhase * uvAnimMask );
    float uvRotSin = sin( uvAnimationRotationPhase * uvAnimMask );
    uv = mat2( uvRotCos, -uvRotSin, uvRotSin, uvRotCos ) * ( uv - 0.5 ) + 0.5;
  #endif

  #ifdef DEBUG_UV
    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
    #if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )
      gl_FragColor = vec4( uv, 0.0, 1.0 );
    #endif
    return;
  #endif

  vec4 diffuseColor = vec4( litFactor, opacity );
  ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
  vec3 totalEmissiveRadiance = emissive * emissiveIntensity;

  #include <logdepthbuf_fragment>

  // #include <map_fragment>
  #ifdef USE_MAP
    vec2 mapUv = ( mapUvTransform * vec3( uv, 1 ) ).xy;
    vec4 sampledDiffuseColor = texture2D( map, mapUv );
    #ifdef DECODE_VIDEO_TEXTURE
      sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
    #endif
    diffuseColor *= sampledDiffuseColor;
  #endif

  // #include <color_fragment>
  #if ( defined( USE_COLOR ) && !defined( IGNORE_VERTEX_COLOR ) )
    diffuseColor.rgb *= vColor;
  #endif

  // #include <alphamap_fragment>

  #include <alphatest_fragment>

  // #include <specularmap_fragment>

  // #include <normal_fragment_begin>
  float faceDirection = gl_FrontFacing ? 1.0 : -1.0;

  #ifdef FLAT_SHADED

    vec3 fdx = dFdx( vViewPosition );
    vec3 fdy = dFdy( vViewPosition );
    vec3 normal = normalize( cross( fdx, fdy ) );

  #else

    vec3 normal = normalize( vNormal );

    #ifdef DOUBLE_SIDED

      normal *= faceDirection;

    #endif

  #endif

  #ifdef USE_NORMALMAP

    vec2 normalMapUv = ( normalMapUvTransform * vec3( uv, 1 ) ).xy;

  #endif

  #ifdef USE_NORMALMAP_TANGENTSPACE

    #ifdef USE_TANGENT

      mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );

    #else

      mat3 tbn = getTangentFrame( - vViewPosition, normal, normalMapUv );

    #endif

    #if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )

      tbn[0] *= faceDirection;
      tbn[1] *= faceDirection;

    #endif

  #endif

  #ifdef USE_CLEARCOAT_NORMALMAP

    #ifdef USE_TANGENT

      mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );

    #else

      mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );

    #endif

    #if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )

      tbn2[0] *= faceDirection;
      tbn2[1] *= faceDirection;

    #endif

  #endif

  // non perturbed normal for clearcoat among others

  vec3 nonPerturbedNormal = normal;

  #ifdef OUTLINE
    normal *= -1.0;
  #endif

  // #include <normal_fragment_maps>

  // COMPAT: USE_NORMALMAP_OBJECTSPACE used to be OBJECTSPACE_NORMALMAP in pre-r151
  #if defined( USE_NORMALMAP_OBJECTSPACE ) || defined( OBJECTSPACE_NORMALMAP )

    normal = texture2D( normalMap, normalMapUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals

    #ifdef FLIP_SIDED

      normal = - normal;

    #endif

    #ifdef DOUBLE_SIDED

      // Temporary compat against shader change @ Three.js r126
      // See: #21205, #21307, #21299
      #if THREE_VRM_THREE_REVISION >= 126

        normal = normal * faceDirection;

      #else

        normal = normal * ( float( gl_FrontFacing ) * 2.0 - 1.0 );

      #endif

    #endif

    normal = normalize( normalMatrix * normal );

  // COMPAT: USE_NORMALMAP_TANGENTSPACE used to be TANGENTSPACE_NORMALMAP in pre-r151
  #elif defined( USE_NORMALMAP_TANGENTSPACE ) || defined( TANGENTSPACE_NORMALMAP )

    vec3 mapN = texture2D( normalMap, normalMapUv ).xyz * 2.0 - 1.0;
    mapN.xy *= normalScale;

    // COMPAT: pre-r151
    #if THREE_VRM_THREE_REVISION >= 151 || defined( USE_TANGENT )

      normal = normalize( tbn * mapN );

    #else

      // pre-r126
      #if THREE_VRM_THREE_REVISION >= 126

        normal = perturbNormal2Arb( uv, -vViewPosition, normal, mapN, faceDirection );

      #else

        normal = perturbNormal2Arb( uv, -vViewPosition, normal, mapN );

      #endif

    #endif

  #endif

  // #include <emissivemap_fragment>
  #ifdef USE_EMISSIVEMAP
    vec2 emissiveMapUv = ( emissiveMapUvTransform * vec3( uv, 1 ) ).xy;
    totalEmissiveRadiance *= texture2D( emissiveMap, emissiveMapUv ).rgb;
  #endif

  #ifdef DEBUG_NORMAL
    gl_FragColor = vec4( 0.5 + 0.5 * normal, 1.0 );
    return;
  #endif

  // -- MToon: lighting --------------------------------------------------------
  // accumulation
  // #include <lights_phong_fragment>
  MToonMaterial material;

  material.diffuseColor = diffuseColor.rgb;

  material.shadeColor = shadeColorFactor;
  #ifdef USE_SHADEMULTIPLYTEXTURE
    vec2 shadeMultiplyTextureUv = ( shadeMultiplyTextureUvTransform * vec3( uv, 1 ) ).xy;
    material.shadeColor *= texture2D( shadeMultiplyTexture, shadeMultiplyTextureUv ).rgb;
  #endif

  #if ( defined( USE_COLOR ) && !defined( IGNORE_VERTEX_COLOR ) )
    material.shadeColor.rgb *= vColor;
  #endif

  material.shadingShift = shadingShiftFactor;
  #ifdef USE_SHADINGSHIFTTEXTURE
    vec2 shadingShiftTextureUv = ( shadingShiftTextureUvTransform * vec3( uv, 1 ) ).xy;
    material.shadingShift += texture2D( shadingShiftTexture, shadingShiftTextureUv ).r * shadingShiftTextureScale;
  #endif

  // #include <lights_fragment_begin>

  // MToon Specific changes:
  // Since we want to take shadows into account of shading instead of irradiance,
  // we had to modify the codes that multiplies the results of shadowmap into color of direct lights.

  // COMPAT: pre-r156 uses a struct GeometricContext
  #if THREE_VRM_THREE_REVISION >= 157
    vec3 geometryPosition = - vViewPosition;
    vec3 geometryNormal = normal;
    vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

    vec3 geometryClearcoatNormal;

    #ifdef USE_CLEARCOAT

      geometryClearcoatNormal = clearcoatNormal;

    #endif
  #else
    GeometricContext geometry;

    geometry.position = - vViewPosition;
    geometry.normal = normal;
    geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

    #ifdef USE_CLEARCOAT

      geometry.clearcoatNormal = clearcoatNormal;

    #endif
  #endif

  IncidentLight directLight;

  // since these variables will be used in unrolled loop, we have to define in prior
  float shadow;

  #if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

    PointLight pointLight;
    #if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
    PointLightShadow pointLightShadow;
    #endif

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

      pointLight = pointLights[ i ];

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        getPointLightInfo( pointLight, geometryPosition, directLight );
      #elif THREE_VRM_THREE_REVISION >= 132
        getPointLightInfo( pointLight, geometry, directLight );
      #else
        getPointDirectLightIrradiance( pointLight, geometry, directLight );
      #endif

      shadow = 1.0;
      #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
      pointLightShadow = pointLightShadows[ i ];
      shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
      #endif

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );
      #else
        RE_Direct( directLight, geometry, material, shadow, reflectedLight );
      #endif

    }
    #pragma unroll_loop_end

  #endif

  #if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

    SpotLight spotLight;
    #if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
    SpotLightShadow spotLightShadow;
    #endif

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

      spotLight = spotLights[ i ];

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        getSpotLightInfo( spotLight, geometryPosition, directLight );
      #elif THREE_VRM_THREE_REVISION >= 132
        getSpotLightInfo( spotLight, geometry, directLight );
      #else
        getSpotDirectLightIrradiance( spotLight, geometry, directLight );
      #endif

      shadow = 1.0;
      #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
      spotLightShadow = spotLightShadows[ i ];
      shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
      #endif

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );
      #else
        RE_Direct( directLight, geometry, material, shadow, reflectedLight );
      #endif

    }
    #pragma unroll_loop_end

  #endif

  #if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )

    DirectionalLight directionalLight;
    #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
    DirectionalLightShadow directionalLightShadow;
    #endif

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

      directionalLight = directionalLights[ i ];

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        getDirectionalLightInfo( directionalLight, directLight );
      #elif THREE_VRM_THREE_REVISION >= 132
        getDirectionalLightInfo( directionalLight, geometry, directLight );
      #else
        getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );
      #endif

      shadow = 1.0;
      #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
      directionalLightShadow = directionalLightShadows[ i ];
      shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
      #endif

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );
      #else
        RE_Direct( directLight, geometry, material, shadow, reflectedLight );
      #endif

    }
    #pragma unroll_loop_end

  #endif

  // #if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

  //   RectAreaLight rectAreaLight;

  //   #pragma unroll_loop_start
  //   for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

  //     rectAreaLight = rectAreaLights[ i ];
  //     RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );

  //   }
  //   #pragma unroll_loop_end

  // #endif

  #if defined( RE_IndirectDiffuse )

    vec3 iblIrradiance = vec3( 0.0 );

    vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

    // COMPAT: pre-r156 uses a struct GeometricContext
    // COMPAT: pre-r156 doesn't have a define USE_LIGHT_PROBES
    #if THREE_VRM_THREE_REVISION >= 157
      #if defined( USE_LIGHT_PROBES )
        irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
      #endif
    #elif THREE_VRM_THREE_REVISION >= 133
      irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );
    #else
      irradiance += getLightProbeIrradiance( lightProbe, geometry );
    #endif

    #if ( NUM_HEMI_LIGHTS > 0 )

      #pragma unroll_loop_start
      for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

        // COMPAT: pre-r156 uses a struct GeometricContext
        #if THREE_VRM_THREE_REVISION >= 157
          irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
        #elif THREE_VRM_THREE_REVISION >= 133
          irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );
        #else
          irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
        #endif

      }
      #pragma unroll_loop_end

    #endif

  #endif

  // #if defined( RE_IndirectSpecular )

  //   vec3 radiance = vec3( 0.0 );
  //   vec3 clearcoatRadiance = vec3( 0.0 );

  // #endif

  #include <lights_fragment_maps>
  #include <lights_fragment_end>

  // modulation
  #include <aomap_fragment>

  vec3 col = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;

  #ifdef DEBUG_LITSHADERATE
    gl_FragColor = vec4( col, diffuseColor.a );
    postCorrection();
    return;
  #endif

  // -- MToon: rim lighting -----------------------------------------
  vec3 viewDir = normalize( vViewPosition );

  #ifndef PHYSICALLY_CORRECT_LIGHTS
    reflectedLight.directSpecular /= PI;
  #endif
  vec3 rimMix = mix( vec3( 1.0 ), reflectedLight.directSpecular, 1.0 );

  vec3 rim = parametricRimColorFactor * pow( saturate( 1.0 - dot( viewDir, normal ) + parametricRimLiftFactor ), parametricRimFresnelPowerFactor );

  #ifdef USE_MATCAPTEXTURE
    {
      vec3 x = normalize( vec3( viewDir.z, 0.0, -viewDir.x ) );
      vec3 y = cross( viewDir, x ); // guaranteed to be normalized
      vec2 sphereUv = 0.5 + 0.5 * vec2( dot( x, normal ), -dot( y, normal ) );
      sphereUv = ( matcapTextureUvTransform * vec3( sphereUv, 1 ) ).xy;
      vec3 matcap = texture2D( matcapTexture, sphereUv ).rgb;
      rim += matcapFactor * matcap;
    }
  #endif

  #ifdef USE_RIMMULTIPLYTEXTURE
    vec2 rimMultiplyTextureUv = ( rimMultiplyTextureUvTransform * vec3( uv, 1 ) ).xy;
    rim *= texture2D( rimMultiplyTexture, rimMultiplyTextureUv ).rgb;
  #endif

  col += rimMix * rim;

  // -- MToon: Emission --------------------------------------------------------
  col += totalEmissiveRadiance;

  // #include <envmap_fragment>

  // -- Almost done! -----------------------------------------------------------
  #if defined( OUTLINE )
    col = outlineColorFactor.rgb * mix( vec3( 1.0 ), col, outlineLightingMixFactor );
  #endif

  #ifdef OPAQUE
    diffuseColor.a = 1.0;
  #endif

  gl_FragColor = vec4( col, diffuseColor.a );
  postCorrection();
}
`;const Pi={None:"none",Normal:"normal",LitShadeRate:"litShadeRate",UV:"uv"},tt={None:"none",WorldCoordinates:"worldCoordinates",ScreenCoordinates:"screenCoordinates"},Li={3e3:"",3001:"srgb"};function nt(d){return parseInt(k,10)>=152?d.colorSpace:Li[d.encoding]}class it extends Xn{get color(){return this.uniforms.litFactor.value}set color(e){this.uniforms.litFactor.value=e}get map(){return this.uniforms.map.value}set map(e){this.uniforms.map.value=e}get normalMap(){return this.uniforms.normalMap.value}set normalMap(e){this.uniforms.normalMap.value=e}get normalScale(){return this.uniforms.normalScale.value}set normalScale(e){this.uniforms.normalScale.value=e}get emissive(){return this.uniforms.emissive.value}set emissive(e){this.uniforms.emissive.value=e}get emissiveIntensity(){return this.uniforms.emissiveIntensity.value}set emissiveIntensity(e){this.uniforms.emissiveIntensity.value=e}get emissiveMap(){return this.uniforms.emissiveMap.value}set emissiveMap(e){this.uniforms.emissiveMap.value=e}get shadeColorFactor(){return this.uniforms.shadeColorFactor.value}set shadeColorFactor(e){this.uniforms.shadeColorFactor.value=e}get shadeMultiplyTexture(){return this.uniforms.shadeMultiplyTexture.value}set shadeMultiplyTexture(e){this.uniforms.shadeMultiplyTexture.value=e}get shadingShiftFactor(){return this.uniforms.shadingShiftFactor.value}set shadingShiftFactor(e){this.uniforms.shadingShiftFactor.value=e}get shadingShiftTexture(){return this.uniforms.shadingShiftTexture.value}set shadingShiftTexture(e){this.uniforms.shadingShiftTexture.value=e}get shadingShiftTextureScale(){return this.uniforms.shadingShiftTextureScale.value}set shadingShiftTextureScale(e){this.uniforms.shadingShiftTextureScale.value=e}get shadingToonyFactor(){return this.uniforms.shadingToonyFactor.value}set shadingToonyFactor(e){this.uniforms.shadingToonyFactor.value=e}get giEqualizationFactor(){return this.uniforms.giEqualizationFactor.value}set giEqualizationFactor(e){this.uniforms.giEqualizationFactor.value=e}get matcapFactor(){return this.uniforms.matcapFactor.value}set matcapFactor(e){this.uniforms.matcapFactor.value=e}get matcapTexture(){return this.uniforms.matcapTexture.value}set matcapTexture(e){this.uniforms.matcapTexture.value=e}get parametricRimColorFactor(){return this.uniforms.parametricRimColorFactor.value}set parametricRimColorFactor(e){this.uniforms.parametricRimColorFactor.value=e}get rimMultiplyTexture(){return this.uniforms.rimMultiplyTexture.value}set rimMultiplyTexture(e){this.uniforms.rimMultiplyTexture.value=e}get rimLightingMixFactor(){return this.uniforms.rimLightingMixFactor.value}set rimLightingMixFactor(e){this.uniforms.rimLightingMixFactor.value=e}get parametricRimFresnelPowerFactor(){return this.uniforms.parametricRimFresnelPowerFactor.value}set parametricRimFresnelPowerFactor(e){this.uniforms.parametricRimFresnelPowerFactor.value=e}get parametricRimLiftFactor(){return this.uniforms.parametricRimLiftFactor.value}set parametricRimLiftFactor(e){this.uniforms.parametricRimLiftFactor.value=e}get outlineWidthMultiplyTexture(){return this.uniforms.outlineWidthMultiplyTexture.value}set outlineWidthMultiplyTexture(e){this.uniforms.outlineWidthMultiplyTexture.value=e}get outlineWidthFactor(){return this.uniforms.outlineWidthFactor.value}set outlineWidthFactor(e){this.uniforms.outlineWidthFactor.value=e}get outlineColorFactor(){return this.uniforms.outlineColorFactor.value}set outlineColorFactor(e){this.uniforms.outlineColorFactor.value=e}get outlineLightingMixFactor(){return this.uniforms.outlineLightingMixFactor.value}set outlineLightingMixFactor(e){this.uniforms.outlineLightingMixFactor.value=e}get uvAnimationMaskTexture(){return this.uniforms.uvAnimationMaskTexture.value}set uvAnimationMaskTexture(e){this.uniforms.uvAnimationMaskTexture.value=e}get uvAnimationScrollXOffset(){return this.uniforms.uvAnimationScrollXOffset.value}set uvAnimationScrollXOffset(e){this.uniforms.uvAnimationScrollXOffset.value=e}get uvAnimationScrollYOffset(){return this.uniforms.uvAnimationScrollYOffset.value}set uvAnimationScrollYOffset(e){this.uniforms.uvAnimationScrollYOffset.value=e}get uvAnimationRotationPhase(){return this.uniforms.uvAnimationRotationPhase.value}set uvAnimationRotationPhase(e){this.uniforms.uvAnimationRotationPhase.value=e}get ignoreVertexColor(){return this._ignoreVertexColor}set ignoreVertexColor(e){this._ignoreVertexColor=e,this.needsUpdate=!0}get v0CompatShade(){return this._v0CompatShade}set v0CompatShade(e){this._v0CompatShade=e,this.needsUpdate=!0}get debugMode(){return this._debugMode}set debugMode(e){this._debugMode=e,this.needsUpdate=!0}get outlineWidthMode(){return this._outlineWidthMode}set outlineWidthMode(e){this._outlineWidthMode=e,this.needsUpdate=!0}get isOutline(){return this._isOutline}set isOutline(e){this._isOutline=e,this.needsUpdate=!0}get isMToonMaterial(){return!0}constructor(e={}){var t;super({vertexShader:Si,fragmentShader:Ai}),this.uvAnimationScrollXSpeedFactor=0,this.uvAnimationScrollYSpeedFactor=0,this.uvAnimationRotationSpeedFactor=0,this.fog=!0,this.normalMapType=Gn,this._ignoreVertexColor=!0,this._v0CompatShade=!1,this._debugMode=Pi.None,this._outlineWidthMode=tt.None,this._isOutline=!1,e.transparentWithZWrite&&(e.depthWrite=!0),delete e.transparentWithZWrite,e.fog=!0,e.lights=!0,e.clipping=!0,parseInt(k,10)<129&&(e.skinning=e.skinning||!1),parseInt(k,10)<131&&(e.morphTargets=e.morphTargets||!1,e.morphNormals=e.morphNormals||!1),this.uniforms=Yn.merge([oe.common,oe.normalmap,oe.emissivemap,oe.fog,oe.lights,{litFactor:{value:new N(1,1,1)},mapUvTransform:{value:new F},colorAlpha:{value:1},normalMapUvTransform:{value:new F},shadeColorFactor:{value:new N(.97,.81,.86)},shadeMultiplyTexture:{value:null},shadeMultiplyTextureUvTransform:{value:new F},shadingShiftFactor:{value:0},shadingShiftTexture:{value:null},shadingShiftTextureUvTransform:{value:new F},shadingShiftTextureScale:{value:1},shadingToonyFactor:{value:.9},giEqualizationFactor:{value:.9},matcapFactor:{value:new N(0,0,0)},matcapTexture:{value:null},matcapTextureUvTransform:{value:new F},parametricRimColorFactor:{value:new N(0,0,0)},rimMultiplyTexture:{value:null},rimMultiplyTextureUvTransform:{value:new F},rimLightingMixFactor:{value:0},parametricRimFresnelPowerFactor:{value:1},parametricRimLiftFactor:{value:0},emissive:{value:new N(0,0,0)},emissiveIntensity:{value:1},emissiveMapUvTransform:{value:new F},outlineWidthMultiplyTexture:{value:null},outlineWidthMultiplyTextureUvTransform:{value:new F},outlineWidthFactor:{value:.5},outlineColorFactor:{value:new N(0,0,0)},outlineLightingMixFactor:{value:1},uvAnimationMaskTexture:{value:null},uvAnimationMaskTextureUvTransform:{value:new F},uvAnimationScrollXOffset:{value:0},uvAnimationScrollYOffset:{value:0},uvAnimationRotationPhase:{value:0}},(t=e.uniforms)!==null&&t!==void 0?t:{}]),this.setValues(e),this._uploadUniformsWorkaround(),this.customProgramCacheKey=()=>[...Object.entries(this._generateDefines()).map(([n,i])=>`${n}:${i}`),this.matcapTexture?`matcapTextureColorSpace:${nt(this.matcapTexture)}`:"",this.shadeMultiplyTexture?`shadeMultiplyTextureColorSpace:${nt(this.shadeMultiplyTexture)}`:"",this.rimMultiplyTexture?`rimMultiplyTextureColorSpace:${nt(this.rimMultiplyTexture)}`:""].join(","),this.onBeforeCompile=n=>{const i=parseInt(k,10),r=Object.entries(Object.assign(Object.assign({},this._generateDefines()),this.defines)).filter(([o,s])=>!!s).map(([o,s])=>`#define ${o} ${s}`).join(`
`)+`
`;n.vertexShader=r+n.vertexShader,n.fragmentShader=r+n.fragmentShader,i<154&&(n.fragmentShader=n.fragmentShader.replace("#include <colorspace_fragment>","#include <encodings_fragment>")),i<132&&(n.fragmentShader=n.fragmentShader.replace("#include <normal_pars_fragment>",""),n.fragmentShader=n.fragmentShader.replace("#include <alphatest_pars_fragment>",""))}}update(e){this._uploadUniformsWorkaround(),this._updateUVAnimation(e)}copy(e){return super.copy(e),this.map=e.map,this.normalMap=e.normalMap,this.emissiveMap=e.emissiveMap,this.shadeMultiplyTexture=e.shadeMultiplyTexture,this.shadingShiftTexture=e.shadingShiftTexture,this.matcapTexture=e.matcapTexture,this.rimMultiplyTexture=e.rimMultiplyTexture,this.outlineWidthMultiplyTexture=e.outlineWidthMultiplyTexture,this.uvAnimationMaskTexture=e.uvAnimationMaskTexture,this.normalMapType=e.normalMapType,this.uvAnimationScrollXSpeedFactor=e.uvAnimationScrollXSpeedFactor,this.uvAnimationScrollYSpeedFactor=e.uvAnimationScrollYSpeedFactor,this.uvAnimationRotationSpeedFactor=e.uvAnimationRotationSpeedFactor,this.ignoreVertexColor=e.ignoreVertexColor,this.v0CompatShade=e.v0CompatShade,this.debugMode=e.debugMode,this.outlineWidthMode=e.outlineWidthMode,this.isOutline=e.isOutline,this.needsUpdate=!0,this}_updateUVAnimation(e){this.uniforms.uvAnimationScrollXOffset.value+=e*this.uvAnimationScrollXSpeedFactor,this.uniforms.uvAnimationScrollYOffset.value+=e*this.uvAnimationScrollYSpeedFactor,this.uniforms.uvAnimationRotationPhase.value+=e*this.uvAnimationRotationSpeedFactor,this.uniformsNeedUpdate=!0}_uploadUniformsWorkaround(){this.uniforms.opacity.value=this.opacity,this._updateTextureMatrix(this.uniforms.map,this.uniforms.mapUvTransform),this._updateTextureMatrix(this.uniforms.normalMap,this.uniforms.normalMapUvTransform),this._updateTextureMatrix(this.uniforms.emissiveMap,this.uniforms.emissiveMapUvTransform),this._updateTextureMatrix(this.uniforms.shadeMultiplyTexture,this.uniforms.shadeMultiplyTextureUvTransform),this._updateTextureMatrix(this.uniforms.shadingShiftTexture,this.uniforms.shadingShiftTextureUvTransform),this._updateTextureMatrix(this.uniforms.matcapTexture,this.uniforms.matcapTextureUvTransform),this._updateTextureMatrix(this.uniforms.rimMultiplyTexture,this.uniforms.rimMultiplyTextureUvTransform),this._updateTextureMatrix(this.uniforms.outlineWidthMultiplyTexture,this.uniforms.outlineWidthMultiplyTextureUvTransform),this._updateTextureMatrix(this.uniforms.uvAnimationMaskTexture,this.uniforms.uvAnimationMaskTextureUvTransform),parseInt(k,10)>=132&&(this.uniforms.alphaTest.value=this.alphaTest),this.uniformsNeedUpdate=!0}_generateDefines(){const e=parseInt(k,10),t=this.outlineWidthMultiplyTexture!==null,n=this.map!==null||this.emissiveMap!==null||this.shadeMultiplyTexture!==null||this.shadingShiftTexture!==null||this.rimMultiplyTexture!==null||this.uvAnimationMaskTexture!==null;return{THREE_VRM_THREE_REVISION:e,OUTLINE:this._isOutline,MTOON_USE_UV:t||n,MTOON_UVS_VERTEX_ONLY:t&&!n,V0_COMPAT_SHADE:this._v0CompatShade,USE_SHADEMULTIPLYTEXTURE:this.shadeMultiplyTexture!==null,USE_SHADINGSHIFTTEXTURE:this.shadingShiftTexture!==null,USE_MATCAPTEXTURE:this.matcapTexture!==null,USE_RIMMULTIPLYTEXTURE:this.rimMultiplyTexture!==null,USE_OUTLINEWIDTHMULTIPLYTEXTURE:this._isOutline&&this.outlineWidthMultiplyTexture!==null,USE_UVANIMATIONMASKTEXTURE:this.uvAnimationMaskTexture!==null,IGNORE_VERTEX_COLOR:this._ignoreVertexColor===!0,DEBUG_NORMAL:this._debugMode==="normal",DEBUG_LITSHADERATE:this._debugMode==="litShadeRate",DEBUG_UV:this._debugMode==="uv",OUTLINE_WIDTH_WORLD:this._isOutline&&this._outlineWidthMode===tt.WorldCoordinates,OUTLINE_WIDTH_SCREEN:this._isOutline&&this._outlineWidthMode===tt.ScreenCoordinates}}_updateTextureMatrix(e,t){e.value&&(e.value.matrixAutoUpdate&&e.value.updateMatrix(),t.value.copy(e.value.matrix))}}const Ii={"":3e3,srgb:3001};function bi(d,e){parseInt(k,10)>=152?d.colorSpace=e:d.encoding=Ii[e]}class Ui{get pending(){return Promise.all(this._pendings)}constructor(e,t){this._parser=e,this._materialParams=t,this._pendings=[]}assignPrimitive(e,t){t!=null&&(this._materialParams[e]=t)}assignColor(e,t,n){t!=null&&(this._materialParams[e]=new N().fromArray(t),n&&this._materialParams[e].convertSRGBToLinear())}assignTexture(e,t,n){return G(this,void 0,void 0,function*(){const i=G(this,void 0,void 0,function*(){t!=null&&(yield this._parser.assignTexture(this._materialParams,e,t),n&&bi(this._materialParams[e],"srgb"))});return this._pendings.push(i),i})}assignTextureByIndex(e,t,n){return G(this,void 0,void 0,function*(){return this.assignTexture(e,t!=null?{index:t}:void 0,n)})}}const Oi=new Set(["1.0","1.0-beta"]);class ie{get name(){return ie.EXTENSION_NAME}constructor(e,t={}){var n,i,r;this.parser=e,this.renderOrderOffset=(n=t.renderOrderOffset)!==null&&n!==void 0?n:0,this.v0CompatShade=(i=t.v0CompatShade)!==null&&i!==void 0?i:!1,this.debugMode=(r=t.debugMode)!==null&&r!==void 0?r:"none",this._mToonMaterialSet=new Set}beforeRoot(){return G(this,void 0,void 0,function*(){this._removeUnlitExtensionIfMToonExists()})}afterRoot(e){return G(this,void 0,void 0,function*(){e.userData.vrmMToonMaterials=Array.from(this._mToonMaterialSet)})}getMaterialType(e){return this._getMToonExtension(e)?it:null}extendMaterialParams(e,t){const n=this._getMToonExtension(e);return n?this._extendMaterialParams(n,t):null}loadMesh(e){var t;return G(this,void 0,void 0,function*(){const n=this.parser,r=(t=n.json.meshes)===null||t===void 0?void 0:t[e];if(r==null)throw new Error(`MToonMaterialLoaderPlugin: Attempt to use meshes[${e}] of glTF but the mesh doesn't exist`);const o=r.primitives,s=yield n.loadMesh(e);if(o.length===1){const l=s,a=o[0].material;a!=null&&this._setupPrimitive(l,a)}else{const l=s;for(let a=0;a<o.length;a++){const u=l.children[a],c=o[a].material;c!=null&&this._setupPrimitive(u,c)}}return s})}_removeUnlitExtensionIfMToonExists(){const n=this.parser.json.materials;n?.map((i,r)=>{var o;this._getMToonExtension(r)&&(!((o=i.extensions)===null||o===void 0)&&o.KHR_materials_unlit)&&delete i.extensions.KHR_materials_unlit})}_getMToonExtension(e){var t,n;const o=(t=this.parser.json.materials)===null||t===void 0?void 0:t[e];if(o==null){console.warn(`MToonMaterialLoaderPlugin: Attempt to use materials[${e}] of glTF but the material doesn't exist`);return}const s=(n=o.extensions)===null||n===void 0?void 0:n[ie.EXTENSION_NAME];if(s==null)return;const l=s.specVersion;if(!Oi.has(l)){console.warn(`MToonMaterialLoaderPlugin: Unknown ${ie.EXTENSION_NAME} specVersion "${l}"`);return}return s}_extendMaterialParams(e,t){var n;return G(this,void 0,void 0,function*(){delete t.metalness,delete t.roughness;const i=new Ui(this.parser,t);i.assignPrimitive("transparentWithZWrite",e.transparentWithZWrite),i.assignColor("shadeColorFactor",e.shadeColorFactor),i.assignTexture("shadeMultiplyTexture",e.shadeMultiplyTexture,!0),i.assignPrimitive("shadingShiftFactor",e.shadingShiftFactor),i.assignTexture("shadingShiftTexture",e.shadingShiftTexture,!0),i.assignPrimitive("shadingShiftTextureScale",(n=e.shadingShiftTexture)===null||n===void 0?void 0:n.scale),i.assignPrimitive("shadingToonyFactor",e.shadingToonyFactor),i.assignPrimitive("giEqualizationFactor",e.giEqualizationFactor),i.assignColor("matcapFactor",e.matcapFactor),i.assignTexture("matcapTexture",e.matcapTexture,!0),i.assignColor("parametricRimColorFactor",e.parametricRimColorFactor),i.assignTexture("rimMultiplyTexture",e.rimMultiplyTexture,!0),i.assignPrimitive("rimLightingMixFactor",e.rimLightingMixFactor),i.assignPrimitive("parametricRimFresnelPowerFactor",e.parametricRimFresnelPowerFactor),i.assignPrimitive("parametricRimLiftFactor",e.parametricRimLiftFactor),i.assignPrimitive("outlineWidthMode",e.outlineWidthMode),i.assignPrimitive("outlineWidthFactor",e.outlineWidthFactor),i.assignTexture("outlineWidthMultiplyTexture",e.outlineWidthMultiplyTexture,!1),i.assignColor("outlineColorFactor",e.outlineColorFactor),i.assignPrimitive("outlineLightingMixFactor",e.outlineLightingMixFactor),i.assignTexture("uvAnimationMaskTexture",e.uvAnimationMaskTexture,!1),i.assignPrimitive("uvAnimationScrollXSpeedFactor",e.uvAnimationScrollXSpeedFactor),i.assignPrimitive("uvAnimationScrollYSpeedFactor",e.uvAnimationScrollYSpeedFactor),i.assignPrimitive("uvAnimationRotationSpeedFactor",e.uvAnimationRotationSpeedFactor),i.assignPrimitive("v0CompatShade",this.v0CompatShade),i.assignPrimitive("debugMode",this.debugMode),yield i.pending})}_setupPrimitive(e,t){const n=this._getMToonExtension(t);if(n){const i=this._parseRenderOrder(n);e.renderOrder=i+this.renderOrderOffset,this._generateOutline(e),this._addToMaterialSet(e);return}}_generateOutline(e){const t=e.material;if(!(t instanceof it)||t.outlineWidthMode==="none"||t.outlineWidthFactor<=0)return;e.material=[t];const n=t.clone();n.name+=" (Outline)",n.isOutline=!0,n.side=Qn,e.material.push(n);const i=e.geometry,r=i.index?i.index.count:i.attributes.position.count/3;i.addGroup(0,r,0),i.addGroup(0,r,1)}_addToMaterialSet(e){const t=e.material,n=new Set;Array.isArray(t)?t.forEach(i=>n.add(i)):n.add(t);for(const i of n)i instanceof it&&this._mToonMaterialSet.add(i)}_parseRenderOrder(e){var t;return(e.transparentWithZWrite?0:19)+((t=e.renderQueueOffsetNumber)!==null&&t!==void 0?t:0)}}ie.EXTENSION_NAME="VRMC_materials_mtoon";/*!
 * @pixiv/three-vrm-materials-hdr-emissive-multiplier v2.1.1
 * Support VRMC_hdr_emissiveMultiplier for @pixiv/three-vrm
 *
 * Copyright (c) 2020-2024 pixiv Inc.
 * @pixiv/three-vrm-materials-hdr-emissive-multiplier is distributed under MIT License
 * https://github.com/pixiv/three-vrm/blob/release/LICENSE
 */function Ni(d,e,t,n){function i(r){return r instanceof t?r:new t(function(o){o(r)})}return new(t||(t=Promise))(function(r,o){function s(u){try{a(n.next(u))}catch(c){o(c)}}function l(u){try{a(n.throw(u))}catch(c){o(c)}}function a(u){u.done?r(u.value):i(u.value).then(s,l)}a((n=n.apply(d,e||[])).next())})}class fe{get name(){return fe.EXTENSION_NAME}constructor(e){this.parser=e}extendMaterialParams(e,t){return Ni(this,void 0,void 0,function*(){const n=this._getHDREmissiveMultiplierExtension(e);if(n==null)return;console.warn("VRMMaterialsHDREmissiveMultiplierLoaderPlugin: `VRMC_materials_hdr_emissiveMultiplier` is archived. Use `KHR_materials_emissive_strength` instead.");const i=n.emissiveMultiplier;t.emissiveIntensity=i})}_getHDREmissiveMultiplierExtension(e){var t,n;const o=(t=this.parser.json.materials)===null||t===void 0?void 0:t[e];if(o==null){console.warn(`VRMMaterialsHDREmissiveMultiplierLoaderPlugin: Attempt to use materials[${e}] of glTF but the material doesn't exist`);return}const s=(n=o.extensions)===null||n===void 0?void 0:n[fe.EXTENSION_NAME];if(s!=null)return s}}fe.EXTENSION_NAME="VRMC_materials_hdr_emissiveMultiplier";/*!
 * @pixiv/three-vrm-materials-v0compat v2.1.1
 * VRM0.0 materials compatibility layer plugin for @pixiv/three-vrm
 *
 * Copyright (c) 2020-2024 pixiv Inc.
 * @pixiv/three-vrm-materials-v0compat is distributed under MIT License
 * https://github.com/pixiv/three-vrm/blob/release/LICENSE
 */function Ci(d,e,t,n){function i(r){return r instanceof t?r:new t(function(o){o(r)})}return new(t||(t=Promise))(function(r,o){function s(u){try{a(n.next(u))}catch(c){o(c)}}function l(u){try{a(n.throw(u))}catch(c){o(c)}}function a(u){u.done?r(u.value):i(u.value).then(s,l)}a((n=n.apply(d,e||[])).next())})}function ee(d){return Math.pow(d,2.2)}class Vi{get name(){return"VRMMaterialsV0CompatPlugin"}constructor(e){var t;this.parser=e,this._renderQueueMapTransparent=new Map,this._renderQueueMapTransparentZWrite=new Map;const n=this.parser.json;n.extensionsUsed=(t=n.extensionsUsed)!==null&&t!==void 0?t:[],n.extensionsUsed.indexOf("KHR_texture_transform")===-1&&n.extensionsUsed.push("KHR_texture_transform")}beforeRoot(){var e;return Ci(this,void 0,void 0,function*(){const t=this.parser.json,n=(e=t.extensions)===null||e===void 0?void 0:e.VRM,i=n?.materialProperties;i&&(this._populateRenderQueueMap(i),i.forEach((r,o)=>{var s,l;const a=(s=t.materials)===null||s===void 0?void 0:s[o];if(a==null){console.warn(`VRMMaterialsV0CompatPlugin: Attempt to use materials[${o}] of glTF but the material doesn't exist`);return}if(r.shader==="VRM/MToon"){const u=this._parseV0MToonProperties(r,a);t.materials[o]=u}else if(!((l=r.shader)===null||l===void 0)&&l.startsWith("VRM/Unlit")){const u=this._parseV0UnlitProperties(r,a);t.materials[o]=u}else r.shader==="VRM_USE_GLTFSHADER"||console.warn(`VRMMaterialsV0CompatPlugin: Unknown shader: ${r.shader}`)}))})}_parseV0MToonProperties(e,t){var n,i,r,o,s,l,a,u,c,f,h,v,p,_,m,R,T,M,x,E,y,I,A,P,b,H,J,Ue,Oe,Ne,Ce,Ve,De,Fe,Be,He,We,ke,ze,je,$e,qe,Xe,Ge;const ft=(i=(n=e.keywordMap)===null||n===void 0?void 0:n._ALPHABLEND_ON)!==null&&i!==void 0?i:!1,mn=((r=e.floatProperties)===null||r===void 0?void 0:r._ZWrite)===1&&ft,vn=this._v0ParseRenderQueue(e),pt=(s=(o=e.keywordMap)===null||o===void 0?void 0:o._ALPHATEST_ON)!==null&&s!==void 0?s:!1,_n=ft?"BLEND":pt?"MASK":"OPAQUE",gn=pt?(l=e.floatProperties)===null||l===void 0?void 0:l._Cutoff:void 0,Mn=((u=(a=e.floatProperties)===null||a===void 0?void 0:a._CullMode)!==null&&u!==void 0?u:2)===0,j=this._portTextureTransform(e),xn=(f=(c=e.vectorProperties)===null||c===void 0?void 0:c._Color)===null||f===void 0?void 0:f.map((Tt,jn)=>jn===3?Tt:ee(Tt)),mt=(h=e.textureProperties)===null||h===void 0?void 0:h._MainTex,yn=mt!=null?{index:mt,extensions:Object.assign({},j)}:void 0,Rn=(v=e.floatProperties)===null||v===void 0?void 0:v._BumpScale,vt=(p=e.textureProperties)===null||p===void 0?void 0:p._BumpMap,Tn=vt!=null?{index:vt,scale:Rn,extensions:Object.assign({},j)}:void 0,En=(m=(_=e.vectorProperties)===null||_===void 0?void 0:_._EmissionColor)===null||m===void 0?void 0:m.map(ee),_t=(R=e.textureProperties)===null||R===void 0?void 0:R._EmissionMap,wn=_t!=null?{index:_t,extensions:Object.assign({},j)}:void 0,Sn=(M=(T=e.vectorProperties)===null||T===void 0?void 0:T._ShadeColor)===null||M===void 0?void 0:M.map(ee),gt=(x=e.textureProperties)===null||x===void 0?void 0:x._ShadeTexture,An=gt!=null?{index:gt,extensions:Object.assign({},j)}:void 0;let me=(y=(E=e.floatProperties)===null||E===void 0?void 0:E._ShadeShift)!==null&&y!==void 0?y:0,ve=(A=(I=e.floatProperties)===null||I===void 0?void 0:I._ShadeToony)!==null&&A!==void 0?A:.9;ve=L.lerp(ve,1,.5+.5*me),me=-me-(1-ve);const Mt=(P=e.floatProperties)===null||P===void 0?void 0:P._IndirectLightIntensity,Pn=Mt?1-Mt:void 0,Ye=(b=e.textureProperties)===null||b===void 0?void 0:b._SphereAdd,Ln=Ye!=null?[1,1,1]:void 0,In=Ye!=null?{index:Ye}:void 0,bn=(H=e.floatProperties)===null||H===void 0?void 0:H._RimLightingMix,xt=(J=e.textureProperties)===null||J===void 0?void 0:J._RimTexture,Un=xt!=null?{index:xt,extensions:Object.assign({},j)}:void 0,On=(Oe=(Ue=e.vectorProperties)===null||Ue===void 0?void 0:Ue._RimColor)===null||Oe===void 0?void 0:Oe.map(ee),Nn=(Ne=e.floatProperties)===null||Ne===void 0?void 0:Ne._RimFresnelPower,Cn=(Ce=e.floatProperties)===null||Ce===void 0?void 0:Ce._RimLift,Vn=["none","worldCoordinates","screenCoordinates"][(De=(Ve=e.floatProperties)===null||Ve===void 0?void 0:Ve._OutlineWidthMode)!==null&&De!==void 0?De:0];let Qe=(Be=(Fe=e.floatProperties)===null||Fe===void 0?void 0:Fe._OutlineWidth)!==null&&Be!==void 0?Be:0;Qe=.01*Qe;const yt=(He=e.textureProperties)===null||He===void 0?void 0:He._OutlineWidthTexture,Dn=yt!=null?{index:yt,extensions:Object.assign({},j)}:void 0,Fn=(ke=(We=e.vectorProperties)===null||We===void 0?void 0:We._OutlineColor)===null||ke===void 0?void 0:ke.map(ee),Bn=((ze=e.floatProperties)===null||ze===void 0?void 0:ze._OutlineColorMode)===1?(je=e.floatProperties)===null||je===void 0?void 0:je._OutlineLightingMix:0,Rt=($e=e.textureProperties)===null||$e===void 0?void 0:$e._UvAnimMaskTexture,Hn=Rt!=null?{index:Rt,extensions:Object.assign({},j)}:void 0,Wn=(qe=e.floatProperties)===null||qe===void 0?void 0:qe._UvAnimScrollX;let _e=(Xe=e.floatProperties)===null||Xe===void 0?void 0:Xe._UvAnimScrollY;_e!=null&&(_e=-_e);const kn=(Ge=e.floatProperties)===null||Ge===void 0?void 0:Ge._UvAnimRotation,zn={specVersion:"1.0",transparentWithZWrite:mn,renderQueueOffsetNumber:vn,shadeColorFactor:Sn,shadeMultiplyTexture:An,shadingShiftFactor:me,shadingToonyFactor:ve,giEqualizationFactor:Pn,matcapFactor:Ln,matcapTexture:In,rimLightingMixFactor:bn,rimMultiplyTexture:Un,parametricRimColorFactor:On,parametricRimFresnelPowerFactor:Nn,parametricRimLiftFactor:Cn,outlineWidthMode:Vn,outlineWidthFactor:Qe,outlineWidthMultiplyTexture:Dn,outlineColorFactor:Fn,outlineLightingMixFactor:Bn,uvAnimationMaskTexture:Hn,uvAnimationScrollXSpeedFactor:Wn,uvAnimationScrollYSpeedFactor:_e,uvAnimationRotationSpeedFactor:kn};return Object.assign(Object.assign({},t),{pbrMetallicRoughness:{baseColorFactor:xn,baseColorTexture:yn},normalTexture:Tn,emissiveTexture:wn,emissiveFactor:En,alphaMode:_n,alphaCutoff:gn,doubleSided:Mn,extensions:{VRMC_materials_mtoon:zn}})}_parseV0UnlitProperties(e,t){var n,i,r,o;const s=e.shader==="VRM/UnlitTransparentZWrite",l=e.shader==="VRM/UnlitTransparent"||s,a=this._v0ParseRenderQueue(e),u=e.shader==="VRM/UnlitCutout",c=l?"BLEND":u?"MASK":"OPAQUE",f=u?(n=e.floatProperties)===null||n===void 0?void 0:n._Cutoff:void 0,h=this._portTextureTransform(e),v=(r=(i=e.vectorProperties)===null||i===void 0?void 0:i._Color)===null||r===void 0?void 0:r.map(ee),p=(o=e.textureProperties)===null||o===void 0?void 0:o._MainTex,_=p!=null?{index:p,extensions:Object.assign({},h)}:void 0,m={specVersion:"1.0",transparentWithZWrite:s,renderQueueOffsetNumber:a,shadeColorFactor:v,shadeMultiplyTexture:_};return Object.assign(Object.assign({},t),{pbrMetallicRoughness:{baseColorFactor:v,baseColorTexture:_},alphaMode:c,alphaCutoff:f,extensions:{VRMC_materials_mtoon:m}})}_portTextureTransform(e){var t,n,i,r,o;const s=(t=e.vectorProperties)===null||t===void 0?void 0:t._MainTex;if(s==null)return{};const l=[(n=s?.[0])!==null&&n!==void 0?n:0,(i=s?.[1])!==null&&i!==void 0?i:0],a=[(r=s?.[2])!==null&&r!==void 0?r:1,(o=s?.[3])!==null&&o!==void 0?o:1];return l[1]=1-a[1]-l[1],{KHR_texture_transform:{offset:l,scale:a}}}_v0ParseRenderQueue(e){var t,n,i;const r=(n=(t=e.keywordMap)===null||t===void 0?void 0:t._ALPHABLEND_ON)!==null&&n!==void 0?n:!1,o=((i=e.floatProperties)===null||i===void 0?void 0:i._ZWrite)===1;let s=0;if(r){const l=e.renderQueue;l!=null&&(o?s=this._renderQueueMapTransparentZWrite.get(l):s=this._renderQueueMapTransparent.get(l))}return s}_populateRenderQueueMap(e){const t=new Set,n=new Set;e.forEach(i=>{var r,o,s;const l=(o=(r=i.keywordMap)===null||r===void 0?void 0:r._ALPHABLEND_ON)!==null&&o!==void 0?o:!1,a=((s=i.floatProperties)===null||s===void 0?void 0:s._ZWrite)===1;if(l){const u=i.renderQueue;u!=null&&(a?n.add(u):t.add(u))}}),t.size>10&&console.warn(`VRMMaterialsV0CompatPlugin: This VRM uses ${t.size} render queues for Transparent materials while VRM 1.0 only supports up to 10 render queues. The model might not be rendered correctly.`),n.size>10&&console.warn(`VRMMaterialsV0CompatPlugin: This VRM uses ${n.size} render queues for TransparentZWrite materials while VRM 1.0 only supports up to 10 render queues. The model might not be rendered correctly.`),Array.from(t).sort().forEach((i,r)=>{const o=Math.min(Math.max(r-t.size+1,-9),0);this._renderQueueMapTransparent.set(i,o)}),Array.from(n).sort().forEach((i,r)=>{const o=Math.min(Math.max(r,0),9);this._renderQueueMapTransparentZWrite.set(i,o)})}}/*!
 * @pixiv/three-vrm-node-constraint v2.1.1
 * Node constraint module for @pixiv/three-vrm
 *
 * Copyright (c) 2020-2024 pixiv Inc.
 * @pixiv/three-vrm-node-constraint is distributed under MIT License
 * https://github.com/pixiv/three-vrm/blob/release/LICENSE
 */const W=new g;class rt extends re{constructor(e){super(),this._attrPosition=new U(new Float32Array([0,0,0,0,0,0]),3),this._attrPosition.setUsage(Zn);const t=new Z;t.setAttribute("position",this._attrPosition);const n=new Le({color:16711935,depthTest:!1,depthWrite:!1});this._line=new Jn(t,n),this.add(this._line),this.constraint=e}updateMatrixWorld(e){W.setFromMatrixPosition(this.constraint.destination.matrixWorld),this._attrPosition.setXYZ(0,W.x,W.y,W.z),this.constraint.source&&W.setFromMatrixPosition(this.constraint.source.matrixWorld),this._attrPosition.setXYZ(1,W.x,W.y,W.z),this._attrPosition.needsUpdate=!0,super.updateMatrixWorld(e)}}function qt(d,e){return e.set(d.elements[12],d.elements[13],d.elements[14])}const Di=new g,Fi=new g;function Bi(d,e){return d.decompose(Di,e,Fi),e}function Pe(d){return d.invert?d.invert():d.inverse(),d}class ht{constructor(e,t){this.destination=e,this.source=t,this.weight=1}}const Hi=new g,Wi=new g,ki=new g,zi=new w,ji=new w,$i=new w;class qi extends ht{get aimAxis(){return this._aimAxis}set aimAxis(e){this._aimAxis=e,this._v3AimAxis.set(e==="PositiveX"?1:e==="NegativeX"?-1:0,e==="PositiveY"?1:e==="NegativeY"?-1:0,e==="PositiveZ"?1:e==="NegativeZ"?-1:0)}get dependencies(){const e=new Set([this.source]);return this.destination.parent&&e.add(this.destination.parent),e}constructor(e,t){super(e,t),this._aimAxis="PositiveX",this._v3AimAxis=new g(1,0,0),this._dstRestQuat=new w}setInitState(){this._dstRestQuat.copy(this.destination.quaternion)}update(){this.destination.updateWorldMatrix(!0,!1),this.source.updateWorldMatrix(!0,!1);const e=zi.identity(),t=ji.identity();this.destination.parent&&(Bi(this.destination.parent.matrixWorld,e),Pe(t.copy(e)));const n=Hi.copy(this._v3AimAxis).applyQuaternion(this._dstRestQuat).applyQuaternion(e),i=qt(this.source.matrixWorld,Wi).sub(qt(this.destination.matrixWorld,ki)).normalize(),r=$i.setFromUnitVectors(n,i).premultiply(t).multiply(e).multiply(this._dstRestQuat);this.destination.quaternion.copy(this._dstRestQuat).slerp(r,this.weight)}}function Xt(d,e,t,n){function i(r){return r instanceof t?r:new t(function(o){o(r)})}return new(t||(t=Promise))(function(r,o){function s(u){try{a(n.next(u))}catch(c){o(c)}}function l(u){try{a(n.throw(u))}catch(c){o(c)}}function a(u){u.done?r(u.value):i(u.value).then(s,l)}a((n=n.apply(d,e||[])).next())})}function Xi(d,e){const t=[d];let n=d.parent;for(;n!==null;)t.unshift(n),n=n.parent;t.forEach(i=>{e(i)})}class Gi{constructor(){this._constraints=new Set,this._objectConstraintsMap=new Map}get constraints(){return this._constraints}addConstraint(e){this._constraints.add(e);let t=this._objectConstraintsMap.get(e.destination);t==null&&(t=new Set,this._objectConstraintsMap.set(e.destination,t)),t.add(e)}deleteConstraint(e){this._constraints.delete(e),this._objectConstraintsMap.get(e.destination).delete(e)}setInitState(){const e=new Set,t=new Set;for(const n of this._constraints)this._processConstraint(n,e,t,i=>i.setInitState())}update(){const e=new Set,t=new Set;for(const n of this._constraints)this._processConstraint(n,e,t,i=>i.update())}_processConstraint(e,t,n,i){if(n.has(e))return;if(t.has(e))throw new Error("VRMNodeConstraintManager: Circular dependency detected while updating constraints");t.add(e);const r=e.dependencies;for(const o of r)Xi(o,s=>{const l=this._objectConstraintsMap.get(s);if(l)for(const a of l)this._processConstraint(a,t,n,i)});i(e),n.add(e)}}const Yi=new w,Qi=new w;class Zi extends ht{get dependencies(){return new Set([this.source])}constructor(e,t){super(e,t),this._dstRestQuat=new w,this._invSrcRestQuat=new w}setInitState(){this._dstRestQuat.copy(this.destination.quaternion),Pe(this._invSrcRestQuat.copy(this.source.quaternion))}update(){const e=Yi.copy(this._invSrcRestQuat).multiply(this.source.quaternion),t=Qi.copy(this._dstRestQuat).multiply(e);this.destination.quaternion.copy(this._dstRestQuat).slerp(t,this.weight)}}const Ji=new g,Ki=new w,er=new w;class tr extends ht{get rollAxis(){return this._rollAxis}set rollAxis(e){this._rollAxis=e,this._v3RollAxis.set(e==="X"?1:0,e==="Y"?1:0,e==="Z"?1:0)}get dependencies(){return new Set([this.source])}constructor(e,t){super(e,t),this._rollAxis="X",this._v3RollAxis=new g(1,0,0),this._dstRestQuat=new w,this._invDstRestQuat=new w,this._invSrcRestQuatMulDstRestQuat=new w}setInitState(){this._dstRestQuat.copy(this.destination.quaternion),Pe(this._invDstRestQuat.copy(this._dstRestQuat)),Pe(this._invSrcRestQuatMulDstRestQuat.copy(this.source.quaternion)).multiply(this._dstRestQuat)}update(){const e=Ki.copy(this._invDstRestQuat).multiply(this.source.quaternion).multiply(this._invSrcRestQuatMulDstRestQuat),t=Ji.copy(this._v3RollAxis).applyQuaternion(e),i=er.setFromUnitVectors(t,this._v3RollAxis).premultiply(this._dstRestQuat).multiply(e);this.destination.quaternion.copy(this._dstRestQuat).slerp(i,this.weight)}}const nr=new Set(["1.0","1.0-beta"]);class Y{get name(){return Y.EXTENSION_NAME}constructor(e,t){this.parser=e,this.helperRoot=t?.helperRoot}afterRoot(e){return Xt(this,void 0,void 0,function*(){e.userData.vrmNodeConstraintManager=yield this._import(e)})}_import(e){var t;return Xt(this,void 0,void 0,function*(){const n=this.parser.json;if(!(((t=n.extensionsUsed)===null||t===void 0?void 0:t.indexOf(Y.EXTENSION_NAME))!==-1))return null;const r=new Gi,o=yield this.parser.getDependencies("node");return o.forEach((s,l)=>{var a;const u=n.nodes[l],c=(a=u?.extensions)===null||a===void 0?void 0:a[Y.EXTENSION_NAME];if(c==null)return;const f=c.specVersion;if(!nr.has(f)){console.warn(`VRMNodeConstraintLoaderPlugin: Unknown ${Y.EXTENSION_NAME} specVersion "${f}"`);return}const h=c.constraint;if(h.roll!=null){const v=this._importRollConstraint(s,o,h.roll);r.addConstraint(v)}else if(h.aim!=null){const v=this._importAimConstraint(s,o,h.aim);r.addConstraint(v)}else if(h.rotation!=null){const v=this._importRotationConstraint(s,o,h.rotation);r.addConstraint(v)}}),e.scene.updateMatrixWorld(),r.setInitState(),r})}_importRollConstraint(e,t,n){const{source:i,rollAxis:r,weight:o}=n,s=t[i],l=new tr(e,s);if(r!=null&&(l.rollAxis=r),o!=null&&(l.weight=o),this.helperRoot){const a=new rt(l);this.helperRoot.add(a)}return l}_importAimConstraint(e,t,n){const{source:i,aimAxis:r,weight:o}=n,s=t[i],l=new qi(e,s);if(r!=null&&(l.aimAxis=r),o!=null&&(l.weight=o),this.helperRoot){const a=new rt(l);this.helperRoot.add(a)}return l}_importRotationConstraint(e,t,n){const{source:i,weight:r}=n,o=t[i],s=new Zi(e,o);if(r!=null&&(s.weight=r),this.helperRoot){const l=new rt(s);this.helperRoot.add(l)}return s}}Y.EXTENSION_NAME="VRMC_node_constraint";/*!
 * @pixiv/three-vrm-springbone v2.1.1
 * Spring bone module for @pixiv/three-vrm
 *
 * Copyright (c) 2020-2024 pixiv Inc.
 * @pixiv/three-vrm-springbone is distributed under MIT License
 * https://github.com/pixiv/three-vrm/blob/release/LICENSE
 */class dn{}const ot=new g,X=new g;class cn extends dn{get type(){return"capsule"}constructor(e){var t,n,i;super(),this.offset=(t=e?.offset)!==null&&t!==void 0?t:new g(0,0,0),this.tail=(n=e?.tail)!==null&&n!==void 0?n:new g(0,0,0),this.radius=(i=e?.radius)!==null&&i!==void 0?i:0}calculateCollision(e,t,n,i){ot.copy(this.offset).applyMatrix4(e),X.copy(this.tail).applyMatrix4(e),X.sub(ot);const r=X.lengthSq();i.copy(t).sub(ot);const o=X.dot(i);o<=0||(r<=o||X.multiplyScalar(o/r),i.sub(X));const s=n+this.radius,l=i.length()-s;return i.normalize(),l}}class hn extends dn{get type(){return"sphere"}constructor(e){var t,n;super(),this.offset=(t=e?.offset)!==null&&t!==void 0?t:new g(0,0,0),this.radius=(n=e?.radius)!==null&&n!==void 0?n:0}calculateCollision(e,t,n,i){i.copy(this.offset).applyMatrix4(e),i.negate().add(t);const r=n+this.radius,o=i.length()-r;return i.normalize(),o}}const V=new g;class ir extends Z{constructor(e){super(),this.worldScale=1,this._currentRadius=0,this._currentOffset=new g,this._currentTail=new g,this._shape=e,this._attrPos=new U(new Float32Array(396),3),this.setAttribute("position",this._attrPos),this._attrIndex=new U(new Uint16Array(264),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let e=!1;const t=this._shape.radius/this.worldScale;this._currentRadius!==t&&(this._currentRadius=t,e=!0),this._currentOffset.equals(this._shape.offset)||(this._currentOffset.copy(this._shape.offset),e=!0);const n=V.copy(this._shape.tail).divideScalar(this.worldScale);this._currentTail.distanceToSquared(n)>1e-10&&(this._currentTail.copy(n),e=!0),e&&this._buildPosition()}_buildPosition(){V.copy(this._currentTail).sub(this._currentOffset);const e=V.length()/this._currentRadius;for(let i=0;i<=16;i++){const r=i/16*Math.PI;this._attrPos.setXYZ(i,-Math.sin(r),-Math.cos(r),0),this._attrPos.setXYZ(17+i,e+Math.sin(r),Math.cos(r),0),this._attrPos.setXYZ(34+i,-Math.sin(r),0,-Math.cos(r)),this._attrPos.setXYZ(51+i,e+Math.sin(r),0,Math.cos(r))}for(let i=0;i<32;i++){const r=i/16*Math.PI;this._attrPos.setXYZ(68+i,0,Math.sin(r),Math.cos(r)),this._attrPos.setXYZ(100+i,e,Math.sin(r),Math.cos(r))}const t=Math.atan2(V.y,Math.sqrt(V.x*V.x+V.z*V.z)),n=-Math.atan2(V.z,V.x);this.rotateZ(t),this.rotateY(n),this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentOffset.x,this._currentOffset.y,this._currentOffset.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let e=0;e<34;e++){const t=(e+1)%34;this._attrIndex.setXY(e*2,e,t),this._attrIndex.setXY(68+e*2,34+e,34+t)}for(let e=0;e<32;e++){const t=(e+1)%32;this._attrIndex.setXY(136+e*2,68+e,68+t),this._attrIndex.setXY(200+e*2,100+e,100+t)}this._attrIndex.needsUpdate=!0}}class rr extends Z{constructor(e){super(),this.worldScale=1,this._currentRadius=0,this._currentOffset=new g,this._shape=e,this._attrPos=new U(new Float32Array(32*3*3),3),this.setAttribute("position",this._attrPos),this._attrIndex=new U(new Uint16Array(64*3),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let e=!1;const t=this._shape.radius/this.worldScale;this._currentRadius!==t&&(this._currentRadius=t,e=!0),this._currentOffset.equals(this._shape.offset)||(this._currentOffset.copy(this._shape.offset),e=!0),e&&this._buildPosition()}_buildPosition(){for(let e=0;e<32;e++){const t=e/16*Math.PI;this._attrPos.setXYZ(e,Math.cos(t),Math.sin(t),0),this._attrPos.setXYZ(32+e,0,Math.cos(t),Math.sin(t)),this._attrPos.setXYZ(64+e,Math.sin(t),0,Math.cos(t))}this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentOffset.x,this._currentOffset.y,this._currentOffset.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let e=0;e<32;e++){const t=(e+1)%32;this._attrIndex.setXY(e*2,e,t),this._attrIndex.setXY(64+e*2,32+e,32+t),this._attrIndex.setXY(128+e*2,64+e,64+t)}this._attrIndex.needsUpdate=!0}}const or=new g;class Gt extends re{constructor(e){if(super(),this.matrixAutoUpdate=!1,this.collider=e,this.collider.shape instanceof hn)this._geometry=new rr(this.collider.shape);else if(this.collider.shape instanceof cn)this._geometry=new ir(this.collider.shape);else throw new Error("VRMSpringBoneColliderHelper: Unknown collider shape type detected");const t=new Le({color:16711935,depthTest:!1,depthWrite:!1});this._line=new dt(this._geometry,t),this.add(this._line)}dispose(){this._geometry.dispose()}updateMatrixWorld(e){this.collider.updateWorldMatrix(!0,!1),this.matrix.copy(this.collider.matrixWorld);const t=this.matrix.elements;this._geometry.worldScale=or.set(t[0],t[1],t[2]).length(),this._geometry.update(),super.updateMatrixWorld(e)}}class sr extends Z{constructor(e){super(),this.worldScale=1,this._currentRadius=0,this._currentTail=new g,this._springBone=e,this._attrPos=new U(new Float32Array(294),3),this.setAttribute("position",this._attrPos),this._attrIndex=new U(new Uint16Array(194),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let e=!1;const t=this._springBone.settings.hitRadius/this.worldScale;this._currentRadius!==t&&(this._currentRadius=t,e=!0),this._currentTail.equals(this._springBone.initialLocalChildPosition)||(this._currentTail.copy(this._springBone.initialLocalChildPosition),e=!0),e&&this._buildPosition()}_buildPosition(){for(let e=0;e<32;e++){const t=e/16*Math.PI;this._attrPos.setXYZ(e,Math.cos(t),Math.sin(t),0),this._attrPos.setXYZ(32+e,0,Math.cos(t),Math.sin(t)),this._attrPos.setXYZ(64+e,Math.sin(t),0,Math.cos(t))}this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.setXYZ(96,0,0,0),this._attrPos.setXYZ(97,this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let e=0;e<32;e++){const t=(e+1)%32;this._attrIndex.setXY(e*2,e,t),this._attrIndex.setXY(64+e*2,32+e,32+t),this._attrIndex.setXY(128+e*2,64+e,64+t)}this._attrIndex.setXY(192,96,97),this._attrIndex.needsUpdate=!0}}const ar=new g;class lr extends re{constructor(e){super(),this.matrixAutoUpdate=!1,this.springBone=e,this._geometry=new sr(this.springBone);const t=new Le({color:16776960,depthTest:!1,depthWrite:!1});this._line=new dt(this._geometry,t),this.add(this._line)}dispose(){this._geometry.dispose()}updateMatrixWorld(e){this.springBone.bone.updateWorldMatrix(!0,!1),this.matrix.copy(this.springBone.bone.matrixWorld);const t=this.matrix.elements;this._geometry.worldScale=ar.set(t[0],t[1],t[2]).length(),this._geometry.update(),super.updateMatrixWorld(e)}}class Yt extends Ee{constructor(e){super(),this.shape=e}}const ur=new z;function fn(d){return d.invert?d.invert():d.getInverse(ur.copy(d)),d}class dr{get inverse(){return this._shouldUpdateInverse&&(this._inverseCache.copy(this.matrix),fn(this._inverseCache),this._shouldUpdateInverse=!1),this._inverseCache}constructor(e){this._inverseCache=new z,this._shouldUpdateInverse=!0,this.matrix=e;const t={set:(n,i,r)=>(this._shouldUpdateInverse=!0,n[i]=r,!0)};this._originalElements=e.elements,e.elements=new Proxy(e.elements,t)}revert(){this.matrix.elements=this._originalElements}}const cr=new z,B=new g,le=new g,hr=new g,te=new g,Qt=new g,ue=new g,Zt=new w,ne=new z,fr=new z;class pr{get center(){return this._center}set center(e){var t;!((t=this._center)===null||t===void 0)&&t.userData.inverseCacheProxy&&(this._center.userData.inverseCacheProxy.revert(),delete this._center.userData.inverseCacheProxy),this._center=e,this._center&&(this._center.userData.inverseCacheProxy||(this._center.userData.inverseCacheProxy=new dr(this._center.matrixWorld)))}get initialLocalChildPosition(){return this._initialLocalChildPosition}get _parentMatrixWorld(){return this.bone.parent?this.bone.parent.matrixWorld:cr}constructor(e,t,n={},i=[]){var r,o,s,l,a,u;this._currentTail=new g,this._prevTail=new g,this._boneAxis=new g,this._worldSpaceBoneLength=0,this._center=null,this._initialLocalMatrix=new z,this._initialLocalRotation=new w,this._initialLocalChildPosition=new g,this.bone=e,this.bone.matrixAutoUpdate=!1,this.child=t,this.settings={hitRadius:(r=n.hitRadius)!==null&&r!==void 0?r:0,stiffness:(o=n.stiffness)!==null&&o!==void 0?o:1,gravityPower:(s=n.gravityPower)!==null&&s!==void 0?s:0,gravityDir:(a=(l=n.gravityDir)===null||l===void 0?void 0:l.clone())!==null&&a!==void 0?a:new g(0,-1,0),dragForce:(u=n.dragForce)!==null&&u!==void 0?u:.4},this.colliderGroups=i}setInitState(){this._initialLocalMatrix.copy(this.bone.matrix),this._initialLocalRotation.copy(this.bone.quaternion),this.child?this._initialLocalChildPosition.copy(this.child.position):this._initialLocalChildPosition.copy(this.bone.position).normalize().multiplyScalar(.07);const e=this._getMatrixWorldToCenter(ne);this.bone.localToWorld(this._currentTail.copy(this._initialLocalChildPosition)).applyMatrix4(e),this._prevTail.copy(this._currentTail),this._boneAxis.copy(this._initialLocalChildPosition).normalize()}reset(){this.bone.quaternion.copy(this._initialLocalRotation),this.bone.updateMatrix(),this.bone.matrixWorld.multiplyMatrices(this._parentMatrixWorld,this.bone.matrix);const e=this._getMatrixWorldToCenter(ne);this.bone.localToWorld(this._currentTail.copy(this._initialLocalChildPosition)).applyMatrix4(e),this._prevTail.copy(this._currentTail)}update(e){if(e<=0)return;this._calcWorldSpaceBoneLength(),te.setFromMatrixPosition(this.bone.matrixWorld);let t=this._getMatrixWorldToCenter(ne);Qt.copy(te).applyMatrix4(t);const n=Zt.setFromRotationMatrix(t),i=fr.copy(t).multiply(this._parentMatrixWorld),r=le.copy(this._boneAxis).applyMatrix4(this._initialLocalMatrix).applyMatrix4(i).sub(Qt).normalize(),o=hr.copy(this.settings.gravityDir).applyQuaternion(n).normalize(),s=this._getMatrixCenterToWorld(ne);ue.copy(this._currentTail).add(B.copy(this._currentTail).sub(this._prevTail).multiplyScalar(1-this.settings.dragForce)).add(B.copy(r).multiplyScalar(this.settings.stiffness*e)).add(B.copy(o).multiplyScalar(this.settings.gravityPower*e)).applyMatrix4(s),ue.sub(te).normalize().multiplyScalar(this._worldSpaceBoneLength).add(te),this._collision(ue),t=this._getMatrixWorldToCenter(ne),this._prevTail.copy(this._currentTail),this._currentTail.copy(B.copy(ue).applyMatrix4(t));const l=fn(ne.copy(this._parentMatrixWorld).multiply(this._initialLocalMatrix)),a=Zt.setFromUnitVectors(this._boneAxis,B.copy(ue).applyMatrix4(l).normalize());this.bone.quaternion.copy(this._initialLocalRotation).multiply(a),this.bone.updateMatrix(),this.bone.matrixWorld.multiplyMatrices(this._parentMatrixWorld,this.bone.matrix)}_collision(e){this.colliderGroups.forEach(t=>{t.colliders.forEach(n=>{const i=n.shape.calculateCollision(n.matrixWorld,e,this.settings.hitRadius,B);i<0&&(e.add(B.multiplyScalar(-i)),e.sub(te).normalize().multiplyScalar(this._worldSpaceBoneLength).add(te))})})}_calcWorldSpaceBoneLength(){B.setFromMatrixPosition(this.bone.matrixWorld),this.child?le.setFromMatrixPosition(this.child.matrixWorld):(le.copy(this._initialLocalChildPosition),le.applyMatrix4(this.bone.matrixWorld)),this._worldSpaceBoneLength=B.sub(le).length()}_getMatrixCenterToWorld(e){return this._center?e.copy(this._center.matrixWorld):e.identity(),e}_getMatrixWorldToCenter(e){return this._center?e.copy(this._center.userData.inverseCacheProxy.inverse):e.identity(),e}}function ye(d,e,t,n){function i(r){return r instanceof t?r:new t(function(o){o(r)})}return new(t||(t=Promise))(function(r,o){function s(u){try{a(n.next(u))}catch(c){o(c)}}function l(u){try{a(n.throw(u))}catch(c){o(c)}}function a(u){u.done?r(u.value):i(u.value).then(s,l)}a((n=n.apply(d,e||[])).next())})}function mr(d,e){const t=[];let n=d;for(;n!==null;)t.unshift(n),n=n.parent;t.forEach(i=>{e(i)})}function pn(d,e){d.children.forEach(t=>{e(t)||pn(t,e)})}class Jt{constructor(){this._joints=new Set,this._objectSpringBonesMap=new Map}get joints(){return this._joints}get springBones(){return console.warn("VRMSpringBoneManager: springBones is deprecated. use joints instead."),this._joints}get colliderGroups(){const e=new Set;return this._joints.forEach(t=>{t.colliderGroups.forEach(n=>{e.add(n)})}),Array.from(e)}get colliders(){const e=new Set;return this.colliderGroups.forEach(t=>{t.colliders.forEach(n=>{e.add(n)})}),Array.from(e)}addJoint(e){this._joints.add(e);let t=this._objectSpringBonesMap.get(e.bone);t==null&&(t=new Set,this._objectSpringBonesMap.set(e.bone,t)),t.add(e)}addSpringBone(e){console.warn("VRMSpringBoneManager: addSpringBone() is deprecated. use addJoint() instead."),this.addJoint(e)}deleteJoint(e){this._joints.delete(e),this._objectSpringBonesMap.get(e.bone).delete(e)}deleteSpringBone(e){console.warn("VRMSpringBoneManager: deleteSpringBone() is deprecated. use deleteJoint() instead."),this.deleteJoint(e)}setInitState(){const e=new Set,t=new Set,n=new Set;for(const i of this._joints)this._processSpringBone(i,e,t,n,r=>r.setInitState())}reset(){const e=new Set,t=new Set,n=new Set;for(const i of this._joints)this._processSpringBone(i,e,t,n,r=>r.reset())}update(e){const t=new Set,n=new Set,i=new Set;for(const r of this._joints)this._processSpringBone(r,t,n,i,o=>o.update(e)),pn(r.bone,o=>{var s,l;return((l=(s=this._objectSpringBonesMap.get(o))===null||s===void 0?void 0:s.size)!==null&&l!==void 0?l:0)>0?!0:(o.updateWorldMatrix(!1,!1),!1)})}_processSpringBone(e,t,n,i,r){if(n.has(e))return;if(t.has(e))throw new Error("VRMSpringBoneManager: Circular dependency detected while updating springbones");t.add(e);const o=this._getDependencies(e);for(const s of o)mr(s,l=>{const a=this._objectSpringBonesMap.get(l);if(a)for(const u of a)this._processSpringBone(u,t,n,i,r);else i.has(l)||(l.updateWorldMatrix(!1,!1),i.add(l))});e.bone.updateMatrix(),e.bone.updateWorldMatrix(!1,!1),r(e),i.add(e.bone),n.add(e)}_getDependencies(e){const t=new Set,n=e.bone.parent;return n&&t.add(n),e.colliderGroups.forEach(i=>{i.colliders.forEach(r=>{t.add(r)})}),t}}const vr=new Set(["1.0","1.0-beta"]);class Q{get name(){return Q.EXTENSION_NAME}constructor(e,t){this.parser=e,this.jointHelperRoot=t?.jointHelperRoot,this.colliderHelperRoot=t?.colliderHelperRoot}afterRoot(e){return ye(this,void 0,void 0,function*(){e.userData.vrmSpringBoneManager=yield this._import(e)})}_import(e){return ye(this,void 0,void 0,function*(){const t=yield this._v1Import(e);if(t!=null)return t;const n=yield this._v0Import(e);return n??null})}_v1Import(e){var t,n,i,r,o;return ye(this,void 0,void 0,function*(){const s=e.parser.json;if(!(((t=s.extensionsUsed)===null||t===void 0?void 0:t.indexOf(Q.EXTENSION_NAME))!==-1))return null;const a=new Jt,u=yield e.parser.getDependencies("node"),c=(n=s.extensions)===null||n===void 0?void 0:n[Q.EXTENSION_NAME];if(!c)return null;const f=c.specVersion;if(!vr.has(f))return console.warn(`VRMSpringBoneLoaderPlugin: Unknown ${Q.EXTENSION_NAME} specVersion "${f}"`),null;const h=(i=c.colliders)===null||i===void 0?void 0:i.map((p,_)=>{var m,R,T,M,x;const E=u[p.node],y=p.shape;if(y.sphere)return this._importSphereCollider(E,{offset:new g().fromArray((m=y.sphere.offset)!==null&&m!==void 0?m:[0,0,0]),radius:(R=y.sphere.radius)!==null&&R!==void 0?R:0});if(y.capsule)return this._importCapsuleCollider(E,{offset:new g().fromArray((T=y.capsule.offset)!==null&&T!==void 0?T:[0,0,0]),radius:(M=y.capsule.radius)!==null&&M!==void 0?M:0,tail:new g().fromArray((x=y.capsule.tail)!==null&&x!==void 0?x:[0,0,0])});throw new Error(`VRMSpringBoneLoaderPlugin: The collider #${_} has no valid shape`)}),v=(r=c.colliderGroups)===null||r===void 0?void 0:r.map((p,_)=>{var m;return{colliders:((m=p.colliders)!==null&&m!==void 0?m:[]).map(T=>{const M=h?.[T];if(M==null)throw new Error(`VRMSpringBoneLoaderPlugin: The colliderGroup #${_} attempted to use a collider #${T} but not found`);return M}),name:p.name}});return(o=c.springs)===null||o===void 0||o.forEach((p,_)=>{var m;const R=p.joints,T=(m=p.colliderGroups)===null||m===void 0?void 0:m.map(E=>{const y=v?.[E];if(y==null)throw new Error(`VRMSpringBoneLoaderPlugin: The spring #${_} attempted to use a colliderGroup ${E} but not found`);return y}),M=p.center!=null?u[p.center]:void 0;let x;R.forEach(E=>{if(x){const y=x.node,I=u[y],A=E.node,P=u[A],b={hitRadius:x.hitRadius,dragForce:x.dragForce,gravityPower:x.gravityPower,stiffness:x.stiffness,gravityDir:x.gravityDir!=null?new g().fromArray(x.gravityDir):void 0},H=this._importJoint(I,P,b,T);M&&(H.center=M),a.addJoint(H)}x=E})}),a.setInitState(),a})}_v0Import(e){var t,n,i;return ye(this,void 0,void 0,function*(){const r=e.parser.json;if(!(((t=r.extensionsUsed)===null||t===void 0?void 0:t.indexOf("VRM"))!==-1))return null;const s=(n=r.extensions)===null||n===void 0?void 0:n.VRM,l=s?.secondaryAnimation;if(!l)return null;const a=l?.boneGroups;if(!a)return null;const u=new Jt,c=yield e.parser.getDependencies("node"),f=(i=l.colliderGroups)===null||i===void 0?void 0:i.map(h=>{var v;const p=c[h.node];return{colliders:((v=h.colliders)!==null&&v!==void 0?v:[]).map((m,R)=>{var T,M,x;const E=new g(0,0,0);return m.offset&&E.set((T=m.offset.x)!==null&&T!==void 0?T:0,(M=m.offset.y)!==null&&M!==void 0?M:0,m.offset.z?-m.offset.z:0),this._importSphereCollider(p,{offset:E,radius:(x=m.radius)!==null&&x!==void 0?x:0})})}});return a?.forEach((h,v)=>{const p=h.bones;p&&p.forEach(_=>{var m,R,T,M;const x=c[_],E=new g;h.gravityDir?E.set((m=h.gravityDir.x)!==null&&m!==void 0?m:0,(R=h.gravityDir.y)!==null&&R!==void 0?R:0,(T=h.gravityDir.z)!==null&&T!==void 0?T:0):E.set(0,-1,0);const y=h.center!=null?c[h.center]:void 0,I={hitRadius:h.hitRadius,dragForce:h.dragForce,gravityPower:h.gravityPower,stiffness:h.stiffiness,gravityDir:E},A=(M=h.colliderGroups)===null||M===void 0?void 0:M.map(P=>{const b=f?.[P];if(b==null)throw new Error(`VRMSpringBoneLoaderPlugin: The spring #${v} attempted to use a colliderGroup ${P} but not found`);return b});x.traverse(P=>{var b;const H=(b=P.children[0])!==null&&b!==void 0?b:null,J=this._importJoint(P,H,I,A);y&&(J.center=y),u.addJoint(J)})})}),e.scene.updateMatrixWorld(),u.setInitState(),u})}_importJoint(e,t,n,i){const r=new pr(e,t,n,i);if(this.jointHelperRoot){const o=new lr(r);this.jointHelperRoot.add(o),o.renderOrder=this.jointHelperRoot.renderOrder}return r}_importSphereCollider(e,t){const{offset:n,radius:i}=t,r=new hn({offset:n,radius:i}),o=new Yt(r);if(e.add(o),this.colliderHelperRoot){const s=new Gt(o);this.colliderHelperRoot.add(s),s.renderOrder=this.colliderHelperRoot.renderOrder}return o}_importCapsuleCollider(e,t){const{offset:n,radius:i,tail:r}=t,o=new cn({offset:n,radius:i,tail:r}),s=new Yt(o);if(e.add(s),this.colliderHelperRoot){const l=new Gt(s);this.colliderHelperRoot.add(l),l.renderOrder=this.colliderHelperRoot.renderOrder}return s}}Q.EXTENSION_NAME="VRMC_springBone";class br{get name(){return"VRMLoaderPlugin"}constructor(e,t){var n,i,r,o,s,l,a,u,c,f;this.parser=e;const h=t?.helperRoot,v=t?.autoUpdateHumanBones;this.expressionPlugin=(n=t?.expressionPlugin)!==null&&n!==void 0?n:new pe(e),this.firstPersonPlugin=(i=t?.firstPersonPlugin)!==null&&i!==void 0?i:new rn(e),this.humanoidPlugin=(r=t?.humanoidPlugin)!==null&&r!==void 0?r:new sn(e,{helperRoot:h,autoUpdateHumanBones:v}),this.lookAtPlugin=(o=t?.lookAtPlugin)!==null&&o!==void 0?o:new an(e,{helperRoot:h}),this.metaPlugin=(s=t?.metaPlugin)!==null&&s!==void 0?s:new ln(e),this.mtoonMaterialPlugin=(l=t?.mtoonMaterialPlugin)!==null&&l!==void 0?l:new ie(e),this.materialsHDREmissiveMultiplierPlugin=(a=t?.materialsHDREmissiveMultiplierPlugin)!==null&&a!==void 0?a:new fe(e),this.materialsV0CompatPlugin=(u=t?.materialsV0CompatPlugin)!==null&&u!==void 0?u:new Vi(e),this.springBonePlugin=(c=t?.springBonePlugin)!==null&&c!==void 0?c:new Q(e,{colliderHelperRoot:h,jointHelperRoot:h}),this.nodeConstraintPlugin=(f=t?.nodeConstraintPlugin)!==null&&f!==void 0?f:new Y(e,{helperRoot:h})}beforeRoot(){return xe(this,void 0,void 0,function*(){yield this.materialsV0CompatPlugin.beforeRoot(),yield this.mtoonMaterialPlugin.beforeRoot()})}loadMesh(e){return xe(this,void 0,void 0,function*(){return yield this.mtoonMaterialPlugin.loadMesh(e)})}getMaterialType(e){const t=this.mtoonMaterialPlugin.getMaterialType(e);return t??null}extendMaterialParams(e,t){return xe(this,void 0,void 0,function*(){yield this.materialsHDREmissiveMultiplierPlugin.extendMaterialParams(e,t),yield this.mtoonMaterialPlugin.extendMaterialParams(e,t)})}afterRoot(e){return xe(this,void 0,void 0,function*(){yield this.metaPlugin.afterRoot(e),yield this.humanoidPlugin.afterRoot(e),yield this.expressionPlugin.afterRoot(e),yield this.lookAtPlugin.afterRoot(e),yield this.firstPersonPlugin.afterRoot(e),yield this.springBonePlugin.afterRoot(e),yield this.nodeConstraintPlugin.afterRoot(e),yield this.mtoonMaterialPlugin.afterRoot(e);const t=e.userData.vrmMeta,n=e.userData.vrmHumanoid;if(t&&n){const i=new wi({scene:e.scene,expressionManager:e.userData.vrmExpressionManager,firstPerson:e.userData.vrmFirstPerson,humanoid:n,lookAt:e.userData.vrmLookAt,meta:t,materials:e.userData.vrmMToonMaterials,springBoneManager:e.userData.vrmSpringBoneManager,nodeConstraintManager:e.userData.vrmNodeConstraintManager});e.userData.vrm=i}})}}function Kt(d){if(Object.values(d).forEach(e=>{e?.isTexture&&e.dispose()}),d.isShaderMaterial){const e=d.uniforms;e&&Object.values(e).forEach(t=>{const n=t.value;n?.isTexture&&n.dispose()})}d.dispose()}function _r(d){const e=d.geometry;e&&e.dispose();const t=d.skeleton;t&&t.dispose();const n=d.material;n&&(Array.isArray(n)?n.forEach(i=>Kt(i)):n&&Kt(n))}function gr(d){d.traverse(_r)}function Mr(d){const e=new Map;d.traverse(t=>{if(t.type!=="SkinnedMesh")return;const n=t,r=n.geometry.getAttribute("skinIndex");let o=e.get(r);if(!o){const s=[],l=[],a={},u=r.array;for(let c=0;c<u.length;c++){const f=u[c];a[f]===void 0&&(a[f]=s.length,s.push(n.skeleton.bones[f]),l.push(n.skeleton.boneInverses[f])),u[c]=a[f]}r.copyArray(u),r.needsUpdate=!0,o=new en(s,l),e.set(r,o)}n.bind(o,new z)})}function xr(d){const e=new Map;d.traverse(t=>{var n,i,r,o;if(!t.isMesh)return;const s=t,l=s.geometry,a=l.index;if(a==null)return;const u=e.get(l);if(u!=null){s.geometry=u;return}const c=new Z;c.name=l.name,c.morphTargetsRelative=l.morphTargetsRelative,l.groups.forEach(p=>{c.addGroup(p.start,p.count,p.materialIndex)}),c.boundingBox=(i=(n=l.boundingBox)===null||n===void 0?void 0:n.clone())!==null&&i!==void 0?i:null,c.boundingSphere=(o=(r=l.boundingSphere)===null||r===void 0?void 0:r.clone())!==null&&o!==void 0?o:null,c.setDrawRange(l.drawRange.start,l.drawRange.count),c.userData=l.userData,e.set(l,c);const f=[],h=[];{const p=a.array,_=new p.constructor(p.length);let m=0;for(let R=0;R<p.length;R++){const T=p[R];let M=f[T];M==null&&(f[T]=m,h[m]=T,M=m,m++),_[R]=M}c.setIndex(new U(_,1,!1))}Object.keys(l.attributes).forEach(p=>{const _=l.attributes[p];if(_.isInterleavedBufferAttribute)throw new Error("removeUnnecessaryVertices: InterleavedBufferAttribute is not supported");const m=_.array,{itemSize:R,normalized:T}=_,M=new m.constructor(h.length*R);h.forEach((x,E)=>{for(let y=0;y<R;y++)M[E*R+y]=m[x*R+y]}),c.setAttribute(p,new U(M,R,T))});let v=!0;Object.keys(l.morphAttributes).forEach(p=>{c.morphAttributes[p]=[];const _=l.morphAttributes[p];for(let m=0;m<_.length;m++){const R=_[m];if(R.isInterleavedBufferAttribute)throw new Error("removeUnnecessaryVertices: InterleavedBufferAttribute is not supported");const T=R.array,{itemSize:M,normalized:x}=R,E=new T.constructor(h.length*M);h.forEach((y,I)=>{for(let A=0;A<M;A++)E[I*M+A]=T[y*M+A]}),v=v&&E.every(y=>y===0),c.morphAttributes[p][m]=new U(E,M,x)}}),v&&(c.morphAttributes={}),s.geometry=c}),Array.from(e.keys()).forEach(t=>{t.dispose()})}function yr(d){var e;((e=d.meta)===null||e===void 0?void 0:e.metaVersion)==="0"&&(d.scene.rotation.y=Math.PI)}class be{constructor(){}}be.deepDispose=gr;be.removeUnnecessaryJoints=Mr;be.removeUnnecessaryVertices=xr;be.rotateVRM0=yr;export{it as MToonMaterial,Pi as MToonMaterialDebugMode,ie as MToonMaterialLoaderPlugin,tt as MToonMaterialOutlineWidthMode,wi as VRM,qi as VRMAimConstraint,un as VRMCore,Ir as VRMCoreLoaderPlugin,Pt as VRMExpression,pe as VRMExpressionLoaderPlugin,we as VRMExpressionManager,ce as VRMExpressionMaterialColorBind,se as VRMExpressionMaterialColorType,Ut as VRMExpressionMorphTargetBind,Sr as VRMExpressionOverrideType,st as VRMExpressionPresetName,he as VRMExpressionTextureTransformBind,D as VRMFirstPerson,rn as VRMFirstPersonLoaderPlugin,Ar as VRMFirstPersonMeshAnnotationType,Ze as VRMHumanBoneList,Pr as VRMHumanBoneName,oi as VRMHumanBoneParentMap,Ae as VRMHumanoid,Vt as VRMHumanoidHelper,sn as VRMHumanoidLoaderPlugin,br as VRMLoaderPlugin,Ie as VRMLookAt,Te as VRMLookAtBoneApplier,ut as VRMLookAtExpressionApplier,fi as VRMLookAtHelper,an as VRMLookAtLoaderPlugin,$t as VRMLookAtRangeMap,Lr as VRMLookAtTypeName,ln as VRMMetaLoaderPlugin,ht as VRMNodeConstraint,rt as VRMNodeConstraintHelper,Y as VRMNodeConstraintLoaderPlugin,Gi as VRMNodeConstraintManager,li as VRMRequiredHumanBoneName,tr as VRMRollConstraint,Zi as VRMRotationConstraint,Yt as VRMSpringBoneCollider,Gt as VRMSpringBoneColliderHelper,dn as VRMSpringBoneColliderShape,cn as VRMSpringBoneColliderShapeCapsule,hn as VRMSpringBoneColliderShapeSphere,pr as VRMSpringBoneJoint,lr as VRMSpringBoneJointHelper,Q as VRMSpringBoneLoaderPlugin,Jt as VRMSpringBoneManager,be as VRMUtils};
