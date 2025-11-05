"use strict";(()=>{var e={};e.id=963,e.ids=[963],e.modules={2934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},240:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>v,patchFetch:()=>x,requestAsyncStorage:()=>p,routeModule:()=>u,serverHooks:()=>m,staticGenerationAsyncStorage:()=>l});var a={};r.r(a),r.d(a,{GET:()=>d});var s=r(9303),i=r(8716),o=r(670),n=r(7070),c=r(9692);async function d(e){try{let{searchParams:t}=new URL(e.url),r=t.get("eventId"),a=(0,c.e)(),s=a.from("events").select(`
        id,
        name,
        is_active,
        voting_start_time,
        voting_end_time,
        categories (
          id,
          name,
          emoji,
          max_votes_per_voter,
          display_order,
          candidates (
            id,
            name,
            photo_url,
            description,
            display_order
          )
        )
      `).order("created_at",{ascending:!1});r&&(s=s.eq("id",r));let{data:i,error:o}=await s;if(o)throw o;let{data:d,error:u}=await a.from("votes").select("candidate_id");if(u)throw u;let p=d?.reduce((e,t)=>(e[t.candidate_id]=(e[t.candidate_id]||0)+1,e),{})||{},l=i?.map(e=>({...e,categories:e.categories?.map(e=>({...e,candidates:e.candidates?.map(e=>({...e,voteCount:p[e.id]||0})).sort((e,t)=>t.voteCount-e.voteCount)}))})),{data:m}=await a.from("voters").select("id",{count:"exact",head:!0});return n.NextResponse.json({events:l||[],totalVoters:m||0,totalVotes:d?.length||0})}catch(e){return console.error("Error fetching results:",e),n.NextResponse.json({error:"Failed to fetch results"},{status:500})}}let u=new s.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/admin/results/route",pathname:"/api/admin/results",filename:"route",bundlePath:"app/api/admin/results/route"},resolvedPagePath:"/Users/tuanpham/MyLife/CRM-Pacificwide/event-voting/app/api/admin/results/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:p,staticGenerationAsyncStorage:l,serverHooks:m}=u,v="/api/admin/results/route";function x(){return(0,o.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:l})}},9692:(e,t,r)=>{r.d(t,{e:()=>i});var a=r(5117),s=r(1615);function i(){let e=(0,s.cookies)();return(0,a.lx)("https://xicdommyxzsschupzvsx.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY2RvbW15eHpzc2NodXB6dnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMTc3NzcsImV4cCI6MjA3Nzg5Mzc3N30.MAmu4KlsDw-GuE_PT6ApiBq58eH3r8xnbcuQjQ4PzME",{cookies:{get:t=>e.get(t)?.value,set(t,r,a){try{e.set({name:t,value:r,...a})}catch(e){}},remove(t,r){try{e.set({name:t,value:"",...r})}catch(e){}}}})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[276,615,972,117],()=>r(240));module.exports=a})();