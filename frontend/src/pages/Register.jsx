import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, UserPlus, ArrowRight, ShieldCheck, MailCheck, RefreshCw, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm_password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const { register, verifyOtp, resendOtp } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const verifyEmail = params.get("verify");
    if (verifyEmail) {
      setForm(f => ({ ...f, email: verifyEmail }));
      setStep("otp");
    }
  }, [params]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const submit = async e => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (form.password !== form.confirm_password) return setError("Passwords do not match");
    setBusy(true);
    try {
      const result = await register(form);
      setStep("otp");
      setMessage("Verification code sent to " + result.email);
      setSeconds(60);
    } catch (x) {
      setError(x.response?.data?.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  const verify = async e => {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      await verifyOtp({ email: form.email, otp });
      nav("/");
    } catch (x) {
      setError(x.response?.data?.message || "Verification failed");
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setError("");
    setMessage("");
    setResendBusy(true);
    try {
      const result = await resendOtp({ email: form.email });
      setMessage(result.message || "New OTP sent");
      setSeconds(60);
      setOtp("");
    } catch (x) {
      setError(x.response?.data?.message || "Could not resend OTP");
    } finally {
      setResendBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        {step === "form" ? (
          <>
            <div className="auth-top">
              <div className="brand big"><span className="brand-mark">TN</span><span>TECH NEXUS<small>SMART TECH. BETTER LIVING.</small></span></div>
              <div className="security-chip"><ShieldCheck size={15}/>Free account</div>
            </div>
            <h2>Build your tech profile.</h2>
            <p className="auth-sub">Create your account and verify your email to start shopping.</p>
            {error && <div className="error">{error}</div>}
            <form onSubmit={submit}>
              <label>Full name<input placeholder="Your name" required value={form.name} onChange={e => setForm({...form, name:e.target.value})}/></label>
              <label>Email address<input type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm({...form, email:e.target.value})}/></label>
              <label>Password><div className="password-field"><input type={show?"text":"password"} placeholder="Create a password" required value={form.password} onChange={e => setForm({...form,password:e.target.value})}/><button type="button" onClick={() => setShow(v => !v)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
              <label>Confirm password<input type="password" placeholder="Repeat password" required value={form.confirm_password} onChange={e => setForm({...form,confirm_password:e.target.value})}/></label>
              <button className="primary auth-submit" disabled={busy}>{busy?"Sending code...":"Create account"}<UserPlus size={17}/></button>
            </form>
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </>
        ) : (
          <>
            <button className="auth-back" type="button" onClick={() => {setStep("form");setOtp("");setError("");setMessage("");}}><ArrowLeft size={15}/>Back</button>
            <div className="otp-icon"><MailCheck size={27}/></div>
            <h2>Verify your email.</h2>
            <p className="auth-sub">Enter the 6-digit code sent to <b>{form.email}</b>.</p>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error">{error}</div>}
            <form onSubmit={verify}>
              <label>Verification code<input className="otp-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" placeholder="000000" required value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}/></label>
              <button className="primary auth-submit" disabled={busy || otp.length !== 6}>{busy?"Verifying...":"Verify & continue"}<ArrowRight size={17}/></button>
            </form>
            <div className="resend-row"><span>Didn't receive it?</span><button type="button" disabled={seconds>0||resendBusy} onClick={resend}>{resendBusy?<RefreshCw className="spin" size={14}/>:null}{seconds>0?"Resend in "+seconds+"s":"Resend OTP"}</button></div>
            <div className="auth-trust"><ShieldCheck size={15}/>Verification protects your account and orders.</div>
          </>
        )}
      </div>
    </main>
  );
}