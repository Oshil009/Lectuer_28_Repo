const express = require("express")
const morgan = require("morgan")
const app = express();
const PORT = 5000;
app.use(express.json())
app.use(morgan("combined"))
const products = [
    { "id": 1, "name": "Laptop", "price": 800 },
    { "id": 2, "name": "Phone", "price": 500 }
];
const Logger = (req, res, next) => {
    const httpMethod = req.method;
    const url = req.url;
    const now = new Date();
    const timeAndDate = now.toLocaleTimeString();
    console.log(`The httpMethod is:${httpMethod} && the Url is:${url} && time is:${timeAndDate}`);
    next()
}
app.use(Logger)
const checkName = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        const err = new Error("Name are required");
        err.status = 400;
        err.success = false;
        next(err);
    }
    next()
}
const checkPrice = (req, res, next) => {
    const { price } = req.body;
    if (price === 0) {
        const err = new Error("price must be greater than 0");
        err.status = 400;
        err.success = false;
        next(err);
    }
    if (typeof price !== "number") {
        const err = new Error("Price must be a number");
        err.status = 400;
        err.success = false;
        next(err);
    }
    if (!price) {
        const err = new Error("Price are required");
        err.status = 400;
        err.success = false;
        next(err);
    }
    next()
}
app.get("/products", (req, res) => {
    res.status(200).json(products)
})
app.post("/products", checkName, checkPrice, (req, res, next) => {
    const newProduct = req.body;
    const {id}=newProduct;
        const sameId = products.find((elem) => {
        return elem.id === +id;
    })
    if(!sameId){
        products.push(newProduct);
    if (newProduct) {
        res.status(200).json({ success: true, message: "data is added ", data: newProduct })
    }
    else {
        const err = new Error("no data found")
        err.status = 404;
        err.success = false;
        next(err)
    }
    }else{
        const err = new Error("The ID already exists ")
        err.status = 404;
        err.success = false;
        next(err)
    }
    
    
})
app.get("/products/:id", (req, res, next) => {
    const { id } = req.params;
    const foundProduct = products.find((elem) => {
        return elem.id === +id;
    })
    if (foundProduct) {
        res.status(200).json({ success: true, message: "Product found", data: foundProduct })
    } else {
        const err = new Error("Product not found");
        err.status = 404;
        err.success = false;
        next(err);
    }
})






app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status).json({ success: err.success, message: err.message })
})
app.listen(PORT, () => {
    console.log(`server run on http://localhost:${PORT}`)
})