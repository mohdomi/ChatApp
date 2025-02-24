const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { app , server } = require("./lib/socket.js");
const authRoutes = require("./routes/auth.route.js");
const messageRoutes = require("./routes/message.route.js");

const {connectDB} = require("./lib/db.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const path = require("path");

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
))
const PORT = process.env.PORT;

const __dirname = path.resolve();


app.use(express.json());
app.use(cookieParser())


app.use("/api/auth" , authRoutes);
app.use("/api/messages" , messageRoutes);

if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname , "../frontend/dist")));

    app.get("*" , (req,res)=>{
        res.sendFile(path.join(__dirname , "../frontend" , "dist" , "index.html"));
    })
}


server.listen(PORT , ()=>{
    console.log("Server is running on PORT : " + PORT);
    connectDB();
})
          