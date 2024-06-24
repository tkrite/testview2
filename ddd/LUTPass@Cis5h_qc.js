import{m as i}from"./ddd@DwDq534T.js";const l={name:"LUTShader",uniforms:{lut:{value:null},lutSize:{value:0},tDiffuse:{value:null},intensity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}

	`,fragmentShader:`

		uniform float lutSize;
		uniform sampler3D lut;

		varying vec2 vUv;
		uniform float intensity;
		uniform sampler2D tDiffuse;
		void main() {

			vec4 val = texture2D( tDiffuse, vUv );
			vec4 lutVal;

			// pull the sample in by half a pixel so the sample begins
			// at the center of the edge pixels.
			float pixelWidth = 1.0 / lutSize;
			float halfPixelWidth = 0.5 / lutSize;
			vec3 uvw = vec3( halfPixelWidth ) + val.rgb * ( 1.0 - pixelWidth );


			lutVal = vec4( texture( lut, uvw ).rgb, val.a );

			gl_FragColor = vec4( mix( val, lutVal, intensity ) );

		}

	`};class n extends i{set lut(t){const e=this.material;t!==this.lut&&(e.uniforms.lut.value=null,t&&(e.uniforms.lutSize.value=t.image.width,e.uniforms.lut.value=t))}get lut(){return this.material.uniforms.lut.value}set intensity(t){this.material.uniforms.intensity.value=t}get intensity(){return this.material.uniforms.intensity.value}constructor(t={}){super(l),this.lut=t.lut||null,this.intensity="intensity"in t?t.intensity:1}}export{n as LUTPass};
