import{b as C,V,a4 as _}from"./ddd@DwDq534T.js";class I{parse(O,z,r={}){function X(a){O.traverse(function(c){if(c.isMesh===!0||c.isPoints){const o=c,e=o.geometry;e.hasAttribute("position")===!0&&a(o,e)}})}r=Object.assign({binary:!1,excludeAttributes:[],littleEndian:!1},r);const $=r.excludeAttributes;let b=!0,m=!1,y=!1,p=!1,w=0,M=0;O.traverse(function(a){if(a.isMesh===!0){const o=a.geometry,e=o.getAttribute("position"),t=o.getAttribute("normal"),n=o.getAttribute("uv"),u=o.getAttribute("color"),x=o.getIndex();if(e===void 0)return;w+=e.count,M+=x?x.count/3:e.count/3,t!==void 0&&(m=!0),n!==void 0&&(p=!0),u!==void 0&&(y=!0)}else if(a.isPoints){const o=a.geometry,e=o.getAttribute("position"),t=o.getAttribute("normal"),n=o.getAttribute("color");w+=e.count,t!==void 0&&(m=!0),n!==void 0&&(y=!0),b=!1}});const A=new C;if(b=b&&$.indexOf("index")===-1,m=m&&$.indexOf("normal")===-1,y=y&&$.indexOf("color")===-1,p=p&&$.indexOf("uv")===-1,b&&M!==Math.floor(M))return console.error("PLYExporter: Failed to generate a valid PLY file with triangle indices because the number of indices is not divisible by 3."),null;const E=4;let h=`ply
format ${r.binary?r.littleEndian?"binary_little_endian":"binary_big_endian":"ascii"} 1.0
element vertex ${w}
property float x
property float y
property float z
`;m===!0&&(h+=`property float nx
property float ny
property float nz
`),p===!0&&(h+=`property float s
property float t
`),y===!0&&(h+=`property uchar red
property uchar green
property uchar blue
`),b===!0&&(h+=`element face ${M}
property list uchar int vertex_index
`),h+=`end_header
`;const l=new V,B=new _;let L=null;if(r.binary===!0){const a=new TextEncoder().encode(h),c=w*(4*3+(m?4*3:0)+(y?3:0)+(p?4*2:0)),o=b?M*(E*3+1):0,e=new DataView(new ArrayBuffer(a.length+c+o));new Uint8Array(e.buffer).set(a,0);let t=a.length,n=a.length+c,u=0;X(function(x,v){const f=v.getAttribute("position"),i=v.getAttribute("normal"),g=v.getAttribute("uv"),d=v.getAttribute("color"),U=v.getIndex();B.getNormalMatrix(x.matrixWorld);for(let s=0,F=f.count;s<F;s++)l.fromBufferAttribute(f,s),l.applyMatrix4(x.matrixWorld),e.setFloat32(t,l.x,r.littleEndian),t+=4,e.setFloat32(t,l.y,r.littleEndian),t+=4,e.setFloat32(t,l.z,r.littleEndian),t+=4,m===!0&&(i!=null?(l.fromBufferAttribute(i,s),l.applyMatrix3(B).normalize(),e.setFloat32(t,l.x,r.littleEndian),t+=4,e.setFloat32(t,l.y,r.littleEndian),t+=4,e.setFloat32(t,l.z,r.littleEndian),t+=4):(e.setFloat32(t,0,r.littleEndian),t+=4,e.setFloat32(t,0,r.littleEndian),t+=4,e.setFloat32(t,0,r.littleEndian),t+=4)),p===!0&&(g!=null?(e.setFloat32(t,g.getX(s),r.littleEndian),t+=4,e.setFloat32(t,g.getY(s),r.littleEndian),t+=4):(e.setFloat32(t,0,r.littleEndian),t+=4,e.setFloat32(t,0,r.littleEndian),t+=4)),y===!0&&(d!=null?(A.fromBufferAttribute(d,s).convertLinearToSRGB(),e.setUint8(t,Math.floor(A.r*255)),t+=1,e.setUint8(t,Math.floor(A.g*255)),t+=1,e.setUint8(t,Math.floor(A.b*255)),t+=1):(e.setUint8(t,255),t+=1,e.setUint8(t,255),t+=1,e.setUint8(t,255),t+=1));if(b===!0)if(U!==null)for(let s=0,F=U.count;s<F;s+=3)e.setUint8(n,3),n+=1,e.setUint32(n,U.getX(s+0)+u,r.littleEndian),n+=E,e.setUint32(n,U.getX(s+1)+u,r.littleEndian),n+=E,e.setUint32(n,U.getX(s+2)+u,r.littleEndian),n+=E;else for(let s=0,F=f.count;s<F;s+=3)e.setUint8(n,3),n+=1,e.setUint32(n,u+s,r.littleEndian),n+=E,e.setUint32(n,u+s+1,r.littleEndian),n+=E,e.setUint32(n,u+s+2,r.littleEndian),n+=E;u+=f.count}),L=e.buffer}else{let a=0,c="",o="";X(function(e,t){const n=t.getAttribute("position"),u=t.getAttribute("normal"),x=t.getAttribute("uv"),v=t.getAttribute("color"),f=t.getIndex();B.getNormalMatrix(e.matrixWorld);for(let i=0,g=n.count;i<g;i++){l.fromBufferAttribute(n,i),l.applyMatrix4(e.matrixWorld);let d=l.x+" "+l.y+" "+l.z;m===!0&&(u!=null?(l.fromBufferAttribute(u,i),l.applyMatrix3(B).normalize(),d+=" "+l.x+" "+l.y+" "+l.z):d+=" 0 0 0"),p===!0&&(x!=null?d+=" "+x.getX(i)+" "+x.getY(i):d+=" 0 0"),y===!0&&(v!=null?(A.fromBufferAttribute(v,i).convertLinearToSRGB(),d+=" "+Math.floor(A.r*255)+" "+Math.floor(A.g*255)+" "+Math.floor(A.b*255)):d+=" 255 255 255"),c+=d+`
`}if(b===!0){if(f!==null)for(let i=0,g=f.count;i<g;i+=3)o+=`3 ${f.getX(i+0)+a}`,o+=` ${f.getX(i+1)+a}`,o+=` ${f.getX(i+2)+a}
`;else for(let i=0,g=n.count;i<g;i+=3)o+=`3 ${a+i} ${a+i+1} ${a+i+2}
`;M+=f?f.count/3:n.count/3}a+=n.count}),L=`${h}${c}${b?`${o}
`:`
`}`}return typeof z=="function"&&requestAnimationFrame(()=>z(L)),L}}export{I as PLYExporter};
