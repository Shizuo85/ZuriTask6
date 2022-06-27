const connectDB = require("./DB/connect")
const express = require("express")
const app = express()
const tasks = require("./routes/tasks")
require("dotenv").config()

const notFoundMiddleware = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

app.use(express.json())

app.get('/', (req, res) => {
	res.send("<h1>Todo List</h1><a href='/api/v1/tasks'>Tasks</a>");
});

app.use("/api/v1/tasks", tasks)

app.use(notFoundMiddleware);
app.use(errorHandler);

const port = process.env.PORT || 3000

const start = async () =>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, ()=>{
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (error){
        console.log(error)
    }
}

start()
