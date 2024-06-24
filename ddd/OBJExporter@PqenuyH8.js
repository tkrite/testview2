import{V as B,b as W,o as N,a4 as P}from"./ddd@DwDq534T.js";class k{parse(j){let r="",u=0,v=0,A=0;const o=new B,g=new W,d=new B,M=new N,y=[];function w(e){let m=0,x=0,l=0;const f=e.geometry,t=new P,i=f.getAttribute("position"),a=f.getAttribute("normal"),p=f.getAttribute("uv"),V=f.getIndex();if(r+="o "+e.name+`
`,e.material&&e.material.name&&(r+="usemtl "+e.material.name+`
`),i!==void 0)for(let n=0,s=i.count;n<s;n++,m++)o.fromBufferAttribute(i,n),o.applyMatrix4(e.matrixWorld),r+="v "+o.x+" "+o.y+" "+o.z+`
`;if(p!==void 0)for(let n=0,s=p.count;n<s;n++,l++)M.fromBufferAttribute(p,n),r+="vt "+M.x+" "+M.y+`
`;if(a!==void 0){t.getNormalMatrix(e.matrixWorld);for(let n=0,s=a.count;n<s;n++,x++)d.fromBufferAttribute(a,n),d.applyMatrix3(t).normalize(),r+="vn "+d.x+" "+d.y+" "+d.z+`
`}if(V!==null)for(let n=0,s=V.count;n<s;n+=3){for(let c=0;c<3;c++){const b=V.getX(n+c)+1;y[c]=u+b+(a||p?"/"+(p?v+b:"")+(a?"/"+(A+b):""):"")}r+="f "+y.join(" ")+`
`}else for(let n=0,s=i.count;n<s;n+=3){for(let c=0;c<3;c++){const b=n+c+1;y[c]=u+b+(a||p?"/"+(p?v+b:"")+(a?"/"+(A+b):""):"")}r+="f "+y.join(" ")+`
`}u+=m,v+=l,A+=x}function z(e){let m=0;const x=e.geometry,l=e.type,f=x.getAttribute("position");if(r+="o "+e.name+`
`,f!==void 0)for(let t=0,i=f.count;t<i;t++,m++)o.fromBufferAttribute(f,t),o.applyMatrix4(e.matrixWorld),r+="v "+o.x+" "+o.y+" "+o.z+`
`;if(l==="Line"){r+="l ";for(let t=1,i=f.count;t<=i;t++)r+=u+t+" ";r+=`
`}if(l==="LineSegments")for(let t=1,i=t+1,a=f.count;t<a;t+=2,i=t+1)r+="l "+(u+t)+" "+(u+i)+`
`;u+=m}function L(e){let m=0;const x=e.geometry,l=x.getAttribute("position"),f=x.getAttribute("color");if(r+="o "+e.name+`
`,l!==void 0){for(let t=0,i=l.count;t<i;t++,m++)o.fromBufferAttribute(l,t),o.applyMatrix4(e.matrixWorld),r+="v "+o.x+" "+o.y+" "+o.z,f!==void 0&&(g.fromBufferAttribute(f,t).convertLinearToSRGB(),r+=" "+g.r+" "+g.g+" "+g.b),r+=`
`;r+="p ";for(let t=1,i=l.count;t<=i;t++)r+=u+t+" ";r+=`
`}u+=m}return j.traverse(function(e){e.isMesh===!0&&w(e),e.isLine===!0&&z(e),e.isPoints===!0&&L(e)}),r}}export{k as OBJExporter};
