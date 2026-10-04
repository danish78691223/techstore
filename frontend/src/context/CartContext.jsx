import { createContext,useContext,useEffect,useState } from "react";
const C=createContext();
export function CartProvider({children}){
 const [items,setItems]=useState(()=>JSON.parse(localStorage.getItem("tech_cart")||"[]"));
 const [notice,setNotice]=useState(null);
 useEffect(()=>localStorage.setItem("tech_cart",JSON.stringify(items)),[items]);
 const add=p=>{
   const existing=items.find(i=>i.product===p._id);
   if(existing&&existing.quantity>=p.stock){setNotice({type:"warning",message:`You already have the maximum available stock of ${p.name}.`});return;}
   setItems(a=>{const x=a.find(i=>i.product===p._id);if(x)return a.map(i=>i.product===p._id?{...i,quantity:Math.min(i.quantity+1,p.stock)}:i);return [...a,{product:p._id,name:p.name,price:p.price,image_name:p.image_name,quantity:1}];});
   setNotice({type:"success",message:`${p.name} added to cart.`});
 };
 const dismissNotice=()=>setNotice(null);
 const remove=id=>setItems(a=>a.filter(i=>i.product!==id));
 const update=(id,q)=>setItems(a=>a.map(i=>i.product===id?{...i,quantity:Math.max(1,Number(q)||1)}:i));
 const clear=()=>setItems([]);
 const count=items.reduce((s,i)=>s+i.quantity,0),total=items.reduce((s,i)=>s+i.price*i.quantity,0);
 return <C.Provider value={{items,add,remove,update,clear,count,total,notice,dismissNotice}}>{children}</C.Provider>;
}
export const useCart=()=>useContext(C);