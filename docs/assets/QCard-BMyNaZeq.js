import{c as s,a as n,h as u,b as c,g as f}from"./index-D3Pq5OX6.js";import{u as g,a as q}from"./use-dark-DnCt0c9h.js";let t=[],r=[];function d(a){r=r.filter(e=>e!==a)}function F(a){d(a),r.push(a)}function p(a){d(a),r.length===0&&t.length!==0&&(t[t.length-1](),t=[])}function v(a){r.length===0?a():t.push(a)}function b(a){t=t.filter(e=>e!==a)}const C=s({name:"QCardSection",props:{tag:{type:String,default:"div"},horizontal:Boolean},setup(a,{slots:e}){const o=n(()=>`q-card__section q-card__section--${a.horizontal===!0?"horiz row no-wrap":"vert"}`);return()=>u(a.tag,{class:o.value},c(e.default))}}),k=s({name:"QCard",props:{...g,tag:{type:String,default:"div"},square:Boolean,flat:Boolean,bordered:Boolean},setup(a,{slots:e}){const{proxy:{$q:o}}=f(),l=q(a,o),i=n(()=>"q-card"+(l.value===!0?" q-card--dark q-dark":"")+(a.bordered===!0?" q-card--bordered":"")+(a.square===!0?" q-card--square no-border-radius":"")+(a.flat===!0?" q-card--flat no-shadow":""));return()=>u(a.tag,{class:i.value},c(e.default))}});export{C as Q,k as a,v as b,F as c,b as d,p as r};
