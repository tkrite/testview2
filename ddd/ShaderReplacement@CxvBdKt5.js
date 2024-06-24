import{WrappedShaderMaterial as k}from"./WrappedShaderMaterial@jJQ4lvlR.js";import"./ddd@DwDq534T.js";import"./ExtendedShaderMaterial@CoOG-Exu.js";function S(h,n,a){a===void 0?n in h.defines&&(delete h.defines[n],h.needsUpdate=!0):a!==h.defines[n]&&(h.defines[n]=a,h.needsUpdate=!0)}const U=new WeakMap;class x{constructor(n){this._replacementMaterial=new k(n),this._replacementMaterials=new WeakMap,this.overrideUniforms={},this.overrideDefines={}}replace(n,a=!1,o=!0){const t=this;function s(r){if(!r.isMesh&&!r.isSkinnedMesh)return;if(!e.has(r)){const d=t.createMaterial(r);e.set(r,d)}const f=e.get(r);if(f===null)return;let c=r.material;if(o?l.set(r,c):c=l.get(r),c||console.error("ShaderReplacement : Material for object was not cached before replacing shader.",r),t.updateUniforms(r,c,f),Array.isArray(f))for(let d=0;d<f.length;d++)f[d].finalize&&f[d].finalize();else f.finalize&&f.finalize();r.material=f}const e=this._replacementMaterials,l=U;if(Array.isArray(n))if(a)for(let r=0,f=n.length;r<f;r++)n[r].traverse(s);else for(let r=0,f=n.length;r<f;r++)s(n[r]);else a?n.traverse(s):s(n)}reset(n,a){function o(s){t.has(s)?(s.material=t.get(s),t.delete(s)):(s.isSkinnedMesh||s.isMesh)&&console.error("ShaderReplacement : Material for object was not cached before resetting.",s)}const t=U;if(Array.isArray(n))if(a)for(let s=0,e=n.length;s<e;s++)o(n[s]);else for(let s=0,e=n.length;s<e;s++)n[s].traverse(o);else a?n.traverse(o):o(n)}createMaterial(n){if(Array.isArray(n.material)){let a=[];for(let o=0,t=n.material.length;o<t;o++)a.push(this._replacementMaterial.clone());return a}return this._replacementMaterial.clone()}updateUniforms(n,a,o){let t=this;if(t.overrideDefines==null)if(Array.isArray(o)){t.overrideDefines=[],t.overrideUniforms=[];for(let e=0,l=o.length;e<l;e++)t.overrideDefines.push({}),t.overrideUniforms.push({})}else t.overrideDefines={},t.overrideUniforms={};function s(e,l,r,f){const d=l.defines,v=e.defines,m=l.defines;if(l.visible=e.visible&&e.depthWrite,l.side=e.side,l.flatShading=e.flatShading,l.skinning=e.skinning,v){for(const i in v)l.setDefine(i,v[i]);for(const i in m)i in v?l.setDefine(i,v[i]):l.setDefine(i,d[i])}const p=l.uniforms;if(e.isShaderMaterial){const i=e.uniforms;for(const u in p){const M=i[u],y=p[u];M&&M.value!==y.value&&(y.value&&y.value.isTexture||M.value&&M.value.isTexture?l.setTextureUniform(u,M.value):y.value=M.value)}}else for(const i in p){const u=p[i];i in e&&e[i]!==u.value&&(u.value&&u.value.isTexture||e[i]&&e[i].isTexture?l.setTextureUniform(i,e[i]):u.value=e[i])}for(const i in r)r[i]===null||r[i]===void 0?delete m[i]:m[i]!==r[i]&&(m[i]=r[i],l.needsUpdate=!0);for(const i in f)i in p&&(p[i].value=f[i].value)}if(Array.isArray(a))for(let e=0;e<a.length;e++){const{overrideDefines:l,overrideUniforms:r}=t;s(a[e],o[e],l[e],r[e])}else{const{overrideDefines:e,overrideUniforms:l}=t;s(a,o,e,l)}}dispose(){}}export{x as ShaderReplacement,S as setMaterialDefine};