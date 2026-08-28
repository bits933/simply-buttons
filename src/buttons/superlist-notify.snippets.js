const CSS = `
@font-face{font-family:SuperlistAeonik;src:url("./aeonik-regular.woff2") format("woff2");font-style:normal;font-weight:400;font-display:swap}
.superlist-stage{position:relative;display:block;width:188px;height:61px}
.superlist-notify{appearance:none;position:absolute;top:0;right:0;display:block;width:188px;height:61px;padding:0;overflow:hidden;border:0;border-radius:999px;background:linear-gradient(270deg,#222322 3.48%,#131311);box-shadow:inset -2px -1px 3px 1px rgb(255 255 255/.07);color:#fff;cursor:pointer;touch-action:manipulation;user-select:none;transition:width 1s cubic-bezier(.87,0,.13,1),opacity 180ms ease}
.superlist-notify.is-open{width:61px}
.superlist-label{position:absolute;inset:0 60px 0 0;display:flex;align-items:center;justify-content:center;font:400 15px/1 SuperlistAeonik,"Helvetica Neue",Arial,sans-serif;letter-spacing:-.015em;white-space:nowrap;opacity:1;transform:translateX(0);transition:transform 500ms cubic-bezier(.87,0,.13,1) 100ms,opacity 400ms ease 150ms}
.superlist-notify.is-open .superlist-label{opacity:0;transform:translateX(28px);transition:transform 400ms cubic-bezier(.87,0,.13,1),opacity 400ms cubic-bezier(.4,0,.2,1);pointer-events:none}
.superlist-notify.is-open .superlist-character>span{transform:none;transition:none}
.superlist-character{display:inline-block;height:1em;overflow:hidden}.superlist-character>span{position:relative;display:block;transition:transform 540ms cubic-bezier(.22,1,.36,1);transition-delay:calc(var(--i)*18ms)}.superlist-character>span:after{position:absolute;top:100%;left:0;content:attr(data-character)}
.superlist-notify:not(.is-open):hover .superlist-character>span,.superlist-notify:not(.is-open):focus-visible .superlist-character>span{transform:translateY(-100%)}
.superlist-canvas{position:absolute;top:.5px;right:.5px;display:block;width:60px;height:60px;pointer-events:none}.superlist-canvas canvas{display:block;width:60px!important;height:60px!important}
.superlist-notify:focus{outline:none}.superlist-notify:focus-visible{outline:2px solid #fff;outline-offset:4px}.superlist-notify:disabled{cursor:not-allowed;opacity:.42}
@media(prefers-reduced-motion:reduce){.superlist-notify,.superlist-label,.superlist-character>span{transition:none}}
`.trim();

const MARKUP = `<span class="superlist-stage"><button type="button" class="superlist-notify" aria-label="Get notified" aria-pressed="false"><span class="superlist-label" aria-hidden="true"></span><span class="superlist-canvas" aria-hidden="true"><canvas width="60" height="60"></canvas></span></button></span>`;

const BROWSER_JS = `
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const PRESS_MS=100,REBOUND_MS=1000,FLIP_MS=1000;
const ease=t=>t===0||t===1?t:t<.5?2**(20*t-10)/2:(2-2**(-20*t+10))/2;
const elastic=t=>t===0||t===1?t:2**(-10*t)*Math.sin((t-.05)*10*Math.PI)+1;
const frame=(ms,from,to)=>{const done=ms>=PRESS_MS+REBOUND_MS;let z=0;if(ms>0&&ms<=PRESS_MS){const t=ms/PRESS_MS;z=-.5*(1-(1-t)**2)}else if(ms>PRESS_MS&&!done){z=-.5*(1-elastic((ms-PRESS_MS)/REBOUND_MS))}const t=Math.min(1,Math.max(0,ms/FLIP_MS));return{z:done?0:z,rotation:t===1?to:from+(to-from)*ease(t),done}};

const element=document.querySelector(".superlist-notify");
const label=element.querySelector(".superlist-label");
for(const [index,value] of [..."Get notified"].entries()){const character=value===" "?"\u00a0":value;const clip=document.createElement("span");const track=document.createElement("span");clip.className="superlist-character";clip.style.setProperty("--i",index);track.textContent=character;track.dataset.character=character;clip.append(track);label.append(clip)}

const canvas=element.querySelector("canvas");
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"high-performance",stencil:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(60,60,false);renderer.setClearColor(0,0);
const camera=new THREE.PerspectiveCamera(35,1,5,20);camera.position.z=10;
const scene=new THREE.Scene();
const loader=new GLTFLoader(),textures=new THREE.TextureLoader();
const [gltf,orange,black]=await Promise.all([loader.loadAsync("./button.glb"),textures.loadAsync("./matcap-orange.png"),textures.loadAsync("./matcap-black.png")]);
orange.colorSpace=black.colorSpace=THREE.SRGBColorSpace;
const model=gltf.scene,button=model.getObjectByName("button-remesh"),border=model.getObjectByName("border");
button.material=new THREE.MeshMatcapMaterial({matcap:orange});border.material=new THREE.MeshMatcapMaterial({matcap:black});model.scale.setScalar(3.35);scene.add(model);renderer.render(scene,camera);

const audio=new Audio("./click.mp3");let open=false,animation=0;
function run(){cancelAnimationFrame(animation);const from=button.rotation.y,to=open?Math.PI:0;if(matchMedia("(prefers-reduced-motion: reduce)").matches){button.position.z=0;button.rotation.y=to;renderer.render(scene,camera);return}const start=performance.now();const tick=now=>{const next=frame(now-start,from,to);button.position.z=next.z;button.rotation.y=next.rotation;renderer.render(scene,camera);if(!next.done)animation=requestAnimationFrame(tick)};animation=requestAnimationFrame(tick)}
element.addEventListener("click",()=>{if(element.disabled)return;open=!open;element.classList.toggle("is-open",open);element.setAttribute("aria-pressed",String(open));audio.pause();audio.currentTime=0;audio.play().catch(()=>{});run()});
`.trim();

const HTML_PAGE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Get notified</title>
  <style>body{min-height:100vh;display:grid;place-items:center;margin:0;background:#f1f1f1}${CSS}</style>
  <script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.185.0/examples/jsm/"}}</script>
</head>
<body>
  <!-- Keep button.glb, both matcap PNGs, click.mp3, and aeonik-regular.woff2 beside this file. -->
  ${MARKUP}
  <script type="module">${BROWSER_JS}</script>
</body>
</html>`;

const REACT = `import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import modelUrl from "./button.glb?url";
import orangeUrl from "./matcap-orange.png?url";
import blackUrl from "./matcap-black.png?url";
import clickUrl from "./click.mp3?url";
import fontUrl from "./aeonik-regular.woff2?url";

const CSS=${JSON.stringify(CSS)};
const PRESS_MS=100,REBOUND_MS=1000,FLIP_MS=1000;
const ease=t=>t===0||t===1?t:t<.5?2**(20*t-10)/2:(2-2**(-20*t+10))/2;
const elastic=t=>t===0||t===1?t:2**(-10*t)*Math.sin((t-.05)*10*Math.PI)+1;
function getFrame(ms,from,to){const done=ms>=PRESS_MS+REBOUND_MS;let z=0;if(ms>0&&ms<=PRESS_MS){const t=ms/PRESS_MS;z=-.5*(1-(1-t)**2)}else if(ms>PRESS_MS&&!done){z=-.5*(1-elastic((ms-PRESS_MS)/REBOUND_MS))}const t=Math.min(1,Math.max(0,ms/FLIP_MS));return{z:done?0:z,rotation:t===1?to:from+(to-from)*ease(t),done}}

function Model({api,openRef}){
  const {scene:source}=useGLTF(modelUrl);const [orange,black]=useTexture([orangeUrl,blackUrl]);const invalidate=useThree(s=>s.invalidate);const raf=useRef(0);const scene=useMemo(()=>source.clone(true),[source]);const button=useMemo(()=>scene.getObjectByName("button-remesh"),[scene]);const border=useMemo(()=>scene.getObjectByName("border"),[scene]);
  useEffect(()=>{orange.colorSpace=black.colorSpace=THREE.SRGBColorSpace;button.material=new THREE.MeshMatcapMaterial({matcap:orange});border.material=new THREE.MeshMatcapMaterial({matcap:black});button.rotation.y=openRef.current?Math.PI:0;invalidate()},[black,border,button,invalidate,openRef,orange]);
  const animate=useCallback(open=>{cancelAnimationFrame(raf.current);const to=open?Math.PI:0;if(matchMedia("(prefers-reduced-motion: reduce)").matches){button.position.z=0;button.rotation.y=to;invalidate();return}const from=button.rotation.y,start=performance.now();const tick=now=>{const next=getFrame(now-start,from,to);button.position.z=next.z;button.rotation.y=next.rotation;invalidate();if(!next.done)raf.current=requestAnimationFrame(tick)};raf.current=requestAnimationFrame(tick)},[button,invalidate]);
  useEffect(()=>{api.current={animate};return()=>cancelAnimationFrame(raf.current)},[animate,api]);return <primitive object={scene} scale={3.35}/>;
}

export default function SuperlistNotifyButton(){
  const [open,setOpen]=useState(false),openRef=useRef(false),api=useRef(null),audio=useRef(null);const label="Get notified";
  function click(){openRef.current=!openRef.current;setOpen(openRef.current);const player=audio.current??new Audio(clickUrl);audio.current=player;player.pause();player.currentTime=0;player.play().catch(()=>{});api.current?.animate(openRef.current)}
  return <><style>{CSS.replace("./aeonik-regular.woff2",fontUrl)}</style><span className="superlist-stage"><button type="button" className={"superlist-notify"+(open?" is-open":"")} aria-label={label} aria-pressed={open} onClick={click}><span className="superlist-label" aria-hidden="true">{[...label].map((character,index)=>{const value=character===" "?"\u00a0":character;return <span className="superlist-character" style={{"--i":index}} key={index}><span data-character={value}>{value}</span></span>})}</span><span className="superlist-canvas" aria-hidden="true"><Canvas frameloop="demand" dpr={[1,2]} camera={{fov:35,near:5,far:20,position:[0,0,10]}} gl={{alpha:true,antialias:true,powerPreference:"high-performance",stencil:false}}><Suspense fallback={null}><Model api={api} openRef={openRef}/></Suspense></Canvas></span></button></span></>;
}`;

export const SUPERLIST_NOTIFY_SNIPPETS = {
  html: HTML_PAGE,
  react: REACT,
  node: `import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";

const page=${JSON.stringify(HTML_PAGE)};
const assets=new Set(["button.glb","matcap-orange.png","matcap-black.png","click.mp3","aeonik-regular.woff2"]);
const types={".glb":"model/gltf-binary",".png":"image/png",".mp3":"audio/mpeg",".woff2":"font/woff2"};
createServer((request,response)=>{if(request.url==="/")return response.writeHead(200,{"content-type":"text/html; charset=utf-8"}).end(page);const name=decodeURIComponent(request.url.slice(1));if(!assets.has(name))return response.writeHead(404).end("Not found");response.writeHead(200,{"content-type":types[extname(name)]});createReadStream(join(process.cwd(),name)).on("error",()=>response.destroy()).pipe(response)}).listen(3000,()=>console.log("http://localhost:3000"));`,
};

export const SUPERLIST_NOTIFY_META = {
  id: "superlist-notify",
  name: "Sidebar",
  blurb: "Source-backed Superlist pill with the original 3D model, matcaps, click audio, elastic press, and flip-to-open toggle.",
  states: "idle, hover, pressed, open, focus, disabled, reduced motion",
  keywords: [
    "get notified",
    "superlist",
    "3d button",
    "webgl button",
    "three js",
    "matcap",
    "elastic press",
    "flip toggle",
    "notification cta",
    "pill button",
    "red control",
    "click sound",
    "interactive button",
    "canvas button",
    "source recreation",
    "animated cta",
    "animated button",
  ],
};
