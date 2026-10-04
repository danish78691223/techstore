import Review from "../models/Review.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

const validId=id=>mongoose.Types.ObjectId.isValid(id);

export async function listReviews(req,res){
  if(!validId(req.params.productId)) return res.status(400).json({message:"Invalid product id"});
  const reviews=await Review.find({product:req.params.productId}).populate("user","name").sort({createdAt:-1});
  const summary=await Review.aggregate([{ $match:{ product:new mongoose.Types.ObjectId(req.params.productId) } },{ $group:{ _id:null, average:{ $avg:"$rating" }, count:{ $sum:1 } } }]);
  res.json({reviews,average:summary[0]?.average||0,count:summary[0]?.count||0});
}

export async function reviewEligibility(req,res){
  if(!validId(req.params.productId)) return res.status(400).json({message:"Invalid product id"});
  const purchased=await Order.exists({user:req.user._id,"items.product":req.params.productId});
  const existing=await Review.exists({user:req.user._id,product:req.params.productId});
  res.json({purchased:!!purchased,canReview:!!purchased&&!existing,alreadyReviewed:!!existing});
}

export async function createReview(req,res){
  if(!validId(req.params.productId)) return res.status(400).json({message:"Invalid product id"});
  const rating=Math.round(Number(req.body.rating));
  const comment=String(req.body.comment||"").trim();
  if(rating<1||rating>5) return res.status(400).json({message:"Rating must be between 1 and 5"});
  if(comment.length<3) return res.status(400).json({message:"Please write a short review"});
  const purchased=await Order.exists({user:req.user._id,"items.product":req.params.productId});
  if(!purchased) return res.status(403).json({message:"Purchase this product before reviewing it"});
  try{
    const review=await Review.create({product:req.params.productId,user:req.user._id,rating,comment});
    res.status(201).json(await review.populate("user","name"));
  }catch(e){
    if(e?.code===11000) return res.status(409).json({message:"You have already reviewed this product"});
    throw e;
  }
}