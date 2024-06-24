import{k as d,n as f,U as t,c as n,s,l as h,W as m,aa as c,h as p}from"./ddd@DwDq534T.js";const r={name:"LuminosityShader",uniforms:{tDiffuse:{value:null}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float l = luminance( texel.rgb );

			gl_FragColor = vec4( l, l, l, texel.w );

		}`},u={uniforms:{tDiffuse:{value:null},averageLuminance:{value:1},luminanceMap:{value:null},maxLuminance:{value:16},minLuminance:{value:.01},middleGrey:{value:.6}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		uniform float middleGrey;
		uniform float minLuminance;
		uniform float maxLuminance;
		#ifdef ADAPTED_LUMINANCE
			uniform sampler2D luminanceMap;
		#else
			uniform float averageLuminance;
		#endif

		float linearToRelativeLuminance( const in vec3 color ) {
			vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );
			return dot( weights, color.rgb );
		}


		vec3 ToneMap( vec3 vColor ) {
			#ifdef ADAPTED_LUMINANCE
				// Get the calculated average luminance
				float fLumAvg = texture2D(luminanceMap, vec2(0.5, 0.5)).r;
			#else
				float fLumAvg = averageLuminance;
			#endif

			// Calculate the luminance of the current pixel
			float fLumPixel = linearToRelativeLuminance( vColor );

			// Apply the modified operator (Eq. 4)
			float fLumScaled = (fLumPixel * middleGrey) / max( minLuminance, fLumAvg );

			float fLumCompressed = (fLumScaled * (1.0 + (fLumScaled / (maxLuminance * maxLuminance)))) / (1.0 + fLumScaled);
			return fLumCompressed * vColor;
		}

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			gl_FragColor = vec4( ToneMap( texel.xyz ), texel.w );

		}`},l=256;class T extends d{constructor(e,i){super(),this.resolution=i!==void 0?i:256,this.resolution=l,this.needsInit=!0,this.adaptive=e!==void 0?!!e:!0,this.luminanceRT=null,this.previousLuminanceRT=null,this.currentLuminanceRT=null,f===void 0&&console.error("THREE.AdaptiveToneMappingPass relies on CopyShader");const a=f;this.copyUniforms=t.clone(a.uniforms),this.materialCopy=new n({uniforms:this.copyUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader,blending:s,depthTest:!1}),r===void 0&&console.error("THREE.AdaptiveToneMappingPass relies on LuminosityShader"),this.materialLuminance=new n({uniforms:t.clone(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,blending:s}),this.adaptLuminanceShader={defines:{MIP_LEVEL_1X1:(Math.log(this.resolution/3)/Math.log(2)).toFixed(1)},uniforms:{lastLum:{value:null},currentLum:{value:null},minLuminance:{value:.01},delta:{value:.016},tau:{value:1}},vertexShader:`varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`varying vec2 vUv;

				uniform sampler2D lastLum;
				uniform sampler2D currentLum;
				uniform float minLuminance;
				uniform float delta;
				uniform float tau;

				void main() {

					vec4 lastLum = texture2D( lastLum, vUv, MIP_LEVEL_1X1 );
					vec4 currentLum = texture2D( currentLum, vUv, MIP_LEVEL_1X1 );

					float fLastLum = max( minLuminance, lastLum.r );
					float fCurrentLum = max( minLuminance, currentLum.r );

					//The adaption seems to work better in extreme lighting differences
					//if the input luminance is squared.
					fCurrentLum *= fCurrentLum;

					// Adapt the luminance using Pattanaik's technique

					float fAdaptedLum = fLastLum + (fCurrentLum - fLastLum) * (1.0 - exp(-delta * tau));
					// fAdaptedLum = pow(fAdaptedLum, 0.98);
					// float fAdaptedLum = fLastLum + (fCurrentLum - fLastLum) *0.05;//* (1.0 - exp(-delta * tau));
					// fAdaptedLum = fCurrentLum;
					// "fAdaptedLum = sqrt(fAdaptedLum);
					
					// gl_FragColor.r = fAdaptedLum;
					gl_FragColor = vec4(fAdaptedLum, fAdaptedLum, fAdaptedLum, 1.0);
				}`},this.materialAdaptiveLum=new n({uniforms:t.clone(this.adaptLuminanceShader.uniforms),vertexShader:this.adaptLuminanceShader.vertexShader,fragmentShader:this.adaptLuminanceShader.fragmentShader,defines:Object.assign({},this.adaptLuminanceShader.defines),blending:s}),u===void 0&&console.error("THREE.AdaptiveToneMappingPass relies on ToneMapShader"),this.materialToneMap=new n({uniforms:t.clone(u.uniforms),vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:s}),this.fsQuad=new h(null),this.previous_time=performance.now()}render(e,i,a,o){this.resolution=l,this.needsInit&&(this.reset(e),this.needsInit=!1),this.adaptive&&(this.fsQuad.material=this.materialLuminance,this.materialLuminance.uniforms.tDiffuse.value=a.texture,e.setRenderTarget(this.currentLuminanceRT),this.fsQuad.render(e),this.fsQuad.material=this.materialAdaptiveLum,this.materialAdaptiveLum.uniforms.delta.value=o==0?performance.now()-this.previous_time:o,this.previous_time=performance.now(),this.materialAdaptiveLum.uniforms.lastLum.value=this.previousLuminanceRT.texture,this.materialAdaptiveLum.uniforms.currentLum.value=this.currentLuminanceRT.texture,e.setRenderTarget(this.luminanceRT),this.fsQuad.render(e),this.fsQuad.material=this.materialCopy,this.copyUniforms.tDiffuse.value=this.luminanceRT.texture,e.setRenderTarget(this.previousLuminanceRT),this.fsQuad.render(e)),this.fsQuad.material=this.materialToneMap,this.materialToneMap.uniforms.tDiffuse.value=a.texture,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(),this.fsQuad.render(e))}reset(){this.resolution=l,this.luminanceRT&&this.luminanceRT.dispose(),this.currentLuminanceRT&&this.currentLuminanceRT.dispose(),this.previousLuminanceRT&&this.previousLuminanceRT.dispose(),this.luminanceRT=new m(this.resolution,this.resolution,{type:THREE.HalfFloatType}),this.luminanceRT.texture.name="AdaptiveToneMappingPass.l",this.luminanceRT.texture.generateMipmaps=!1,this.previousLuminanceRT=new m(this.resolution,this.resolution,{type:THREE.HalfFloatType}),this.previousLuminanceRT.texture.name="AdaptiveToneMappingPass.pl",this.previousLuminanceRT.texture.generateMipmaps=!1,this.currentLuminanceRT=new m(this.resolution,this.resolution,{minFilter:c,generateMipmaps:!0,type:THREE.HalfFloatType}),this.currentLuminanceRT.texture.name="AdaptiveToneMappingPass.cl",this.adaptive&&(this.materialToneMap.defines.ADAPTED_LUMINANCE="",this.materialToneMap.uniforms.luminanceMap.value=this.luminanceRT.texture),this.fsQuad.material=new p({color:7829367}),this.materialLuminance.needsUpdate=!0,this.materialAdaptiveLum.needsUpdate=!0,this.materialToneMap.needsUpdate=!0}setAdaptive(e){e?(this.adaptive=!0,this.materialToneMap.defines.ADAPTED_LUMINANCE="",this.materialToneMap.uniforms.luminanceMap.value=this.luminanceRT.texture):(this.adaptive=!1,delete this.materialToneMap.defines.ADAPTED_LUMINANCE,this.materialToneMap.uniforms.luminanceMap.value=null),this.materialToneMap.needsUpdate=!0}setAdaptionRate(e){e&&(this.materialAdaptiveLum.uniforms.tau.value=Math.abs(e))}setMinLuminance(e){e&&(this.materialToneMap.uniforms.minLuminance.value=e,this.materialAdaptiveLum.uniforms.minLuminance.value=e)}setMaxLuminance(e){e&&(this.materialToneMap.uniforms.maxLuminance.value=e)}setAverageLuminance(e){e&&(this.materialToneMap.uniforms.averageLuminance.value=e)}setMiddleGrey(e){e&&(this.materialToneMap.uniforms.middleGrey.value=e)}dispose(){this.luminanceRT&&this.luminanceRT.dispose(),this.previousLuminanceRT&&this.previousLuminanceRT.dispose(),this.currentLuminanceRT&&this.currentLuminanceRT.dispose(),this.materialLuminance&&this.materialLuminance.dispose(),this.materialAdaptiveLum&&this.materialAdaptiveLum.dispose(),this.materialCopy&&this.materialCopy.dispose(),this.materialToneMap&&this.materialToneMap.dispose()}}export{T as AdaptiveToneMappingPass};
