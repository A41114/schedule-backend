import  express  from "express";
let configViewEngine = (app)=>{
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");// ejs tương tự blade trong php, cho phép dùng if else, while, for trong file HTML
    app.set("views", "./src/views");
}

module.exports = configViewEngine
