import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export async function dashboard(req,res){
  const [totalProducts,totalOrders,totalUsers,rev,lowStock]=await Promise.all([
    Product.countDocuments(), Order.countDocuments(), User.countDocuments(),
    Order.aggregate([{ $group:{ _id:null, total:{ $sum:"$total_price" } } }]),
    Product.countDocuments({ stock:{ $lte:5 } })
  ]);
  res.json({totalProducts,totalOrders,totalUsers,revenue:rev[0]?.total||0,lowStock});
}

export async function analytics(req,res){
  const [summary,ordersByStatus,monthlyRevenue,topProducts,lowStock]=await Promise.all([
    Order.aggregate([{ $group:{ _id:null, revenue:{ $sum:"$total_price" }, orders:{ $sum:1 } } }]),
    Order.aggregate([{ $group:{ _id:"$status", count:{ $sum:1 } } },{ $project:{ _id:0,status:"$_id",count:1 } }]),
    Order.aggregate([{ $group:{ _id:{ year:{ $year:"$createdAt" }, month:{ $month:"$createdAt" } }, revenue:{ $sum:"$total_price" } } },{ $sort:{ "_id.year":1, "_id.month":1 } }]),
    Order.aggregate([{ $unwind:"$items" },{ $group:{ _id:"$items.product", name:{ $first:"$items.name" }, units:{ $sum:"$items.quantity" }, revenue:{ $sum:{ $multiply:["$items.price","$items.quantity"] } } } },{ $sort:{ units:-1 } },{ $limit:5 },{ $project:{ _id:0,name:1,units:1,revenue:1 } }]),
    Product.find({stock:{ $lte:5 }}).select("name stock price").sort({stock:1}).limit(8)
  ]);
  res.json({
    totalProducts:await Product.countDocuments(),
    totalOrders:summary[0]?.orders||0,
    totalUsers:await User.countDocuments(),
    revenue:summary[0]?.revenue||0,
    ordersByStatus,
    monthlyRevenue,
    topProducts,
    lowStock
  });
}