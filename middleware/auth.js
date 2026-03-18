const jwt = require("jsonwebtoken");

module.exports = function(req,res,next){

  const header = req.headers.authorization;
    console.log("Authorization header:", header); // 👈 ADD THIS

  if(!header){
    return res.status(401).json({message:"No token"});
  }

  const token = header.split(" ")[1];
    console.log("Extracted token:", token); // 👈 ADD THIS
  console.log("Main JWT Secret:", process.env.JWT_SECRET); // 👈 ADD THIS

  try{

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // 👈 ADD THIS

    req.user = decoded;

    next();

  }catch(err){
console.log("JWT ERROR:", err.message); // 👈 VERY IMPORTANT
    res.status(401).json({message:"Invalid token"});

  }

}
