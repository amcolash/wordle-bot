var v=Object.defineProperty,w=Object.defineProperties;var x=Object.getOwnPropertyDescriptors;var g=Object.getOwnPropertySymbols;var S=Object.prototype.hasOwnProperty,N=Object.prototype.propertyIsEnumerable;var y=(t,e,n)=>e in t?v(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,m=(t,e)=>{for(var n in e||(e={}))S.call(e,n)&&y(t,n,e[n]);if(g)for(var n of g(e))N.call(e,n)&&y(t,n,e[n]);return t},u=(t,e)=>w(t,x(e));import{i as C,R as s,F as k,a as D,r as c,g as I,u as A,b as F,c as z,d as L,e as O}from"./vendor.ca4b54b3.js";const P=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))l(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&l(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerpolicy&&(o.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?o.credentials="include":r.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}};P();const R={apiKey:"AIzaSyAqe-vixCcenxgSmXcGrszkeooWFxc6XDs",authDomain:"wordle-bot-4b4e3.firebaseapp.com",databaseURL:"https://wordle-bot-4b4e3-default-rtdb.firebaseio.com",projectId:"wordle-bot-4b4e3",storageBucket:"wordle-bot-4b4e3.appspot.com",messagingSenderId:"197146352982",appId:"1:197146352982:web:cd4eab3da3f1d88a510af7"},B=C(R);function M(t){const{item:e,selected:n,setSelected:l}=t,r=["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sept","Oct","Nov","Dec"],o=new Date(e.timestamp);return s.createElement("div",{style:{margin:"0.5rem 0.75rem",padding:"0.5rem",border:"2px solid transparent",borderColor:n?"var(--blue)":"transparent",borderRadius:"0.3rem",cursor:"pointer",whiteSpace:"nowrap",display:"flex"},onClick:()=>l(e)},e.correct?s.createElement(k,{color:"var(--green)"}):s.createElement(D,{color:"var(--orange)"}),s.createElement("div",{style:{display:"flex",flexDirection:"column",margin:"0 0.5rem"}},s.createElement("span",null,"#",e.wordleNumber," (",e.guesses,"/6)"),s.createElement("span",null,r[o.getMonth()],", ",o.getDate())))}function j(t){const{items:e,selected:n,setSelected:l}=t;return s.createElement("div",{style:{overflow:"auto",flexShrink:0}},e.map(r=>s.createElement(M,{key:r.runNumber,item:r,selected:r.timestamp===n.timestamp,setSelected:l})))}function q(t){const{selected:e,hidden:n}=t,[l,r]=c.exports.useState();c.exports.useEffect(()=>{r(n?void 0:0)},[e,n]);let o=[...e.progress];for(;o.length<6;)o.push({guess:"     ",results:"     "});return s.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",width:"100%"},onClick:()=>r()},s.createElement("h1",{style:{textAlign:"center"}},"Wordle ",e.wordleNumber,!t.hidden&&s.createElement("span",{style:{textTransform:"capitalize"}},": ",e.answer)),o.map((i,a)=>{const h=i.guess.split(""),E=[...i.results];return s.createElement("div",{style:{display:"flex",outline:a===l&&!n&&"3px solid var(--blue)",outlineOffset:"-3px"},onClick:d=>{i.guess!=="     "&&!n&&(d.stopPropagation(),r(a))}},h.map((d,p)=>J({j:p,letter:d,result:E[p],hidden:n})))}),!n&&l!==void 0&&e.possibilities[l]&&s.createElement(W,{possibilities:e.possibilities[l]}))}const f="8.5vw";function J(t){let e;return t.result==="\u2B1B"&&(e="var(--color-tone-4)"),(t.result==="\u{1F7E8}"||t.result==="\uD83D")&&(e="var(--yellow)"),t.result==="\u{1F7E9}"&&(e="var(--green)"),s.createElement("div",{key:t.i,style:{fontSize:"1.25rem",fontWeight:"bold",textTransform:"capitalize",width:`min(${f}, 4rem)`,height:`min(${f}, 4rem)`,outline:t.result===" "&&"3px solid var(--color-tone-4)",outlineOffset:"-3px",display:"flex",justifyContent:"center",alignItems:"center",margin:`calc(min(${f}, 4rem) / 10)`,background:e,color:"var(--color-tone-1)"}},t.hidden?"":t.letter)}function W(t){const{possibilities:e}=t;let n=999,l=-999;const r=e.map(o=>{const i=o.split(":")[0],a=Number.parseFloat(o.split(":")[1]);return a<n&&(n=a),a>l&&(l=a),{word:i,score:a}});return s.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center"}},s.createElement("h3",{style:{textAlign:"center"}},"Possibilities:"),r.map(o=>s.createElement("div",{key:o.word,style:{display:"flex",justifyContent:"space-between",width:"100%",margin:"0.35rem"}},s.createElement("div",{style:{marginRight:"0.75rem"}},s.createElement("strong",null,o.word)),s.createElement("progress",{min:n,max:l,value:n===l?999:o.score,style:{width:"6rem"}}))))}function X(t){return s.createElement("button",u(m({},t),{style:u(m({},t.style),{display:"flex",alignContent:"center",alignItems:"center",padding:"0.5rem",fontSize:"1.5rem",background:"none",border:"2px solid var(--color-tone-4)",color:"var(--color-tone-1)"})}))}const $=I(B),K=()=>{const[t,e,n]=A(F($,"attempts")),[l,r]=c.exports.useState(),[o,i]=c.exports.useState(!0);return c.exports.useEffect(()=>{const a=b(t);l||r(a[0])},[t]),s.createElement("div",{style:{height:"100vh",width:"100vw",overflow:"hidden",display:"flex",justifyContent:"center",alignItems:"center",alignContent:"center"}},n&&s.createElement("strong",{style:{fontSize:"1.5rem"}},"Error: ",n),e&&s.createElement("span",{style:{fontSize:"1.5rem"}},"Loading Data..."),!e&&t&&s.createElement("div",{style:{display:"flex",height:"100%",width:"100%"}},s.createElement(j,{items:b(t),selected:l||{},setSelected:r}),l&&s.createElement(q,{selected:l,hidden:o})),s.createElement(X,{onClick:()=>i(!o),style:{position:"fixed",bottom:"0.5rem",right:"0.5rem"}},o?s.createElement(z,null):s.createElement(L,null)))};function b(t){const e=new Set;return t.map(l=>l.val()).sort((l,r)=>r.wordleNumber!==l.wordleNumber?r.wordleNumber-l.wordleNumber:r.runNumber-l.runNumber).filter(l=>e.has(l.wordleNumber)?!1:(e.add(l.wordleNumber),!0))}var T=()=>s.createElement(K,null);O.render(s.createElement(T,null),document.getElementById("root"));
