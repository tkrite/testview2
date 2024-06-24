import{i as u,c as g,bD as w,an as h,M as p,P as S,f as b,bE as C,bA as T}from"./ddd@DwDq534T.js";let t,c,i,s;function U(e,m=1/0,a=null){c||(c=new u(2,2,1,1)),i||(i=new g({uniforms:{blitTexture:new w(e)},vertexShader:`
			varying vec2 vUv;
			void main(){
				vUv = uv;
				gl_Position = vec4(position.xy * 1.0,0.,.999999);
			}`,fragmentShader:`
			uniform sampler2D blitTexture; 
			varying vec2 vUv;

			void main(){ 
				gl_FragColor = vec4(vUv.xy, 0, 1);
				
				#ifdef IS_SRGB
				gl_FragColor = LinearTosRGB( texture2D( blitTexture, vUv) );
				#else
				gl_FragColor = texture2D( blitTexture, vUv);
				#endif
			}`})),i.uniforms.blitTexture.value=e,i.defines.IS_SRGB=e.colorSpace==h,i.needsUpdate=!0,s||(s=new p(c,i),s.frustumCulled=!1);const d=new S,v=new b;v.add(s),a===null&&(a=t=new C({antialias:!1}));const o=Math.min(e.image.width,m),r=Math.min(e.image.height,m);a.setSize(o,r),a.clear(),a.render(v,d);const l=document.createElement("canvas"),f=l.getContext("2d");l.width=o,l.height=r,f.drawImage(a.domElement,0,0,o,r);const n=new T(l);return n.minFilter=e.minFilter,n.magFilter=e.magFilter,n.wrapS=e.wrapS,n.wrapT=e.wrapT,n.name=e.name,t&&(t.forceContextLoss(),t.dispose(),t=null),n}export{U as d};
