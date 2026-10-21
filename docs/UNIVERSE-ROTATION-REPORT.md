# ZoLaiGPT — Universe Auto-Rotation Preview

2026-10-22 (Asia/Kuala_Lumpur)။ Existing V5.7 preview ကိုပဲ ဆက်သုံးထားသည်။ Production၊ main branch၊ Android backend နှင့် chatbot integration မပြောင်းထားပါ။ ဤအစီရင်ခံစာသည် hero rendering အတွက် ယခင် artwork/CSS-only ဖော်ပြချက်ကို အစားထိုးသည်။

## ပြောင်းလဲထားသောအရာ

ယခင် hero-orb.js တွင် floating/light-trail CSS motion သာရှိပြီး orb ကိုယ်တိုင် Y-axis rotation လုပ်သော sphere/render loop မရှိခဲ့ပါ။ ယခု hero ကို renderer ၂ မျိုးဖြင့် ပြန်တည်ဆောက်ထားသည်။

1. `assets/js/universe-orb.js` — local Three.js r170၊ real SphereGeometry၊ original orb artwork ကို sphere material ထဲတွင် projected texture အဖြစ်သုံးထားသည်။ Orange/blue torus rings၊ star particles၊ atmosphere နှင့် floating motion ပါသည်။ Flat logo plane မသုံးထားပါ။
2. `assets/js/software-orb.js` — WebGL မရသောအခါ Canvas 2D output ထဲတွင် CPU ray-cast 3D sphere ကို render လုပ်သည်။ Sphere surface point တိုင်းကို inverse 3D Y-axis rotation ဖြင့် texture sample တွက်သည်။ PNG ကို CSS rotate လုပ်ထားခြင်း မဟုတ်ပါ။

မူရင်း logo.png နှင့် orb artwork bytes ကို မပြောင်းထားပါ။ Logo သည် sphere surface နှင့်အတူ အမှန်တကယ် လိုက်လည်သည်။ မျက်နှာနှစ်ဘက်တွင် brand identity ကို projection လုပ်ထားသဖြင့် လည်နေစဉ် logo ပြန်ပေါ်လာသည်။ မျက်နှာဘေးစောင်းချိန် perspective အရ သဘာဝကျကျ ကျဉ်းလာနိုင်သည်။

30 active seconds = 360°။ Rendering ကို requestAnimationFrame ဖြင့် ဆက်လုပ်သည်။ Ambient frame delta ကို clamp လုပ်ထားပြီး core angular phase ကို active wall-clock interval ဖြင့်တွက်ထားသည်။ Frame delta clamp ကို core phase မှာပါ သုံးသည့် ပထမ fallback စမ်းသပ်ချက်က slow-frame browser တွင် နှေးနေခဲ့သဖြင့် ခွဲပြင်ထားသည်။ Hidden/offscreen/manual-pause/reduced-motion တွင် scheduling နှင့် clocks reset ဖြစ်သည်။ Angle ကို တစ်ပတ်ပြည့်တိုင်း 0 reset မလုပ်ပါ။

Drag စဉ် auto phase ရပ်ပြီး release နောက် 1.4 seconds မှ ပြန်စရန် configure လုပ်ထားသည်။ Horizontal gesture ဖြစ်မှ pointer capture လုပ်ပြီး touch-action:pan-y သတ်မှတ်ထားသည်။ Quiet atmosphere၊ device resolution/particle limits၊ WebGL context loss/restoration handlers နှင့် resource cleanup ပါသည်။ WebGL နှင့် Canvas နှစ်မျိုးစလုံး မရလျှင် original static artwork ကို ထိန်းထားသည်။

## တကယ်စမ်းသပ်ထားသော browser results

စမ်းသပ် browser က WebGL context creation ကို `GL_RENDERER=Disabled` ဖြင့် ပယ်ချသည်။ ထို့ကြောင့် **Three.js/WebGL rendering PASS ဟု မဖော်ပြပါ**။ Browser စမ်းသပ်မှုအားလုံးသည် အမှန်တကယ် လည်နေသော `canvas-3d` fallback ပေါ်တွင် ဖြစ်သည်။

လက်မထိဘဲ actual DOM rotation telemetry ကို အောက်ပါအတိုင်း မှတ်တမ်းတင်ထားသည်။ `automatic` သည် drag input မပါသော cumulative automatic angle ဖြစ်သည်။ Elapsed time သည် browser sample timestamps အချင်းချင်းကွာခြားချက် ဖြစ်သည်။

| Elapsed seconds | Y radians | Automatic radians | State |
| --- | --- | --- | --- |
| 0.000 | 1.514457 | 1.514457 | running |
| 33.709 | 8.574454 | 8.574454 | running |
| 67.402 | 15.631099 | 15.631099 | running |
| 123.540 | 27.388614 | 27.388614 | running |

123.540 seconds အတွင်း automatic turns **4.118** ရရှိသည်။ 30 seconds/turn နှင့် ကိုက်ညီပြီး လက်မထိဘဲ full 360° ထက်ပိုလည်သည်။ တိကျသော 10/20/35/45-second capture schedule ကို မလုပ်ထားပါ။ ရလဒ်အမှန်ရှိသော timestamps များကိုသာ ဖော်ပြထားသည်။

- Pause: Y/automatic = 27.601614 တွင် ရပ်ပြီး နောက်တစ်ကြိမ်ဖတ်ရာတွင် မပြောင်းပါ။
- Desktop mouse drag: manual angle offset 1.137029 radians ရရှိပြီး automatic counter နှင့် သီးခြားဖြစ်ကြောင်း တွေ့ရသည်။ Release နောက် auto counter 27.817965 → 36.333357 ပြန်တိုးသည်။ Configured 1.4s delay ကို sub-second timing ဖြင့် သီးခြားမတိုင်းထားပါ။
- Viewports 320/360/390/768/926/1280/1440px တို့တွင် `canvas-3d` rendered ဖြစ်ပြီး horizontal overflow မရှိပါ။
- JS modules syntax နှင့် tools/verify-preview.py checks အောင်မြင်သည်။ Original branding/legal/translation/social URLs မပြောင်းထားပါ။

## မစမ်းသပ်နိုင်သေးသောအရာ

Physical Android Chrome/iOS Safari၊ actual touch scroll/drag conflict၊ OS reduced motion၊ background-tab return၊ real WebGL context restoration၊ GPU/FPS/memory/long-session profiling ကို ယခု browser တွင် အတည်မပြုရသေးပါ။ Handlers ရှိသည်ဆိုရုံဖြင့် PASS ဟု မဆိုပါ။ WebGL failure logs သည် test browser ၏ disabled graphics context ကြောင့်ဖြစ်ပြီး fallback အလုပ်လုပ်ကြောင်း သီးခြားအတည်ပြုထားသည်။

## Deployment နှင့် rollback

Preview branch: feature/v57-spatial-chat-preview။ Source safety baseline before this change: a0330021a6ec5553f42376e7c50e0b8170c73628။ ယခင် deployed snapshot https://22af2765.zolaigpt-official-website.pages.dev/ တွင် universe change မပါသေးပါ။ Latest final response တွင် verified deployment URL ကို ကြည့်ပါ။ Main ကို merge/deploy မလုပ်ပါနှင့်။ Rollback လိုလျှင် universe refinement ကို preview branch တွင် revert လုပ်နိုင်သည်။
