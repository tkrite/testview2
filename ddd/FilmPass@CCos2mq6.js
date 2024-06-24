import{k as r,U as t,c as o,l as n}from"./ddd@DwDq534T.js";const l={name:"FilmShader",uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.5},grayscale:{value:!1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		uniform float intensity;
		uniform bool grayscale;
		uniform float time;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 base = texture2D( tDiffuse, vUv );

			float noise = rand( fract( vUv + time ) );

			vec3 color = base.rgb + base.rgb * clamp( 0.1 + noise, 0.0, 1.0 );

			color = mix( base.rgb, color, intensity );

			if ( grayscale ) {

				color = vec3( luminance( color ) ); // assuming linear-srgb

			}

			gl_FragColor = vec4( color, base.a );

		}`};class f extends r{constructor(e=.5,a=!1){super();const s=l;this.uniforms=t.clone(s.uniforms),this.material=new o({name:s.name,uniforms:this.uniforms,vertexShader:s.vertexShader,fragmentShader:s.fragmentShader}),this.uniforms.intensity.value=e,this.uniforms.grayscale.value=a,this.fsQuad=new n(this.material)}render(e,a,s,i){this.uniforms.tDiffuse.value=s.texture,this.uniforms.time.value+=i,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(a),this.clear&&e.clear(),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}export{f as FilmPass};
