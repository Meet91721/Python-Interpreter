(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[472],{5189:function(e,n,t){Promise.resolve().then(t.bind(t,9027))},6777:function(e,n,t){"use strict";t.d(n,{Nb:function(){return step},T0:function(){return skip},hY:function(){return play},mc:function(){return reset},wO:function(){return pause}});var l=t(5622);let r=null;function reset(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:()=>{},t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:()=>{};e.iter=0,e.line=1,e.column=1,e.tokens=[],e.table=[],n(l.Wq.map(()=>!1)),t(!1),pause()}function step(e,n,t,r){if(e.iter>=n.length){r(!0),"EOF"!==e.tokens[e.tokens.length-1].type&&(e.tokens.push({type:"NEWLINE",re:/./,lexeme:"\n",line:e.line,column:e.column}),e.tokens.push({type:"EOF",re:/./,lexeme:"$",line:e.line,column:e.column}));return}let i=[],u="",o=/./,c="",s=n.slice(e.iter);if(l.Wq.forEach(e=>{let{type:n,re:t}=e,l=t.exec(s);if(l){let e=l[0];e.length>c.length&&(u=n,o=t,c=e),i.push(!0)}else i.push(!1)}),c){let n={type:u,re:o,lexeme:c,line:e.line,column:e.column};("BOOLEAN"===u||"INT"===u||"FLOAT"===u||"STRING"===u||"IDENTIFIER"===u)&&(n.entry=e.table.length,e.table.push(n)),e.tokens.push(n);let t=n.lexeme.split("\n");e.iter+=n.lexeme.length,e.line+=t.length-1,t.length>1?e.column=t[t.length-1].length+1:e.column+=n.lexeme.length}else e.tokens.push({type:"UNKNOWN",re:/./,lexeme:n[e.iter],line:e.line,column:e.column}),e.iter+=1,e.column+=1;t(i),e.iter>=n.length&&(r(!0),"EOF"!==e.tokens[e.tokens.length-1].type&&(e.tokens.push({type:"NEWLINE",re:/./,lexeme:"\n",line:e.line,column:e.column}),e.tokens.push({type:"EOF",re:/./,lexeme:"$",line:e.line,column:e.column})))}function skip(e,n,t,l){do step(e,n,t,l);while(e.iter<n.length&&"\n"!==n[e.iter])}function play(e,n,t,l){r||(r=setInterval(()=>{step(e,n,t,l),e.iter>=n.length&&clearInterval(r)},100))}function pause(){r&&clearInterval(r),r=null}},9027:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return Page}});var l=t(7437),r=t(2265),i=t(3677),u=t(8863),o=t(16),c=t(7492),s=t(6777),a=t(2553),h=t(753),p=t.n(h);function Page(){let e=(0,r.useContext)(u.x),n=(0,r.useContext)(o.g),t=(0,r.useContext)(c.h),[h,f]=(0,r.useState)(e.code);function handleChange(l){e.code=l.replace(/\t/g,"    "),f(e.code),(0,s.mc)(n),(0,a.mc)(t)}return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(i.default,{reset:function(){handleChange('# Sample Python code\ndef factorial(n):\n    eq = n == 0\n    lt = n < 0\n    if eq == True or lt == True:\n        return 1\n    else:\n        return n * factorial(n-1)\n\nx = input("Enter a number: ")\nprint("factorial(" + x + ") = " + factorial(int(x)))\n\nprint("Printing the first 10 factorials ...")\nfor k in range(1000e-2):\n    print(factorial(k))\n\ninput(\'Press Enter to continue ...\')\n')}}),(0,l.jsx)("main",{className:p().main,children:(0,l.jsx)("textarea",{className:p().textarea,rows:18,cols:80,placeholder:"# Enter Python code here ...",value:h,onChange:e=>handleChange(e.target.value)})})]})}},8863:function(e,n,t){"use strict";t.d(n,{x:function(){return r}});var l=t(2265);let r=(0,l.createContext)({code:""})},753:function(e){e.exports={main:"src_main__5Hkc6",textarea:"src_textarea__2de_A"}}},function(e){e.O(0,[582,224,877,971,32,744],function(){return e(e.s=5189)}),_N_E=e.O()}]);