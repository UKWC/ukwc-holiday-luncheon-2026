const crypto=require('crypto');
const reply=(statusCode,body)=>({statusCode,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
exports.handler=async(event)=>{
 if(event.httpMethod!=='POST')return reply(405,{error:'Method not allowed'});
 try{
 const d=JSON.parse(event.body||'{}');const name=String(d.name||'').trim(),email=String(d.email||'').trim(),guestName=String(d.guestName||'').trim(),method=d.paymentMethod;
 if(!name||!/^\S+@\S+\.\S+$/.test(email)||!['square','check'].includes(method))return reply(400,{error:'Please complete the required fields.'});
 const count=guestName?2:1,subtotal=count*2400,total=method==='square'?Math.ceil((subtotal+30)/(1-.029)):subtotal,id=crypto.randomUUID();let paymentUrl=null,paymentLinkId='';
 if(method==='square'){
  if(!process.env.SQUARE_ACCESS_TOKEN||!process.env.SQUARE_LOCATION_ID||!process.env.PUBLIC_SITE_URL)throw Error('Square environment variables are missing');
  const redirect=new URL('/thank-you.html?method=card',process.env.PUBLIC_SITE_URL).toString();
  const res=await fetch('https://connect.squareup.com/v2/online-checkout/payment-links',{method:'POST',headers:{Authorization:'Bearer '+process.env.SQUARE_ACCESS_TOKEN,'Content-Type':'application/json','Square-Version':'2024-01-18'},body:JSON.stringify({idempotency_key:id,quick_pay:{name:'UKWC 2026 Holiday Luncheon Registration',price_money:{amount:total,currency:'USD'},location_id:process.env.SQUARE_LOCATION_ID},checkout_options:{redirect_url:redirect,ask_for_shipping_address:false},pre_populated_data:{buyer_email:email},payment_note:'Holiday luncheon registration '+id})});const out=await res.json();if(!res.ok||!out.payment_link?.url)throw Error('Unable to create Square payment link');paymentUrl=out.payment_link.url;paymentLinkId=out.payment_link.id||'';
 }
 const endpoint='https://script.google.com/macros/s/AKfycbwUsHqQiuOsVNGM8TMp1zpBN_4sqAFqx57AYVqJBKfJlmPzPkhePfS_9dZZ5ileoTgHCA/exec';
 const payload={registrationId:id,name,email,phone:String(d.phone||''),vegetarian:d.vegetarian===true,guestName,guestVegetarian:d.guestVegetarian===true,numberAttending:count,registrationTotal:subtotal/100,chargedTotal:total/100,paymentMethod:method==='square'?'Square':'Check',paymentStatus:method==='square'?'Pending Square Payment':'Awaiting Check',paymentLinkId};
 const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),redirect:'follow'});const raw=await res.text();let out;try{out=JSON.parse(raw)}catch{throw Error('Google Sheet did not return valid JSON')}if(!res.ok||!out.ok)throw Error('Unable to save registration');
 return reply(200,{ok:true,paymentUrl,registrationId:id,emailSent:out.emailSent});
 }catch(e){console.error(e);return reply(502,{error:'Unable to complete registration. Please try again or contact UKWC.'})}
};
