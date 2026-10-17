// ZoLaiGPT V5.5 preview-only OpenRouter Worker. Never paste API keys into this file.
// Required secret: OPENROUTER_API_KEY. Optional: ALLOWED_ORIGIN, RATE_LIMITER binding.
const json=(data,status=200,origin='')=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...(origin?{'Access-Control-Allow-Origin':origin,'Vary':'Origin'}:{})}});

const FAQ_URL='https://v55-chatbot-preview.zolaigpt-official-website.pages.dev/faq-runtime.json';
const FAQ_SHA256='1cf1f3b7b29be6ebc4bfffb0f2c074e42f3a3b155e4bc41bb41c066b3a50cd1b';
let faqCache=null,faqCacheUntil=0;
async function loadFaq(){
 if(faqCache&&Date.now()<faqCacheUntil)return faqCache;
 try{
  const response=await fetch(FAQ_URL,{headers:{Accept:'application/json'},redirect:'error'});
  if(!response.ok)return null;
  const buffer=await response.arrayBuffer();if(buffer.byteLength>150000)return null;
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',buffer)),b=>b.toString(16).padStart(2,'0')).join('');
  if(digest!==FAQ_SHA256)return null;
  const parsed=JSON.parse(new TextDecoder().decode(buffer));
  if(parsed?.records?.length!==72||parsed?.counts?.verified!==54||parsed?.counts?.unverified!==18)return null;
  faqCache=parsed.records;faqCacheUntil=Date.now()+180000;return faqCache;
 }catch{return null}
}
function faqScore(question,record){
 const norm=s=>String(s||'').toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();
 const input=norm(question),en=norm(record.question_en),my=norm(record.question_my);
 if(!input)return 0;if(input===en||input===my)return 1;
 if(input.length>=12&&(en.includes(input)||my.includes(input)))return .93;
 const stop=new Set(['what','how','does','the','is','are','can','do','i','to','a','an','for','on','about','and','of','my','where','why','this','which','please','tell','me']);
 const words=t=>t.split(' ').filter(w=>w.length>2&&!stop.has(w));
 const query=words(input),target=new Set(words(en+' '+my));if(!query.length)return 0;
 let matches=0;for(const w of query)if(target.has(w))matches++;
 return matches/Math.max(query.length,words(en).length*.8);
}
function findFaq(text,records){
 let best=null,score=0;
 for(const record of records){const value=faqScore(text,record);if(value>score){score=value;best=record}}
 return score>=.58?best:null;
}

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
 // Enforce an actual byte cap even for chunked bodies with no Content-Length.
 if(Number(request.headers.get('Content-Length')||0)>12000)return json({error:'Message too large'},413,origin);
 let payload;
 try{
  if(!request.body)return json({error:'JSON body required'},400,origin);
  const reader=request.body.getReader();const chunks=[];let size=0;
  try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>12000){await reader.cancel();return json({error:'Message too large'},413,origin);}chunks.push(value)}}finally{reader.releaseLock()}
  const bytes=new Uint8Array(size);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.byteLength}
  payload=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
 }catch{return json({error:'Invalid JSON body'},400,origin)}
 const message=payload?.message,lang=['en','my','zom'].includes(payload?.language)?payload.language:'en';
 // Tedim content requires native review: always use a clearly labelled English fallback.
 const effectiveLang=lang==='zom'?'en':lang;
 if(typeof message!=='string'||!message.trim()||message.length>1000)return json({error:'Message must be 1-1000 characters'},400,origin);
 const history=Array.isArray(payload.history)?payload.history.slice(-8):[];
 const turns=history.filter(m=>m&&['user','assistant'].includes(m.role)&&typeof m.content==='string'&&m.content.length<=1000).map(m=>({role:m.role,content:m.content}));
 // Source-backed runtime FAQ retrieval. Unverified entries contain no official answers.
 const faqRecords=await loadFaq();
 if(faqRecords){
  const matched=findFaq(message,faqRecords);
  if(matched){
   if(matched.verification_status!=='verified')return json({reply:lang==='my'?'ဤအချက်အလက်ကို တရားဝင် အတည်မပြုရသေးပါ။ Official Website တွင် ကြေညာချက်ကို စစ်ဆေးပါ။':'This information has not been officially verified. Please check the official website for updates.',source_id:matched.id,verification_status:'unverified'},200,origin);
   const verifiedReply=effectiveLang==='my'?matched.answer_my:matched.answer_en;
   const reply=lang==='zom'?'Zomi (Tedim) translation is pending native review. English fallback: '+matched.answer_en:verifiedReply;
   return json({reply,source_id:matched.id,source_refs:matched.source_refs,verification_status:'verified',model:'source-backed-faq'},200,origin);
  }
 }
 // Deterministic response for verified site facts: free models must not guess basic ZoLaiGPT details.
 const languageQuestion=/what languages|which languages|supported languages|languages does zolaigpt|ဘာသာစကား|pau bang|languages supported/i.test(message);
 if(languageQuestion){
  const reply=effectiveLang==='my'?'ZoLaiGPT Website သည် English၊ Myanmar (မြန်မာ) နှင့် Zomi (Tedim) ဘာသာစကား ၃ မျိုးကို အဓိကထားပါသည်။':'ZoLaiGPT focuses on three languages: English, Myanmar (Burmese), and Zomi (Tedim). This is the website’s multilingual focus, not a guarantee of full AI language proficiency.';
  return json({reply:lang==='zom'?'Zomi (Tedim) translation is pending native review. English fallback: '+reply:reply,model:'verified-site-facts'},200,origin);
 }
 // Verified FAQ answers are stable and do not rely on the variable-quality free router.
 const aboutQuestion=/about zolaigpt|what is zolaigpt|tell me about zolaigpt|zolaigpt အကြောင်း|zolaigpt.*bang|zolaigpt.*thu/i.test(message);
 const appQuestion=/app availability|app information|download (the )?app|app (release|download|available)|app အကြောင်း/i.test(message);
 if(aboutQuestion||appQuestion){
  const facts=aboutQuestion
   ?{en:'ZoLaiGPT is a multilingual AI project focusing on English, Myanmar (Burmese), and Zomi (Tedim). This website is the official brand and information hub, separate from the app.',my:'ZoLaiGPT သည် English၊ Myanmar နှင့် Zomi (Tedim) ဘာသာစကားများကို အဓိကထားသော AI စီမံကိန်းဖြစ်ပါသည်။ ဤ Website သည် App နှင့် သီးခြားဖြစ်သော တရားဝင် အချက်အလက် Website ဖြစ်ပါသည်။'}
   :{en:'Official ZoLaiGPT app release and download details have not been confirmed on this website. Please check the official website for announcements.',my:'ZoLaiGPT App ၏ တရားဝင် ထုတ်ဝေမည့်ရက်နှင့် Download Link ကို Website ပေါ်တွင် အတည်မပြုရသေးပါ။ တရားဝင်ကြေညာချက်များကို Website တွင် စစ်ဆေးနိုင်ပါသည်။'};
  return json({reply:effectiveLang==='my'?facts.my:lang==='zom'?'Zomi (Tedim) translation is pending native review. English fallback: '+facts.en:facts.en,model:'verified-site-facts'},200,origin);
 }
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
 try{
  const upstream=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',signal:controller.signal,headers:{'Authorization':'Bearer '+env.OPENROUTER_API_KEY,'Content-Type':'application/json','HTTP-Referer':allowed,'X-Title':'ZoLaiGPT V5.5 Preview'},body:JSON.stringify({model:'openrouter/free',max_tokens:700,temperature:0.5,messages:[{role:'system',content:'VERIFIED ZOLAIGPT WEBSITE FACTS: The official ZoLaiGPT website focuses on English, Myanmar (Burmese), and Zomi (Tedim). It is the official information and brand hub, separate from the app. The website explores how multilingual AI can help people learn, communicate and create. The app release date, download link, prices and availability are not confirmed here. Do not claim all languages have complete AI support. If asked which languages ZoLaiGPT supports or focuses on, name English, Myanmar and Zomi (Tedim) explicitly. For any unknown official details, say unconfirmed. You are the ZoLaiGPT website PREVIEW assistant. Reply concisely in '+({en:'English',my:'Myanmar language',zom:'Zomi (Tedim) ONLY if you can express it reliably; otherwise answer in English with a short disclosure that Zomi translation is unavailable. NEVER answer in Burmese when Zomi was requested'}[effectiveLang])+'. Do not invent official app releases, downloads, pricing or product capabilities. Clearly say you are a preview assistant when asked.'},...turns,{role:'user',content:message.trim()}]})});
  if(!upstream.ok)return json({error:upstream.status===429?'Free AI quota or rate limit reached':'AI service unavailable right now'},upstream.status===429?429:502,origin);
  const data=await upstream.json();const content=data?.choices?.[0]?.message?.content;
  const reply=typeof content==='string'?content:Array.isArray(content)?content.filter(x=>x?.type==='text'&&typeof x.text==='string').map(x=>x.text).join('\n'):'';
  if(!reply.trim())return json({error:'This free AI model did not provide a reply. Please try again shortly.'},502,origin);
  // A Burmese-script reply is not a Zomi (Tedim) reply. Avoid mislabelling it.
  if(lang==='zom'&&/[\u1000-\u109F]/.test(reply))return json({reply:'Zomi (Tedim) reply could not be verified for this request. Please select English or try again later.',model:'language-quality-guard'},200,origin);
  return json({reply:lang==='zom'?'Zomi (Tedim) translation is pending native review. English fallback: '+reply.slice(0,3700):reply.slice(0,4000),model:data.model||'openrouter/free'},200,origin);
 }catch{return json({error:'AI request timed out or failed'},502,origin)}
 finally{clearTimeout(timer)}
}};
