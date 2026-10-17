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
 // Deterministic response for verified site facts: free models must not guess basic ZoLaiGPT details.
 const languageQuestion=/what languages|which languages|supported languages|languages does zolaigpt|ဘာသာစကား|pau bang|languages supported/i.test(message);
 if(languageQuestion){
  const reply=lang==='my'?'ZoLaiGPT Website သည် English၊ Myanmar (မြန်မာ) နှင့် Zomi (Tedim) ဘာသာစကား ၃ မျိုးကို အဓိကထားပါသည်။':lang==='zom'?'ZoLaiGPT website in English, Myanmar leh Zomi (Tedim) pau thum tawh kisai hi.':'ZoLaiGPT focuses on three languages: English, Myanmar (Burmese), and Zomi (Tedim). This is the website’s multilingual focus, not a guarantee of full AI language proficiency.';
  return json({reply,model:'verified-site-facts'},200,origin);
 }
 // Verified FAQ answers are stable and do not rely on the variable-quality free router.
 const aboutQuestion=/about zolaigpt|what is zolaigpt|tell me about zolaigpt|zolaigpt အကြောင်း|zolaigpt.*bang|zolaigpt.*thu/i.test(message);
 const appQuestion=/app availability|app information|download (the )?app|app (release|download|available)|app အကြောင်း/i.test(message);
 if(aboutQuestion||appQuestion){
  const facts=aboutQuestion
   ?{en:'ZoLaiGPT is a multilingual AI project focusing on English, Myanmar (Burmese), and Zomi (Tedim). This website is the official brand and information hub, separate from the app.',my:'ZoLaiGPT သည် English၊ Myanmar နှင့် Zomi (Tedim) ဘာသာစကားများကို အဓိကထားသော AI စီမံကိန်းဖြစ်ပါသည်။ ဤ Website သည် App နှင့် သီးခြားဖြစ်သော တရားဝင် အချက်အလက် Website ဖြစ်ပါသည်။'}
   :{en:'Official ZoLaiGPT app release and download details have not been confirmed on this website. Please check the official website for announcements.',my:'ZoLaiGPT App ၏ တရားဝင် ထုတ်ဝေမည့်ရက်နှင့် Download Link ကို Website ပေါ်တွင် အတည်မပြုရသေးပါ။ တရားဝင်ကြေညာချက်များကို Website တွင် စစ်ဆေးနိုင်ပါသည်။'};
  return json({reply:lang==='my'?facts.my:lang==='zom'?'Zomi (Tedim) translation is not verified yet. English information: '+facts.en:facts.en,model:'verified-site-facts'},200,origin);
 }
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
 try{
  const upstream=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',signal:controller.signal,headers:{'Authorization':'Bearer '+env.OPENROUTER_API_KEY,'Content-Type':'application/json','HTTP-Referer':allowed,'X-Title':'ZoLaiGPT V5.5 Preview'},body:JSON.stringify({model:'openrouter/free',max_tokens:700,temperature:0.5,messages:[{role:'system',content:'VERIFIED ZOLAIGPT WEBSITE FACTS: The official ZoLaiGPT website focuses on English, Myanmar (Burmese), and Zomi (Tedim). It is the official information and brand hub, separate from the app. The website explores how multilingual AI can help people learn, communicate and create. The app release date, download link, prices and availability are not confirmed here. Do not claim all languages have complete AI support. If asked which languages ZoLaiGPT supports or focuses on, name English, Myanmar and Zomi (Tedim) explicitly. For any unknown official details, say unconfirmed. You are the ZoLaiGPT website PREVIEW assistant. Reply concisely in '+({en:'English',my:'Myanmar language',zom:'Zomi (Tedim) ONLY if you can express it reliably; otherwise answer in English with a short disclosure that Zomi translation is unavailable. NEVER answer in Burmese when Zomi was requested'}[lang])+'. Do not invent official app releases, downloads, pricing or product capabilities. Clearly say you are a preview assistant when asked.'},...turns,{role:'user',content:message.trim()}]})});
  if(!upstream.ok)return json({error:upstream.status===429?'Free AI quota or rate limit reached':'AI service unavailable right now'},upstream.status===429?429:502,origin);
  const data=await upstream.json();const content=data?.choices?.[0]?.message?.content;
  const reply=typeof content==='string'?content:Array.isArray(content)?content.filter(x=>x?.type==='text'&&typeof x.text==='string').map(x=>x.text).join('\n'):'';
  if(!reply.trim())return json({error:'This free AI model did not provide a reply. Please try again shortly.'},502,origin);
  // A Burmese-script reply is not a Zomi (Tedim) reply. Avoid mislabelling it.
  if(lang==='zom'&&/[\u1000-\u109F]/.test(reply))return json({reply:'Zomi (Tedim) reply could not be verified for this request. Please select English or try again later.',model:'language-quality-guard'},200,origin);
  return json({reply:reply.slice(0,4000),model:data.model||'openrouter/free'},200,origin);
 }catch{return json({error:'AI request timed out or failed'},502,origin)}
 finally{clearTimeout(timer)}
}};
