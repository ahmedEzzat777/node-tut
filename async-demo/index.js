console.log('before');

getUser(1)
    .then(user => displayUser(user))
    .then(repos => displayRepos(repos[0]))
    .then(commits => displayCommits(commits))
    .catch(err => console.log('Error ', err.message));

console.log('After');

function displayUser(user){
    console.log('User', user);
    return getRepositories(user.gitHubUsername, displayRepos);
}

function displayRepos(repos) {
    console.log('repos', repos);
    return getCommits(repos[0], displayCommits);
}

function displayCommits(commits) {
    console.log('commits', commits);
}

function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('reading a user from a database...');
            resolve({id: id, gitHubUsername: 'jack'});
        }, 2000);
    });
}

function getRepositories(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('getting a list of repositories from gh api...');
            resolve(['repo1', 'repo2', 'repo3']);
        }, 2000);
    });
}

function getCommits(repo, callback) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('getting a list of commits from gh api...');
                resolve(['commit1', 'commit2']);
            }, 1000);
        });
}