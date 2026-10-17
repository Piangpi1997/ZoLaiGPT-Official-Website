// ZoLaiGPT V5.5 preview-only OpenRouter Worker. Never paste API keys into this file.
// Required secret: OPENROUTER_API_KEY. Optional: ALLOWED_ORIGIN, RATE_LIMITER binding.
const json=(data,status=200,origin='')=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...(origin?{'Access-Control-Allow-Origin':origin,'Vary':'Origin'}:{})}});
export default {async fetch(request,env){
 const origin=request.headers.get('Origin')||'';
 const allowed=env.ALLOWED_ORIGIN||'https://v55-chatbot-preview.zolaigpt-official-website.pages.dev';
 // Exact allowlist, never *.pages.dev and never production domain.
 if(origin!==allowed)return json({error:'Origin not allowed'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600','Vary':'Origin'}});
 if(request.method!=='POST')return json({error:'Method not allowed'},405,origin);
 if(!env.OPENROUTER_API_KEY)return json({error:'AI service is not configured yet'},503,origin);
 // Fail closed until an actual Cloudflare Rate Limiting binding is configured.
 if(!env.RATE_LIMITER)return json({error:'Rate limiting must be configured before enabling AI'},503,origin);
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';
 const limit=await env.RATE_LIMITER.limit({key:ip});
 if(!limit.success)return json({error:'Too many requests. Please try later.'},429,origin);
 if(Number(request.headers.get('Content-Length')||0)>12000)return json({error:'Message too large'},413,origin);
 let payload;try{payload=await request.json()}catch{return json({error:'Invalid JSON'},400,origin)}
 const message=payload?.message,lang=['en','my','zom'].includes(payload?.language)?payload.language:'en';
 if(typeof message!=='string'||!message.trim()||message.length>1000)return json({error:'Message must be 1-1000 characters'},400,origin);
 const history=Array.isArray(payload.history)?payload.history.slice(-8):[];
 const turns=history.filter(m=>m&&['user','assistant'].includes(m.role)&&typeof m.content==='string'&&m.content.length<=1000).map(m=>({role:m.role,content:m.content}));
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
 try{
  const upstream=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',signal:controller.signal,headers:{'Authorization':'Bearer '+env.OPENROUTER_API_KEY,'Content-Type':'application/json','HTTP-Referer':allowed,'X-Title':'ZoLaiGPT V5.5 Preview'},body:JSON.stringify({model:'openrouter/free',max_tokens:400,temperature:0.5,messages:[{role:'system',content:'You are the ZoLaiGPT website PREVIEW assistant. Reply concisely in '+({en:'English',my:'Myanmar language',zom:'Zomi (Tedim), if possible; otherwise explain honestly'}[lang])+'. Do not invent official app releases, downloads, pricing or product capabilities. Clearly say you are a preview assistant when asked.'},...turns,{role:'user',content:message.trim()}]})});
  if(!upstream.ok)return json({error:upstream.status===429?'Free AI quota or rate limit reached':'AI service unavailable right now'},upstream.status===429?429:502,origin);
  const data=await upstream.json();const reply=data?.choices?.[0]?.message?.content;
  if(typeof reply!=='string'||!reply.trim())return json({error:'AI returned no text'},502,origin);
  return json({reply:reply.slice(0,4000),model:data.model||'openrouter/free'},200,origin);
 }catch{return json({error:'AI request timed out or failed'},502,origin)}
 finally{clearTimeout(timer)}
}};
