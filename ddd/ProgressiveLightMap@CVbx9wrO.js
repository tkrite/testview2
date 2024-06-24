import{f as v,W as u,g as c,h as p,D as M,i as g,M as f,H as m,F as b}from"./ddd@DwDq534T.js";/**
 * potpack - by [@mourner](https://github.com/mourner)
 * 
 * A tiny JavaScript function for packing 2D rectangles into a near-square container, 
 * which is useful for generating CSS sprites and WebGL textures. Similar to 
 * [shelf-pack](https://github.com/mapbox/shelf-pack), but static (you can't add items 
 * once a layout is generated), and aims for maximal space utilization.
 *
 * A variation of algorithms used in [rectpack2D](https://github.com/TeamHypersomnia/rectpack2D)
 * and [bin-pack](https://github.com/bryanburgers/bin-pack), which are in turn based 
 * on [this article by Blackpawn](http://blackpawn.com/texts/lightmaps/default.html).
 * 
 * @license
 * ISC License
 * 
 * Copyright (c) 2018, Mapbox
 * 
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
 * THIS SOFTWARE.
 */function w(o){let a=0,n=0;for(const e of o)a+=e.w*e.h,n=Math.max(n,e.w);o.sort((e,l)=>l.h-e.h);const t=[{x:0,y:0,w:Math.max(Math.ceil(Math.sqrt(a/.95)),n),h:1/0}];let i=0,s=0;for(const e of o)for(let l=t.length-1;l>=0;l--){const r=t[l];if(!(e.w>r.w||e.h>r.h)){if(e.x=r.x,e.y=r.y,s=Math.max(s,e.y+e.h),i=Math.max(i,e.x+e.w),e.w===r.w&&e.h===r.h){const d=t.pop();l<t.length&&(t[l]=d)}else e.h===r.h?(r.x+=e.w,r.w-=e.w):e.w===r.w?(r.y+=e.h,r.h-=e.h):(t.push({x:r.x+e.w,y:r.y,w:r.w-e.w,h:e.h}),r.y+=e.h,r.h-=e.h);break}}return{w:i,h:s,fill:a/(i*s)||0}}class S{constructor(a,n=1024){this.renderer=a,this.res=n,this.lightMapContainers=[],this.compiled=!1,this.scene=new v,this.scene.background=null,this.tinyTarget=new u(1,1),this.buffer1Active=!1,this.firstUpdate=!0,this.warned=!1;const h=/(Android|iPad|iPhone|iPod)/g.test(navigator.userAgent)?m:b;this.progressiveLightMap1=new u(this.res,this.res,{type:h}),this.progressiveLightMap2=new u(this.res,this.res,{type:h}),this.progressiveLightMap2.texture.channel=1,this.uvMat=new c,this.uvMat.uniforms={},this.uvMat.onBeforeCompile=t=>{t.vertexShader=`attribute vec2 uv1;
#define USE_LIGHTMAP
#define LIGHTMAP_UV uv1
`+t.vertexShader.slice(0,-1)+"	gl_Position = vec4((LIGHTMAP_UV - 0.5) * 2.0, 1.0, 1.0); }";const i=t.fragmentShader.indexOf("void main() {");t.fragmentShader=`#define USE_LIGHTMAP
`+t.fragmentShader.slice(0,i)+`	uniform sampler2D previousShadowMap;
	uniform float averagingWindow;
`+t.fragmentShader.slice(i-1,-1)+`
vec3 texelOld = texture2D(previousShadowMap, vLightMapUv).rgb;
				gl_FragColor.rgb = mix(texelOld, gl_FragColor.rgb, 1.0/averagingWindow);
			}`,t.uniforms.previousShadowMap={value:this.progressiveLightMap1.texture},t.uniforms.averagingWindow={value:100},this.uvMat.uniforms=t.uniforms,this.uvMat.userData.shader=t,this.compiled=!0}}addObjectsToLightMap(a){this.uv_boxes=[];const n=3/this.res;for(let t=0;t<a.length;t++){const i=a[t];if(i.isLight){this.scene.attach(i);continue}if(!i.geometry.hasAttribute("uv")){console.warn("All lightmap objects need UVs!");continue}this.blurringPlane==null&&this._initializeBlurPlane(this.res,this.progressiveLightMap1),i.material.lightMap=this.progressiveLightMap2.texture,i.material.dithering=!0,i.castShadow=!0,i.receiveShadow=!0,i.renderOrder=1e3+t,this.uv_boxes.push({w:1+n*2,h:1+n*2,index:t});let s=[];if(Array.isArray(i.material))for(const e of i.material)e.lightMap=this.progressiveLightMap2.texture,e.dithering=!0,s.push(e);else s=i.material,i.material.lightMap=this.progressiveLightMap2.texture,i.material.dithering=!0;this.lightMapContainers.push({copied:s,basicMat:i.material,object:i}),this.compiled=!1}const h=w(this.uv_boxes);this.uv_boxes.forEach(t=>{const i=a[t.index].geometry.getAttribute("uv").clone();for(let s=0;s<i.array.length;s+=i.itemSize)i.array[s]=(i.array[s]+t.x+n)/h.w,i.array[s+1]=(i.array[s+1]+t.y+n)/h.h;a[t.index].geometry.setAttribute("uv1",i),a[t.index].geometry.getAttribute("uv1").needsUpdate=!0})}update(a,n=100,h=!0){if(this.blurringPlane==null)return;const t=this.renderer.getRenderTarget();this.blurringPlane.visible=h;for(let e=0;e<this.lightMapContainers.length;e++)this.lightMapContainers[e].object.oldScene=this.lightMapContainers[e].object.parent,this.scene.attach(this.lightMapContainers[e].object);this.firstUpdate&&(this.renderer.setRenderTarget(this.tinyTarget),this.renderer.render(this.scene,a),this.firstUpdate=!1);for(let e=0;e<this.lightMapContainers.length;e++){if(this.uvMat.uniforms.averagingWindow={value:n},Array.isArray(this.lightMapContainers[e].object.material)){const l=this.lightMapContainers[e].copied;for(let r=0;r<l.length;r++)l[r]=this.uvMat;this.lightMapContainers[e].object.material=l}else this.lightMapContainers[e].object.material=this.uvMat;this.lightMapContainers[e].object.oldFrustumCulled=this.lightMapContainers[e].object.frustumCulled,this.lightMapContainers[e].object.frustumCulled=!1}const i=this.buffer1Active?this.progressiveLightMap1:this.progressiveLightMap2,s=this.buffer1Active?this.progressiveLightMap2:this.progressiveLightMap1;this.renderer.setRenderTarget(i),this.uvMat.uniforms.previousShadowMap={value:s.texture},this.blurringPlane.material.uniforms.previousShadowMap={value:s.texture},this.buffer1Active=!this.buffer1Active,this.renderer.render(this.scene,a);for(let e=0;e<this.lightMapContainers.length;e++)this.lightMapContainers[e].object.frustumCulled=this.lightMapContainers[e].object.oldFrustumCulled,this.lightMapContainers[e].object.material=this.lightMapContainers[e].basicMat,this.lightMapContainers[e].object.oldScene.attach(this.lightMapContainers[e].object);this.renderer.setRenderTarget(t)}showDebugLightmap(a,n=void 0){if(this.lightMapContainers.length==0){this.warned||(console.warn("Call this after adding the objects!"),this.warned=!0);return}this.labelMesh==null&&(this.labelMaterial=new p({map:this.progressiveLightMap1.texture,side:M}),this.labelPlane=new g(100,100),this.labelMesh=new f(this.labelPlane,this.labelMaterial),this.labelMesh.position.y=250,this.lightMapContainers[0].object.parent.add(this.labelMesh)),n!=null&&this.labelMesh.position.copy(n),this.labelMesh.visible=a}_initializeBlurPlane(a,n=null){const h=new p;h.uniforms={previousShadowMap:{value:null},pixelOffset:{value:1/a},polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:3},h.onBeforeCompile=t=>{t.vertexShader=`#define USE_UV
`+t.vertexShader.slice(0,-1)+"	gl_Position = vec4((uv - 0.5) * 2.0, 1.0, 1.0); }";const i=t.fragmentShader.indexOf("void main() {");t.fragmentShader=`#define USE_UV
`+t.fragmentShader.slice(0,i)+`	uniform sampler2D previousShadowMap;
	uniform float pixelOffset;
`+t.fragmentShader.slice(i-1,-1)+`	gl_FragColor.rgb = (
									texture2D(previousShadowMap, vUv + vec2( pixelOffset,  0.0        )).rgb +
									texture2D(previousShadowMap, vUv + vec2( 0.0        ,  pixelOffset)).rgb +
									texture2D(previousShadowMap, vUv + vec2( 0.0        , -pixelOffset)).rgb +
									texture2D(previousShadowMap, vUv + vec2(-pixelOffset,  0.0        )).rgb +
									texture2D(previousShadowMap, vUv + vec2( pixelOffset,  pixelOffset)).rgb +
									texture2D(previousShadowMap, vUv + vec2(-pixelOffset,  pixelOffset)).rgb +
									texture2D(previousShadowMap, vUv + vec2( pixelOffset, -pixelOffset)).rgb +
									texture2D(previousShadowMap, vUv + vec2(-pixelOffset, -pixelOffset)).rgb)/8.0;
				}`,t.uniforms.previousShadowMap={value:n.texture},t.uniforms.pixelOffset={value:.5/a},h.uniforms=t.uniforms,h.userData.shader=t,this.compiled=!0},this.blurringPlane=new f(new g(1,1),h),this.blurringPlane.name="Blurring Plane",this.blurringPlane.frustumCulled=!1,this.blurringPlane.renderOrder=0,this.blurringPlane.material.depthWrite=!1,this.scene.add(this.blurringPlane)}}export{S as ProgressiveLightMap};
