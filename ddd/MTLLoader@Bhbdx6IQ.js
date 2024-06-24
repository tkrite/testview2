import{ac as g,aj as k,ad as w,ak as b,Y as M,b as m,g as L,o as d,al as v,am as y,an as x}from"./ddd@DwDq534T.js";class C extends g{constructor(e){super(e)}load(e,o,n,t){const i=this,c=this.path===""?k.extractUrlBase(e):this.path,a=new w(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(s){try{s instanceof Uint8Array&&(s=new TextDecoder().decode(s)),o(i.parse(s,c))}catch(r){t?t(r):console.error(r),i.manager.itemError(e)}},n,t)}setMaterialOptions(e){return this.materialOptions=e,this}parse(e,o){const n=e.split(`
`);let t={};const i=/\s+/,c={};for(let s=0;s<n.length;s++){let r=n[s];if(r=r.trim(),r.length===0||r.charAt(0)==="#")continue;const p=r.indexOf(" ");let l=p>=0?r.substring(0,p):r;l=l.toLowerCase();let h=p>=0?r.substring(p+1):"";if(h=h.trim(),l==="newmtl")t={name:h},c[h]=t;else if(l==="ka"||l==="kd"||l==="ks"||l==="ke"){const f=h.split(i,3);t[l]=[parseFloat(f[0]),parseFloat(f[1]),parseFloat(f[2])]}else t[l]=h}const a=new O(this.resourcePath||o,this.materialOptions);return a.setCrossOrigin(this.crossOrigin),a.setManager(this.manager),a.setMaterials(c),a}}class O{constructor(e="",o={}){this.baseUrl=e,this.options=o,this.materialsInfo={},this.materials={},this.materialsArray=[],this.nameLookup={},this.crossOrigin="anonymous",this.side=this.options.side!==void 0?this.options.side:b,this.wrap=this.options.wrap!==void 0?this.options.wrap:M}setCrossOrigin(e){return this.crossOrigin=e,this}setManager(e){this.manager=e}setMaterials(e){this.materialsInfo=this.convert(e),this.materials={},this.materialsArray=[],this.nameLookup={}}convert(e){if(!this.options)return e;const o={};for(const n in e){const t=e[n],i={};o[n]=i;for(const c in t){let a=!0,s=t[c];const r=c.toLowerCase();switch(r){case"kd":case"ka":case"ks":this.options&&this.options.normalizeRGB&&(s=[s[0]/255,s[1]/255,s[2]/255]),this.options&&this.options.ignoreZeroRGBs&&s[0]===0&&s[1]===0&&s[2]===0&&(a=!1);break}a&&(i[r]=s)}}return o}preload(){for(const e in this.materialsInfo)this.create(e)}getIndex(e){return this.nameLookup[e]}getAsArray(){let e=0;for(const o in this.materialsInfo)this.materialsArray[e]=this.create(o),this.nameLookup[o]=e,e++;return this.materialsArray}create(e){return this.materials[e]===void 0&&this.createMaterial_(e),this.materials[e]}createMaterial_(e){const o=this,n=this.materialsInfo[e],t={name:e,side:this.side};function i(a,s){return typeof s!="string"||s===""?"":/^https?:\/\//i.test(s)?s:a+s}function c(a,s){if(t[a])return;const r=o.getTextureParams(s,t),p=o.loadTexture(i(o.baseUrl,r.url));p.repeat.copy(r.scale),p.offset.copy(r.offset),p.wrapS=o.wrap,p.wrapT=o.wrap,(a==="map"||a==="emissiveMap")&&(p.colorSpace=x),t[a]=p}for(const a in n){const s=n[a];let r;if(s!=="")switch(a.toLowerCase()){case"kd":t.color=new m().fromArray(s).convertSRGBToLinear();break;case"ks":t.specular=new m().fromArray(s).convertSRGBToLinear();break;case"ke":t.emissive=new m().fromArray(s).convertSRGBToLinear();break;case"map_kd":c("map",s);break;case"map_ks":c("specularMap",s);break;case"map_ke":c("emissiveMap",s);break;case"norm":c("normalMap",s);break;case"map_bump":case"bump":c("bumpMap",s);break;case"map_d":c("alphaMap",s),t.transparent=!0;break;case"ns":t.shininess=parseFloat(s);break;case"d":r=parseFloat(s),r<1&&(t.opacity=r,t.transparent=!0);break;case"tr":r=parseFloat(s),this.options&&this.options.invertTrProperty&&(r=1-r),r>0&&(t.opacity=1-r,t.transparent=!0);break}}return this.materials[e]=new L(t),this.materials[e]}getTextureParams(e,o){const n={scale:new d(1,1),offset:new d(0,0)},t=e.split(/\s+/);let i;return i=t.indexOf("-bm"),i>=0&&(o.bumpScale=parseFloat(t[i+1]),t.splice(i,2)),i=t.indexOf("-s"),i>=0&&(n.scale.set(parseFloat(t[i+1]),parseFloat(t[i+2])),t.splice(i,4)),i=t.indexOf("-o"),i>=0&&(n.offset.set(parseFloat(t[i+1]),parseFloat(t[i+2])),t.splice(i,4)),n.url=t.join(" ").trim(),n}loadTexture(e,o,n,t,i){const c=this.manager!==void 0?this.manager:v;let a=c.getHandler(e);a===null&&(a=new y(c)),a.setCrossOrigin&&a.setCrossOrigin(this.crossOrigin);const s=a.load(e,n,t,i);return o!==void 0&&(s.mapping=o),s}}export{C as MTLLoader};