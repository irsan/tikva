// const StringTemplate = require('string-template');
//
//
// let date = new Date('1492793694.702125');

// console.log(date);

// let botId = "U5603NE5B";
//
// let text = "Hi <@U5603NE5B>. I would like to <@U5603NE5B>";
//
// let re = new RegExp("<@" + botId + ">");
//
// let result = text.find(re);
//
// console.log(re);
// console.log("\n");
// console.log(result);
const crypto = require('crypto');

let body = {
    ref: 'refs/heads/master',
    before: 'b2cb9343e23ab33e88d21844fd18339994ab2c0f',
    after: 'babbe20e85ed8dc963fd1c70d1cd46fe7663523f',
    created: false,
    deleted: false,
    forced: false,
    base_ref: null,
    compare: 'https://github.com/irsan/tikva/compare/b2cb9343e23a...babbe20e85ed',
    commits: [{
        id: 'babbe20e85ed8dc963fd1c70d1cd46fe7663523f',
        tree_id: '6ab0e50802f6bf8d9866bcba225f9fea784c739f',
        distinct: true,
        message: 'test again',
        timestamp: '2017-05-02T11:27:27+08:00',
        url: 'https://github.com/irsan/tikva/commit/babbe20e85ed8dc963fd1c70d1cd46fe7663523f',
        author: [Object],
        committer: [Object],
        added: [],
        removed: [],
        modified: [Object]
    }],
    head_commit: {
        id: 'babbe20e85ed8dc963fd1c70d1cd46fe7663523f',
        tree_id: '6ab0e50802f6bf8d9866bcba225f9fea784c739f',
        distinct: true,
        message: 'test again',
        timestamp: '2017-05-02T11:27:27+08:00',
        url: 'https://github.com/irsan/tikva/commit/babbe20e85ed8dc963fd1c70d1cd46fe7663523f',
        author: {
            name: 'Irsan Jie',
            email: 'irsan@mavenlab.com',
            username: 'irsan'
        },
        committer: {
            name: 'Irsan Jie',
            email: 'irsan@mavenlab.com',
            username: 'irsan'
        },
        added: [],
        removed: [],
        modified: ['util/test.js']
    },
    repository: {
        id: 72723733,
        name: 'tikva',
        full_name: 'irsan/tikva',
        owner: {
            name: 'irsan',
            email: 'irsan@mavenlab.com',
            login: 'irsan',
            id: 312539,
            avatar_url: 'https://avatars1.githubusercontent.com/u/312539?v=3',
            gravatar_id: '',
            url: 'https://api.github.com/users/irsan',
            html_url: 'https://github.com/irsan',
            followers_url: 'https://api.github.com/users/irsan/followers',
            following_url: 'https://api.github.com/users/irsan/following{/other_user}',
            gists_url: 'https://api.github.com/users/irsan/gists{/gist_id}',
            starred_url: 'https://api.github.com/users/irsan/starred{/owner}{/repo}',
            subscriptions_url: 'https://api.github.com/users/irsan/subscriptions',
            organizations_url: 'https://api.github.com/users/irsan/orgs',
            repos_url: 'https://api.github.com/users/irsan/repos',
            events_url: 'https://api.github.com/users/irsan/events{/privacy}',
            received_events_url: 'https://api.github.com/users/irsan/received_events',
            type: 'User',
            site_admin: false
        },
        private: false,
        html_url: 'https://github.com/irsan/tikva',
        description: null,
        fork: false,
        url: 'https://github.com/irsan/tikva',
        forks_url: 'https://api.github.com/repos/irsan/tikva/forks',
        keys_url: 'https://api.github.com/repos/irsan/tikva/keys{/key_id}',
        collaborators_url: 'https://api.github.com/repos/irsan/tikva/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/irsan/tikva/teams',
        hooks_url: 'https://api.github.com/repos/irsan/tikva/hooks',
        issue_events_url: 'https://api.github.com/repos/irsan/tikva/issues/events{/number}',
        events_url: 'https://api.github.com/repos/irsan/tikva/events',
        assignees_url: 'https://api.github.com/repos/irsan/tikva/assignees{/user}',
        branches_url: 'https://api.github.com/repos/irsan/tikva/branches{/branch}',
        tags_url: 'https://api.github.com/repos/irsan/tikva/tags',
        blobs_url: 'https://api.github.com/repos/irsan/tikva/git/blobs{/sha}',
        git_tags_url: 'https://api.github.com/repos/irsan/tikva/git/tags{/sha}',
        git_refs_url: 'https://api.github.com/repos/irsan/tikva/git/refs{/sha}',
        trees_url: 'https://api.github.com/repos/irsan/tikva/git/trees{/sha}',
        statuses_url: 'https://api.github.com/repos/irsan/tikva/statuses/{sha}',
        languages_url: 'https://api.github.com/repos/irsan/tikva/languages',
        stargazers_url: 'https://api.github.com/repos/irsan/tikva/stargazers',
        contributors_url: 'https://api.github.com/repos/irsan/tikva/contributors',
        subscribers_url: 'https://api.github.com/repos/irsan/tikva/subscribers',
        subscription_url: 'https://api.github.com/repos/irsan/tikva/subscription',
        commits_url: 'https://api.github.com/repos/irsan/tikva/commits{/sha}',
        git_commits_url: 'https://api.github.com/repos/irsan/tikva/git/commits{/sha}',
        comments_url: 'https://api.github.com/repos/irsan/tikva/comments{/number}',
        issue_comment_url: 'https://api.github.com/repos/irsan/tikva/issues/comments{/number}',
        contents_url: 'https://api.github.com/repos/irsan/tikva/contents/{+path}',
        compare_url: 'https://api.github.com/repos/irsan/tikva/compare/{base}...{head}',
        merges_url: 'https://api.github.com/repos/irsan/tikva/merges',
        archive_url: 'https://api.github.com/repos/irsan/tikva/{archive_format}{/ref}',
        downloads_url: 'https://api.github.com/repos/irsan/tikva/downloads',
        issues_url: 'https://api.github.com/repos/irsan/tikva/issues{/number}',
        pulls_url: 'https://api.github.com/repos/irsan/tikva/pulls{/number}',
        milestones_url: 'https://api.github.com/repos/irsan/tikva/milestones{/number}',
        notifications_url: 'https://api.github.com/repos/irsan/tikva/notifications{?since,all,participating}',
        labels_url: 'https://api.github.com/repos/irsan/tikva/labels{/name}',
        releases_url: 'https://api.github.com/repos/irsan/tikva/releases{/id}',
        deployments_url: 'https://api.github.com/repos/irsan/tikva/deployments',
        created_at: 1478161460,
        updated_at: '2016-11-03T08:25:08Z',
        pushed_at: 1493695658,
        git_url: 'git://github.com/irsan/tikva.git',
        ssh_url: 'git@github.com:irsan/tikva.git',
        clone_url: 'https://github.com/irsan/tikva.git',
        svn_url: 'https://github.com/irsan/tikva',
        homepage: null,
        size: 151,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'JavaScript',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 0,
        mirror_url: null,
        open_issues_count: 0,
        forks: 0,
        open_issues: 0,
        watchers: 0,
        default_branch: 'master',
        stargazers: 0,
        master_branch: 'master'
    },
    pusher: {name: 'irsan', email: 'irsan@mavenlab.com'},
    sender: {
        login: 'irsan',
        id: 312539,
        avatar_url: 'https://avatars1.githubusercontent.com/u/312539?v=3',
        gravatar_id: '',
        url: 'https://api.github.com/users/irsan',
        html_url: 'https://github.com/irsan',
        followers_url: 'https://api.github.com/users/irsan/followers',
        following_url: 'https://api.github.com/users/irsan/following{/other_user}',
        gists_url: 'https://api.github.com/users/irsan/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/irsan/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/irsan/subscriptions',
        organizations_url: 'https://api.github.com/users/irsan/orgs',
        repos_url: 'https://api.github.com/users/irsan/repos',
        events_url: 'https://api.github.com/users/irsan/events{/privacy}',
        received_events_url: 'https://api.github.com/users/irsan/received_events',
        type: 'User',
        site_admin: false
    }
};

let signature = crypto.createHmac('sha1', 'yucca-orchid-avert-tight-began').update(new Buffer(body, "utf-8")).digest('hex');

console.log("THE  SIGNATURE IS: ", signature);

