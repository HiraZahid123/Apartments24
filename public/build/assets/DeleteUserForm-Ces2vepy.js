import{j as e,r as c,u as h}from"./app-CCJW7-yc.js";import{T as y,I as w}from"./TextInput-B9p3Q2-X.js";import{I as j}from"./InputLabel-MLN5XYfy.js";import{M as k}from"./Modal-DMP-mRx2.js";import"./transition-c3iKWNoW.js";function u({className:o="",disabled:t,children:r,...s}){return e.jsx("button",{...s,className:`inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700 ${t&&"opacity-25"} `+o,disabled:t,children:r})}function v({type:o="button",className:t="",disabled:r,children:s,...n}){return e.jsx("button",{...n,type:o,className:`inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 ${r&&"opacity-25"} `+t,disabled:r,children:s})}function F({className:o=""}){const[t,r]=c.useState(!1),s=c.useRef(),{data:n,setData:p,delete:m,processing:x,reset:l,errors:d,clearErrors:f}=h({password:""}),b=()=>{r(!0)},g=i=>{i.preventDefault(),m(route("profile.destroy"),{preserveScroll:!0,onSuccess:()=>a(),onError:()=>s.current.focus(),onFinish:()=>l()})},a=()=>{r(!1),f(),l()};return e.jsxs("section",{className:`space-y-6 ${o}`,children:[e.jsxs("header",{children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-800 mb-2",children:"Delete Account"}),e.jsx("p",{className:"text-slate-600 text-base",children:"Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain."})]}),e.jsx(u,{onClick:b,className:"shimmer-button text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105",children:"Delete Account"}),e.jsx(k,{show:t,onClose:a,children:e.jsxs("form",{className:"card-blur rounded-2xl p-8 space-y-6",onSubmit:g,children:[e.jsx("h2",{className:"text-xl font-semibold text-slate-800",children:"Are you sure you want to delete your account?"}),e.jsx("p",{className:"text-slate-600 text-sm",children:"Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account."}),e.jsxs("div",{children:[e.jsx(j,{htmlFor:"password",value:"Password",className:"sr-only"}),e.jsx(y,{id:"password",type:"password",name:"password",ref:s,value:n.password,onChange:i=>p("password",i.target.value),className:`w-full p-4 rounded-xl border-2 form-input focus:outline-none focus:ring-2 focus:ring-blue-500 ${d.password?"border-red-500":"border-slate-300"}`,placeholder:"Password",isFocused:!0}),e.jsx(w,{message:d.password,className:"mt-2 text-red-600 text-sm flex items-center gap-1"})]}),e.jsxs("div",{className:"flex justify-end gap-3 mt-4",children:[e.jsx(v,{className:"px-4 py-2 rounded-xl shadow-sm hover:scale-105 transition-transform",onClick:a,children:"Cancel"}),e.jsx(u,{type:"submit",disabled:x,className:"shimmer-button text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",children:"Delete Account"})]})]})}),e.jsx("style",{jsx:!0,children:`
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes shimmer {
                    0% { background-position: -200px 0; }
                    100% { background-position: calc(200px + 100%) 0; }
                }
                .shimmer-button {
                    background: linear-gradient(135deg, #2563EB, #3B82F6, #1D4ED8);
                    background-size: 200% 200%;
                    animation: gradientShift 3s ease infinite;
                    position: relative;
                    overflow: hidden;
                }
                .shimmer-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    animation: shimmer 2s infinite;
                }
                .card-blur {
                    backdrop-filter: blur(10px);
                    background: rgba(255, 255, 255, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: all 0.3s ease;
                }
                .card-blur:hover {
                    background: rgba(255, 255, 255, 1);
                    transform: translateY(-2px);
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
                }
                .form-input {
                    transition: all 0.3s ease;
                    backdrop-filter: blur(5px);
                    background: rgba(255, 255, 255, 0.9);
                }
                .form-input:focus {
                    transform: translateY(-1px);
                    box-shadow: 0 10px 25px -3px rgb(37 99 235 / 0.1);
                    background: rgba(255, 255, 255, 1);
                }
            `})]})}export{F as default};
