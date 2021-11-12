const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.error('could not connect to mongodb', err));

const courseSchema = new mongoose.Schema({
    //name: String,
    name: {
        type: String,
        required:true,
        minlength:3,
        maxlength:255,
        //match:/pat/
        },
    category:{
        type: String,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        trim: true
    },
    author: String,
    tags: {
        type:[String],
        validate:{
            validator: async function(v) {
                return await validateTags(v);
            },
            message:'a course should have atleast one tag'
        }
    },
    date: { type: Date, default: Date.now},
    isPublished: Boolean,
    price:{
        type: Number,
        min:10,
        max:200, //also for dates
        required: function() { //cannot use arrow function here, this will not refer to current model
            return this.isPublished;
        },
        get: v => Math.round(v),
        set: v => Math.round(v),
    }
});

function validateTags(v) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(v && v.length > 0);
        }, 2000);
    });
}

const Course = mongoose.model('Course', courseSchema);

createCourse();
//getCourses();
//UpdateCourse('618e5de6a5f46521f14a15da');
//UpdateCourse_UpdateFirst('618e5de6a5f46521f14a15da');
//UpdateCourse_UpdateFirst2('618e5de6a5f46521f14a15da');
    
async function createCourse() {
    const course = new Course({
        name: 'Angular Course',
        author: 'Mosh',
        category: 'Web',
        tags: ['angular', 'frontend'],
        isPublished: true,
        price: 10.696262
    });
    try{
        //await course.validate(); //throws an exception if there's an error
        const result = await course.save();
        console.log(result);
    } catch (ex){
        for(field in ex.errors)
            console.error(ex.errors[field].message);
    }
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
    const pageNumber = 2;
    const pageSize = 10;
    // /api/courses?pageNumber=2&pageSize=10
    const courses = await Course
        .find({author:'Mosh', isPublished: true})
        //.find({price: {$gte: 10, $lte: 20}}) //greater than or eq 10 less than or eq 20
        //.find({price: {$in: [10,15,20]}}) //10 or 15 or 20
        // .find()
        // .or([{author:'Mosh'},{isPublished:true}])
        // .and([])
        //.find({author: /^Mosh/}) //starts with Mosh
        //.find({author:/Hamedani$/i}) //ends with hamedani case insen
        //.find({author:/.*Mosh.*/i})
        .skip((pageNumber - 1)*pageSize)
        .limit(pageSize) //pagination
        .sort({name:1})
        .select({name:1, tags:1});

    console.log(courses);
}

async function UpdateCourse(id) {
    const course = await Course.findById(id);
    if(!course) return;

    // course.isPublished = true;
    // course.author = 'Another author';

    course.set({
        isPublished:true,
        author:'Another author'
    });

    const result = await course.save();
    console.log(course);
}

async function UpdateCourse_UpdateFirst(id) {
    const res = await Course.update({_id:id}, {
        $set:{
            isPublished:true,
            name:'new author'
        }
    });

    console.log(res);
}

async function UpdateCourse_UpdateFirst2(id) {
    const res = await Course.findByIdAndUpdate(id, {
        $set:{
            isPublished:true,
            name:'jason'
        }
    },
    {new: true});

    console.log(res);
}

async function removeCourse(id) {
    // const result = await Course.deleteOne({_id: id});
    // const result = await Course.deleteMany( {name: /.*Mosh.*/ });
    const course = await Course.findByIdAndDelete(id);
}