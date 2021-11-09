console.log('before');
getUser(1, user => {
    console.log('User', user);
    getRepositories(user.gitHubUsername, repos => console.log('repos', repos));
});
console.log('After');

function getUser(id, callback) {

    setTimeout(() => {
        console.log('reading a user from a database...');
        callback({id: id, gitHubUsername: 'jack'});
    }, 2000);
}

function getRepositories(username, callback) {
    setTimeout(() => {
        console.log('getting a list of repositories from gh api...');
        callback(['repo1', 'repo2', 'repo3']);
    }, 2000);
}