(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[213],{3062:function(e,t,s){Promise.resolve().then(s.bind(s,5081))},5081:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return Page}});var a=s(7437),n=s(2265),r=s(3677),c=s(3138);function ReactD3Tree(e){let{tree:t}=e;return(0,a.jsx)(c.Z,{data:t,orientation:"vertical"})}var o=s(16),u=s(7492),i=s(5622),l=s(2553),p=s(5504),d=s.n(p);function Page(){let e=(0,n.useContext)(o.g),t=(0,n.useContext)(u.h),[s,c]=(0,n.useState)(t.stack);function Push(e){t.stack.push(e),c(t.stack)}function Pop(){let e=t.stack.pop();return c(t.stack),e}let[p,h]=(0,n.useState)(t.tree);function updateTree(e){t.tree={...e},h(t.tree)}let[_,k]=(0,n.useState)(t.iter>=e.tokens.length);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(r.default,{disabled:_,reset:()=>(0,l.mc)(t,updateTree,k),step:()=>(0,l.Nb)(t,e,Push,Pop,updateTree,k),skip:()=>(0,l.T0)(t,e,Push,Pop,updateTree,k),play:()=>(0,l.hY)(t,e,Push,Pop,updateTree,k),pause:()=>(0,l.wO)()}),(0,a.jsxs)("main",{className:d().main,children:[(0,a.jsxs)("div",{className:d().stack,children:[s.map((e,t)=>{let s=(0,a.jsx)("span",{ref:e=>{e&&e.scrollIntoView({behavior:"smooth"})},children:e},t);return s}),0===s.length&&(0,a.jsx)("span",{children:"--==EMPTY STACK==--"})]}),(0,a.jsx)("div",{className:d().code,children:e.tokens.slice(t.iter).map((e,t)=>{let{type:s,lexeme:n,line:r,column:c}=e;return(0,a.jsx)("span",{style:{backgroundColor:(0,i.Pk)(s)},className:d().token,"data-label":"".concat(s,"@(").concat(r,", ").concat(c,")"),children:n},t)})}),(0,a.jsx)("div",{className:d().tree,children:p&&(0,a.jsx)(ReactD3Tree,{tree:p})})]})]})}},5504:function(e){e.exports={main:"parser_main__s2la7",code:"parser_code__7Zm_r",token:"parser_token__dN9IR",stack:"parser_stack__LAAWX",tree:"parser_tree__NgktI"}}},function(e){e.O(0,[582,224,138,877,971,32,744],function(){return e(e.s=3062)}),_N_E=e.O()}]);