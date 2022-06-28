const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const PORT = 3001;
const mongoose = require("mongoose");
const path = require("path")


//DB接続
mongoose.connect(
    "mongodb+srv://misakiishihara:619Hoshi@mahoroba.xe1pwfi.mongodb.net/mahoroba?retryWrites=true&w=majority"
)
.then(() => {
    console.log("dbと接続");
}).catch((err) => {
    console.log("error")
});

//middleware
app.use("/images/", express.static(path.join(__dirname, "public/images")))
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/upload", uploadRoute);






app.get("/", (req, res) => {
    res.send("hello express");
})

// app.get("/users", (req, res) => {
//     res.send("users express");
// })

app.listen(PORT, () => console.log("サーバーが起動しました"));