import { useEffect } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";
import { useCart } from "../context/CartContext";
export default function CartToast(){
 const {notice,dismissNotice}=useCart();
 useEffect(()=>{if(!notice)return;const t=setTimeout(dismissNotice,2800);return()=>clearTimeout(t)},[notice,dismissNotice]);
 if(!notice)return null;
 return <div className={"cart-toast "+(notice.type==="warning"?"warning":"success")} role="status"><div className="toast-icon">{notice.type==="warning"?<AlertTriangle size={18}/>:<CheckCircle2 size={18}/>}</div><span>{notice.message}</span><button onClick={dismissNotice} aria-label="Dismiss notification"><X size={16}/></button></div>;
}