import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { generateOtp,hashOtp,otpExpiryMinutes,sendOtpEmail } from "../utils/emailService.js";

const publicUser=user=>({id:user._id,name:user.name,email:user.email,role:user.role});

export async function register(req,res){
 const {name,email,password,confirm_password}=req.body;
 if(!name||!email||!password)return res.status(400).json({message:"Name, email and password are required"});
 if(confirm_password!==undefined&&password!==confirm_password)return res.status(400).json({message:"Passwords do not match"});
 const normalizedEmail=String(email).trim().toLowerCase();
 let user=await User.findOne({email:normalizedEmail});
 if(user&&user.isEmailVerified)return res.status(409).json({message:"Email is already registered"});
 const otp=generateOtp();
 if(!user)user=new User({name,email:normalizedEmail,password:await bcrypt.hash(password,12),isEmailVerified:false});
 else {user.name=name;user.password=await bcrypt.hash(password,12);}
 user.emailOtpHash=hashOtp(otp);user.emailOtpExpiresAt=new Date(Date.now()+otpExpiryMinutes*60000);user.emailOtpLastSentAt=new Date();
 await user.save();
 try{await sendOtpEmail({name:user.name,email:user.email,otp});}catch(error){console.error("OTP email error:",error);return res.status(500).json({message:"Could not send verification email. Please try again."});}
 res.status(201).json({message:"Verification OTP sent",email:user.email,expiresInMinutes:otpExpiryMinutes});
}

export async function verifyOtp(req,res){
 const email=String(req.body.email||"").trim().toLowerCase(),otp=String(req.body.otp||"").trim();
 if(!email||!/^[0-9]{6}$/.test(otp))return res.status(400).json({message:"Enter a valid 6-digit OTP"});
 const user=await User.findOne({email});if(!user)return res.status(404).json({message:"Account not found"});
 if(user.isEmailVerified)return res.status(400).json({message:"Email is already verified"});
 if(!user.emailOtpExpiresAt||user.emailOtpExpiresAt.getTime()<Date.now())return res.status(400).json({message:"OTP expired. Request a new code."});
 if(user.emailOtpHash!==hashOtp(otp))return res.status(400).json({message:"Incorrect OTP"});
 user.isEmailVerified=true;user.emailOtpHash="";user.emailOtpExpiresAt=null;user.emailOtpLastSentAt=null;await user.save();
 res.json({message:"Email verified successfully",token:generateToken(user),user:publicUser(user)});
}

export async function resendOtp(req,res){
 const email=String(req.body.email||"").trim().toLowerCase(),user=await User.findOne({email});
 if(!user)return res.status(404).json({message:"Account not found"});
 if(user.isEmailVerified)return res.status(400).json({message:"Email is already verified"});
 if(user.emailOtpLastSentAt&&Date.now()-user.emailOtpLastSentAt.getTime()<60000)return res.status(429).json({message:"Please wait 60 seconds before requesting another OTP"});
 const otp=generateOtp();user.emailOtpHash=hashOtp(otp);user.emailOtpExpiresAt=new Date(Date.now()+otpExpiryMinutes*60000);user.emailOtpLastSentAt=new Date();await user.save();
 try{await sendOtpEmail({name:user.name,email:user.email,otp});}catch(error){console.error("OTP email error:",error);return res.status(500).json({message:"Could not send OTP email"});}
 res.json({message:"New OTP sent",expiresInMinutes:otpExpiryMinutes});
}

export async function login(req,res){
 const {email,password}=req.body,user=await User.findOne({email:String(email||"").trim().toLowerCase()});
 if(!user||!(await bcrypt.compare(password,user.password)))return res.status(401).json({message:"Invalid email or password"});
 if(!user.isEmailVerified)return res.status(403).json({message:"Please verify your email before logging in",requiresVerification:true,email:user.email});
 res.json({token:generateToken(user),user:publicUser(user)});
}

export async function me(req,res){res.json({user:publicUser(req.user)});}

export async function seedAdmin(req,res){
 if(process.env.ALLOW_ADMIN_SEED!=="true")return res.status(403).json({message:"Admin seed disabled"});
 const email=req.body.email||"admin@techstore.com",password=req.body.password||"password123";let u=await User.findOne({email});
 if(u){u.role="admin";u.password=await bcrypt.hash(password,12);u.isEmailVerified=true;u.emailOtpHash="";u.emailOtpExpiresAt=null;await u.save();}
 else u=await User.create({name:"Admin User",email,password:await bcrypt.hash(password,12),role:"admin",isEmailVerified:true});
 res.json({message:"Admin ready",email,password});
}