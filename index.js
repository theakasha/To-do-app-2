const express = require('express');

const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");
const app = express();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));//Urlencoded will allow us to extract the data from the form by adding her to the body property of the request.
app.set("view engine", "ejs");
const dotenv = (require("dotenv"));
dotenv.config();

//connection to db
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true ,useUnifiedTopology: true}, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
});

app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});
app.route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});    