import{ac as B,ad as O,G as N,M as E,O as P,B as $,av as y,a as I,an as C,aG as S,am as V,o as _,af as Z,aW as q,Y as X}from"./ddd@DwDq534T.js";import{a as Y,s as F}from"./fflate.module@Do-qMP1X.js";class K{parse(m){const d={},g=m.split(`
`);let a=null,o=d;const i=[d];for(const f of g)if(f.includes("=")){const c=f.split("="),w=c[0].trim(),l=c[1].trim();if(l.endsWith("{")){const x={};i.push(x),o[w]=x,o=x}else o[w]=l}else if(f.endsWith("{")){const c=o[a]||{};i.push(c),o[a]=c,o=c}else if(f.endsWith("}")){if(i.pop(),i.length===0)continue;o=i[i.length-1]}else if(f.endsWith("(")){const c={};i.push(c),a=f.split("(")[0].trim()||a,o[a]=c,o=c}else f.endsWith(")")?(i.pop(),o=i[i.length-1]):a=f.trim();return d}}class ee extends B{constructor(m){super(m)}load(m,d,g,a){const o=this,i=new O(o.manager);i.setPath(o.path),i.setResponseType("arraybuffer"),i.setRequestHeader(o.requestHeader),i.setWithCredentials(o.withCredentials),i.load(m,function(f){try{d(o.parse(f))}catch(c){a?a(c):console.error(c),o.manager.itemError(m)}},g,a)}parse(m){const d=new K;function g(e){const n={};new O().setResponseType("arraybuffer");for(const t in e){if(t.endsWith("png")){const s=new Blob([e[t]],{type:{type:"image/png"}});n[t]=URL.createObjectURL(s)}if(t.endsWith("usd")||t.endsWith("usda")){if(a(e[t])){console.warn("THREE.USDZLoader: Crate files (.usdc or binary .usd) are not supported.");continue}const s=F(e[t]);n[t]=d.parse(s)}}return n}function a(e){const n=e.slice(0,7),r=new Uint8Array([80,88,82,45,85,83,68,67]);return n.every((t,s)=>t===r[s])}function o(e){if(e.length<1)return;const n=Object.keys(e)[0];let r=!1;if(n.endsWith("usda"))return e[n];if(n.endsWith("usdc"))r=!0;else if(n.endsWith("usd"))if(a(e[n]))r=!0;else return e[n];r&&console.warn("THREE.USDZLoader: Crate files (.usdc or binary .usd) are not supported.")}const i=Y(new Uint8Array(m)),f=g(i),c=o(i);if(c===void 0)return console.warn("THREE.USDZLoader: No usda file found."),new N;const w=F(c),l=d.parse(w);function x(e){if(e){if("prepend references"in e){const r=e["prepend references"].split("@"),t=r[1].replace(/^.\//,""),s=r[2].replace(/^<\//,"").replace(/>$/,"");return M(f[t],s)}return M(e)}}function M(e,n){if(e){if(n!==void 0){const r=`def Mesh "${n}"`;if(r in e)return e[r]}for(const r in e){const t=e[r];if(r.startsWith("def Mesh"))return"point3f[] points"in e&&(t["point3f[] points"]=e["point3f[] points"]),"texCoord2f[] primvars:st"in e&&(t["texCoord2f[] primvars:st"]=e["texCoord2f[] primvars:st"]),"int[] primvars:st:indices"in e&&(t["int[] primvars:st:indices"]=e["int[] primvars:st:indices"]),t;if(typeof t=="object"){const s=M(t);if(s)return s}}}}function U(e){if(!e)return;let n=new $;if("int[] faceVertexIndices"in e){const r=JSON.parse(e["int[] faceVertexIndices"]);n.setIndex(r)}if("point3f[] points"in e){const r=JSON.parse(e["point3f[] points"].replace(/[()]*/g,"")),t=new y(new Float32Array(r),3);n.setAttribute("position",t)}if("normal3f[] normals"in e){const r=JSON.parse(e["normal3f[] normals"].replace(/[()]*/g,"")),t=new y(new Float32Array(r),3);n.setAttribute("normal",t)}else n.computeVertexNormals();if("float2[] primvars:st"in e&&(e["texCoord2f[] primvars:st"]=e["float2[] primvars:st"]),"texCoord2f[] primvars:st"in e){const r=JSON.parse(e["texCoord2f[] primvars:st"].replace(/[()]*/g,"")),t=new y(new Float32Array(r),2);if("int[] primvars:st:indices"in e){n=n.toNonIndexed();const s=JSON.parse(e["int[] primvars:st:indices"]);n.setAttribute("uv",J(t,s))}else n.setAttribute("uv",t)}return n}function J(e,n){const r=e.array,t=e.itemSize,s=new r.constructor(n.length*t);let W=0,H=0;for(let v=0,k=n.length;v<k;v++){W=n[v]*t;for(let A=0;A<t;A++)s[H++]=r[W++]}return new y(s,t)}function L(e){if(e){if("rel material:binding"in e){const t=e["rel material:binding"].replace(/^<\//,"").replace(/>$/,"").split("/");return b(l,` "${t[1]}"`)}return b(e)}}function b(e,n=""){for(const r in e){const t=e[r];if(r.startsWith("def Material"+n))return t;if(typeof t=="object"){const s=b(t,n);if(s)return s}}}function h(e,n){n["float inputs:rotation"]&&(e.rotation=parseFloat(n["float inputs:rotation"])),n["float2 inputs:scale"]&&(e.repeat=new _().fromArray(JSON.parse("["+n["float2 inputs:scale"].replace(/[()]*/g,"")+"]"))),n["float2 inputs:translation"]&&(e.offset=new _().fromArray(JSON.parse("["+n["float2 inputs:translation"].replace(/[()]*/g,"")+"]")))}function D(e){const n=new I;if(e!==void 0){if('def Shader "PreviewSurface"'in e){const r=e['def Shader "PreviewSurface"'];if("color3f inputs:diffuseColor.connect"in r){const t=r["color3f inputs:diffuseColor.connect"],s=u(l,/(\w+).output/.exec(t)[1]);n.map=p(s),n.map.colorSpace=C,'def Shader "Transform2d_diffuse"'in e&&h(n.map,e['def Shader "Transform2d_diffuse"'])}else if("color3f inputs:diffuseColor"in r){const t=r["color3f inputs:diffuseColor"].replace(/[()]*/g,"");n.color.fromArray(JSON.parse("["+t+"]"))}if("color3f inputs:emissiveColor.connect"in r){const t=r["color3f inputs:emissiveColor.connect"],s=u(l,/(\w+).output/.exec(t)[1]);n.emissiveMap=p(s),n.emissiveMap.colorSpace=C,n.emissive.set(16777215),'def Shader "Transform2d_emissive"'in e&&h(n.emissiveMap,e['def Shader "Transform2d_emissive"'])}else if("color3f inputs:emissiveColor"in r){const t=r["color3f inputs:emissiveColor"].replace(/[()]*/g,"");n.emissive.fromArray(JSON.parse("["+t+"]"))}if("normal3f inputs:normal.connect"in r){const t=r["normal3f inputs:normal.connect"],s=u(l,/(\w+).output/.exec(t)[1]);n.normalMap=p(s),n.normalMap.colorSpace=S,'def Shader "Transform2d_normal"'in e&&h(n.normalMap,e['def Shader "Transform2d_normal"'])}if("float inputs:roughness.connect"in r){const t=r["float inputs:roughness.connect"],s=u(l,/(\w+).output/.exec(t)[1]);n.roughness=1,n.roughnessMap=p(s),n.roughnessMap.colorSpace=S,'def Shader "Transform2d_roughness"'in e&&h(n.roughnessMap,e['def Shader "Transform2d_roughness"'])}else"float inputs:roughness"in r&&(n.roughness=parseFloat(r["float inputs:roughness"]));if("float inputs:metallic.connect"in r){const t=r["float inputs:metallic.connect"],s=u(l,/(\w+).output/.exec(t)[1]);n.metalness=1,n.metalnessMap=p(s),n.metalnessMap.colorSpace=S,'def Shader "Transform2d_metallic"'in e&&h(n.metalnessMap,e['def Shader "Transform2d_metallic"'])}else"float inputs:metallic"in r&&(n.metalness=parseFloat(r["float inputs:metallic"]));if("float inputs:clearcoat.connect"in r){const t=r["float inputs:clearcoat.connect"],s=u(l,/(\w+).output/.exec(t)[1]);n.clearcoat=1,n.clearcoatMap=p(s),n.clearcoatMap.colorSpace=S,'def Shader "Transform2d_clearcoat"'in e&&h(n.clearcoatMap,e['def Shader "Transform2d_clearcoat"'])}else"float inputs:clearcoat"in r&&(n.clearcoat=parseFloat(r["float inputs:clearcoat"]));if("float inputs:clearcoatRoughness.connect"in r){const t=r["float inputs:clearcoatRoughness.connect"],s=u(l,/(\w+).output/.exec(t)[1]);n.clearcoatRoughness=1,n.clearcoatRoughnessMap=p(s),n.clearcoatRoughnessMap.colorSpace=S,'def Shader "Transform2d_clearcoatRoughness"'in e&&h(n.clearcoatRoughnessMap,e['def Shader "Transform2d_clearcoatRoughness"'])}else"float inputs:clearcoatRoughness"in r&&(n.clearcoatRoughness=parseFloat(r["float inputs:clearcoatRoughness"]));if("float inputs:ior"in r&&(n.ior=parseFloat(r["float inputs:ior"])),"float inputs:occlusion.connect"in r){const t=r["float inputs:occlusion.connect"],s=u(l,/(\w+).output/.exec(t)[1]);n.aoMap=p(s),n.aoMap.colorSpace=S,'def Shader "Transform2d_occlusion"'in e&&h(n.aoMap,e['def Shader "Transform2d_occlusion"'])}}if('def Shader "diffuseColor_texture"'in e){const r=e['def Shader "diffuseColor_texture"'];n.map=p(r),n.map.colorSpace=C}if('def Shader "normal_texture"'in e){const r=e['def Shader "normal_texture"'];n.normalMap=p(r),n.normalMap.colorSpace=S}}return n}function u(e,n){for(const r in e){const t=e[r];if(r.startsWith(`def Shader "${n}"`))return t;if(typeof t=="object"){const s=u(t,n);if(s)return s}}}function p(e){if("asset inputs:file"in e){const n=e["asset inputs:file"].replace(/@*/g,""),t=new V().load(f[n]),s={'"clamp"':Z,'"mirror"':q,'"repeat"':X};return"token inputs:wrapS"in e&&(t.wrapS=s[e["token inputs:wrapS"]]),"token inputs:wrapT"in e&&(t.wrapT=s[e["token inputs:wrapT"]]),t}return null}function G(e){const n=U(x(e)),r=D(L(e)),t=n?new E(n,r):new P;if("matrix4d xformOp:transform"in e){const s=JSON.parse("["+e["matrix4d xformOp:transform"].replace(/[()]*/g,"")+"]");t.matrix.fromArray(s),t.matrix.decompose(t.position,t.quaternion,t.scale)}return t}function T(e,n){for(const r in e)if(r.startsWith("def Scope"))T(e[r],n);else if(r.startsWith("def Xform")){const t=G(e[r]);/def Xform "(\w+)"/.test(r)&&(t.name=/def Xform "(\w+)"/.exec(r)[1]),n.add(t),T(e[r],t)}}const R=new N;return T(l,R),R}}export{ee as USDZLoader};
