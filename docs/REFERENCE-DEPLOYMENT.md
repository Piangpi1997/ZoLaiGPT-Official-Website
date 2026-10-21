# Preview တင်ရန် လမ်းညွှန်

ဤ package သည် V5.7 Preview refinement ဖြစ်သည်။ Production အတွက် ခွင့်ပြုချက် မရှိပါ။

1. ZIP ကို ဖြည်ပါ။ Root တွင် index.html, styles.css, script.js, _headers, assets/, chat/ နှင့် legal files ရှိရမည်။
2. Root ကို `python3 -m http.server 8080` ဖြင့် serve လုပ်၍ localhost:8080/၊ /chat/၊ /qa-reference.html ကို ဖွင့်စမ်းပါ။ file:// ဖြင့် မဖွင့်ပါနှင့်။
3. GitHub branch `feature/v57-spatial-chat-preview` ကိုသာ အသုံးပြုပါ။ `main` ကို merge/push မလုပ်ပါနှင့်။ Existing PR #3 သည် draft ဖြစ်သည်။
4. Cloudflare Pages project `zolaigpt-official-website` တွင် production branch ကို main အတိုင်းထားပါ။ ဤ branch အတွက် Git preview build ရှိမှ preview deploy ကို စစ်ပါ။ Latest source commit နှင့် deployment commit တူကြောင်း စစ်ပြီး /chat/ ပါ new content ပြသကြောင်း အတည်ပြုပါ။
5. Ready static root ကို serve ရန် Next.js server မလိုပါ။ App source ကို ပြင်မှ `chat-workspace/` အတွင်း npm ci, npm run build, npm test လုပ်ပြီး out/ ကို root chat/ သို့ အစားထိုးပါ။
6. Manual Direct Upload သုံးလျှင် dedicated preview project သို့သာ extracted deployable files တင်ပါ။ Existing production environment ကို ရွေးမတင်ပါနှင့်။ Provider UI က Git-integrated project တွင် upload မပေးလျှင် preview Git workflow ကိုသာ အသုံးပြုပါ။
7. `_headers` နှင့် page noindex ကို ထိန်းထားပါ။ Official domain/custom domains၊ production mappings နှင့် API secrets မပြောင်းပါနှင့်။

Current blocker: Cloudflare connector internal error နှင့် browser sign-in generic failure။ Public preview URL အသစ် မအတည်ပြုနိုင်သေးပါ။ ဤလမ်းညွှန်သည် deployed ဖြစ်ကြောင်း သက်သေမဟုတ်ပါ။

Rollback: Previous preview commit `59526d045a53a02bcdc76b9587679d3b30f244db` ကို branch အသစ်တွင် checkout လုပ်နိုင်သည်၊ သို့မဟုတ် refinement commit ကို preview branch ပေါ်တွင် revert လုပ်နိုင်သည်။ Input V5.6 ZIP ကို backup အဖြစ် သီးခြားထားသည်။ Production မတင်ထားသဖြင့် production rollback မလိုပါ။

Future live AI: separate authenticated server proxy၊ server-side provider secret၊ rate/concurrency limits၊ input/output bounds၊ timeout/cancellation၊ abuse protection နှင့် empty-response validation ပါမှ ချိတ်ဆက်ရန်။ Existing Android backend ကို မသုံး/မပြင်ထားပါ။
