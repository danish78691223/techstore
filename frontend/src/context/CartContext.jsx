import { createContext,useContext,useEffect,useState } from "react";
import { useAuth } from "./AuthContext";
const C=createContext();

const getCartKey=user=>user?.id ? `tech_cart_${user.id}` : "tech_cart_guest";
const readCart=key=>{try{return JSON.parse(localStorage.getItem(key)||"[]");}catch{return [];}};

export function CartProvider({children}){
 const {user}=useAuth();
 const cartKey=getCartKey(user);
 const [items,setItems]=useState(()=>readCart(getCartKey(null)));
 const [notice,setNotice]=useState(null);

 useEffect(()=>{
   // Remove the old shared cart key so an old browser cart cannot leak into a new account.
   localStorage.removeItem("tech_cart");
   setItems(readCart(cartKey));
 },[cartKey]);

 useEffect(()=>{localStorage.setItem(cartKey,JSON.stringify(items));},[cartKey,items]);

 const add=p=>{
   const existing=items.find(i=>i.product===p._id);
   if(existing&&existing.quantity>=p.stock){setNotice({type:"warning",message:`You already have the maximum available stock of ${p.name}.`});return;}
   setItems(a=>{
     const x=a.find(i=>i.product===p._id);
     if(x)return a.map(i=>i.product===p._id?{...i,quantity:Math.min(i.quantity+1,p.stock)}:i);
     return [...a,{product:p._id,name:p.name,price:Number(p.price),image_name:p.image_name,quantity:1}];
   });
   setNotice({type:"success",message:`${p.name} added to cart.`});
 };
 const dismissNotice=()=>setNotice(null);
 const remove=id=>setItems(a=>a.filter(i=>i.product!==id));
 const update=(id,q)=>setItems(a=>a.map(i=>i.product===id?{...i,quantity:Math.max(1,Number(q)||1)}:i));
 const clear=()=>setItems([]);
 const count=items.reduce((s,i)=>s+i.quantity,0);
 const total=items.reduce((s,i)=>s+Number(i.price)*i.quantity,0);
 return <C.Provider value={{items,add,remove,update,clear,count,total,notice,dismissNotice}}>{children}</C.Provider>;
}
export const useCart=()=>useContext(C);