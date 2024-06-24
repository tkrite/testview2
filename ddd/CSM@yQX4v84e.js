import{j as _,V as d,ag as u,ah as A,ai as v,a0 as P,o as y}from"./ddd@DwDq534T.js";const L=new _;class S{constructor(e){e=e||{},this.vertices={near:[new d,new d,new d,new d],far:[new d,new d,new d,new d]},e.projectionMatrix!==void 0&&this.setFromProjectionMatrix(e.projectionMatrix,e.maxFar||1e4)}setFromProjectionMatrix(e,i){const a=e.elements[11]===0;return L.copy(e).invert(),this.vertices.near[0].set(1,1,-1),this.vertices.near[1].set(1,-1,-1),this.vertices.near[2].set(-1,-1,-1),this.vertices.near[3].set(-1,1,-1),this.vertices.near.forEach(function(r){r.applyMatrix4(L)}),this.vertices.far[0].set(1,1,1),this.vertices.far[1].set(1,-1,1),this.vertices.far[2].set(-1,-1,1),this.vertices.far[3].set(-1,1,1),this.vertices.far.forEach(function(r){r.applyMatrix4(L);const t=Math.abs(r.z);a?r.z*=Math.min(i/t,1):r.multiplyScalar(Math.min(i/t,1))}),this.vertices}split(e,i){for(;e.length>i.length;)i.push(new S);i.length=e.length;for(let a=0;a<e.length;a++){const r=i[a];if(a===0)for(let t=0;t<4;t++)r.vertices.near[t].copy(this.vertices.near[t]);else for(let t=0;t<4;t++)r.vertices.near[t].lerpVectors(this.vertices.near[t],this.vertices.far[t],e[a-1]);if(a===e.length-1)for(let t=0;t<4;t++)r.vertices.far[t].copy(this.vertices.far[t]);else for(let t=0;t<4;t++)r.vertices.far[t].lerpVectors(this.vertices.near[t],this.vertices.far[t],e[a])}}toSpace(e,i){for(let a=0;a<4;a++)i.vertices.near[a].copy(this.vertices.near[a]).applyMatrix4(e),i.vertices.far[a].copy(this.vertices.far[a]).applyMatrix4(e)}}const N={lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

vec3 geometryClearcoatNormal = vec3( 0.0 );

#ifdef USE_CLEARCOAT

	geometryClearcoatNormal = clearcoatNormal;

#endif

#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		// Iridescence F0 approximation
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif

IncidentLight directLight;

#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		pointLight = pointLights[ i ];

		getPointLightInfo( pointLight, geometryPosition, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

	SpotLight spotLight;
 	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;

	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		spotLight = spotLights[ i ];

		getSpotLightInfo( spotLight, geometryPosition, directLight );

  		// spot lights are ordered [shadows with maps, shadows without maps, maps without shadows, none]
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;

		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct ) && defined( USE_CSM ) && defined( CSM_CASCADES )

	DirectionalLight directionalLight;
	float linearDepth = (vViewPosition.z) / (shadowFar - cameraNear);
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#if defined( USE_SHADOWMAP ) && defined( CSM_FADE )
		vec2 cascade;
		float cascadeCenter;
		float closestEdge;
		float margin;
		float csmx;
		float csmy;

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];
			getDirectionalLightInfo( directionalLight, directLight );

			#if ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
				// NOTE: Depth gets larger away from the camera.
				// cascade.x is closer, cascade.y is further
				cascade = CSM_cascades[ i ];
				cascadeCenter = ( cascade.x + cascade.y ) / 2.0;
				closestEdge = linearDepth < cascadeCenter ? cascade.x : cascade.y;
				margin = 0.25 * pow( closestEdge, 2.0 );
				csmx = cascade.x - margin / 2.0;
				csmy = cascade.y + margin / 2.0;
				if( linearDepth >= csmx && ( linearDepth < csmy || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 ) ) {

					float dist = min( linearDepth - csmx, csmy - linearDepth );
					float ratio = clamp( dist / margin, 0.0, 1.0 );

					vec3 prevColor = directLight.color;
					directionalLightShadow = directionalLightShadows[ i ];
					directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

					bool shouldFadeLastCascade = UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 && linearDepth > cascadeCenter;
					directLight.color = mix( prevColor, directLight.color, shouldFadeLastCascade ? ratio : 1.0 );

					ReflectedLight prevLight = reflectedLight;
					RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

					bool shouldBlend = UNROLLED_LOOP_INDEX != CSM_CASCADES - 1 || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 && linearDepth < cascadeCenter;
					float blendRatio = shouldBlend ? ratio : 1.0;

					reflectedLight.directDiffuse = mix( prevLight.directDiffuse, reflectedLight.directDiffuse, blendRatio );
					reflectedLight.directSpecular = mix( prevLight.directSpecular, reflectedLight.directSpecular, blendRatio );
					reflectedLight.indirectDiffuse = mix( prevLight.indirectDiffuse, reflectedLight.indirectDiffuse, blendRatio );
					reflectedLight.indirectSpecular = mix( prevLight.indirectSpecular, reflectedLight.indirectSpecular, blendRatio );

				}
			#endif

		}
		#pragma unroll_loop_end
	#elif defined (USE_SHADOWMAP)

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];
			getDirectionalLightInfo( directionalLight, directLight );

			#if ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )

				directionalLightShadow = directionalLightShadows[ i ];
				if(linearDepth >= CSM_cascades[UNROLLED_LOOP_INDEX].x && linearDepth < CSM_cascades[UNROLLED_LOOP_INDEX].y) directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

				if(linearDepth >= CSM_cascades[UNROLLED_LOOP_INDEX].x && (linearDepth < CSM_cascades[UNROLLED_LOOP_INDEX].y || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1)) RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

			#endif

		}
		#pragma unroll_loop_end

	#elif ( NUM_DIR_LIGHT_SHADOWS > 0 )
		// note: no loop here - all CSM lights are in fact one light only
		getDirectionalLightInfo( directionalLights[0], directLight );
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	#endif

	#if ( NUM_DIR_LIGHTS > NUM_DIR_LIGHT_SHADOWS)
		// compute the lights not casting shadows (if any)

		#pragma unroll_loop_start
		for ( int i = NUM_DIR_LIGHT_SHADOWS; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];

			getDirectionalLightInfo( directionalLight, directLight );

			RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

		}
		#pragma unroll_loop_end

	#endif

#endif


#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct ) && !defined( USE_CSM ) && !defined( CSM_CASCADES )

	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		directionalLight = directionalLights[ i ];

		getDirectionalLightInfo( directionalLight, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

	RectAreaLight rectAreaLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if defined( RE_IndirectDiffuse )

	vec3 iblIrradiance = vec3( 0.0 );

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	#if defined( USE_LIGHT_PROBES )

		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );

	#endif

	#if ( NUM_HEMI_LIGHTS > 0 )

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );

		}
		#pragma unroll_loop_end

	#endif

#endif

#if defined( RE_IndirectSpecular )

	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );

#endif
`,lights_pars_begin:`
#if defined( USE_CSM ) && defined( CSM_CASCADES )
uniform vec2 CSM_cascades[CSM_CASCADES];
uniform float cameraNear;
uniform float shadowFar;
#endif
	`+u.lights_pars_begin},E=new _,p=new S,l=new d,f=new A,m=[],D=[],w=new _,C=new _,U=new d(0,1,0);class R{constructor(e){this.camera=e.camera,this.parent=e.parent,this.cascades=e.cascades||3,this.maxFar=e.maxFar||1e5,this.mode=e.mode||"practical",this.shadowMapSize=e.shadowMapSize||2048,this.shadowBias=e.shadowBias||1e-6,this.lightDirection=e.lightDirection||new d(1,-1,1).normalize(),this.lightIntensity=e.lightIntensity||3,this.lightNear=e.lightNear||1,this.lightFar=e.lightFar||2e3,this.lightMargin=e.lightMargin||200,this.shadowNormalBias=e.shadowNormalBias||.1,this.customSplitsCallback=e.customSplitsCallback,this.fade=!1,this.mainFrustum=new S,this.frustums=[],this.breaks=[],this.lights=[],this.shaders=new Map,this.createLights(),this.updateFrustums(),this.injectInclude()}createLights(){for(const e of this.lights)e.dispose();for(let e=0;e<this.cascades;e++){const i=new v(16777215,this.lightIntensity);i.castShadow=!0,i.shadow.mapSize.width=this.shadowMapSize,i.shadow.mapSize.height=this.shadowMapSize,i.shadow.camera.near=this.lightNear,i.shadow.camera.far=this.lightFar,i.shadow.bias=this.shadowBias,i.shadow.normalBias=this.shadowNormalBias,this.parent.add(i),this.parent.add(i.target),this.lights.push(i)}}updateLights(){for(let e=0;e<this.cascades;e++){const i=this.lights[e];i.shadow.camera.near=this.lightNear,i.shadow.camera.far=this.lightFar,i.shadow.bias=this.shadowBias*Math.exp(e),i.shadow.normalBias=this.shadowNormalBias}}initCascades(){const e=this.camera;e.updateProjectionMatrix(),this.mainFrustum.setFromProjectionMatrix(e.projectionMatrix,this.maxFar),this.mainFrustum.split(this.breaks,this.frustums)}updateShadowBounds(){const e=this.frustums;for(let i=0;i<e.length;i++){const r=this.lights[i].shadow.camera,t=this.frustums[i],s=t.vertices.near,h=t.vertices.far,n=h[0];let c;n.distanceTo(h[2])>n.distanceTo(s[2])?c=h[2]:c=s[2];let o=n.distanceTo(c);if(this.fade){const g=this.camera,M=Math.max(g.far,this.maxFar),I=t.vertices.far[0].z/(M-g.near),O=.25*Math.pow(I,2)*(M-g.near);o+=O}r.left=-o/2,r.right=o/2,r.top=o/2,r.bottom=-o/2,r.updateProjectionMatrix()}}getBreaks(){const e=this.camera,i=Math.min(e.far,this.maxFar);switch(this.breaks.length=0,this.mode){case"uniform":a(this.cascades,e.near,i,this.breaks);break;case"logarithmic":r(this.cascades,e.near,i,this.breaks);break;case"practical":t(this.cascades,e.near,i,.5,this.breaks);break;case"custom":this.customSplitsCallback===void 0&&console.error("CSM: Custom split scheme callback not defined."),this.customSplitsCallback(this.cascades,e.near,i,this.breaks);break}function a(s,h,n,c){for(let o=1;o<s;o++)c.push((h+(n-h)*o/s)/n);c.push(1)}function r(s,h,n,c){for(let o=1;o<s;o++)c.push(h*(n/h)**(o/s)/n);c.push(1)}function t(s,h,n,c,o){m.length=0,D.length=0,r(s,h,n,D),a(s,h,n,m);for(let g=1;g<s;g++)o.push(P.lerp(m[g-1],D[g-1],c));o.push(1)}}update(){const e=this.camera,i=this.frustums;w.lookAt(new d,this.lightDirection,U),C.copy(w).invert();for(let a=0;a<i.length;a++){const r=this.lights[a],t=r.shadow.camera,s=(t.right-t.left)/this.shadowMapSize,h=(t.top-t.bottom)/this.shadowMapSize;E.multiplyMatrices(C,e.matrixWorld),i[a].toSpace(E,p);const n=p.vertices.near,c=p.vertices.far;f.makeEmpty();for(let o=0;o<4;o++)f.expandByPoint(n[o]),f.expandByPoint(c[o]);f.getCenter(l),l.z=f.max.z+this.lightMargin,l.x=Math.floor(l.x/s)*s,l.y=Math.floor(l.y/h)*h,l.applyMatrix4(w),r.position.copy(l),r.target.position.copy(l),r.target.position.x+=this.lightDirection.x,r.target.position.y+=this.lightDirection.y,r.target.position.z+=this.lightDirection.z}this.updateLights()}injectInclude(){u.lights_fragment_begin=N.lights_fragment_begin,u.lights_pars_begin=N.lights_pars_begin}setupMaterial(e){e.defines=e.defines||{},e.defines.USE_CSM=1,e.defines.CSM_CASCADES=this.cascades,this.fade&&(e.defines.CSM_FADE="");const i=[],a=this,r=this.shaders;e.onBeforeCompile=function(t){const s=Math.min(a.camera.far,a.maxFar);a.getExtendedBreaks(i),t.uniforms.CSM_cascades={value:i},t.uniforms.cameraNear={value:a.camera.near},t.uniforms.shadowFar={value:s},r.set(e,t)},r.set(e,null)}updateUniforms(){const e=Math.min(this.camera.far,this.maxFar);this.shaders.forEach(function(a,r){if(a!==null){const t=a.uniforms;this.getExtendedBreaks(t.CSM_cascades.value),t.cameraNear.value=this.camera.near,t.shadowFar.value=e}!this.fade&&"CSM_FADE"in r.defines?(delete r.defines.CSM_FADE,r.needsUpdate=!0):this.fade&&!("CSM_FADE"in r.defines)&&(r.defines.CSM_FADE="",r.needsUpdate=!0)},this)}getExtendedBreaks(e){for(;e.length<this.breaks.length;)e.push(new y);e.length=this.breaks.length;for(let i=0;i<this.cascades;i++){const a=this.breaks[i],r=this.breaks[i-1]||0;e[i].x=r,e[i].y=a}}updateFrustums(){this.getBreaks(),this.initCascades(),this.updateShadowBounds(),this.updateUniforms()}remove(){for(let e=0;e<this.lights.length;e++)this.parent.remove(this.lights[e].target),this.parent.remove(this.lights[e])}dispose(){const e=this.shaders;e.forEach(function(i,a){delete a.onBeforeCompile,delete a.defines.USE_CSM,delete a.defines.CSM_CASCADES,delete a.defines.CSM_FADE,i!==null&&(delete i.uniforms.CSM_cascades,delete i.uniforms.cameraNear,delete i.uniforms.shadowFar),a.needsUpdate=!0}),e.clear()}}export{R as CSM};
