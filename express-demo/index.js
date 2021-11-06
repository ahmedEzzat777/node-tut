const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
];

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {

    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id == req.params.id);

    if(!course) //404
        res.status(404).send('The course is not found');
    else
        res.send(course);
});

app.post('/api/courses', (req, res) => {

    const result = validateCourse(req.body);

    if(result.error)
        //400 bad request
        return res.status(400).send(result.error.details[0].message);


    // if(!req.body.name || req.body.name.length < 3) {
    //     //400 bad request
    //     res.status(400).send('Name is required and should be minimum of 3 characters');
    //     return;
    // }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});


app.put('/api/courses/:id', (req,res) => {
    let course = courses.find(c => c.id == req.params.id); // or c.id === parseInt(req.params.id)

    if(!course) //404
        return res.status(404).send('The course is not found');

    //const result = validateCourse(req.body);
    const {error} = validateCourse(req.body); //object destructuring

    if(error) 
        return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req,res) => {
    let course = courses.find(c => c.id == req.params.id);

    if(!course) //404
        return res.status(404).send('The course is not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

function validateCourse(course) {
    const schema = Joi.object({
        //id: Joi.number().required().min(courses.length),
        name: Joi.string().min(3).required()
    });

    return schema.validate(course);
}

//Port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));