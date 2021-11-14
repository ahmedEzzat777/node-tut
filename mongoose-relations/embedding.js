const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors:[authorSchema]
  // author:{
  //   type:authorSchema,
  //   required:true
  // }
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function updateAuthor(courseId) {
  await Course.updateOne({_id:courseId},{
    $unset:{
      'author':''
    }
  });
  // await Course.updateOne({_id:courseId},{
  //   $set:{
  //     'author.name':'john smith'
  //   }
  // });
  // const course = await Course.findById(courseId);
  // course.author.name = 'mosh hamedani';
  // course.save();
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  // const idx = course.authors.findIndex(i => i._id == authorId);
  // course.authors.splice(idx, 1);
  const author = course.authors.id(authorId);
  course.authors.remove(author);
  course.save();

}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

removeAuthor('61917862c36e0503e6b6cd79', '61917862c36e0503e6b6cd78');
//addAuthor('61917862c36e0503e6b6cd79', new Author({name:'max'}));
// createCourse('Node Course', [
//   new Author({ name: 'Mosh' }),
//   new Author({ name: 'John' }),
// ]);
//createCourse('Node Course', new Author({ name: 'Mosh' }));
//updateAuthor('6191739ce7ca97299c9f98f9');
