import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload,ArrowLeft,PackagePlus,Link as LinkIcon,Image as ImageIcon,X,CheckCircle2 } from "lucide-react";
import api from "../../services/api";

export default function AddProduct(){
 const [form,setForm]=useState({name:"",price:"",stock:"",description:"",features:""});
 const [image,setImage]=useState(null);
 const [imageUrl,setImageUrl]=useState("");
 const [imageMode,setImageMode]=useState("upload");
 const [preview,setPreview]=useState("");
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 const nav=useNavigate();
 const set=(key,value)=>setForm({...form,[key]:value});

 useEffect(()=>{
   if(imageMode==="url"){ setPreview(imageUrl.trim()); return; }
   if(image){ const url=URL.createObjectURL(image); setPreview(url); return ()=>URL.revokeObjectURL(url); }
   setPreview("");
 },[image,imageUrl,imageMode]);

 const submit=async e=>{
   e.preventDefault(); setBusy(true); setError("");
   const fd=new FormData(); Object.entries(form).forEach(([k,v])=>fd.append(k,v));
   if(imageMode==="url"){
     if(!imageUrl.trim()) { setError("Please enter a valid image URL."); setBusy(false); return; }
     fd.append("image_name",imageUrl.trim());
   } else if(image) fd.append("image",image);
   try{ await api.post("/products",fd); nav("/admin/products"); }
   catch(x){ setError(x.response?.data?.message||"Failed to create product"); }
   finally{ setBusy(false); }
 };

 return <div className="edit-page add-product-page">
   <div className="list-head"><div><p className="eyebrow">CATALOG CONTROL</p><h2>Add a product</h2><p className="muted">Create a polished listing with the right image, pricing and stock information.</p></div><button className="ghost-button" onClick={()=>nav("/admin/products")}><ArrowLeft size={16}/>Back to products</button></div>
   <form className="product-form-card premium-form" onSubmit={submit}>
     {error&&<div className="error">{error}</div>}
     <div className="form-section"><div className="form-section-head"><div><span className="step-number">01</span><div><h3>Product information</h3><p>Give shoppers the essentials at a glance.</p></div></div></div>
       <div className="product-form-grid add-grid"><div>
         <label>Product name<input required placeholder="e.g. Pro Wireless Headset" value={form.name} onChange={e=>set("name",e.target.value)}/></label>
         <div className="split-fields"><label>Price <span>INR</span><input required type="number" min="0" placeholder="0" value={form.price} onChange={e=>set("price",e.target.value)}/></label><label>Stock<input required type="number" min="0" placeholder="0" value={form.stock} onChange={e=>set("stock",e.target.value)}/></label></div>
          <label>Product features <span className="field-hint">Separate with commas or new lines</span><textarea className="features-input" placeholder="Wireless connectivity, Low-latency audio, 40-hour battery" value={form.features||""} onChange={e=>set("features",e.target.value)}/></label>
         <label>Description<textarea placeholder="Explain what makes this product worth adding to a setup." value={form.description} onChange={e=>set("description",e.target.value)}/></label>
       </div>
       <div className="image-workspace">
         <div className="form-section-label"><span className="step-number">02</span><div><h3>Product image</h3><p>Upload a file or paste a hosted image URL.</p></div></div>
         <div className="image-mode-tabs"><button type="button" className={imageMode==="upload"?"selected":""} onClick={()=>setImageMode("upload")}><Upload size={15}/>Upload</button><button type="button" className={imageMode==="url"?"selected":""} onClick={()=>setImageMode("url")}><LinkIcon size={15}/>Image URL</button></div>
         <div className={"image-preview-box "+(preview?"has-preview":"")}>{preview?<><img src={preview} alt="Product preview" onError={()=>setPreview("")}/><span className="preview-badge"><CheckCircle2 size={13}/>Preview ready</span></>:<><ImageIcon size={32}/><b>No image selected</b><small>Your image will appear here before publishing.</small></>}</div>
         {imageMode==="upload"?<><label className="upload-button wide-upload"><Upload size={17}/>Choose image<input type="file" accept="image/*" onChange={e=>setImage(e.target.files?.[0]||null)} hidden/></label>{image&&<div className="file-picked"><span>{image.name}</span><button type="button" onClick={()=>setImage(null)}><X size={14}/></button></div>}</>:<label className="url-field"><LinkIcon size={16}/><input type="url" placeholder="https://example.com/product-image.jpg" value={imageUrl} onChange={e=>setImageUrl(e.target.value)}/></label>}
       </div></div>
     </div>
     <div className="publish-row"><div><div className="publish-status"><CheckCircle2 size={15}/>Ready to publish</div><small>Product information can be edited later from Products.</small></div><button className="primary publish-button" disabled={busy}>{busy?"Publishing...":"Publish product"}<PackagePlus size={17}/></button></div>
   </form>
 </div>;
}