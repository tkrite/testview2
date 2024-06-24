import{o as h,j as S,k as y,b as C,W as D,p as M,R,N as P,q as x,r as w,s as l,t as E,u as T,c as m,U as c,n as p,v as g,w as A,Z as B,x as U,y as N,l as _}from"./ddd@DwDq534T.js";const f={defines:{NUM_SAMPLES:7,NUM_RINGS:4,NORMAL_TEXTURE:0,DEPTH_PACKING:1,PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},tDiffuse:{value:null},tNormal:{value:null},size:{value:new h(512,512)},cameraNear:{value:1},cameraFar:{value:100},cameraProjectionMatrix:{value:new S},cameraInverseProjectionMatrix:{value:new S},scale:{value:1},intensity:{value:.1},bias:{value:.5},minResolution:{value:0},kernelRadius:{value:100},randomSeed:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		#include <common>

		varying vec2 vUv;

		// #if DIFFUSE_TEXTURE == 1
		// uniform sampler2D tDiffuse;
		// #endif

		uniform sampler2D tDepth;

		#if NORMAL_TEXTURE == 1
		uniform sampler2D tNormal;
		#endif

		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraInverseProjectionMatrix;

		uniform float scale;
		uniform float intensity;
		uniform float bias;
		uniform float kernelRadius;
		uniform float minResolution;
		uniform vec2 size;
		uniform float randomSeed;

		// RGBA depth

		#include <packing>

		vec4 getDefaultColor( const in vec2 screenPosition ) {
			return vec4( 1.0 );
			// #if DIFFUSE_TEXTURE == 1
			// return texture2D( tDiffuse, vUv );
			// #else
			// return vec4( 1.0 );
			// #endif
		}


		float getDepth( const in vec2 screenPosition ) {
			#if DEPTH_PACKING == 1
			return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
			#else
			return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		float getViewZ( const in float depth ) {
			#if PERSPECTIVE_CAMERA == 1
			return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );
			#else
			return orthographicDepthToViewZ( depth, cameraNear, cameraFar );
			#endif
		}

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {
			float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];
			vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, 1.0 );
			clipPosition *= clipW; // unprojection.

			return ( cameraInverseProjectionMatrix * clipPosition ).xyz;
		}

		vec3 getViewNormal( const in vec3 viewPosition, const in vec2 screenPosition ) {
			#if NORMAL_TEXTURE == 1
			return unpackRGBToNormal( texture2D( tNormal, screenPosition ).xyz );
			#else
			return normalize( cross( dFdx( viewPosition ), dFdy( viewPosition ) ) );
			#endif
		}

		float scaleDividedByCameraFar;
		float minResolutionMultipliedByCameraFar;

		float getOcclusion( const in vec3 centerViewPosition, const in vec3 centerViewNormal, const in vec3 sampleViewPosition ) {
			vec3 viewDelta = sampleViewPosition - centerViewPosition;
			float viewDistance = length( viewDelta );
			float scaledScreenDistance = scaleDividedByCameraFar * viewDistance;
			if (viewDistance > 6.0) { return 1.0/(1.0+exp(-(viewDistance))); }  // @DDD@

			return max(0.0, (dot(centerViewNormal, viewDelta) - minResolutionMultipliedByCameraFar) / scaledScreenDistance - bias) / (1.0 + pow2( scaledScreenDistance ) );
		}

		// moving costly divides into consts
		const float ANGLE_STEP = PI2 * float( NUM_RINGS ) / float( NUM_SAMPLES );
		const float INV_NUM_SAMPLES = 1.0 / float( NUM_SAMPLES );


		// const EPSILON2 = 0.00000001;
		void main() {
			float centerDepth = getDepth( vUv );
			if( centerDepth >= ( 1.0 - 0.003907 ) ) {
				gl_FragColor = vec4(1.0);

				// discard;
			} else {

				
			float centerViewZ = getViewZ( centerDepth );
			vec3 viewPosition = getViewPosition( vUv, centerDepth, centerViewZ );

			// float ambientOcclusion = getAmbientOcclusion( viewPosition );


			// precompute some variables require in getOcclusion.
			scaleDividedByCameraFar = scale / cameraFar;
			minResolutionMultipliedByCameraFar = minResolution * cameraFar;
			vec3 centerViewNormal = getViewNormal( viewPosition, vUv );

			// jsfiddle that shows sample pattern: https://jsfiddle.net/a16ff1p7/
			float angle = rand( vUv + randomSeed ) * PI2;
			vec2 radius = vec2( kernelRadius * INV_NUM_SAMPLES ) / size;
			vec2 radiusStep = radius;

			float occlusionSum = 0.0;
			float weightSum = 0.0;

			vec3 total_c2 = vec3(0.0);

			for( int i = 0; i < NUM_SAMPLES; i ++ ) {
				vec2 sampleUv = vUv + vec2( cos( angle ), sin( angle ) ) * radius;
				radius += radiusStep;
				angle += ANGLE_STEP;

				float sampleDepth = getDepth( sampleUv );
				if( sampleDepth >= ( 1.0 - 0.003907 ) ) {
				// if( sampleDepth >= ( 1.0 - EPSILON ) ) {
					continue;
				}

				float sampleViewZ = getViewZ( sampleDepth );
				vec3 sampleViewPosition = getViewPosition( sampleUv, sampleDepth, sampleViewZ );
				occlusionSum += getOcclusion( viewPosition, centerViewNormal, sampleViewPosition );
				weightSum += 1.0;

				total_c2 += vec3(1.0);
			}

			if( weightSum == 0.0 ) discard;

			total_c2 = total_c2 / weightSum;
			vec3 oc = vec3(1.0 - occlusionSum*(intensity/weightSum));
			vec3 oc2 = clamp(oc, 0.0, 1.0);
			vec3 mm = mix(total_c2, oc, oc2);
			mm = mix(mm,oc2, ( 1.0 - oc2 ) * 0.8);
			// mm = clamp(mm,0.0, 1.0);
			
			
			gl_FragColor = vec4(mm, 1.0 );

			}


			//total_c2 = texture2D(tDiffuse, vUv).xyz;
			// gl_FragColor = vec4(total_c2, 1.0 );
			
			// gl_FragColor = vec4(total_c2 * (intensity / weightSum), 1.0 );
			// gl_FragColor = vec4(1.0-total_c2*intensity, 1.0 );
			// gl_FragColor = vec4(1.0);

			// return mm;

			// return occlusionSum * ( intensity / weightSum );

		}`},u={name:"DepthLimitedBlurShader",defines:{KERNEL_RADIUS:4,DEPTH_PACKING:1,PERSPECTIVE_CAMERA:1},uniforms:{tDiffuse:{value:null},size:{value:new h(512,512)},sampleUvOffsets:{value:[new h(0,0)]},sampleWeights:{value:[1]},tDepth:{value:null},cameraNear:{value:10},cameraFar:{value:1e3},depthCutoff:{value:10}},vertexShader:`

		#include <common>

		uniform vec2 size;

		varying vec2 vUv;
		varying vec2 vInvSize;

		void main() {
			vUv = uv;
			vInvSize = 1.0 / size;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		#include <common>
		#include <packing>

		uniform sampler2D tDiffuse;
		uniform sampler2D tDepth;

		uniform float cameraNear;
		uniform float cameraFar;
		uniform float depthCutoff;

		uniform vec2 sampleUvOffsets[ KERNEL_RADIUS + 1 ];
		uniform float sampleWeights[ KERNEL_RADIUS + 1 ];

		varying vec2 vUv;
		varying vec2 vInvSize;

		float getDepth( const in vec2 screenPosition ) {
			#if DEPTH_PACKING == 1
			return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
			#else
			return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		float getViewZ( const in float depth ) {
			#if PERSPECTIVE_CAMERA == 1
			return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );
			#else
			return orthographicDepthToViewZ( depth, cameraNear, cameraFar );
			#endif
		}

		void main() {
			float depth = getDepth( vUv );
			if( depth >= ( 1.0 - EPSILON ) ) {
				discard;
			}

			float centerViewZ = -getViewZ( depth );
			bool rBreak = false, lBreak = false;

			float weightSum = sampleWeights[0];
			vec4 diffuseSum = texture2D( tDiffuse, vUv ) * weightSum;

			for( int i = 1; i <= KERNEL_RADIUS; i ++ ) {

				float sampleWeight = sampleWeights[i];
				vec2 sampleUvOffset = sampleUvOffsets[i] * vInvSize;

				vec2 sampleUv = vUv + sampleUvOffset;
				float viewZ = -getViewZ( getDepth( sampleUv ) );

				if( abs( viewZ - centerViewZ ) > depthCutoff ) rBreak = true;

				if( ! rBreak ) {
					diffuseSum += texture2D( tDiffuse, sampleUv ) * sampleWeight;
					weightSum += sampleWeight;
				}

				sampleUv = vUv - sampleUvOffset;
				viewZ = -getViewZ( getDepth( sampleUv ) );

				if( abs( viewZ - centerViewZ ) > depthCutoff ) lBreak = true;

				if( ! lBreak ) {
					diffuseSum += texture2D( tDiffuse, sampleUv ) * sampleWeight;
					weightSum += sampleWeight;
				}

			}

			gl_FragColor = diffuseSum / weightSum;
		}`},d={createSampleWeights:function(r,e){const t=[];for(let a=0;a<=r;a++)t.push(I(a,e));return t},createSampleOffsets:function(r,e){const t=[];for(let a=0;a<=r;a++)t.push(e.clone().multiplyScalar(a));return t},configure:function(r,e,t,a){r.defines.KERNEL_RADIUS=e,r.uniforms.sampleUvOffsets.value=d.createSampleOffsets(e,a),r.uniforms.sampleWeights.value=d.createSampleWeights(e,t),r.needsUpdate=!0}};function I(r,e){return Math.exp(-(r*r)/(2*(e*e)))/(Math.sqrt(2*Math.PI)*e)}const v={name:"UnpackDepthRGBAShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		#include <packing>

		void main() {

			float depth = 1.0 - unpackRGBAToDepth( texture2D( tDiffuse, vUv ) );
			gl_FragColor = vec4( vec3( depth ), opacity );

		}`};class V extends y{constructor(e,t,a,i,s){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.depthTexture=a,this.supportsDepthTextureExtension=a!==void 0?a:!1,this.supportsNormalTexture=i!==void 0?i:!1,this.originalClearColor=new C,this._oldClearColor=new C,this.oldClearAlpha=1,this.params={output:0,saoBias:.5,saoIntensity:.18,saoScale:1,saoKernelRadius:100,saoMinResolution:0,saoBlur:!0,saoBlurRadius:8,saoBlurStdDev:4,saoBlurDepthCutoff:.01},this.resolution=s!==void 0?new h(s.x,s.y):new h(256,256),this.saoRenderTarget=new D(this.resolution.x,this.resolution.y,{minFilter:M,magFilter:M,format:R}),this.blurIntermediateRenderTarget=this.saoRenderTarget.clone(),this.beautyRenderTarget=this.saoRenderTarget.clone(),this.normalRenderTarget=new D(this.resolution.x,this.resolution.y,{minFilter:P,magFilter:P,format:R}),this.depthRenderTarget=this.normalRenderTarget.clone(),this.depthMaterial=new x,this.depthMaterial.depthPacking=w,this.depthMaterial.blending=l,this.depthMaterialReplacer=new E,this.normalMaterial=new T,this.normalMaterial.blending=THREE.NoBlending,this.normalMaterialReplacer=new E,f===void 0&&console.error("THREE.SAOPass relies on SAOShader"),this.saoMaterial=new m({defines:Object.assign({},f.defines),fragmentShader:f.fragmentShader,vertexShader:f.vertexShader,uniforms:c.clone(f.uniforms)}),this.saoMaterial.extensions.derivatives=!0,this.saoMaterial.defines.DEPTH_PACKING=this.supportsDepthTextureExtension?0:1,this.saoMaterial.defines.NORMAL_TEXTURE=this.supportsNormalTexture?1:0,this.saoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.saoMaterial.uniforms.tDepth.value=this.supportsDepthTextureExtension?a:this.depthRenderTarget.texture,this.saoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.saoMaterial.uniforms.size.value.set(this.resolution.x,this.resolution.y),this.saoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.saoMaterial.uniforms.cameraProjectionMatrix.value=this.camera.projectionMatrix,this.saoMaterial.blending=l,u===void 0&&console.error("THREE.SAOPass relies on DepthLimitedBlurShader"),this.vBlurMaterial=new m({uniforms:c.clone(u.uniforms),defines:Object.assign({},u.defines),vertexShader:u.vertexShader,fragmentShader:u.fragmentShader}),this.vBlurMaterial.defines.DEPTH_PACKING=this.supportsDepthTextureExtension?0:1,this.vBlurMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.vBlurMaterial.uniforms.tDiffuse.value=this.saoRenderTarget.texture,this.vBlurMaterial.uniforms.tDepth.value=this.supportsDepthTextureExtension?a:this.depthRenderTarget.texture,this.vBlurMaterial.uniforms.size.value.set(this.resolution.x,this.resolution.y),this.vBlurMaterial.blending=l,this.hBlurMaterial=new m({uniforms:c.clone(u.uniforms),defines:Object.assign({},u.defines),vertexShader:u.vertexShader,fragmentShader:u.fragmentShader}),this.hBlurMaterial.defines.DEPTH_PACKING=this.supportsDepthTextureExtension?0:1,this.hBlurMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.hBlurMaterial.uniforms.tDiffuse.value=this.blurIntermediateRenderTarget.texture,this.hBlurMaterial.uniforms.tDepth.value=this.supportsDepthTextureExtension?a:this.depthRenderTarget.texture,this.hBlurMaterial.uniforms.size.value.set(this.resolution.x,this.resolution.y),this.hBlurMaterial.blending=l,p===void 0&&console.error("THREE.SAOPass relies on CopyShader"),this.materialCopy=new m({uniforms:c.clone(p.uniforms),vertexShader:p.vertexShader,fragmentShader:p.fragmentShader,blending:l}),this.materialCopy.transparent=!0,this.materialCopy.depthTest=!1,this.materialCopy.depthWrite=!1,this.materialCopy.blending=g,this.materialCopy.blendSrc=A,this.materialCopy.blendDst=B,this.materialCopy.blendEquation=U,this.materialCopy.blendSrcAlpha=N,this.materialCopy.blendDstAlpha=B,this.materialCopy.blendEquationAlpha=U,v===void 0&&console.error("THREE.SAOPass relies on UnpackDepthRGBAShader"),this.depthCopy=new m({uniforms:c.clone(v.uniforms),vertexShader:v.vertexShader,fragmentShader:v.fragmentShader,blending:l}),this.fsQuad=new _(null),this.update_parameter(),this.previous={}}update_parameter(){this.saoMaterial.uniforms.bias.value=this.params.saoBias,this.saoMaterial.uniforms.intensity.value=this.params.saoIntensity,this.saoMaterial.uniforms.scale.value=this.params.saoScale,this.saoMaterial.uniforms.kernelRadius.value=this.params.saoKernelRadius,this.saoMaterial.uniforms.minResolution.value=this.params.saoMinResolution,this.saoMaterial.uniforms.cameraNear.value=this.camera.near,this.saoMaterial.uniforms.cameraFar.value=this.camera.far;const e=this.params.saoBlurDepthCutoff*(this.camera.far-this.camera.near);this.vBlurMaterial.uniforms.depthCutoff.value=e,this.hBlurMaterial.uniforms.depthCutoff.value=e,this.vBlurMaterial.uniforms.cameraNear.value=this.camera.near,this.vBlurMaterial.uniforms.cameraFar.value=this.camera.far,this.hBlurMaterial.uniforms.cameraNear.value=this.camera.near,this.hBlurMaterial.uniforms.cameraFar.value=this.camera.far;let t=this.materialCopy;this.params.output===0?t.blending=g:t.blending=l}render(e,t,a){if(this.renderToScreen&&(this.materialCopy.blending=l,this.materialCopy.uniforms.tDiffuse.value=a.texture,this.materialCopy.needsUpdate=!0,this.renderPass(e,this.materialCopy,null)),this.params.output===1)return;e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const i=e.autoClear;e.autoClear=!1,e.setRenderTarget(this.depthRenderTarget),e.clear(),this.params.saoBlurRadius=Math.floor(this.params.saoBlurRadius),(this.prevStdDev!==this.params.saoBlurStdDev||this.prevNumSamples!==this.params.saoBlurRadius)&&(d.configure(this.vBlurMaterial,this.params.saoBlurRadius,this.params.saoBlurStdDev,new h(0,1)),d.configure(this.hBlurMaterial,this.params.saoBlurRadius,this.params.saoBlurStdDev,new h(1,0)),this.prevStdDev=this.params.saoBlurStdDev,this.prevNumSamples=this.params.saoBlurRadius),e.setClearColor(0),e.setRenderTarget(this.beautyRenderTarget),e.clear(),e.render(this.scene,this.camera);{if(!this.supportsDepthTextureExtension){const o=this.depthMaterialReplacer;o.replaceMaterials(this.scene,()=>{const n=new x;return n.blending=l,n.depthPacking=w,n}),o.renderPass(this.scene,this.camera,e,this.depthRenderTarget,0,1),o.restoreMaterials(this.scene)}if(this.supportsNormalTexture){const o=this.normalMaterialReplacer;o.replaceMaterials(this.scene,()=>{const n=new T;return n.blending=l,n}),o.renderPass(this.scene,this.camera,e,this.normalRenderTarget,7829503,1),o.restoreMaterials(this.scene)}}this.renderPass(e,this.saoMaterial,this.saoRenderTarget,16777215,1),this.params.saoBlur&&(this.renderPass(e,this.vBlurMaterial,this.blurIntermediateRenderTarget,16777215,1),this.renderPass(e,this.hBlurMaterial,this.saoRenderTarget,16777215,1));let s=this.materialCopy;this.params.output===3?this.supportsDepthTextureExtension?(this.materialCopy.uniforms.tDiffuse.value=this.beautyRenderTarget.depthTexture,this.materialCopy.needsUpdate=!0):(this.depthCopy.uniforms.tDiffuse.value=this.depthRenderTarget.texture,this.depthCopy.needsUpdate=!0,s=this.depthCopy):this.params.output===4?(this.materialCopy.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.materialCopy.needsUpdate=!0):(this.materialCopy.uniforms.tDiffuse.value=this.saoRenderTarget.texture,this.materialCopy.needsUpdate=!0),this.params.output===0?s.blending=g:s.blending=l,this.renderPass(e,s,this.renderToScreen?null:a),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=i}renderPass(e,t,a,i,s){e.getClearColor(this.originalClearColor);const o=e.getClearAlpha(),n=e.autoClear;e.setRenderTarget(a),e.autoClear=!1,i!=null&&(e.setClearColor(i),e.setClearAlpha(s||0),e.clear()),this.fsQuad.material=t,this.fsQuad.render(e),e.autoClear=n,e.setClearColor(this.originalClearColor),e.setClearAlpha(o)}renderOverride(e,t,a,i,s){e.getClearColor(this.originalClearColor);const o=e.getClearAlpha(),n=e.autoClear;e.setRenderTarget(a),e.autoClear=!1,i=t.clearColor||i,s=t.clearAlpha||s,i!=null&&(e.setClearColor(i),e.setClearAlpha(s||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=n,e.setClearColor(this.originalClearColor),e.setClearAlpha(o)}setSize(e,t){let i=Math.floor(e*.5),s=Math.floor(t*.5);i=i<1?1:i,s=s<1?1:s,this.beautyRenderTarget.setSize(i,s),this.saoRenderTarget.setSize(i,s),this.blurIntermediateRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(i,s),this.depthRenderTarget.setSize(i,s),this.saoMaterial.uniforms.size.value.set(e,t),this.saoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.saoMaterial.uniforms.cameraProjectionMatrix.value=this.camera.projectionMatrix,this.saoMaterial.needsUpdate=!0,this.vBlurMaterial.uniforms.size.value.set(e,t),this.vBlurMaterial.needsUpdate=!0,this.hBlurMaterial.uniforms.size.value.set(e,t),this.hBlurMaterial.needsUpdate=!0,this.update_parameter()}}V.OUTPUT={Beauty:1,Default:0,SAO:2,Depth:3,Normal:4};export{V as SAOPass};
