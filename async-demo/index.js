console.log('before');
// promise based approach
// getUser(1)
//     .then(user => displayUser(user))
//     .then(repos => displayRepos(repos[0]))
//     .then(commits => displayCommits(commits))
//     .catch(err => console.log('Error ', err.message));

//async and await operations
async function displayCommitsAsync() {
    try {
        const user = await getUser(1);
        const repos = await getRepositories(user.gitHubUsername);
        const commits = await getCommits(repos[0]);
        console.log(commits);    
    }
    catch(err) {
        console.log(err);
    }
}

displayCommitsAsync();

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
            //reject('couldnt get repos');
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