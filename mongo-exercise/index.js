const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mongo-exercises')
    .then(() => console.log('connection successfull'))
    .catch((err) => console.log(err));

const schema = mongoose.Schema({
    tags: [String],
    date: {type:Date, default:Date.now},
    name: String,
    author: String,
    isPublished: Boolean,
    price: Number
});

const Course = mongoose.model('Course', schema);

// GetCourses()
//     .then((courses) => console.log(courses))
//     .catch((err) => console.log(err));

// GetCourses2()
//     .then((courses) => console.log(courses))
//     .catch((err) => console.log(err));

GetCourses3()
    .then((courses) => console.log(courses))
    .catch((err) => console.log(err));

async function GetCourses() {
    return await Course.find({
        isPublished:true,
        tags:'backend'
    })
    .sort({
        name:1
    }) //or sort('name') asc sort('-name') desc
    .select({
        name:1,
        author:1
    }); // select('name author');
}

async function GetCourses2() {
    return await Course.find({isPublished:true})
    .or([{tags:'backend'}, {tags:'frontend'}]) // can also use just find({isPublished:true, tags:{$in:['backend','frontend']}})
    .sort({
        price:-1
    }) //or sort('name') asc sort('-name') desc
    .select({
        name:1,
        author:1
    }); // select('name author');
}

async function GetCourses3() {
    return await Course.find({isPublished:true})
    .or([{price: {$gte:15}}, {name: /.*by.*/i}]);
}