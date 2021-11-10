const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.error('could not connect to mongodb', err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now},
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

getCourses();
    
async function createCourse() {
    const course = new Course({
        name: 'Angular course',
        author: 'Mosh',
        tags: ['angular', 'frontend'],
        isPublished: true
    });
    
    const result = await course.save();
    console.log(result);
}

async function getCourses() {
    //eq ==> equal
    //ne ==> not equal
    //gt ==> greater than
    //gte ==> greater or equal
    //lt ==> less than
    //lte ==> less than or equal
    //in
    //nin => not in
    const courses = await Course
        //.find({author:'Mosh', isPublished: true})
        //.find({price: {$gte: 10, $lte: 20}}) //greater than or eq 10 less than or eq 20
        //.find({price: {$in: [10,15,20]}}) //10 or 15 or 20
        // .find()
        // .or([{author:'Mosh'},{isPublished:true}])
        // .and([])
        //.find({author: /^Mosh/}) //starts with Mosh
        //.find({author:/Hamedani$/i}) //ends with hamedani case insen
        .find({author:/.*Mosh.*/i})
        .limit(10)
        .sort({name:1})
        .select({name:1, tags:1});

    console.log(courses);
}