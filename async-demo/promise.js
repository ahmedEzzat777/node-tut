const p =  new Promise((resolve,reject) => {

    //asynchronuse work
    setTimeout(() => {
        //resolve(1);
        reject(new Error('error'))
    }, 2000);
});

p.then(result => {
    console.log('result' + result);
})
.catch(err => {
    console.log('error' + err.message);
})