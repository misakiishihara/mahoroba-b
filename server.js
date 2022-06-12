const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const PORT = 3001;
const mongoose = require("mongoose");

//DB接続
mongoose.connect("mongodb+srv://misakiishihara:619Hoshi@cluster0.bhdyp8l.mongodb.net/mahoroba?retryWrites=true&w=majority"
).then(() => {
    console.log("dbと接続");
}).catch((err) => {
    console.log("error")
});

//middleware
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);






// app.get("/", (req, res) => {
//     res.send("hello express");
// })

// app.get("/users", (req, res) => {
//     res.send("users express");
// })

app.listen(PORT, () => console.log("サーバーが起動しました"));