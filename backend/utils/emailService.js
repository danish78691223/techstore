import crypto from "crypto";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";
export const otpExpiryMinutes = Number(process.env.OTP_EXPIRES_MINUTES || 10);

const escapeHtml = value => String(value ?? "")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll(String.fromCharCode(34), "&quot;").replaceAll(String.fromCharCode(39), "&#039;");

export function generateOtp(){ return String(crypto.randomInt(100000,1000000)); }
export function hashOtp(otp){ return crypto.createHash("sha256").update(String(otp)).digest("hex"); }

export async function sendBrevoEmail({toEmail,toName,subject,htmlContent,textContent}){
  const apiKey=String(process.env.BREVO_API_KEY || "").trim();
  const senderEmail=String(process.env.BREVO_SENDER_EMAIL || "").trim();
  const senderName=String(process.env.BREVO_SENDER_NAME || "Tech Nexus").trim();
  if(!apiKey || !senderEmail) throw new Error("Brevo email configuration is missing");
  const response=await fetch(BREVO_URL,{
    method:"POST",
    headers:{accept:"application/json","api-key":apiKey,"content-type":"application/json"},
    body:JSON.stringify({sender:{email:senderEmail,name:senderName},to:[{email:toEmail,name:toName||toEmail}],subject,htmlContent,textContent})
  });
  const body=await response.text();
  if(!response.ok) throw new Error("Brevo email failed ("+response.status+"): "+body);
  return body ? JSON.parse(body) : {};
}

export async function sendOtpEmail({name,email,otp}){
  const safeName=escapeHtml(name||"there");
  const html="<div style=\"font-family:Arial,sans-serif;background:#f5f8fc;padding:32px\"><div style=\"max-width:560px;margin:auto;background:#fff;border:1px solid #e6edf5;border-radius:18px;padding:32px\"><div style=\"font-size:12px;font-weight:800;letter-spacing:2px;color:#6255f5\">TECH NEXUS</div><h1 style=\"margin:14px 0 8px;color:#101828\">Verify your email</h1><p style=\"color:#667085;line-height:1.6\">Hi "+safeName+", use the verification code below to activate your Tech Nexus account.</p><div style=\"font-size:34px;letter-spacing:10px;font-weight:800;color:#111827;background:#f2f5ff;border-radius:14px;padding:20px;text-align:center;margin:24px 0\">"+otp+"</div><p style=\"color:#667085;font-size:13px\">This code expires in "+otpExpiryMinutes+" minutes. Never share this OTP with anyone.</p><p style=\"color:#98a2b3;font-size:12px;margin-top:28px\">Tech Nexus • Smart tech. Better living.</p></div></div>";
  return sendBrevoEmail({toEmail:email,toName:name,subject:"Verify your Tech Nexus account",htmlContent:html,textContent:"Hi "+(name||"there")+", your Tech Nexus verification code is "+otp+". It expires in "+otpExpiryMinutes+" minutes."});
}

export async function sendOrderConfirmationEmail({name,email,order}){
  const orderId=String(order._id).slice(-8).toUpperCase();
  const rows=order.items.map(item=>"<tr><td style=\"padding:10px 0;border-bottom:1px solid #edf1f5\">"+escapeHtml(item.name)+" × "+item.quantity+"</td><td style=\"padding:10px 0;border-bottom:1px solid #edf1f5;text-align:right\">Rs "+Number(item.price*item.quantity).toLocaleString("en-IN")+"</td></tr>").join("");
  const html="<div style=\"font-family:Arial,sans-serif;background:#f5f8fc;padding:32px\"><div style=\"max-width:620px;margin:auto;background:#fff;border:1px solid #e6edf5;border-radius:18px;overflow:hidden\"><div style=\"padding:28px;background:linear-gradient(135deg,#6255f5,#12cde5);color:#fff\"><div style=\"font-size:12px;font-weight:800;letter-spacing:2px\">TECH NEXUS</div><h1 style=\"margin:12px 0 5px;font-size:28px\">Order confirmed.</h1><p style=\"margin:0;opacity:.9\">Thanks "+escapeHtml(name||"for shopping with us")+"!</p></div><div style=\"padding:28px\"><p style=\"color:#667085\">Your order <b style=\"color:#101828\">#"+orderId+"</b> has been placed successfully via Cash on Delivery.</p><table style=\"width:100%;border-collapse:collapse;color:#344054\">"+rows+"<tr><td style=\"padding:14px 0;font-weight:700\">Total</td><td style=\"padding:14px 0;text-align:right;font-weight:800\">Rs "+Number(order.total_price).toLocaleString("en-IN")+"</td></tr></table><div style=\"margin-top:20px;padding:14px;background:#f8fafc;border-radius:12px\"><b style=\"color:#101828\">Delivery address</b><div style=\"color:#667085;font-size:13px;margin-top:6px\">"+escapeHtml(order.address)+"</div></div><p style=\"color:#98a2b3;font-size:12px;margin-top:24px\">View your order anytime in My Orders.</p></div></div></div>";
  return sendBrevoEmail({toEmail:email,toName:name,subject:"Tech Nexus order #"+orderId+" confirmed",htmlContent:html,textContent:"Your Tech Nexus order #"+orderId+" is confirmed. Total: Rs "+Number(order.total_price).toLocaleString("en-IN")+". Payment: Cash on Delivery."});
}