import{o as Nt,j as yt,V as Ut}from"./ddd@DwDq534T.js";const Tt={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:Et(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new Nt},cameraProjectionMatrixInverse:{value:new yt},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;
		
		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

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

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);
			
			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;
		
			denoised += w * neighborColor;
			totalWeight += w;
		}
		
		void main() {
			float depth = getDepth(vUv.xy);	
			vec3 viewNormal = getViewNormal(vUv);	
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);
		
			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}
		
			if (totalWeight > 0.) { 
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function Et(V,e,t){const l=Lt(V,e,t);let n="vec3[SAMPLES](";for(let c=0;c<V;c++){const s=l[c];n+=`vec3(${s.x}, ${s.y}, ${s.z})${c<V-1?",":")"}`}return n}function Lt(V,e,t){const l=[];for(let n=0;n<V;n++){const c=2*Math.PI*e*n/V,s=Math.pow(n/(V-1),t);l.push(new Ut(Math.cos(c),Math.sin(c),s))}return l}class zt{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}dot(e,t,l){return e[0]*t+e[1]*l}dot3(e,t,l,n){return e[0]*t+e[1]*l+e[2]*n}dot4(e,t,l,n,c){return e[0]*t+e[1]*l+e[2]*n+e[3]*c}noise(e,t){let l,n,c;const s=.5*(Math.sqrt(3)-1),o=(e+t)*s,k=Math.floor(e+o),i=Math.floor(t+o),M=(3-Math.sqrt(3))/6,y=(k+i)*M,L=k-y,d=i-y,x=e-L,S=t-d;let U,E;x>S?(U=1,E=0):(U=0,E=1);const m=x-U+M,p=S-E+M,f=x-1+2*M,g=S-1+2*M,P=k&255,D=i&255,w=this.perm[P+this.perm[D]]%12,r=this.perm[P+U+this.perm[D+E]]%12,a=this.perm[P+1+this.perm[D+1]]%12;let v=.5-x*x-S*S;v<0?l=0:(v*=v,l=v*v*this.dot(this.grad3[w],x,S));let h=.5-m*m-p*p;h<0?n=0:(h*=h,n=h*h*this.dot(this.grad3[r],m,p));let N=.5-f*f-g*g;return N<0?c=0:(N*=N,c=N*N*this.dot(this.grad3[a],f,g)),70*(l+n+c)}noise3d(e,t,l){let n,c,s,o;const i=(e+t+l)*.3333333333333333,M=Math.floor(e+i),y=Math.floor(t+i),L=Math.floor(l+i),d=1/6,x=(M+y+L)*d,S=M-x,U=y-x,E=L-x,m=e-S,p=t-U,f=l-E;let g,P,D,w,r,a;m>=p?p>=f?(g=1,P=0,D=0,w=1,r=1,a=0):m>=f?(g=1,P=0,D=0,w=1,r=0,a=1):(g=0,P=0,D=1,w=1,r=0,a=1):p<f?(g=0,P=0,D=1,w=0,r=1,a=1):m<f?(g=0,P=1,D=0,w=0,r=1,a=1):(g=0,P=1,D=0,w=1,r=1,a=0);const v=m-g+d,h=p-P+d,N=f-D+d,C=m-w+2*d,O=p-r+2*d,F=f-a+2*d,I=m-1+3*d,G=p-1+3*d,u=f-1+3*d,A=M&255,j=y&255,R=L&255,K=this.perm[A+this.perm[j+this.perm[R]]]%12,Q=this.perm[A+g+this.perm[j+P+this.perm[R+D]]]%12,tt=this.perm[A+w+this.perm[j+r+this.perm[R+a]]]%12,et=this.perm[A+1+this.perm[j+1+this.perm[R+1]]]%12;let T=.6-m*m-p*p-f*f;T<0?n=0:(T*=T,n=T*T*this.dot3(this.grad3[K],m,p,f));let z=.6-v*v-h*h-N*N;z<0?c=0:(z*=z,c=z*z*this.dot3(this.grad3[Q],v,h,N));let _=.6-C*C-O*O-F*F;_<0?s=0:(_*=_,s=_*_*this.dot3(this.grad3[tt],C,O,F));let b=.6-I*I-G*G-u*u;return b<0?o=0:(b*=b,o=b*b*this.dot3(this.grad3[et],I,G,u)),32*(n+c+s+o)}noise4d(e,t,l,n){const c=this.grad4,s=this.simplex,o=this.perm,k=(Math.sqrt(5)-1)/4,i=(5-Math.sqrt(5))/20;let M,y,L,d,x;const S=(e+t+l+n)*k,U=Math.floor(e+S),E=Math.floor(t+S),m=Math.floor(l+S),p=Math.floor(n+S),f=(U+E+m+p)*i,g=U-f,P=E-f,D=m-f,w=p-f,r=e-g,a=t-P,v=l-D,h=n-w,N=r>a?32:0,C=r>v?16:0,O=a>v?8:0,F=r>h?4:0,I=a>h?2:0,G=v>h?1:0,u=N+C+O+F+I+G,A=s[u][0]>=3?1:0,j=s[u][1]>=3?1:0,R=s[u][2]>=3?1:0,K=s[u][3]>=3?1:0,Q=s[u][0]>=2?1:0,tt=s[u][1]>=2?1:0,et=s[u][2]>=2?1:0,T=s[u][3]>=2?1:0,z=s[u][0]>=1?1:0,_=s[u][1]>=1?1:0,b=s[u][2]>=1?1:0,gt=s[u][3]>=1?1:0,ot=r-A+i,it=a-j+i,st=v-R+i,nt=h-K+i,ct=r-Q+2*i,lt=a-tt+2*i,rt=v-et+2*i,at=h-T+2*i,vt=r-z+3*i,ht=a-_+3*i,ft=v-b+3*i,mt=h-gt+3*i,pt=r-1+4*i,dt=a-1+4*i,ut=v-1+4*i,xt=h-1+4*i,W=U&255,Y=E&255,q=m&255,$=p&255,Pt=o[W+o[Y+o[q+o[$]]]]%32,Dt=o[W+A+o[Y+j+o[q+R+o[$+K]]]]%32,Mt=o[W+Q+o[Y+tt+o[q+et+o[$+T]]]]%32,St=o[W+z+o[Y+_+o[q+b+o[$+gt]]]]%32,wt=o[W+1+o[Y+1+o[q+1+o[$+1]]]]%32;let H=.6-r*r-a*a-v*v-h*h;H<0?M=0:(H*=H,M=H*H*this.dot4(c[Pt],r,a,v,h));let X=.6-ot*ot-it*it-st*st-nt*nt;X<0?y=0:(X*=X,y=X*X*this.dot4(c[Dt],ot,it,st,nt));let Z=.6-ct*ct-lt*lt-rt*rt-at*at;Z<0?L=0:(Z*=Z,L=Z*Z*this.dot4(c[Mt],ct,lt,rt,at));let B=.6-vt*vt-ht*ht-ft*ft-mt*mt;B<0?d=0:(B*=B,d=B*B*this.dot4(c[St],vt,ht,ft,mt));let J=.6-pt*pt-dt*dt-ut*ut-xt*xt;return J<0?x=0:(J*=J,x=J*J*this.dot4(c[wt],pt,dt,ut,xt)),27*(M+y+L+d+x)}}export{Tt as P,zt as S,Et as g};
