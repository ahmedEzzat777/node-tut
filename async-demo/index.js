console.log('before');
getUser(1, displayUser);
console.log('After');

function displayUser(user){
    console.log('User', user);
    getRepositories(user.gitHubUsername, displayRepos);
}

function displayRepos(repos) {
    console.log('repos', repos);
    getCommits(repos[0], displayCommits);
}

function displayCommits(commits) {
    console.log('commits', commits);
}

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

function getCommits(repo, callback) {
    setTimeout(() => {
        console.log('getting a list of commits from gh api...');
        callback(['commit1', 'commit2']);
    }, 1000);
}