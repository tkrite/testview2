import{D as P,aG as C}from"./ddd@DwDq534T.js";import{b,z as w}from"./fflate.module@Do-qMP1X.js";import{d as E}from"./TextureUtils@YzsTNqKi.js";class B{parse(o,s,n,e){this.parseAsync(o,e).then(s).catch(n)}async parseAsync(o,s={}){s=Object.assign({ar:{anchoring:{type:"plane"},planeAnchoring:{alignment:"horizontal"}},includeAnchoringProperties:!0,quickLookCompatible:!1,maxTextureSize:1024},s);const n={},e="model.usda";n[e]=null;let i=v();i+=U(s);const c={},u={};o.traverseVisible(r=>{if(r.isMesh){const l=r.geometry,d=r.material;if(d.isMeshStandardMaterial){const h="geometries/Geometry_"+l.id+".usda";if(!(h in n)){const f=D(l);n[h]=O(f)}d.uuid in c||(c[d.uuid]=d),i+=R(r,l,d)}else console.warn("THREE.USDZExporter: Unsupported material type (USDZ only supports MeshStandardMaterial)",r)}else r.isCamera&&(i+=W(r))}),i+=A(),i+=N(c,u,s.quickLookCompatible),n[e]=b(i),i=null;for(const r in u){let l=u[r];l.isCompressedTexture===!0&&(l=E(l));const d=k(l.image,l.flipY,s.maxTextureSize),h=await new Promise(f=>d.toBlob(f,"image/png",1));n[`textures/Texture_${r}.png`]=new Uint8Array(await h.arrayBuffer())}let $=0;for(const r in n){const l=n[r],d=34+r.length;$+=d;const h=$&63;if(h!==4){const f=64-h,p=new Uint8Array(f);n[r]=[l,{extra:{12345:p}}]}$=l.length}return w(n,{level:0})}}function k(t,o,s){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof OffscreenCanvas<"u"&&t instanceof OffscreenCanvas||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const n=s/Math.max(t.width,t.height),e=document.createElement("canvas");e.width=t.width*Math.min(1,n),e.height=t.height*Math.min(1,n);const i=e.getContext("2d");return o===!0&&(i.translate(0,e.height),i.scale(1,-1)),i.drawImage(t,0,0,e.width,e.height),e}else throw new Error("THREE.USDZExporter: No valid image data found. Unable to process texture.")}const a=7;function v(){return`#usda 1.0
(
	customLayerData = {
		string creator = "Three.js USDZExporter"
	}
	defaultPrim = "Root"
	metersPerUnit = 1
	upAxis = "Y"
)

`}function U(t){return`def Xform "Root"
{
	def Scope "Scenes" (
		kind = "sceneLibrary"
	)
	{
		def Xform "Scene" (
			customData = {
				bool preliminary_collidesWithEnvironment = 0
				string sceneName = "Scene"
			}
			sceneName = "Scene"
		)
		{${t.includeAnchoringProperties===!0?`
		token preliminary:anchoring:type = "${t.ar.anchoring.type}"
		token preliminary:planeAnchoring:alignment = "${t.ar.planeAnchoring.alignment}"
	`:""}
`}function A(){return`
		}
	}
}

`}function O(t){let o=v();return o+=t,b(o)}function R(t,o,s){const n="Object_"+t.id,e=T(t.matrixWorld);return t.matrixWorld.determinant()<0&&console.warn("THREE.USDZExporter: USDZ does not support negative scales",t),`def Xform "${n}" (
	prepend references = @./geometries/Geometry_${o.id}.usda@</Geometry>
	prepend apiSchemas = ["MaterialBindingAPI"]
)
{
	matrix4d xformOp:transform = ${e}
	uniform token[] xformOpOrder = ["xformOp:transform"]

	rel material:binding = </Materials/Material_${s.id}>
}

`}function T(t){const o=t.elements;return`( ${m(o,0)}, ${m(o,4)}, ${m(o,8)}, ${m(o,12)} )`}function m(t,o){return`(${t[o+0]}, ${t[o+1]}, ${t[o+2]}, ${t[o+3]})`}function D(t){return`
def "Geometry"
{
${Z(t)}
}
`}function Z(t){const o="Geometry",s=t.attributes,n=s.position.count;return`
	def Mesh "${o}"
	{
		int[] faceVertexCounts = [${H(t)}]
		int[] faceVertexIndices = [${I(t)}]
		normal3f[] normals = [${g(s.normal,n)}] (
			interpolation = "vertex"
		)
		point3f[] points = [${g(s.position,n)}]
${z(s)}
		uniform token subdivisionScheme = "none"
	}
`}function H(t){const o=t.index!==null?t.index.count:t.attributes.position.count;return Array(o/3).fill(3).join(", ")}function I(t){const o=t.index,s=[];if(o!==null)for(let n=0;n<o.count;n++)s.push(o.getX(n));else{const n=t.attributes.position.count;for(let e=0;e<n;e++)s.push(e)}return s.join(", ")}function g(t,o){if(t===void 0)return console.warn("USDZExporter: Normals missing."),Array(o).fill("(0, 0, 0)").join(", ");const s=[];for(let n=0;n<t.count;n++){const e=t.getX(n),i=t.getY(n),c=t.getZ(n);s.push(`(${e.toPrecision(a)}, ${i.toPrecision(a)}, ${c.toPrecision(a)})`)}return s.join(", ")}function L(t){const o=[];for(let s=0;s<t.count;s++){const n=t.getX(s),e=t.getY(s);o.push(`(${n.toPrecision(a)}, ${1-e.toPrecision(a)})`)}return o.join(", ")}function z(t){let o="";for(let n=0;n<4;n++){const e=n>0?n:"",i=t["uv"+e];i!==void 0&&(o+=`
		texCoord2f[] primvars:st${e} = [${L(i)}] (
			interpolation = "vertex"
		)`)}const s=t.color;if(s!==void 0){const n=s.count;o+=`
	color3f[] primvars:displayColor = [${g(s,n)}] (
		interpolation = "vertex"
		)`}return o}function N(t,o,s=!1){const n=[];for(const e in t){const i=t[e];n.push(V(i,o,s))}return`def "Materials"
{
${n.join("")}
}

`}function V(t,o,s=!1){const n="			",e=[],i=[];function c(u,$,r){const l=u.source.id+"_"+u.flipY;o[l]=u;const d=u.channel>0?"st"+u.channel:"st",h={1e3:"repeat",1001:"clamp",1002:"mirror"},f=u.repeat.clone(),p=u.offset.clone(),M=u.rotation,x=Math.sin(M),y=Math.cos(M);return p.y=1-p.y-f.y,s?(p.x=p.x/f.x,p.y=p.y/f.y,p.x+=x/f.x,p.y+=y-1):(p.x+=x*f.x,p.y+=(1-y)*f.y),`
		def Shader "PrimvarReader_${$}"
		{
			uniform token info:id = "UsdPrimvarReader_float2"
			float2 inputs:fallback = (0.0, 0.0)
			token inputs:varname = "${d}"
			float2 outputs:result
		}

		def Shader "Transform2d_${$}"
		{
			uniform token info:id = "UsdTransform2d"
			token inputs:in.connect = </Materials/Material_${t.id}/PrimvarReader_${$}.outputs:result>
			float inputs:rotation = ${(M*(180/Math.PI)).toFixed(a)}
			float2 inputs:scale = ${S(f)}
			float2 inputs:translation = ${S(p)}
			float2 outputs:result
		}

		def Shader "Texture_${u.id}_${$}"
		{
			uniform token info:id = "UsdUVTexture"
			asset inputs:file = @textures/Texture_${l}.png@
			float2 inputs:st.connect = </Materials/Material_${t.id}/Transform2d_${$}.outputs:result>
			${r!==void 0?"float4 inputs:scale = "+G(r):""}
			token inputs:sourceColorSpace = "${u.colorSpace===C?"raw":"sRGB"}"
			token inputs:wrapS = "${h[u.wrapS]}"
			token inputs:wrapT = "${h[u.wrapT]}"
			float outputs:r
			float outputs:g
			float outputs:b
			float3 outputs:rgb
			${t.transparent||t.alphaTest>0?"float outputs:a":""}
		}`}return t.side===P&&console.warn("THREE.USDZExporter: USDZ does not support double sided materials",t),t.map!==null?(e.push(`${n}color3f inputs:diffuseColor.connect = </Materials/Material_${t.id}/Texture_${t.map.id}_diffuse.outputs:rgb>`),t.transparent?e.push(`${n}float inputs:opacity.connect = </Materials/Material_${t.id}/Texture_${t.map.id}_diffuse.outputs:a>`):t.alphaTest>0&&(e.push(`${n}float inputs:opacity.connect = </Materials/Material_${t.id}/Texture_${t.map.id}_diffuse.outputs:a>`),e.push(`${n}float inputs:opacityThreshold = ${t.alphaTest}`)),i.push(c(t.map,"diffuse",t.color))):e.push(`${n}color3f inputs:diffuseColor = ${_(t.color)}`),t.emissiveMap!==null?(e.push(`${n}color3f inputs:emissiveColor.connect = </Materials/Material_${t.id}/Texture_${t.emissiveMap.id}_emissive.outputs:rgb>`),i.push(c(t.emissiveMap,"emissive"))):t.emissive.getHex()>0&&e.push(`${n}color3f inputs:emissiveColor = ${_(t.emissive)}`),t.normalMap!==null&&(e.push(`${n}normal3f inputs:normal.connect = </Materials/Material_${t.id}/Texture_${t.normalMap.id}_normal.outputs:rgb>`),i.push(c(t.normalMap,"normal"))),t.aoMap!==null&&(e.push(`${n}float inputs:occlusion.connect = </Materials/Material_${t.id}/Texture_${t.aoMap.id}_occlusion.outputs:r>`),i.push(c(t.aoMap,"occlusion"))),t.roughnessMap!==null&&t.roughness===1?(e.push(`${n}float inputs:roughness.connect = </Materials/Material_${t.id}/Texture_${t.roughnessMap.id}_roughness.outputs:g>`),i.push(c(t.roughnessMap,"roughness"))):e.push(`${n}float inputs:roughness = ${t.roughness}`),t.metalnessMap!==null&&t.metalness===1?(e.push(`${n}float inputs:metallic.connect = </Materials/Material_${t.id}/Texture_${t.metalnessMap.id}_metallic.outputs:b>`),i.push(c(t.metalnessMap,"metallic"))):e.push(`${n}float inputs:metallic = ${t.metalness}`),t.alphaMap!==null?(e.push(`${n}float inputs:opacity.connect = </Materials/Material_${t.id}/Texture_${t.alphaMap.id}_opacity.outputs:r>`),e.push(`${n}float inputs:opacityThreshold = 0.0001`),i.push(c(t.alphaMap,"opacity"))):e.push(`${n}float inputs:opacity = ${t.opacity}`),t.isMeshPhysicalMaterial&&(e.push(`${n}float inputs:clearcoat = ${t.clearcoat}`),e.push(`${n}float inputs:clearcoatRoughness = ${t.clearcoatRoughness}`),e.push(`${n}float inputs:ior = ${t.ior}`)),`
	def Material "Material_${t.id}"
	{
		def Shader "PreviewSurface"
		{
			uniform token info:id = "UsdPreviewSurface"
${e.join(`
`)}
			int inputs:useSpecularWorkflow = 0
			token outputs:surface
		}

		token outputs:surface.connect = </Materials/Material_${t.id}/PreviewSurface.outputs:surface>

${i.join(`
`)}

	}
`}function _(t){return`(${t.r}, ${t.g}, ${t.b})`}function G(t){return`(${t.r}, ${t.g}, ${t.b}, 1.0)`}function S(t){return`(${t.x}, ${t.y})`}function W(t){const o=t.name?t.name:"Camera_"+t.id,s=T(t.matrixWorld);return t.matrixWorld.determinant()<0&&console.warn("THREE.USDZExporter: USDZ does not support negative scales",t),t.isOrthographicCamera?`def Camera "${o}"
		{
			matrix4d xformOp:transform = ${s}
			uniform token[] xformOpOrder = ["xformOp:transform"]

			float2 clippingRange = (${t.near.toPrecision(a)}, ${t.far.toPrecision(a)})
			float horizontalAperture = ${((Math.abs(t.left)+Math.abs(t.right))*10).toPrecision(a)}
			float verticalAperture = ${((Math.abs(t.top)+Math.abs(t.bottom))*10).toPrecision(a)}
			token projection = "orthographic"
		}
	
	`:`def Camera "${o}"
		{
			matrix4d xformOp:transform = ${s}
			uniform token[] xformOpOrder = ["xformOp:transform"]

			float2 clippingRange = (${t.near.toPrecision(a)}, ${t.far.toPrecision(a)})
			float focalLength = ${t.getFocalLength().toPrecision(a)}
			float focusDistance = ${t.focus.toPrecision(a)}
			float horizontalAperture = ${t.getFilmWidth().toPrecision(a)}
			token projection = "perspective"
			float verticalAperture = ${t.getFilmHeight().toPrecision(a)}
		}
	
	`}export{B as USDZExporter};
