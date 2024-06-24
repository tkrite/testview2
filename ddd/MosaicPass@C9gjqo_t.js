import{k as u,m as o,n as v}from"./ddd@DwDq534T.js";class E extends u{constructor(e,a){super(),this.scene=e,this.camera=a,this.clear=!1,this.clearDepth=!1,this.needsSwap=!0,this.width=this.height=1;const s=v;this.copy_pass=new o(s),this.mosaicShaderMaterial=new THREE.ShaderMaterial({uniforms:THREE.UniformsUtils.merge([THREE.UniformsUtils.clone(s.uniforms),THREE.UniformsUtils.clone({tMosaic:{value:null},tDepth:{value:null},aspect:{value:1},mosaic_size:{value:.75}})]),vertexShader:s.vertexShader,fragmentShader:`
			uniform sampler2D tDiffuse;
			uniform sampler2D tMosaic;
			uniform sampler2D tDepth;
			uniform float aspect;
			uniform float mosaic_size;
			varying vec2 vUv;
			void main() {
				float depth = texture2D(tDepth,vUv).r;
				float DM = 0.01;
				depth = depth - mod(depth, DM) + DM * 0.5;
				float M = mosaic_size * pow(1.0-depth,8.0);
				vec2 uv = vUv - mod(vUv,vec2(M,M*aspect)) + M*0.5;
				vec4 tx1 = texture2D(tDiffuse, uv);
				vec4 tx2 = texture2D(tDiffuse, vUv);
				vec4 msc = texture2D(tMosaic, vUv);
				// vec4 tx = mix(tx2,tx1, msc.r);
				vec4 tx = mix(tx2,tx1, step(0.5,msc.r));
				gl_FragColor = vec4(tx.rgb, 1.0);
			}`,premultipliedAlpha:!1,transparent:!1,blending:THREE.NoBlending,depthTest:!1,depthWrite:!1}),this.white_material=new THREE.MeshBasicMaterial,this.white_material.receiveDynamicEnvironment=!1,this.white_material.fog=!1,this.white_material.alphaTest=0,this.white_material.color.set(16777215),this.filter_pass=new o(this.mosaicShaderMaterial),this.renderTarget=this.create_render_target(this.width,this.height,{type:THREE.UnsignedByteType}),this.backupVisibilities=new WeakMap,this.clearColor=new THREE.Color(0,0,0),this.clearColor2=new THREE.Color(1,0,0)}create_render_target(e,a,s={}){const i={minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat,type:THREE.HalfFloatType,depthBuffer:!1,stencilBuffer:!1,colorSpace:THREE.NoColorSpace};return Object.assign(i,s),new THREE.WebGLRenderTarget(e,a,i)}compile(){this.needsCompile=!0}dispose(){this.mosaicShaderMaterial.dispose(),this.renderTarget.dispose()}setSize(e,a){this.width=e,this.height=a,this.renderTarget.setSize(Math.floor(e/10),Math.floor(a/10)),this.filter_pass.material.uniforms.aspect.value=e/a}render(e,a,s,i,d,h){const l=h.effect_composer;e.getClearColor(this.clearColor2);const c=e.getClearAlpha(),p=e.autoClear,n=e.autoClearColor,m=e.autoClearDepth,f=e.autoClearStencil;e.autoClear=!1,e.autoClearDepth=!1,e.autoClearStencil=!1,e.setClearColor(this.clearColor,1),e.setRenderTarget(l.renderTarget3),e.clear(!0,!1,!1),this.scene.traverse(t=>{t.isMesh&&(t.isMosaicObject?(this.backupVisibilities.set(t,{visible:t.visible,material:t.material}),t.visible=!0,t.material=this.white_material):(this.backupVisibilities.set(t,{visible:t.visible,material:void 0}),t.visible=!1))}),e.render(this.scene,this.camera),this.scene.traverse(t=>{if(t.isMesh){const r=this.backupVisibilities.get(t);t.visible=r.visible,r.material&&(t.material=r.material)}}),this.copy_pass.render(e,this.renderTarget,l.renderTarget3),this.filter_pass.material.uniforms.tMosaic.value=this.renderTarget.texture,this.filter_pass.material.uniforms.tDepth.value=l.renderTarget3.depthTexture,this.filter_pass.render(e,this.renderToScreen?null:a,s),e.setClearColor(this.clearColor2),e.setClearAlpha(c),e.autoClear=p,e.autoClearColor=n,e.autoClearDepth=m,e.autoClearStencil=f}}export{E as MosaicPass};
