import{M as O,i as D,h as P,bA as H,an as U,p as W,b as X}from"./ddd@DwDq534T.js";class Y extends O{constructor(c){const f=new A(c),v=new D(f.image.width*.001,f.image.height*.001),T=new P({map:f,toneMapped:!1,transparent:!0});super(v,T);function d(w){T.map.dispatchDOMEvent(w)}this.addEventListener("mousedown",d),this.addEventListener("mousemove",d),this.addEventListener("mouseup",d),this.addEventListener("click",d),this.dispose=function(){v.dispose(),T.dispose(),T.map.dispose(),N.delete(c),this.removeEventListener("mousedown",d),this.removeEventListener("mousemove",d),this.removeEventListener("mouseup",d),this.removeEventListener("click",d)}}}class A extends H{constructor(c){super(B(c)),this.dom=c,this.anisotropy=16,this.colorSpace=U,this.minFilter=W,this.magFilter=W;const f=new MutationObserver(()=>{this.scheduleUpdate||(this.scheduleUpdate=setTimeout(()=>this.update(),16))}),v={attributes:!0,childList:!0,subtree:!0,characterData:!0};f.observe(c,v),this.observer=f}dispatchDOMEvent(c){c.data&&_(this.dom,c.type,c.data.x,c.data.y)}update(){this.image=B(this.dom),this.needsUpdate=!0,this.scheduleUpdate=null}dispose(){this.observer&&this.observer.disconnect(),this.scheduleUpdate=clearTimeout(this.scheduleUpdate),super.dispose()}}const N=new WeakMap;function B(u){const c=document.createRange(),f=new X;function v(e){const o=[];let i=!1;function n(){if(i&&(i=!1,e.restore()),o.length===0)return;let r=-1/0,s=-1/0,C=1/0,a=1/0;for(let b=0;b<o.length;b++){const m=o[b];r=Math.max(r,m.x),s=Math.max(s,m.y),C=Math.min(C,m.x+m.width),a=Math.min(a,m.y+m.height)}e.save(),e.beginPath(),e.rect(r,s,C-r,a-s),e.clip(),i=!0}return{add:function(r){o.push(r),n()},remove:function(){o.pop(),n()}}}function T(e,o,i,n){n!==""&&(e.textTransform==="uppercase"&&(n=n.toUpperCase()),t.font=e.fontWeight+" "+e.fontSize+" "+e.fontFamily,t.textBaseline="top",t.fillStyle=e.color,t.fillText(n,o,i+parseFloat(e.fontSize)*.1))}function d(e,o,i,n,r){i<2*r&&(r=i/2),n<2*r&&(r=n/2),t.beginPath(),t.moveTo(e+r,o),t.arcTo(e+i,o,e+i,o+n,r),t.arcTo(e+i,o+n,e,o+n,r),t.arcTo(e,o+n,e,o,r),t.arcTo(e,o,e+i,o,r),t.closePath()}function w(e,o,i,n,r,s){const C=e[o+"Width"],a=e[o+"Style"],b=e[o+"Color"];C!=="0px"&&a!=="none"&&b!=="transparent"&&b!=="rgba(0, 0, 0, 0)"&&(t.strokeStyle=b,t.lineWidth=parseFloat(C),t.beginPath(),t.moveTo(i,n),t.lineTo(i+r,n+s),t.stroke())}function g(e,o){if(e.nodeType===Node.COMMENT_NODE||e.nodeName==="SCRIPT"||e.style&&e.style.display==="none")return;let i=0,n=0,r=0,s=0;if(e.nodeType===Node.TEXT_NODE){c.selectNode(e);const a=c.getBoundingClientRect();i=a.left-p.left-.5,n=a.top-p.top-.5,r=a.width,s=a.height,T(o,i,n,e.nodeValue.trim())}else if(e instanceof HTMLCanvasElement){const a=e.getBoundingClientRect();i=a.left-p.left-.5,n=a.top-p.top-.5,t.save();const b=window.devicePixelRatio;t.scale(1/b,1/b),t.drawImage(e,i,n),t.restore()}else if(e instanceof HTMLImageElement){const a=e.getBoundingClientRect();i=a.left-p.left-.5,n=a.top-p.top-.5,r=a.width,s=a.height,t.drawImage(e,i,n,r,s)}else{const a=e.getBoundingClientRect();i=a.left-p.left-.5,n=a.top-p.top-.5,r=a.width,s=a.height,o=window.getComputedStyle(e),d(i,n,r,s,parseFloat(o.borderRadius));const b=o.backgroundColor;b!=="transparent"&&b!=="rgba(0, 0, 0, 0)"&&(t.fillStyle=b,t.fill());const m=["borderTop","borderLeft","borderBottom","borderRight"];let x=!0,M=null;for(const h of m){if(M!==null&&(x=o[h+"Width"]===o[M+"Width"]&&o[h+"Color"]===o[M+"Color"]&&o[h+"Style"]===o[M+"Style"]),x===!1)break;M=h}if(x===!0){const h=parseFloat(o.borderTopWidth);o.borderTopWidth!=="0px"&&o.borderTopStyle!=="none"&&o.borderTopColor!=="transparent"&&o.borderTopColor!=="rgba(0, 0, 0, 0)"&&(t.strokeStyle=o.borderTopColor,t.lineWidth=h,t.stroke())}else w(o,"borderTop",i,n,r,0),w(o,"borderLeft",i,n,0,s),w(o,"borderBottom",i,n+s,r,0),w(o,"borderRight",i+r,n,0,s);if(e instanceof HTMLInputElement){let h=o.accentColor;(h===void 0||h==="auto")&&(h=o.color),f.set(h);const S=Math.sqrt(.299*f.r**2+.587*f.g**2+.114*f.b**2)<.5?"white":"#111111";if(e.type==="radio"&&(d(i,n,r,s,s),t.fillStyle="white",t.strokeStyle=h,t.lineWidth=1,t.fill(),t.stroke(),e.checked&&(d(i+2,n+2,r-4,s-4,s),t.fillStyle=h,t.strokeStyle=S,t.lineWidth=2,t.fill(),t.stroke())),e.type==="checkbox"&&(d(i,n,r,s,2),t.fillStyle=e.checked?h:"white",t.strokeStyle=e.checked?S:h,t.lineWidth=1,t.stroke(),t.fill(),e.checked)){const k=t.textAlign;t.textAlign="center";const L={color:S,fontFamily:o.fontFamily,fontSize:s+"px",fontWeight:"bold"};T(L,i+r/2,n,"✔"),t.textAlign=k}if(e.type==="range"){const[k,L,I]=["min","max","value"].map(F=>parseFloat(e[F])),R=(I-k)/(L-k)*(r-s);d(i,n+s/4,r,s/2,s/4),t.fillStyle=S,t.strokeStyle=h,t.lineWidth=1,t.fill(),t.stroke(),d(i,n+s/4,R+s/2,s/2,s/4),t.fillStyle=h,t.fill(),d(i+R,n,s,s,s/2),t.fillStyle=h,t.fill()}(e.type==="color"||e.type==="text"||e.type==="number")&&(E.add({x:i,y:n,width:r,height:s}),T(o,i+parseInt(o.paddingLeft),n+parseInt(o.paddingTop),e.value),E.remove())}}const C=o.overflow==="auto"||o.overflow==="hidden";C&&E.add({x:i,y:n,width:r,height:s});for(let a=0;a<e.childNodes.length;a++)g(e.childNodes[a],o);C&&E.remove()}const p=u.getBoundingClientRect();let l=N.get(u);l===void 0&&(l=document.createElement("canvas"),l.width=p.width,l.height=p.height,N.set(u,l));const t=l.getContext("2d"),E=new v(t);return t.clearRect(0,0,l.width,l.height),g(u),l}function _(u,c,f,v){const T={clientX:f*u.offsetWidth+u.offsetLeft,clientY:v*u.offsetHeight+u.offsetTop,view:u.ownerDocument.defaultView};window.dispatchEvent(new MouseEvent(c,T));const d=u.getBoundingClientRect();f=f*d.width+d.left,v=v*d.height+d.top;function w(g){if(g.nodeType!==Node.TEXT_NODE&&g.nodeType!==Node.COMMENT_NODE){const p=g.getBoundingClientRect();if(f>p.left&&f<p.right&&v>p.top&&v<p.bottom&&(g.dispatchEvent(new MouseEvent(c,T)),g instanceof HTMLInputElement&&g.type==="range"&&(c==="mousedown"||c==="click"))){const[l,t]=["min","max"].map(i=>parseFloat(g[i])),E=p.width,o=(f-p.x)/E;g.value=l+(t-l)*o,g.dispatchEvent(new InputEvent("input",{bubbles:!0}))}for(let l=0;l<g.childNodes.length;l++)w(g.childNodes[l])}}w(u)}export{Y as HTMLMesh};
