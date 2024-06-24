import{o as E,j as x,z as y,k as N,W as T,H as P,c as d,U as p,s as n,u as S,t as U,n as g,w as V,Z as b,x as D,y as A,l as O,b as _,I as F,J as L,K as I,N as w,v as z,T as k,R as j,X as W,Y as R}from"./ddd@DwDq534T.js";import{P as f,g as H,S as G}from"./SimplexNoise@DJLmKNIm.js";const m={name:"HBAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,SAMPLE_VECTORS:C(16),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0,SAMPLING_FROM_NOISE:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new E},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new x},cameraProjectionMatrixInverse:{value:new x},radius:{value:2},distanceExponent:{value:1},bias:{value:.01}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;		
		uniform float radius;
		uniform float distanceExponent;
		uniform float bias;
		
		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		const vec4 sampleKernel[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1    
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1    
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
            vec2 size = vec2(textureSize(tDepth, 0));
            ivec2 p = ivec2(uv * size);
            float c0 = fetchDepth(p);
            float l2 = fetchDepth(p - ivec2(2, 0));
            float l1 = fetchDepth(p - ivec2(1, 0));
            float r1 = fetchDepth(p + ivec2(1, 0));
            float r2 = fetchDepth(p + ivec2(2, 0));
            float b2 = fetchDepth(p - ivec2(0, 2));
            float b1 = fetchDepth(p - ivec2(0, 1));
            float t1 = fetchDepth(p + ivec2(0, 1));
            float t2 = fetchDepth(p + ivec2(0, 2));
            float dl = abs((2.0 * l1 - l2) - c0);
            float dr = abs((2.0 * r1 - r2) - c0);
            float db = abs((2.0 * b1 - b2) - c0);
            float dt = abs((2.0 * t1 - t2) - c0);
            vec3 ce = getViewPosition(uv, c0).xyz;
            vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
                                  : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
            vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
                                  : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
            return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}
		
		float getOcclusion(const vec2 uv, const vec3 viewPos, const vec3 viewNormal, const float depth, const vec4 sampleViewDir, inout float totalWeight) {
			
			vec3 sampleViewPos = viewPos + sampleViewDir.xyz * radius * pow(sampleViewDir.w, distanceExponent);
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleDepth = getDepth(sampleUv);
			float distSample = abs(getViewZ(sampleDepth));
			float distWorld = abs(sampleViewPos.z);
			float distanceFalloffToUse = radius;
			float rangeCheck = smoothstep(0.0, 1.0, distanceFalloffToUse / (abs(distSample - distWorld)));
			float weight = dot(viewNormal, sampleViewDir.xyz);
			vec2 diff = (uv - sampleUv) * resolution;
			vec2 clipRangeCheck = step(0., sampleUv) * step(sampleUv, vec2(1.));
			float occlusion = rangeCheck * weight * step(distSample + bias, distWorld) * step(0.707, dot(diff, diff)) * clipRangeCheck.x * clipRangeCheck.y;
			totalWeight += weight;

			return occlusion;
		}
		
		void main() {
			float depth = getDepth(vUv.xy);
			if (depth == 1.0) {
				discard;
				return;
			}
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);
			// float dotProduct = dot(viewNormal, normal(viewPos));
			// viewNormal = viewNormal * sign(dotProduct);

			
			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
  			vec3 tangent = normalize(randomVec - viewNormal * dot(randomVec, viewNormal));
      		vec3 bitangent = cross(viewNormal, tangent);
      		mat3 kernelMatrix = mat3(tangent, bitangent, viewNormal);

			float ao = 0.0, totalWeight = 0.0;
			for (int i = 0; i < SAMPLES; i++) {		
				#if SAMPLING_FROM_NOISE == 1
					vec4 sampleNoise = noiseTexel;
					if (i != 0) {
						const vec4 hn = vec4(0.618033988749895, 0.3247179572447458, 0.2207440846057596, 0.1673039782614187);
						sampleNoise = fract(sampleNoise + hn * float(i));
						sampleNoise = mix(sampleNoise, 1.0 - sampleNoise, step(0.5, sampleNoise)) * 2.0;
					}
					vec3 hemisphereDir = normalize(kernelMatrix * vec3(sampleNoise.xy * 2. - 1., sampleNoise.z));
					vec4 sampleViewDir = vec4(hemisphereDir, sampleNoise.a);
				#else
					vec4 sampleViewDir = sampleKernel[i];
					sampleViewDir.xyz = normalize(kernelMatrix * sampleViewDir.xyz);
				#endif
				float occlusion = getOcclusion(vUv, viewPos, viewNormal, depth, sampleViewDir, totalWeight);
				ao += occlusion;
			}		
			if (totalWeight > 0.) { 
				ao /= totalWeight;
			}
			ao = clamp(1. - ao, 0., 1.);
			gl_FragColor = FRAGMENT_OUTPUT;
		}`},v={name:"HBAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDepth;

		uniform float cameraNear;
		uniform float cameraFar;

		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		void main() {

			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`};function C(l){const e=Z(l);let t="vec4[SAMPLES](";for(let a=0;a<l;a++){const i=e[a];t+=`vec4(${i.x}, ${i.y}, ${i.z}, ${i.w})`,a<l-1&&(t+=",")}return t+=")",t}function Z(l){const e=[];for(let t=0;t<l;t++){const a=t*Math.PI*(3-Math.sqrt(5)),i=Math.sqrt(.99-t/(l-1)*.98),s=Math.sqrt(1-i*i),r=Math.cos(a)*s,o=Math.sin(a)*s,h=8,u=Math.floor(l/h);let M=1-(Math.floor(t/h)+t%h*u)/l;M=.1+.9*M,e.push(new y(r,o,i,M))}return e}class c extends N{constructor(e,t,a,i,s){super(),this.width=a!==void 0?a:512,this.height=i!==void 0?i:512,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=new Map,this.rings=4,this.samples=16,this.noiseTexture=this.generateNoise(),this.hbaoRenderTarget=new T(this.width,this.height,{type:P}),this.pdRenderTarget=this.hbaoRenderTarget.clone(),this.hbaoMaterial=new d({defines:Object.assign({},m.defines),uniforms:p.clone(m.uniforms),vertexShader:m.vertexShader,fragmentShader:m.fragmentShader,blending:n,depthTest:!1,depthWrite:!1}),this.hbaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.hbaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.hbaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.hbaoMaterial.uniforms.cameraNear.value=this.camera.near,this.hbaoMaterial.uniforms.cameraFar.value=this.camera.far,this.hbaoMaterial.uniforms.radius.value=2,this.hbaoMaterial.uniforms.distanceExponent.value=2,this.hbaoMaterial.uniforms.bias.value=.01,this.normalMaterial=new S,this.normalMaterial.blending=n,this.materialReplacer=new U,this.pdMaterial=new d({defines:Object.assign({},f.defines),uniforms:p.clone(f.uniforms),vertexShader:f.vertexShader,fragmentShader:f.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.hbaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.noiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.depthRenderMaterial=new d({defines:Object.assign({},v.defines),uniforms:p.clone(v.uniforms),vertexShader:v.vertexShader,fragmentShader:v.fragmentShader,blending:n}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new d({uniforms:p.clone(g.uniforms),vertexShader:g.vertexShader,fragmentShader:g.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:V,blendDst:b,blendEquation:D,blendSrcAlpha:A,blendDstAlpha:b,blendEquationAlpha:D}),this.fsQuad=new O(null),this.originalClearColor=new _,this.setTextures(s?s.depthTexture:void 0,s?s.normalTexture:void 0)}dispose(){this.noiseTexture.dispose(),this.normalRenderTarget.dispose(),this.hbaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this.fsQuad.dispose()}setTextures(e,t){e!==void 0?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new F(this.width,this.height),this.depthTexture.format=L,this.depthTexture.type=I,this.normalRenderTarget=new T(this.width,this.height,{minFilter:w,magFilter:w,type:P,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);const a=this.normalTexture?1:0,i=this.depthTexture===this.normalTexture?1:0;this.hbaoMaterial.defines.NORMAL_VECTOR_TYPE=a,this.hbaoMaterial.defines.DEPTH_VALUE_SOURCE=i,this.hbaoMaterial.uniforms.tNormal.value=this.normalTexture,this.hbaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=a,this.pdMaterial.defines.DEPTH_VALUE_SOURCE=i,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}updateHbaoMaterial(e){e.radius!==void 0&&(this.hbaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.hbaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.bias!==void 0&&(this.hbaoMaterial.uniforms.bias.value=e.bias),e.samples!==void 0&&e.samples!==this.hbaoMaterial.defines.SAMPLES&&(this.hbaoMaterial.defines.SAMPLES=e.samples,this.hbaoMaterial.defines.SAMPLE_VECTORS=C(e.samples),this.hbaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.rings!==void 0&&e.rings!==this.rings&&(this.rings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.samples&&(this.samples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=e.samples,this.pdMaterial.defines.SAMPLE_VECTORS=H(e.samples,this.rings),this.pdMaterial.needsUpdate=!0)}render(e,t,a){if(this._renderGBuffer){const i=this.materialReplacer;i.replaceMaterials(this.scene,()=>{const s=new S;return s.blending=n,s}),i.renderPass(this.scene,this.camera,e,this.normalRenderTarget,7829503,1),i.restoreMaterials(this.scene)}switch(this.hbaoMaterial.uniforms.cameraNear.value=this.camera.near,this.hbaoMaterial.uniforms.cameraFar.value=this.camera.far,this.hbaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.hbaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.renderPass(e,this.hbaoMaterial,this.hbaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case c.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=a.texture,this.copyMaterial.blending=n,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case c.OUTPUT.HBAO:this.copyMaterial.uniforms.tDiffuse.value=this.hbaoRenderTarget.texture,this.copyMaterial.blending=n,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case c.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=n,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case c.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case c.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=n,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case c.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=a.texture,this.copyMaterial.blending=n,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=z,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.HBAOPass: Unknown output type.")}}renderPass(e,t,a,i,s){e.getClearColor(this.originalClearColor);const r=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(a),e.autoClear=!1,i!=null&&(e.setClearColor(i),e.setClearAlpha(s||0),e.clear()),this.fsQuad.material=t,this.fsQuad.render(e),e.autoClear=o,e.setClearColor(this.originalClearColor),e.setClearAlpha(r)}renderOverride(e,t,a,i,s){e.getClearColor(this.originalClearColor);const r=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(a),e.autoClear=!1,i=t.clearColor||i,s=t.clearAlpha||s,i!=null&&(e.setClearColor(i),e.setClearAlpha(s||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this.originalClearColor),e.setClearAlpha(r)}setSize(e,t){this.width=e,this.height=t,this.hbaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.hbaoMaterial.uniforms.resolution.value.set(e,t),this.hbaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.hbaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}overrideVisibility(){const e=this.scene,t=this._visibilityCache;e.traverse(function(a){t.set(a,a.visible),(a.isPoints||a.isLine)&&(a.visible=!1)})}restoreVisibility(){const e=this.scene,t=this._visibilityCache;e.traverse(function(a){const i=t.get(a);a.visible=i}),t.clear()}generateNoise(e=64){const t=new G,a=e*e*4,i=new Uint8Array(a);for(let r=0;r<e;r++)for(let o=0;o<e;o++){const h=r,u=o;i[(r*e+o)*4]=(t.noise(h,u)+1)*255,i[(r*e+o)*4+1]=(t.noise(h+e,u)+1)*255,i[(r*e+o)*4+2]=(t.noise(h,u+e)+1)*255,i[(r*e+o)*4+3]=(t.noise(h+e,u+e)+1)*255}const s=new k(i,e,e,j,W);return s.wrapS=R,s.wrapT=R,s.needsUpdate=!0,s}}c.OUTPUT={Default:0,Diffuse:1,Depth:2,Normal:3,HBAO:4,Denoise:5};export{c as HBAOPass};
