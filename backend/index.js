const express=require("express");
const databaseConnection=require("./mongoDB/database");
const app=express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
app.use(cors());
app.use(express.json());
// Import Routes
const userRoutes = require("./routes/user");
const auth = require("./routes/auth");
const middlemanRoutes = require("./routes/middleman");
const Company = require("./routes/company")



app.use("/api/user", userRoutes);
app.use("/api", auth);
app.use("/api/middleman", middlemanRoutes);
app.use("/api/company",Company)
app.listen(3000,()=>{
console.log("server started");
databaseConnection();
})