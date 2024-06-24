import{o as B,j as Q,$ as ae,b as k,c as m,W as y,N as R,l as E,n as $,a0 as C,a1 as ie,k as re,a2 as se,T as oe,R as T,Y as F,p as w,F as L,a3 as H}from"./ddd@DwDq534T.js";import{sampleFunctions as ne}from"./mipSampleFunctions@CE2NLcig.js";import{ShaderReplacement as ee}from"./ShaderReplacement@CxvBdKt5.js";import{PackedShader as le}from"./PackedShader@D9dUVuxe.js";import{clone as D,MipGenerationShader as ue}from"./MipGenerationShader@34s1mtIh.js";import"./WrappedShaderMaterial@jJQ4lvlR.js";import"./ExtendedShaderMaterial@CoOG-Exu.js";const ce={defines:{ENABLE_BLUR:1,BLUR_RADIUS:5,DEPTH_THRESHOLD:"2e-3",COLOR_HIT_ONLY:0},uniforms:{intersectBuffer:{value:null},sourceBuffer:{value:null},packedBuffer:{value:null},depthBuffer:{value:null},intensity:{value:.5},renderSize:{value:new B},marchSize:{value:new B},blurStride:{value:1}},vertexShader:`
		varying vec2 vUv;
		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}
	`,fragmentShader:`
		#include <common>
		#include <packing>
		#define E 2.7182818

		varying vec2 vUv;
		uniform sampler2D intersectBuffer;
		uniform sampler2D sourceBuffer;
		uniform sampler2D packedBuffer;
		uniform sampler2D depthBuffer;

		uniform vec2 renderSize;
		uniform vec2 marchSize;
		uniform float blurStride;

		uniform float intensity;

		// https://danielilett.com/2019-05-08-tut1-3-smo-blur/
		// One-dimensional Gaussian curve function.
		float gaussian( int x, int spread) {

			float sigmaSqu = float( spread * spread );
			return ( 1.0 / sqrt( 2.0 * PI * sigmaSqu ) ) * pow( E, - float( x * x ) / ( 2.0 * sigmaSqu ) );

		}

		vec3 UnpackNormal( vec4 d ) {

			return d.xyz * 2.0 - 1.0;

		}

		void main() {

			// Found, blending
			vec4 source = texture2D( sourceBuffer, vUv );
			vec3 sampleValue = vec3( 0.0 );

			#if ENABLE_BLUR

			vec2 currTexel = vUv * renderSize;
			vec2 currMarchTexel = vUv * marchSize;
			vec2 texelRatio = marchSize / renderSize;

			vec3 currNormal = UnpackNormal( texture2D( packedBuffer, vUv  ) );
			float currDepth = texture2D( depthBuffer, vUv ).r;

			float totalWeight = 1e-10;
			int blurWidth = BLUR_RADIUS * 2 + 1;

			for ( int x = - BLUR_RADIUS; x <= BLUR_RADIUS; x ++ ) {

				for ( int y = - BLUR_RADIUS; y <= BLUR_RADIUS; y ++ ) {

					// if ( x != 0 || y != 0 ) continue;

					vec2 step = vec2( float( x ), float( y ) ) * float( blurStride );

					// iterate over full res pixels
					vec2 renderUv = currTexel + step;
					renderUv /= renderSize;

					// get the associated pixel in the AO buffer
					vec2 marchUv = currMarchTexel + step * texelRatio;
					marchUv /= marchSize;

					// if the pixels are close enough in space then blur them together
					float offsetDepth = texture2D( depthBuffer, renderUv ).r;
					if ( abs( offsetDepth - currDepth ) <= 1e-1 ) {

						// Weigh the sample based on normal similarity
						vec3 offsetNormal = UnpackNormal( texture2D( packedBuffer, renderUv ) );
						float weight = max( 0.0, dot( offsetNormal, currNormal ) - 0.9 ) * 10.0;

						// gaussian distribution
						weight *= gaussian( x, blurWidth ) * gaussian( y, blurWidth );

						// accumulate
						vec4 val = texture2D( intersectBuffer, marchUv );
						sampleValue += val.rgb * weight;
						totalWeight += weight;

					}

				}

			}

			sampleValue /= totalWeight;

			#else

			sampleValue = texture2D( intersectBuffer, vUv ).rgb;

			#endif

			#if COLOR_HIT_ONLY

			gl_FragColor = vec4( sampleValue, 1.0 );

			#else

			source.rgb += sampleValue * intensity;
			gl_FragColor = source;

			#endif


		}
	`},de={defines:{MAX_STEPS:10,BINARY_SEARCH_ITERATIONS:4,PYRAMID_DEPTH:1,USE_THICKNESS:0,EDGE_FADE:.3,ORTHOGRAPHIC_CAMERA:0,GLOSSY_MODE:0,ENABLE_DEBUG:0,JITTER_STRATEGY:0,GLOSSY_JITTER_STRATEGY:1,BLUENOISE_SIZE:"32.0"},uniforms:{colorBuffer:{value:null},packedBuffer:{value:null},depthBuffer:{value:null},depthBufferLod:{value:null},backfaceDepthBuffer:{value:null},invProjectionMatrix:{value:new Q},projMatrix:{value:new Q},blueNoiseTex:{value:null},stride:{value:20},resolution:{value:new B},thickness:{value:1},jitter:{value:1},roughnessCutoff:{value:1},maxDistance:{value:100}},vertexShader:`
		varying vec2 vUv;
		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}
		`,fragmentShader:`
		#include <common>
		#include <packing>

		${ne}

		varying vec2 vUv;
		uniform sampler2D colorBuffer;
		uniform sampler2D packedBuffer;
		uniform sampler2D depthBuffer;
		uniform sampler2D backfaceDepthBuffer;
		uniform mat4 invProjectionMatrix;
		uniform mat4 projMatrix;
		uniform vec2 resolution;

		uniform float roughnessCutoff;
		uniform float thickness;
		uniform float stride;
		uniform float jitter;
		uniform float maxDistance;

		// Include the blue noise texture if we're using blue noise jitter ( 1 ) or
		// we're using a glossiness mode with blue noise jitter.
		#if JITTER_STRATEGY == 1 || ( GLOSSY_JITTER_STRATEGY == 1 && GLOSSY_MODE != 0 )
		uniform sampler2D blueNoiseTex;
		#endif

		#if GLOSSY_MODE == 3 // MIP_PYRAMID_GLOSSY
		uniform sampler2D depthBufferLod;
		#endif

		vec3 Deproject( vec3 p ) {

			vec4 res = invProjectionMatrix * vec4( p, 1 );
			return res.xyz / res.w;

		}

		vec3 Project( vec3 p ) {

			vec4 res = projMatrix * vec4( p, 1 );
			return res.xyz / res.w;

		}

		vec3 UnpackNormal( vec4 d ) {

			return d.xyz * 2.0 - 1.0;

		}

		#if USE_THICKNESS

		#if GLOSSY_MODE == 3 // MIP_PYRAMID_GLOSSY

		// If we're using z hierarchy glossiness sample from the lod depth map with a variable
		// LOD and thickness.
		bool doesIntersect( float rayzmax, float rayzmin, vec2 uv, int lod, float thickness ) {

			float sceneZMin = packedTexture2DLOD( depthBufferLod, uv, lod ).r;

			return sceneZMin != 0.0 &&  rayzmin > sceneZMin - thickness && rayzmax < sceneZMin;

		}

		#else

		// If we're using thickness then account for the thickness uniform when sampling.
		bool doesIntersect( float rayzmax, float rayzmin, vec2 uv ) {

			float sceneZMin = texture2D( depthBuffer, uv ).r;

			return sceneZMin != 0.0 &&  rayzmin > sceneZMin - thickness && rayzmax < sceneZMin;

		}

		#endif

		#else

		// check if the ray passed through the min and max depth values at the given uv.
		bool doesIntersect( float rayzmax, float rayzmin, vec2 uv ) {

			float sceneZMax = texture2D( backfaceDepthBuffer, uv ).r;
			float sceneZMin = texture2D( depthBuffer, uv ).r;

			return sceneZMin != 0.0 && rayzmin >= sceneZMax && rayzmax <= sceneZMin;

		}

		#endif

		float distanceSquared( vec2 a, vec2 b ) {

			a -= b;
			return dot(a, a);

		}

		// NOTE: "further" is actually "more negative"
		void swapIfBigger( inout float a, inout float b ) {

			if ( a > b ) {

				float t = a;
				a = b;
				b = t;

			}

		}

		bool isOutsideUvBounds( float x ) {

			return x < 0.0 || x > 1.0;

		}

		bool isOutsideUvBounds( vec2 uv ) {

			return isOutsideUvBounds( uv.x ) || isOutsideUvBounds( uv.y );

		}

		void main() {

			// Screen position information
			vec2 screenCoord = vUv * 2.0 - vec2( 1, 1 );
			float nearClip = Deproject( vec3( 0, 0, - 1 ) ).z;

			// Samples
			vec4 dataSample = texture2D( packedBuffer, vUv );
			float depthSample = texture2D( depthBuffer, vUv ).r;

			// TODO: this is added because with the ortho camera we get some stray samples that
			// hit outside the model so make sure we ignore any non retrievals.
			if ( depthSample == 0.0 ) {

				gl_FragColor = vec4( 0.0 );
				return;

			}

			// View space information
			vec3 vnorm = UnpackNormal( dataSample );
			float roughness = dataSample.a;

			if ( roughness >= roughnessCutoff ) {

				gl_FragColor = vec4( 0.0 );
				return;

			}

			#if ORTHOGRAPHIC_CAMERA
			// The ray is positioned at our screen coordinate into the screen
			// "depthSample - nearClip" will be negative here -- TODO: into the screen should be z = - 1.
			vec3 ray = vec3( 0.0, 0.0, 1.0 );
			vec3 vpos = ( depthSample - nearClip ) * ray + Deproject( vec3( screenCoord, - 1 ) );
			vec3 dir = normalize( reflect( normalize( vec3(0.0, 0.0, - 1.0) ), normalize( vnorm ) ) );
			#else
			vec3 ray = Deproject( vec3( screenCoord, - 1 ) );
			ray /= ray.z;
			vec3 vpos =  depthSample * ray;
			vec3 dir = normalize( reflect( normalize( vpos ), normalize( vnorm ) ) );
			#endif

			// Define view space values
			float maxDist = maxDistance;
			float rayLength = ( vpos.z + dir.z * maxDist ) > nearClip ? ( nearClip - vpos.z ) / dir.z : maxDist;
			vec3 csOrig = vpos;
			vec3 csEndPoint = csOrig + dir * rayLength;

			// Projected Coordintes
			vec4 H0 = projMatrix * vec4( csOrig, 1.0 );
			vec4 H1 = projMatrix * vec4( csEndPoint, 1.0 );

			// Homogenous Divisor
			float k0 = 1.0 / H0.w, k1 = 1.0 / H1.w;

			// Clip Space Coordinates?
			vec3 Q0 = csOrig.xyz * k0, Q1 = csEndPoint.xyz * k1;

			// Screen Space Pixel Coordinates [ 0.0, resolution.xy ]
			vec2 P0 = H0.xy * k0, P1 = H1.xy * k1;
			P0 = P0 * 0.5 + vec2( 0.5 ), P1 = P1 * 0.5 + vec2( 0.5 );
			P0 *= resolution, P1 *= resolution;

			// Scoot the final coordinate a bit if the two points are really close
			P1 += vec2( ( distanceSquared( P0, P1 ) < 0.0001 ) ? 0.01 : 0.0 );
			vec2 delta = P1 - P0;

			// Ensure X is the larger coordinate
			bool permute = false;
			if ( abs( delta.x ) < abs( delta.y ) ) {
				permute = true;
				delta = delta.yx;
				P0 = P0.yx; P1 = P1.yx;
			}

			// invdx = px difference along larger stride axis
			float stepDir = sign( delta.x );
			float invdx = stepDir / delta.x;

			// Derivatives
			// Step for one pixel for each component
			vec3 dQ = ( Q1 - Q0 ) * invdx;
			float dk = ( k1 - k0 ) * invdx;
			vec2 dP = vec2( stepDir, delta.y * invdx );

			// Track all values in a vector
			float pixelStride = stride;

			// Ray Starting Position Jitter
			#if JITTER_STRATEGY == 0 // REGULAR_JITTER
			float jitterAmount = mod( ( gl_FragCoord.x + gl_FragCoord.y ) * 0.25, 1.0 );
			#elif JITTER_STRATEGY == 1 // BLUENOISE_JITTER
			float jitterAmount = texture2D( blueNoiseTex, gl_FragCoord.xy / BLUENOISE_SIZE ).r;
			#endif

			// Tracking Variables
			vec4 PQK = vec4( P0, Q0.z, k0 );
			vec4 dPQK = vec4( dP, dQ.z, dk );

			// Start by taking an initial stride to avoid intersecting at the first pixel.
			// TODO: this was added -- maybe offset the start by the normal instead?
			PQK += dPQK;

			// Scale the derivative by the pixel stride
			dPQK *= pixelStride;
			PQK += dPQK * jitterAmount * jitter;

			// Variables for completion condition
			float end = P1.x * stepDir;
			float prevZMaxEstimate = PQK.z / PQK.w; // Q0.z * H0.w : Back to camera space z
			float rayZMin = prevZMaxEstimate;
			float rayZMax = prevZMaxEstimate;
			float stepped = 0.0;

			// Glossy Variable Init
			#if GLOSSY_MODE == 1 // SIMPLE_GLOSSY
			float searchRadius = 0.0;

			#if GLOSSY_JITTER_STRATEGY == 1 // BLUENOISE_JITTER

			vec3 searchVector = ( texture2D( blueNoiseTex, gl_FragCoord.xy / BLUENOISE_SIZE ).gra - vec3( 0.5 ) );

			#elif GLOSSY_JITTER_STRATEGY == 2 // RANDOM_JITTER

			vec3 searchVector = normalize(
				vec3(
					rand( gl_FragCoord.xy - sin( vUv * 400.0 ) * 100.0 ) - 0.5,
					rand( gl_FragCoord.xy - cos( vUv * 100.0 ) * 200.0 ) - 0.5,
					rand( gl_FragCoord.xy - tan( vUv * 800.0 ) * 50.0 ) - 0.5
				)
			) * ( rand( gl_FragCoord.xy ) - 0.5 ) * 2.0;

			#endif

			#elif GLOSSY_MODE == 2 // MULTI_GLOSSY

			#define GLOSSY_RAY_COUNT 6
			vec3 searchVectors[ GLOSSY_RAY_COUNT ];
			float searchRadius = 0.0;
			vec3 accumulatedColor = vec3( 0.0 );

			#if GLOSSY_JITTER_STRATEGY == 1	 // BLUENOISE_JITTER

			float angle = texture2D( blueNoiseTex, gl_FragCoord.xy / BLUENOISE_SIZE ).g * 2.0 * PI;

			#elif GLOSSY_JITTER_STRATEGY == 2 // RANDOM_JITTER

			float angle = rand( gl_FragCoord.xy ) * 2.0 * PI;

			#endif

			// Generate sample vectors
			float angleStep = 13.123412 * PI / float( GLOSSY_RAY_COUNT );
			float ratio;
			#pragma unroll_loop_start
			for ( int i = 0; i < 6; i ++ ) {

				ratio = float ( UNROLLED_LOOP_INDEX ) / float ( GLOSSY_RAY_COUNT );
				searchVectors[ i ] = normalize( vec3( sin( angle ), cos( angle ), 2.0 * ratio - 1.0 ) ) * ratio;
				angle += angleStep;

			}
			#pragma unroll_loop_end

			#elif GLOSSY_MODE == 3 // MIP_PYRAMID_GLOSSY

			float searchRadius = 0.0;
			vec3 finalColor = vec3( 0.0 );

			#endif

			vec2 hitUV;
			bool intersected = false;
			for ( float stepCount = 1.0; stepCount <= float( MAX_STEPS ); stepCount ++ ) {

				#if GLOSSY_MODE == 0
				PQK += dPQK;
				#else
				// Take a larger stride based on the search radius for our glossiness
				PQK += ( dPQK / pixelStride ) * ( max( searchRadius, pixelStride ) );
				#endif

				rayZMin = prevZMaxEstimate;
				rayZMax = ( dPQK.z * 0.5 + PQK.z ) / ( dPQK.w * 0.5 + PQK.w );
				prevZMaxEstimate = rayZMax;

				// "further" is "more negative", so max should be further away,
				// or the smaller number
				swapIfBigger( rayZMax, rayZMin );

				stepped = stepCount;
				hitUV = ( permute ? PQK.yx : PQK.xy ) / resolution;
				if ( isOutsideUvBounds( hitUV ) ) break;

				// TODO: this is here because there are cases where we rayZMin is somehow hitting
				// a positive value after marching for awhile which is odd because "into the screen"
				// should be negative.
				if ( rayZMin > 0.0 ) break;

				// TODO: the glossiness paths should convert glossiness search radius from world space in to screen space
				#if GLOSSY_MODE == 0 // NO_GLOSSY

				intersected = doesIntersect( rayZMax, rayZMin, hitUV );

				#elif GLOSSY_MODE == 1 // SIMPLE_GLOSSY

				float rayDist = abs( ( ( rayZMax - csOrig.z ) / ( csEndPoint.z - csOrig.z ) ) * rayLength );
				searchRadius = rayDist * roughness;

				vec3 radius = searchVector * searchRadius;
				radius.xy /= resolution.x / resolution.y;
				radius.xy *= PQK.w;
				intersected = doesIntersect( rayZMax + radius.z, rayZMin + radius.z, hitUV + radius.xy );

				if (intersected) {

					hitUV = hitUV + radius.xy;

				}

				#elif GLOSSY_MODE == 2 // MULTI_GLOSSY

				float rayDist = abs( ( ( rayZMax - csOrig.z ) / ( csEndPoint.z - csOrig.z ) ) * rayLength );
				searchRadius = rayDist * roughness;

				bool didIntersect = false;
				float total = 0.0;
				vec3 radius;
				#pragma unroll_loop_start
				for ( int i = 0; i < 6; i ++ ) {

					radius = searchVectors[ i ] * searchRadius;
					radius.xy /= resolution.x / resolution.y;
					radius.xy *= PQK.w;

					didIntersect = doesIntersect( rayZMax + radius.z, rayZMin + radius.z, hitUV + radius.xy );
					if ( didIntersect ) {

						accumulatedColor += texture2D( colorBuffer, hitUV + radius.xy ).rgb;
						intersected = true;
						total += 1.0;

					}

				}
				#pragma unroll_loop_end

				if ( intersected ) {

					hitUV = hitUV;
					accumulatedColor /= total;

				}

				#elif GLOSSY_MODE == 3 // MIP_PYRAMID_GLOSSY

				float rayDist = abs( ( ( rayZMax - csOrig.z ) / ( csEndPoint.z - csOrig.z ) ) * rayLength );
				searchRadius = rayDist * roughness * 3.0;

				float radius = searchRadius * PQK.w;
				float lod = radius * 10.0;

				intersected = doesIntersect( rayZMax, rayZMin, hitUV, int( ceil( lod ) ), thickness + searchRadius );

				if ( intersected ) {

					hitUV = hitUV;
					finalColor = texture2D( colorBuffer, hitUV, lod * 2.0 ).rgb;

					#if ENABLE_DEBUG
					gl_FragColor = vec4( lod );
					return;
					#endif

				}

				#endif
				if ( intersected || ( PQK.x * stepDir ) > end ) break;

			}

			// Don't perform binary search if using mip or multi sample binary glossiness
			#if BINARY_SEARCH_ITERATIONS && GLOSSY_MODE != 2 && GLOSSY_MODE != 3

			// Binary search
			#if GLOSSY_MODE == 1
			if ( intersected && pixelStride > 1.0 && searchRadius < 0.1 ) {
			#else
			if ( intersected && pixelStride > 1.0 ) {
			#endif

				PQK -= dPQK;
				dPQK /= stride;
				float ogStride = pixelStride * 0.5;
				float currStride = pixelStride;

				prevZMaxEstimate = PQK.z / PQK.w;
				rayZMin = prevZMaxEstimate, rayZMax = prevZMaxEstimate;

				for( int j = 0; j < int( BINARY_SEARCH_ITERATIONS ); j ++ ) {
					PQK += dPQK * currStride;

					rayZMin = prevZMaxEstimate;
					rayZMax = ( dPQK.z * 0.5 + PQK.z ) / ( dPQK.w * 0.5 + PQK.w );
					prevZMaxEstimate = rayZMax;

					swapIfBigger( rayZMax, rayZMin );

					vec2 newUV = ( permute ? PQK.yx : PQK.xy ) / resolution;
					ogStride *= 0.5;
					if ( doesIntersect( rayZMax, rayZMin, newUV ) ) {

						hitUV = newUV;
						currStride = -ogStride;

					} else {

						currStride = ogStride;

					}

				}

			}
			#endif

			#if ENABLE_DEBUG

			gl_FragColor = intersected ? vec4( hitUV, stepped / float( MAX_STEPS ), 1.0 ) : vec4( 0.0 );

			#else

			if ( intersected ) {

				vec2 ndc = abs( hitUV * 2.0 - 1.0 );
				float maxndc = max( abs( ndc.x ), abs( ndc.y ) ); // [ -1.0, 1.0 ]
				float ndcFade = 1.0 - ( max( 0.0, maxndc - EDGE_FADE ) / ( 1.0 - EDGE_FADE )  );
				float stepFade = 1.0 - ( stepped / float( MAX_STEPS ) );
				float roughnessFade = 1.0 - roughness;

				#if GLOSSY_MODE != 0 // using GLOSSINESS mode

				roughnessFade = 1.0 / ( pow( searchRadius, 1.0 ) + 1.0 );
				// roughnessFade = 1.0 / ( PI * pow( searchRadius, 2.0 ) + 1.0 );
				// roughnessFade = smoothstep(5.0, 0.0, searchRadius);

				#endif

				roughnessFade *= smoothstep( roughnessCutoff, roughnessCutoff * 0.9, roughness );

				#if GLOSSY_MODE == 2 // MULTI_GLOSSY

				vec3 color = accumulatedColor;

				#elif GLOSSY_MODE == 3 // MIP_PYRAMID_GLOSSY

				vec3 color = finalColor;
				float factor = smoothstep( 3.0, 6.0, searchRadius );
				roughnessFade = 1.0 / ( searchRadius * factor + 1.0 );
				// roughnessFade = 1.0;

				#else

				vec3 color = texture2D( colorBuffer, hitUV ).rgb;

				#endif

				gl_FragColor = vec4( color * ndcFade * stepFade * roughnessFade, 0.0 );

			} else {

				gl_FragColor = vec4( 0.0 );

			}

			#endif

		}
		`},fe={uniforms:{tex:{value:null},displayRoughness:{value:0}},vertexShader:`
		varying vec3 vViewPosition;
		varying vec2 vUv;
		void main() {

			#include <begin_vertex>
			#include <project_vertex>
			vViewPosition = mvPosition.xyz;
			vUv = uv;

		}
	`,fragmentShader:`
		varying vec2 vUv;
		uniform sampler2D tex;
		uniform float displayRoughness;
		void main() {

			vec4 texVal = texture2D( tex, vUv );
			float roughness = texVal.a;
			vec3 packedNormal = texVal.xyz;
			vec3 unpackedNormal = ( packedNormal - 0.5 ) * 2.0;
			gl_FragColor = mix(
				vec4( unpackedNormal, 1.0 ),
				vec4( roughness, roughness, roughness, 1.0 ),
				displayRoughness
			);

		}
	`},he={uniforms:{tex:{value:null}},vertexShader:`
		varying vec3 vViewPosition;
		varying vec2 vUv;
		void main() {

			#include <begin_vertex>
			#include <project_vertex>
			vViewPosition = mvPosition.xyz;
			vUv = uv;

		}
	`,fragmentShader:`
		varying vec2 vUv;
		uniform sampler2D tex;
		uniform float divide;
		void main() {

			vec4 texVal = texture2D( tex, vUv );
			float depthVal = mod( - texVal.r, 1.0 );
			gl_FragColor = vec4( depthVal );

		}
	`},pe={uniforms:{frontSidetex:{value:null},backSidetex:{value:null},divide:{value:1}},vertexShader:`
		varying vec3 vViewPosition;
		varying vec2 vUv;
		void main() {

			#include <begin_vertex>
			#include <project_vertex>
			vViewPosition = mvPosition.xyz;
			vUv = uv;

		}
	`,fragmentShader:`
		varying vec2 vUv;
		uniform sampler2D frontSideTexture;
		uniform sampler2D backSideTexture;
		uniform float divide;
		void main() {

			vec4 frontTex = texture2D( frontSideTexture, vUv );
			vec4 backTex = texture2D( backSideTexture, vUv );

			float frontDepth = frontTex.r;
			float backDepth = backTex.r;
			float depthDelta = frontDepth - backDepth;

			if ( frontDepth < backDepth ) {

				gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );

			} else if ( ( frontDepth == 0.0 ) != ( backDepth == 0.0 ) ) {

				gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );

			} else {

				gl_FragColor = vec4( 10.0 * depthDelta / divide );

			}

		}
	`},ve={uniforms:{tex:{value:null}},vertexShader:`
		varying vec3 vViewPosition;
		varying vec2 vUv;
		void main() {

			#include <begin_vertex>
			#include <project_vertex>
			vViewPosition = mvPosition.xyz;
			vUv = uv;

		}
	`,fragmentShader:`
		varying vec2 vUv;
		uniform sampler2D tex;
		void main() {

			vec4 texVal = texture2D( tex, vUv );
			gl_FragColor = vec4( texVal.xy, 0.0, 1.0 );

		}
	`},me={uniforms:{tex:{value:null}},vertexShader:`
		varying vec3 vViewPosition;
		varying vec2 vUv;
		void main() {

			#include <begin_vertex>
			#include <project_vertex>
			vViewPosition = mvPosition.xyz;
			vUv = uv;

		}
	`,fragmentShader:`
		varying vec2 vUv;
		uniform sampler2D tex;
		void main() {

			vec4 texVal = texture2D( tex, vUv );
			gl_FragColor = vec4( texVal.z, texVal.z, texVal.z, 1.0 );

		}
	`};class _e extends ee{constructor(){super(le),this.useNormalMaps=!0,this.useRoughnessMaps=!0,this.roughnessOverride=null}updateUniforms(e,r,t){super.updateUniforms(e,r,t);let l=this;function p(s,a){l.roughnessOverride!==null&&(a.uniforms.roughness.value=l.roughnessOverride),a.setDefine("USE_ROUGHNESSMAP",l.useRoughnessMaps&&a.uniforms.roughnessMap.value?"":void 0),a.setDefine("USE_NORMALMAP",l.useNormalMaps&&a.uniforms.normalMap.value?"":void 0),a.setDefine("TANGENTSPACE_NORMALMAP",l.useNormalMaps&&a.uniforms.normalMap.value?"":void 0),a.setDefine("ALPHATEST",a.uniforms.alphaTest.value===0?void 0:a.uniforms.alphaTest.value),a.uniforms.alphaMap.value?(a.setDefine("ALPHAMAP_UV","uv"),a.setDefine("USE_ALPHAMAP","")):(a.setDefine("ALPHAMAP_UV",void 0),a.setDefine("USE_ALPHAMAP",void 0)),a.setDefine("USE_MAP",a.uniforms.map.value?"":void 0),a.setDefine("USE_UV","USE_ALPHAMAP"in a.defines||"USE_MAP"in a.defines||"USE_NORMALMAP"in a.defines||"USE_ROUGHNESSMAP"in a.defines?"":void 0)}if(Array.isArray(r))for(let s=0;s<r.length;s++)p(r[s],t[s]);else p(r,t)}}class Z extends ee{constructor(){super({extensions:{derivatives:!0},defines:{USE_UV:""},uniforms:{...ae.normal.uniforms,alphaMap:{value:null},alphaTest:{value:0},map:{value:null},opacity:{value:1}},vertexShader:`
				varying vec3 vViewPosition;
				#include <common>
				#include <uv_pars_vertex>
				#include <displacementmap_pars_vertex>
				#include <morphtarget_pars_vertex>
				#include <skinning_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>
				void main() {
					#include <uv_vertex>
					#include <beginnormal_vertex>
					#include <morphnormal_vertex>
					#include <skinbase_vertex>
					#include <skinnormal_vertex>
					#include <defaultnormal_vertex>
					#include <begin_vertex>
					#include <morphtarget_vertex>
					#include <skinning_vertex>
					#include <displacementmap_vertex>
					#include <project_vertex>
					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					vViewPosition = mvPosition.xyz;
				}
			`,fragmentShader:`
				uniform float opacity;
				varying vec3 vViewPosition;
				#include <uv_pars_fragment>
				#include <map_pars_fragment>
				#include <bumpmap_pars_fragment>
				#include <normalmap_pars_fragment>
				#include <alphamap_pars_fragment>
				#include <alphatest_pars_fragment>
				
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>
				void main() {
					vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
					#include <clipping_planes_fragment>
					#include <logdepthbuf_fragment>
					#include <map_fragment>
					#include <alphamap_fragment>
					#include <alphatest_fragment>
					gl_FragColor = vec4( vViewPosition.z );
				}
			`}),this.invertSide=!1}updateUniforms(e,r,t){super.updateUniforms(e,r,t);let l=this;function p(s,a){let n;l.invertSide&&(a.side=s.side),a.setDefine("ALPHATEST",a.uniforms.alphaTest.value===0?void 0:a.uniforms.alphaTest.value),a.setDefine("USE_ALPHAMAP",a.uniforms.alphaMap.value?"":void 0),n=a.defines.USE_MAP,a.defines.ALPHATEST===0||!a.uniforms.map.value?delete a.defines.USE_MAP:a.defines.USE_MAP="",n!==a.defines.USE_MAP&&(a.needsUpdate=!0),n=a.defines.USE_UV,"USE_ALPHAMAP"in a.defines||"USE_MAP"in a.defines?a.defines.USE_UV="":delete a.defines.USE_UV,n!==a.defines.USE_UV&&(a.needsUpdate=!0)}if(Array.isArray(r))for(let s=0;s<r.length;s++)p(r[s],t[s]);else p(r,t)}}const j=new k;class Se{constructor(e){e||(e=`

				#pragma unroll_loop
				for ( int i = 0; i < SAMPLES; i ++ ) {

					gl_FragColor += samples[ i ] * weights[ i ];

				}

			`);const r=D(ue);r.fragmentShader=r.fragmentShader.replace(/<mipmap_logic>/g,e);const t=new Array(4);t[0]=new m(D(r)),t[0].defines.X_IS_EVEN=0,t[0].defines.Y_IS_EVEN=0,t[1]=new m(D(r)),t[1].defines.X_IS_EVEN=1,t[1].defines.Y_IS_EVEN=0,t[2]=new m(D(r)),t[2].defines.X_IS_EVEN=0,t[2].defines.Y_IS_EVEN=1,t[3]=new m(D(r)),t[3].defines.X_IS_EVEN=1,t[3].defines.Y_IS_EVEN=1;const l=new y;l.texture.minFilter=R,l.texture.magFilter=R,this._swapTarget=l,this._copyQuad=new E(new m($)),this._mipQuad=new E(null),this._mipMaterials=t}update(e,r,t,l=!1){e.isWebGLRenderTarget&&(e=e.texture);const p=t.autoClear,s=t.getClearAlpha(),a=t.getRenderTarget();t.getClearColor(j);const n=this._copyQuad,d=this._mipQuad,i=this._swapTarget,u=this._mipMaterials;let c,g;l?(c=C.floorPowerOfTwo(e.image.width),g=C.floorPowerOfTwo(e.image.height)):(c=Math.floor(e.image.width),g=Math.floor(e.image.height));const v=Math.floor(c*1.5),h=Math.floor(g);r.setSize(v,h),i.texture.type!==r.texture.type?(i.dispose(),i.copy(r),i.texture.image={...i.texture.image}):i.setSize(v,h),t.autoClear=!1,t.setClearColor(0),t.setClearAlpha(),n.material.uniforms.tDiffuse.value=e,n.camera.setViewOffset(c,g,0,0,v,h),t.setRenderTarget(r),t.clear(),n.render(t),t.setRenderTarget(i),t.clear(),n.render(t);let f=c,_=g,S=0;for(;f>1&&_>1;){const Y=(f%2===0?1:0)|(_%2===0?2:0),x=u[Y];x.uniforms.map.value=i.texture,x.uniforms.parentLevel.value=S,x.uniforms.parentMapSize.value.set(f,_),x.uniforms.originalMapSize.value.set(c,g),d.material=x,f=Math.floor(f/2),_=Math.floor(_/2);const A=h-2*_;t.setRenderTarget(r),d.camera.setViewOffset(f,_,-c,-A,v,h),d.render(t),t.setRenderTarget(i),x.uniforms.map.value=r.texture,d.render(t),S++}return t.setRenderTarget(a),t.setClearAlpha(s),t.setClearColor(j),t.autoClear=p,S+1}dispose(){this._swapTarget.dispose(),this._mipQuad.dispose(),this._copyQuad.dispose(),this._mipMaterials.forEach(e=>e.dispose())}}const O=new m(fe),K=new E(O),N=new m(he),J=new E(N),I=new m(pe),ge=new E(I),xe=new m(ve),W=new E(xe),Ee=new m(me),X=new E(Ee),q=new ie,Te=new k(0);let M=null,U=null;class o extends re{constructor(e,r,t={}){if(super(),M==null){M=new se,M.size=32;const s=new Uint8Array(32**2*4);for(let a=0,n=4;a<n;a++){const d=M.generate(),i=d.data,u=d.maxValue;for(let c=0,g=i.length;c<g;c++){const v=255*(i[c]/u);s[c*4+a]=v}}U=new oe(s,M.size,M.size,T),U.wrapS=F,U.wrapT=F,U.minFilter=w}this.enabled=!0,this.needsSwap=!0,this.intensity=.5,this.steps=10,this.binarySearchSteps=4,this.stride=30,this.renderTargetScale=.5,this.raymarchTargetScale=.5,this.jitter=1,this.thickness=1,this.useThickness=!1,this.useNormalMaps=!0,this.useRoughnessMaps=!0,this.roughnessCutoff=1,this.roughnessOverride=null,this.glossinessMode=o.NO_GLOSSY,this.jitterStrategy=o.REGULAR_JITTER,this.glossyJitterStrategy=o.RANDOM_JITTER,this.enableBlur=!0,this.blurStride=1,this.blurRadius=5,this.scene=e,this.camera=r,this.debug={display:o.DEFAULT},this._depthBuffer=new y(256,256,{minFilter:R,magFilter:R,format:T,type:L}),this._depthBuffer.texture.name="SSRPass.Depth",this._depthReplacement=new Z,this._depthReplacement._replacementMaterial.defines.USE_ALPHATEST=!0,this._backfaceDepthBuffer=this._depthBuffer.clone(),this._backfaceDepthBuffer.texture.name="SSRPass.Depth",this._backfaceDepthReplacement=new Z,this._backfaceDepthReplacement._replacementMaterial.defines.USE_ALPHATEST=!0,this._backfaceDepthReplacement.invertSide=!0,this._depthBufferLod=new y(256,256,{minFilter:H,magFilter:w,format:T,type:L}),this._depthBufferLodGenerator=new Se(`
				float minVal = samples[ 0 ].r;
				for ( int i = 1; i < SAMPLES; i ++ ) {

					minVal = min( minVal, samples[ i ].r );

				}
				gl_FragColor = vec4( minVal );
			`),this._colorLod=new y(1,1,{format:T,minFilter:H,magFilter:w,generateMipmaps:!0}),this._packedReplacement=new _e,this._packedReplacement._replacementMaterial.defines.USE_ALPHATEST=!0,this._packedBuffer=new y(256,256,{minFilter:R,magFilter:R,type:L,format:T}),this._packedBuffer.texture.name="SSRPass.Packed",this._marchResultsBuffer=new y(256,256,{type:L,format:T}),this._marchResultsBuffer.texture.name="SSRPass.MarchResults";const l=new m(de);this._marchQuad=new E(l);const p=new m(ce);this._colorResolveQuad=new E(p),this._copyQuad=new E(new m($)),this._clear_color_=new k,this.cache={}}dispose(){this._depthBuffer.dispose(),this._packedBuffer.dispose()}setSize(e,r){const t=this.raymarchTargetScale,l=Math.floor(e*t),p=Math.floor(r*t);this._marchResultsBuffer.setSize(l,p);const s=this.renderTargetScale,a=Math.floor(e*s),n=Math.floor(r*s);this._depthBuffer.setSize(a,n),this._backfaceDepthBuffer.setSize(a,n),this._packedBuffer.setSize(a,n),this.update_parameter()}update_parameter(){const e=this.camera,r=this.debug,t=this._depthBuffer,l=this._packedBuffer,p=this._backfaceDepthBuffer,s=this._packedReplacement;s.useNormalMaps=this.useNormalMaps,s.useRoughnessMaps=this.useRoughnessMaps,s.roughnessOverride=this.roughnessOverride;const a=this.glossinessMode===o.MIP_PYRAMID_GLOSSY||this.useThickness,n=this._marchResultsBuffer,i=this._marchQuad.material,u=i.uniforms;u.depthBuffer.value=t.texture,u.backfaceDepthBuffer.value=p.texture,u.packedBuffer.value=l.texture,u.invProjectionMatrix.value.copy(e.projectionMatrix).invert(),u.projMatrix.value.copy(e.projectionMatrix),u.resolution.value.set(n.width,n.height),u.jitter.value=this.jitter,u.thickness.value=this.thickness,u.stride.value=this.stride,u.blueNoiseTex.value=U,u.roughnessCutoff.value=this.roughnessCutoff,this.glossinessMode===o.MIP_PYRAMID_GLOSSY&&(u.colorBuffer.value=this._colorLod.texture,u.depthBufferLod.value=this._depthBufferLod.texture),i.defines.GLOSSY_MODE!==this.glossinessMode&&(i.defines.GLOSSY_MODE=this.glossinessMode,i.needsUpdate=!0),i.defines.JITTER_STRATEGY!==this.jitterStrategy&&(i.defines.JITTER_STRATEGY=this.jitterStrategy,i.needsUpdate=!0),i.defines.GLOSSY_JITTER_STRATEGY!==this.glossyJitterStrategy&&(i.defines.GLOSSY_JITTER_STRATEGY=this.glossyJitterStrategy,i.needsUpdate=!0),i.defines.ORTHOGRAPHIC_CAMERA!==Number(e.isOrthographicCamera||!1)&&(i.defines.ORTHOGRAPHIC_CAMERA=Number(e.isOrthographicCamera||!1),i.needsUpdate=!0),i.defines.MAX_STEPS!==this.steps&&(i.defines.MAX_STEPS=Math.floor(this.steps),i.needsUpdate=!0),i.defines.BINARY_SEARCH_ITERATIONS!==this.binarySearchSteps&&(i.defines.BINARY_SEARCH_ITERATIONS=Math.floor(this.binarySearchSteps),i.needsUpdate=!0),!!i.defines.USE_THICKNESS!==a&&(i.defines.USE_THICKNESS=a?1:0,i.needsUpdate=!0);const c=r.display===o.INTERSECTION_RESULTS||r.display===o.INTERSECTION_DISTANCE;c!==!!i.defines.ENABLE_DEBUG&&(i.defines.ENABLE_DEBUG=c?1:0,i.needsUpdate=!0);const v=this._colorResolveQuad.material,h=v.uniforms,f=v.defines;h.depthBuffer.value=t.texture,h.packedBuffer.value=l.texture,h.intersectBuffer.value=n.texture,h.intensity.value=this.intensity,h.renderSize.value.set(t.width,t.height),h.marchSize.value.set(n.width,n.height),h.blurStride.value=this.blurStride,this.enableBlur!==!!f.ENABLE_BLUR&&(f.ENABLE_BLUR=this.enableBlur?1:0,v.needsUpdate=!0),this.blurRadius!==f.BLUR_RADIUS&&(f.BLUR_RADIUS=this.blurRadius,v.needsUpdate=!0);const _=r.display===o.INTERSECTION_COLOR;_!==!!f.COLOR_HIT_ONLY&&(f.COLOR_HIT_ONLY=_?1:0,v.needsUpdate=!0)}render(e,r,t,l,p){const s=this.scene,a=this.camera,n=this.debug,d=this.renderToScreen?null:r,i=this._depthBuffer,u=this._packedBuffer,c=this._backfaceDepthBuffer,g=this.glossinessMode===o.MIP_PYRAMID_GLOSSY||this.useThickness,v=this._depthReplacement,h=this._backfaceDepthReplacement,f=this._packedReplacement;e.getClearColor(this._clear_color_);const _=e.getClearAlpha();q.copy(e,s);const S=()=>{q.restore(e,s),f.reset(s,!0),e.setClearColor(this._clear_color_,_)};if(s.matrixWorldAutoUpdate=!1,e.shadowMap.enabled=!1,e.autoClear=!0,e.setClearColor(Te,0),s.background=null,f.replace(s,!0,!0),e.setRenderTarget(u),e.clear(),e.render(s,a),n.display===o.NORMAL){e.setRenderTarget(d),e.clear(),O.uniforms.displayRoughness.value=0,O.uniforms.tex.value=u.texture,K.render(e),S();return}if(n.display===o.ROUGHNESS){e.setRenderTarget(d),e.clear(),O.uniforms.displayRoughness.value=1,O.uniforms.tex.value=u.texture,K.render(e),S();return}if(v.replace(s,!0,!1),e.setRenderTarget(i),e.clear(),e.render(s,a),this.glossinessMode===o.MIP_PYRAMID_GLOSSY){this._depthBufferLodGenerator.update(i,this._depthBufferLod,e,!1);const V=C.floorPowerOfTwo(t.texture.image.width,t.texture.image.height);this._copyQuad.material.uniforms.tDiffuse.value=t.texture,this._colorLod.texture.generateMipmaps=!0,this._colorLod.setSize(V,V),e.setRenderTarget(this._colorLod),this._copyQuad.render(e)}if(n.display===o.FRONT_DEPTH){e.setRenderTarget(d),e.clear(),N.uniforms.tex.value=this.glossinessMode===o.MIP_PYRAMID_GLOSSY?this._depthBufferLod:i.texture,J.render(e),S();return}if(g===!1){if(h.replace(s,!0,!1),e.setRenderTarget(c),e.clear(),e.render(s,a),n.display===o.BACK_DEPTH){e.setRenderTarget(d),e.clear(),N.uniforms.tex.value=c.texture,J.render(e),S();return}if(n.display===o.DEPTH_DELTA){e.setRenderTarget(d),e.clear(),I.uniforms.backSidetex.value=c.texture,I.uniforms.frontSidetex.value=i.texture,I.uniforms.divide.value=30,ge.render(e),S();return}}const P=this._marchResultsBuffer,b=this._marchQuad,x=b.material.uniforms;if(this.cache.readBuffer_texture!==t.texture&&(this.cache.readBuffer_texture=t.texture,x.colorBuffer.value=t.texture),x.invProjectionMatrix.value.copy(a.projectionMatrix).invert(),x.projMatrix.value.copy(a.projectionMatrix),e.setRenderTarget(P),e.clear(),b.render(e),n.display===o.INTERSECTION_RESULTS){e.setRenderTarget(d),e.clear(),W.material.uniforms.tex.value=P.texture,W.render(e),S();return}if(n.display===o.INTERSECTION_DISTANCE){e.setRenderTarget(d),e.clear(),X.material.uniforms.tex.value=P.texture,X.render(e),S();return}const A=this._colorResolveQuad,z=A.material,te=z.uniforms;z.defines,this.cache.resolveUniforms_readBuffer_texture!==t.texture&&(this.cache.resolveUniforms_readBuffer_texture=t.texture,te.sourceBuffer.value=t.texture),e.setRenderTarget(d),e.clear(),A.render(e),S()}}o.DEFAULT=0;o.FRONT_DEPTH=1;o.BACK_DEPTH=2;o.DEPTH_DELTA=3;o.NORMAL=4;o.ROUGHNESS=5;o.INTERSECTION_RESULTS=6;o.INTERSECTION_DISTANCE=7;o.INTERSECTION_COLOR=8;o.NO_GLOSSY=0;o.SIMPLE_GLOSSY=1;o.MULTI_GLOSSY=2;o.MIP_PYRAMID_GLOSSY=3;o.REGULAR_JITTER=0;o.BLUENOISE_JITTER=1;o.RANDOM_JITTER=2;export{o as SSRPass};
