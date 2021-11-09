const pa = Promise.resolve({id: 1});

pa.then(res => console.log('result', res));

const pb = Promise.reject(new Error('reason for rejection...'));

pb.catch(error => console.log(error));

// parallel promises

const p1 = new Promise(resolve => {
    setTimeout(() => {
        console.log('async op 1');
        resolve({id: 1});
    }, 2000);
});

const p2 = new Promise(resolve => {
    setTimeout(() => {
        console.log('async op 2');
        resolve(2);
    }, 3000);
});

Promise.all([p1, p2])
    .then(result => console.log(result));

    
Promise.race([p1, p2])
    .then(result => console.log(result));