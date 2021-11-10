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
    const courses = await Course
        .find({author:'Mosh', isPublished: true})
        .limit(10)
        .sort({name:1})
        .select({name:1, tags:1});
        
    console.log(courses);
}