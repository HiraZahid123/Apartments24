import{r as c,u as g,j as r}from"./app-DkoMt7NI.js";import{T as n,I as i}from"./TextInput-CgoU17jL.js";import{I as d}from"./InputLabel-CDERt_cj.js";import{P as h}from"./PrimaryButton-CpVdUsJ9.js";import{K as j}from"./transition-DKG03tRO.js";function P({className:m=""}){const p=c.useRef(),u=c.useRef(),{data:o,setData:a,errors:e,put:x,reset:t,processing:f,recentlySuccessful:b}=g({current_password:"",password:"",password_confirmation:""}),w=s=>{s.preventDefault(),x(route("password.update"),{preserveScroll:!0,onSuccess:()=>t(),onError:l=>{l.password&&(t("password","password_confirmation"),p.current.focus()),l.current_password&&(t("current_password"),u.current.focus())}})};return r.jsxs("section",{className:`${m}`,children:[r.jsxs("header",{children:[r.jsx("h2",{className:"text-2xl font-bold text-slate-800 mb-2",children:"Update Password"}),r.jsx("p",{className:"text-slate-600 text-base",children:"Ensure your account is using a long, random password to stay secure."})]}),r.jsxs("form",{onSubmit:w,className:"space-y-6",children:[r.jsxs("div",{children:[r.jsx(d,{htmlFor:"current_password",value:"Current Password"}),r.jsx(n,{id:"current_password",ref:u,value:o.current_password,onChange:s=>a("current_password",s.target.value),type:"password",className:`mt-1 w-full p-4 rounded-xl border-2 form-input focus:outline-none focus:ring-2 focus:ring-blue-500 ${e.current_password?"border-red-500":"border-slate-300"}`,autoComplete:"current-password"}),r.jsx(i,{message:e.current_password,className:"mt-2 text-red-600 text-sm flex items-center gap-1"})]}),r.jsxs("div",{children:[r.jsx(d,{htmlFor:"password",value:"New Password"}),r.jsx(n,{id:"password",ref:p,value:o.password,onChange:s=>a("password",s.target.value),type:"password",className:`mt-1 w-full p-4 rounded-xl border-2 form-input focus:outline-none focus:ring-2 focus:ring-blue-500 ${e.password?"border-red-500":"border-slate-300"}`,autoComplete:"new-password"}),r.jsx(i,{message:e.password,className:"mt-2 text-red-600 text-sm flex items-center gap-1"})]}),r.jsxs("div",{children:[r.jsx(d,{htmlFor:"password_confirmation",value:"Confirm Password"}),r.jsx(n,{id:"password_confirmation",value:o.password_confirmation,onChange:s=>a("password_confirmation",s.target.value),type:"password",className:`mt-1 w-full p-4 rounded-xl border-2 form-input focus:outline-none focus:ring-2 focus:ring-blue-500 ${e.password_confirmation?"border-red-500":"border-slate-300"}`,autoComplete:"new-password"}),r.jsx(i,{message:e.password_confirmation,className:"mt-2 text-red-600 text-sm flex items-center gap-1"})]}),r.jsxs("div",{className:"flex items-center gap-4",children:[r.jsx(h,{type:"submit",disabled:f,className:"shimmer-button text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",children:"Save"}),r.jsx(j,{show:b,enter:"transition ease-in-out",enterFrom:"opacity-0",leave:"transition ease-in-out",leaveTo:"opacity-0",children:r.jsx("p",{className:"text-sm text-slate-600",children:"Saved."})})]})]}),r.jsx("style",{jsx:!0,children:`
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
            `})]})}export{P as default};
