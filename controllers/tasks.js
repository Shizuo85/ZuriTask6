const Task = require("../models/task")
const getAllTasks =  async (req, res) => {
    try{
        let query = Task.find({})
        if (req.query.sort){
            const sortBy = req.query.sort.replace(",", " ")
            query = query.sort(sortBy)
          }
          else{
            query = query.sort("-timeStamp")
          }
    
          if(req.query.fields){
            const fields = req.query.fields.replace(",", " ")
            query = query.select(fields)
          }
          else{
            query = query.select("-__v")
          }
    
          const page = Number(req.query.page) || 1;
          const limit = Number(req.query.limit) || 10;
          const skip = (page - 1) * limit;
    
          query = query.skip(skip).limit(limit);
    
          if(req.query.page){
            const numTours = await Tour.countDocuments()
            if(skip>=numTours){
              throw new Error("This page does not exist")
            }
          }
        
        const tasks = await query
        res.status(200).json({tasks})
    } catch(error){
        res.status(500).json({msg : error})
    }
}

const createTask =  async (req, res) => {
    try{
        const task = await Task.create(req.body)
        res.status(201).json({task})
    }catch(error){
        res.status(500).json({msg: error})
    }
}

const getTask =  async (req, res) => {
    try{
        const singleTask = await Task.findOne({_id : req.params.id})

        if(!singleTask){
            return res.status(400).json({msg: `no task with id : ${req.params.id}`})
        }
        res.status(200).json({singleTask})
    } catch(error){
        res.status(500).json({msg : error})
    }
}

const updateTask =  async (req, res) => {
    try{
       const updateTask = await Task.findOneAndUpdate({_id : req.params.id}, req.body, {
           new:true,
           runValidators : true
       })
       if (!updateTask){
           return res.status(404).json({msg: `no task with id : ${req.params.id}`})
       }
       res.status(200).json(updateTask)
    } catch(error){
        res.status(500).json({msg : error})
    }
}

const deleteTask =  async (req, res) => {
    try{
        const deleteTask = await Task.findOneAndDelete({_id : req.params.id})

        if(!deleteTask){
            return res.status(404).json({msg: `no task with id : ${req.params.id}`})
        }
        res.status(200).json({deleteTask})
    } catch(error){
        res.status(500).json({msg : error})
    }
}
module.exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
}