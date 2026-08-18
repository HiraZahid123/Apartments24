import{c as b,u as h,j as e,L as g}from"./app-CfgFxHFD.js";import{T as n,I as o}from"./TextInput-lTOceK0v.js";import{I as l}from"./InputLabel-Bt8lHSLb.js";import{P as v}from"./PrimaryButton-BGLH_sFM.js";import{K as j}from"./transition-D9K0Y0N5.js";function F({mustVerifyEmail:m,status:d,className:u=""}){const r=b().props.auth.user,{data:s,setData:i,patch:c,errors:a,processing:x,recentlySuccessful:p}=h({name:r.name,email:r.email}),f=t=>{t.preventDefault(),c(route("profile.update"))};return e.jsxs("section",{className:`${u}`,children:[e.jsxs("header",{children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-800 mb-2",children:"Profile Information"}),e.jsx("p",{className:"text-slate-600 text-base",children:"Update your account's profile information and email address."})]}),e.jsxs("form",{onSubmit:f,className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx(l,{htmlFor:"name",value:"Name"}),e.jsx(n,{id:"name",className:`mt-1 w-full p-4 rounded-xl border-2 form-input focus:outline-none focus:ring-2 focus:ring-blue-500 ${a.name?"border-red-500":"border-slate-300"}`,value:s.name,onChange:t=>i("name",t.target.value),required:!0,isFocused:!0,autoComplete:"name"}),e.jsx(o,{className:"mt-2 text-red-600 text-sm flex items-center gap-1",message:a.name})]}),e.jsxs("div",{children:[e.jsx(l,{htmlFor:"email",value:"Email"}),e.jsx(n,{id:"email",type:"email",className:`mt-1 w-full p-4 rounded-xl border-2 form-input focus:outline-none focus:ring-2 focus:ring-blue-500 ${a.email?"border-red-500":"border-slate-300"}`,value:s.email,onChange:t=>i("email",t.target.value),required:!0,autoComplete:"username"}),e.jsx(o,{className:"mt-2 text-red-600 text-sm flex items-center gap-1",message:a.email})]}),m&&r.email_verified_at===null&&e.jsxs("div",{children:[e.jsxs("p",{className:"mt-2 text-sm text-slate-700",children:["Your email address is unverified.",e.jsx(g,{href:route("verification.send"),method:"post",as:"button",className:"ml-1 rounded-md text-sm text-blue-600 underline hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",children:"Click here to re-send the verification email."})]}),d==="verification-link-sent"&&e.jsx("div",{className:"mt-2 text-sm font-medium text-green-600",children:"A new verification link has been sent to your email address."})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(v,{type:"submit",disabled:x,className:"shimmer-button text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",children:"Save"}),e.jsx(j,{show:p,enter:"transition ease-in-out",enterFrom:"opacity-0",leave:"transition ease-in-out",leaveTo:"opacity-0",children:e.jsx("p",{className:"text-sm text-slate-600",children:"Saved."})})]})]}),e.jsx("style",{jsx:!0,children:`
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
