import{M as j,P as N,b as S,a9 as E,j as U,W as L,H as V,c as B,U as H,V as v,z as F,Q as A,o as q,am as I,d as Q,Y as O,aR as k}from"./ddd@DwDq534T.js";import{Reflector as z}from"./Reflector@Y262dkt1.js";class y extends j{constructor(h,t={}){super(h),this.isRefractor=!0,this.type="Refractor",this.camera=new N;const n=this,_=t.color!==void 0?new S(t.color):new S(8355711),M=t.textureWidth||512,b=t.textureHeight||512,W=t.clipBias||0,m=t.shader||y.RefractorShader,D=t.multisample!==void 0?t.multisample:4,i=this.camera;i.matrixAutoUpdate=!1,i.userData.refractor=!0;const R=new E,f=new U,d=new L(M,b,{samples:D,type:V});this.material=new B({name:m.name!==void 0?m.name:"unspecified",uniforms:H.clone(m.uniforms),vertexShader:m.vertexShader,fragmentShader:m.fragmentShader,transparent:!0}),this.material.uniforms.color.value=_,this.material.uniforms.tDiffuse.value=d.texture,this.material.uniforms.textureMatrix.value=f;const C=function(){const e=new v,a=new v,r=new U,c=new v,s=new v;return function(u){return e.setFromMatrixPosition(n.matrixWorld),a.setFromMatrixPosition(u.matrixWorld),c.subVectors(e,a),r.extractRotation(n.matrixWorld),s.set(0,0,1),s.applyMatrix4(r),c.dot(s)<0}}(),w=function(){const e=new v,a=new v,r=new A,c=new v;return function(){n.matrixWorld.decompose(a,r,c),e.set(0,0,1).applyQuaternion(r).normalize(),e.negate(),R.setFromNormalAndCoplanarPoint(e,a)}}(),g=function(){const e=new E,a=new F,r=new F;return function(s){i.matrixWorld.copy(s.matrixWorld),i.matrixWorldInverse.copy(i.matrixWorld).invert(),i.projectionMatrix.copy(s.projectionMatrix),i.far=s.far,e.copy(R),e.applyMatrix4(i.matrixWorldInverse),a.set(e.normal.x,e.normal.y,e.normal.z,e.constant);const o=i.projectionMatrix;r.x=(Math.sign(a.x)+o.elements[8])/o.elements[0],r.y=(Math.sign(a.y)+o.elements[9])/o.elements[5],r.z=-1,r.w=(1+o.elements[10])/o.elements[14],a.multiplyScalar(2/a.dot(r)),o.elements[2]=a.x,o.elements[6]=a.y,o.elements[10]=a.z+1-W,o.elements[14]=a.w}}();function p(e){f.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),f.multiply(e.projectionMatrix),f.multiply(e.matrixWorldInverse),f.multiply(n.matrixWorld)}function x(e,a,r){n.visible=!1;const c=e.getRenderTarget(),s=e.xr.enabled,o=e.shadowMap.autoUpdate;e.xr.enabled=!1,e.shadowMap.autoUpdate=!1,e.setRenderTarget(d),e.autoClear===!1&&e.clear(),e.render(a,i),e.xr.enabled=s,e.shadowMap.autoUpdate=o,e.setRenderTarget(c);const u=r.viewport;u!==void 0&&e.state.viewport(u),n.visible=!0}this.onBeforeRender=function(e,a,r){r.userData.refractor!==!0&&C(r)&&(w(),p(r),g(r),x(e,a,r))},this.getRenderTarget=function(){return d},this.dispose=function(){d.dispose(),n.material.dispose()}}}y.RefractorShader={name:"RefractorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`

		uniform mat4 textureMatrix;

		varying vec4 vUv;

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform vec3 color;
		uniform sampler2D tDiffuse;

		varying vec4 vUv;

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};class T extends j{constructor(h,t={}){super(h),this.isWater=!0,this.type="Water";const n=this,_=t.color!==void 0?new S(t.color):new S(16777215),M=t.textureWidth!==void 0?t.textureWidth:512,b=t.textureHeight!==void 0?t.textureHeight:512,W=t.clipBias!==void 0?t.clipBias:0,m=t.flowDirection!==void 0?t.flowDirection:new q(1,0),D=t.flowSpeed!==void 0?t.flowSpeed:.03,i=t.reflectivity!==void 0?t.reflectivity:.02,R=t.scale!==void 0?t.scale:1,f=t.shader!==void 0?t.shader:T.WaterShader,d=new I,C=t.flowMap||void 0,w=t.normalMap0||d.load("ddd/textures/water/Water_1_M_Normal.jpg"),g=t.normalMap1||d.load("ddd/textures/water/Water_2_M_Normal.jpg"),p=.15,x=p*.5,e=new U,a=new k;if(z===void 0){console.error("THREE.Water: Required component Reflector not found.");return}if(y===void 0){console.error("THREE.Water: Required component Refractor not found.");return}const r=new z(h,{textureWidth:M,textureHeight:b,clipBias:W}),c=new y(h,{textureWidth:M,textureHeight:b,clipBias:W});r.matrixAutoUpdate=!1,c.matrixAutoUpdate=!1,this.material=new B({name:f.name,uniforms:H.merge([Q.fog,f.uniforms]),vertexShader:f.vertexShader,fragmentShader:f.fragmentShader,transparent:!0,fog:!0}),C!==void 0?(this.material.defines.USE_FLOWMAP="",this.material.uniforms.tFlowMap={type:"t",value:C}):this.material.uniforms.flowDirection={type:"v2",value:m},w.wrapS=w.wrapT=O,g.wrapS=g.wrapT=O,this.material.uniforms.tReflectionMap.value=r.getRenderTarget().texture,this.material.uniforms.tRefractionMap.value=c.getRenderTarget().texture,this.material.uniforms.tNormalMap0.value=w,this.material.uniforms.tNormalMap1.value=g,this.material.uniforms.color.value=_,this.material.uniforms.reflectivity.value=i,this.material.uniforms.textureMatrix.value=e,this.material.uniforms.config.value.x=0,this.material.uniforms.config.value.y=x,this.material.uniforms.config.value.z=x,this.material.uniforms.config.value.w=R;function s(u){e.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),e.multiply(u.projectionMatrix),e.multiply(u.matrixWorldInverse),e.multiply(n.matrixWorld)}function o(){const u=a.getDelta(),l=n.material.uniforms.config;l!=null&&(l.value.x+=D*u,l.value.y=l.value.x+x,l.value.x>=p?(l.value.x=0,l.value.y=x):l.value.y>=p&&(l.value.y=l.value.y-p))}this.onBeforeRender=function(u,l,P){s(P),o(),n.visible=!1,r.matrixWorld.copy(n.matrixWorld),c.matrixWorld.copy(n.matrixWorld),r.onBeforeRender(u,l,P),c.onBeforeRender(u,l,P),n.visible=!0}}}T.WaterShader={name:"WaterShader",uniforms:{color:{type:"c",value:null},reflectivity:{type:"f",value:0},tReflectionMap:{type:"t",value:null},tRefractionMap:{type:"t",value:null},tNormalMap0:{type:"t",value:null},tNormalMap1:{type:"t",value:null},textureMatrix:{type:"m4",value:null},config:{type:"v4",value:new F}},vertexShader:`

		#include <common>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>

		uniform mat4 textureMatrix;

		varying vec4 vCoord;
		varying vec2 vUv;
		varying vec3 vToEye;

		void main() {

			vUv = uv;
			vCoord = textureMatrix * vec4( position, 1.0 );

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vToEye = cameraPosition - worldPosition.xyz;

			vec4 mvPosition =  viewMatrix * worldPosition; // used in fog_vertex
			gl_Position = projectionMatrix * mvPosition;

			#include <logdepthbuf_vertex>
			#include <fog_vertex>

		}`,fragmentShader:`

		#include <common>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>

		uniform sampler2D tReflectionMap;
		uniform sampler2D tRefractionMap;
		uniform sampler2D tNormalMap0;
		uniform sampler2D tNormalMap1;

		#ifdef USE_FLOWMAP
			uniform sampler2D tFlowMap;
		#else
			uniform vec2 flowDirection;
		#endif

		uniform vec3 color;
		uniform float reflectivity;
		uniform vec4 config;

		varying vec4 vCoord;
		varying vec2 vUv;
		varying vec3 vToEye;

		void main() {

			#include <logdepthbuf_fragment>

			float flowMapOffset0 = config.x;
			float flowMapOffset1 = config.y;
			float halfCycle = config.z;
			float scale = config.w;

			vec3 toEye = normalize( vToEye );

			// determine flow direction
			vec2 flow;
			#ifdef USE_FLOWMAP
				flow = texture2D( tFlowMap, vUv ).rg * 2.0 - 1.0;
			#else
				flow = flowDirection;
			#endif
			flow.x *= - 1.0;

			// sample normal maps (distort uvs with flowdata)
			vec4 normalColor0 = texture2D( tNormalMap0, ( vUv * scale ) + flow * flowMapOffset0 );
			vec4 normalColor1 = texture2D( tNormalMap1, ( vUv * scale ) + flow * flowMapOffset1 );

			// linear interpolate to get the final normal color
			float flowLerp = abs( halfCycle - flowMapOffset0 ) / halfCycle;
			vec4 normalColor = mix( normalColor0, normalColor1, flowLerp );

			// calculate normal vector
			vec3 normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );

			// calculate the fresnel term to blend reflection and refraction maps
			float theta = max( dot( toEye, normal ), 0.0 );
			float reflectance = reflectivity + ( 1.0 - reflectivity ) * pow( ( 1.0 - theta ), 5.0 );

			// calculate final uv coords
			vec3 coord = vCoord.xyz / vCoord.w;
			vec2 uv = coord.xy + coord.z * normal.xz * 0.05;

			vec4 reflectColor = texture2D( tReflectionMap, vec2( 1.0 - uv.x, uv.y ) );
			vec4 refractColor = texture2D( tRefractionMap, uv );

			// multiply water color with the mix of both textures
			gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>

		}`};export{T as Water};
