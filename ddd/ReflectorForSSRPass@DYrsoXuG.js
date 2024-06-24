import{M as H,b as P,V as o,o as D,j as u,P as L,I as Z,a5 as k,N as T,W as z,c as B,U as G,a9 as X,H as q}from"./ddd@DwDq534T.js";class l extends H{constructor(W,n={}){super(W),this.isReflectorForSSRPass=!0,this.type="ReflectorForSSRPass";const e=this,N=n.color!==void 0?new P(n.color):new P(8355711),j=n.textureWidth||512,A=n.textureHeight||512,U=n.clipBias||0,c=n.shader||l.ReflectorShader,f=n.useDepthTexture===!0,S=new o(0,1,0),b=new o,M=new o;e.needsUpdate=!1,e.maxDistance=l.ReflectorShader.uniforms.maxDistance.value,e.opacity=l.ReflectorShader.uniforms.opacity.value,e.color=N,e.resolution=n.resolution||new D(window.innerWidth,window.innerHeight),e._distanceAttenuation=l.ReflectorShader.defines.DISTANCE_ATTENUATION,Object.defineProperty(e,"distanceAttenuation",{get(){return e._distanceAttenuation},set(t){e._distanceAttenuation!==t&&(e._distanceAttenuation=t,e.material.defines.DISTANCE_ATTENUATION=t,e.material.needsUpdate=!0)}}),e._fresnel=l.ReflectorShader.defines.FRESNEL,Object.defineProperty(e,"fresnel",{get(){return e._fresnel},set(t){e._fresnel!==t&&(e._fresnel=t,e.material.defines.FRESNEL=t,e.material.needsUpdate=!0)}});const s=new o,d=new o,y=new o,v=new u,h=new o(0,0,-1),p=new o,w=new o,m=new u,r=new L;let x;f&&(x=new Z,x.type=k,x.minFilter=T,x.magFilter=T);const E={depthTexture:f?x:null,type:q},g=new z(j,A,E),a=new B({name:c.name!==void 0?c.name:"unspecified",transparent:f,defines:Object.assign({},l.ReflectorShader.defines,{useDepthTexture:f}),uniforms:G.clone(c.uniforms),fragmentShader:c.fragmentShader,vertexShader:c.vertexShader});a.uniforms.tDiffuse.value=g.texture,a.uniforms.color.value=e.color,a.uniforms.textureMatrix.value=m,f&&(a.uniforms.tDepth.value=g.depthTexture),this.material=a;const F=[new X(new o(0,1,0),U)];this.doRender=function(t,I,i){if(a.uniforms.maxDistance.value=e.maxDistance,a.uniforms.color.value=e.color,a.uniforms.opacity.value=e.opacity,b.copy(i.position).normalize(),M.copy(b).reflect(S),a.uniforms.fresnelCoe.value=(b.dot(M)+1)/2,d.setFromMatrixPosition(e.matrixWorld),y.setFromMatrixPosition(i.matrixWorld),v.extractRotation(e.matrixWorld),s.set(0,0,1),s.applyMatrix4(v),p.subVectors(d,y),p.dot(s)>0)return;p.reflect(s).negate(),p.add(d),v.extractRotation(i.matrixWorld),h.set(0,0,-1),h.applyMatrix4(v),h.add(y),w.subVectors(d,h),w.reflect(s).negate(),w.add(d),r.position.copy(p),r.up.set(0,1,0),r.up.applyMatrix4(v),r.up.reflect(s),r.lookAt(w),r.far=i.far,r.updateMatrixWorld(),r.projectionMatrix.copy(i.projectionMatrix),a.uniforms.virtualCameraNear.value=i.near,a.uniforms.virtualCameraFar.value=i.far,a.uniforms.virtualCameraMatrixWorld.value=r.matrixWorld,a.uniforms.virtualCameraProjectionMatrix.value=i.projectionMatrix,a.uniforms.virtualCameraProjectionMatrixInverse.value=i.projectionMatrixInverse,a.uniforms.resolution.value=e.resolution,m.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),m.multiply(r.projectionMatrix),m.multiply(r.matrixWorldInverse),m.multiply(e.matrixWorld);const R=t.getRenderTarget(),O=t.xr.enabled,V=t.shadowMap.autoUpdate,_=t.clippingPlanes;t.xr.enabled=!1,t.shadowMap.autoUpdate=!1,t.clippingPlanes=F,t.setRenderTarget(g),t.state.buffers.depth.setMask(!0),t.autoClear===!1&&t.clear(),t.render(I,r),t.xr.enabled=O,t.shadowMap.autoUpdate=V,t.clippingPlanes=_,t.setRenderTarget(R);const C=i.viewport;C!==void 0&&t.state.viewport(C)},this.getRenderTarget=function(){return g}}}l.ReflectorShader={name:"ReflectorShader",defines:{DISTANCE_ATTENUATION:!0,FRESNEL:!0},uniforms:{color:{value:null},tDiffuse:{value:null},tDepth:{value:null},textureMatrix:{value:new u},maxDistance:{value:180},opacity:{value:.5},fresnelCoe:{value:null},virtualCameraNear:{value:null},virtualCameraFar:{value:null},virtualCameraProjectionMatrix:{value:new u},virtualCameraMatrixWorld:{value:new u},virtualCameraProjectionMatrixInverse:{value:new u},resolution:{value:new D}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		uniform sampler2D tDepth;
		uniform float maxDistance;
		uniform float opacity;
		uniform float fresnelCoe;
		uniform float virtualCameraNear;
		uniform float virtualCameraFar;
		uniform mat4 virtualCameraProjectionMatrix;
		uniform mat4 virtualCameraProjectionMatrixInverse;
		uniform mat4 virtualCameraMatrixWorld;
		uniform vec2 resolution;
		varying vec4 vUv;
		#include <packing>
		float blendOverlay( float base, float blend ) {
			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
		}
		vec3 blendOverlay( vec3 base, vec3 blend ) {
			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );
		}
		float getDepth( const in vec2 uv ) {
			return texture2D( tDepth, uv ).x;
		}
		float getViewZ( const in float depth ) {
			return perspectiveDepthToViewZ( depth, virtualCameraNear, virtualCameraFar );
		}
		vec3 getViewPosition( const in vec2 uv, const in float depth/*clip space*/, const in float clipW ) {
			vec4 clipPosition = vec4( ( vec3( uv, depth ) - 0.5 ) * 2.0, 1.0 );//ndc
			clipPosition *= clipW; //clip
			return ( virtualCameraProjectionMatrixInverse * clipPosition ).xyz;//view
		}
		void main() {
			vec4 base = texture2DProj( tDiffuse, vUv );
			#ifdef useDepthTexture
				vec2 uv=(gl_FragCoord.xy-.5)/resolution.xy;
				uv.x=1.-uv.x;
				float depth = texture2DProj( tDepth, vUv ).r;
				float viewZ = getViewZ( depth );
				float clipW = virtualCameraProjectionMatrix[2][3] * viewZ+virtualCameraProjectionMatrix[3][3];
				vec3 viewPosition=getViewPosition( uv, depth, clipW );
				vec3 worldPosition=(virtualCameraMatrixWorld*vec4(viewPosition,1)).xyz;
				if(worldPosition.y>maxDistance) discard;
				float op=opacity;
				#ifdef DISTANCE_ATTENUATION
					float ratio=1.-(worldPosition.y/maxDistance);
					float attenuation=ratio*ratio;
					op=opacity*attenuation;
				#endif
				#ifdef FRESNEL
					op*=fresnelCoe;
				#endif
				gl_FragColor = vec4( blendOverlay( base.rgb, color ), op );
			#else
				gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );
			#endif
		}
	`};export{l as ReflectorForSSRPass};
