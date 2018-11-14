Description:

The gh-parser is a CLI tool that get commenters statistics for a given Github repository.

Github has [neat statistics](https://github.com/facebook/react/graphs/contributors) for contributors, it shows number of commits and nice charts. But people contribute to Github projects not only via commits. Actually, a lot of contributions happens in issue or pull request comments. Github doesn't have statistics to show "top commenters".

3 types of comments are accessed using the following API endpoints:

- [Get Commit Comments](https://developer.github.com/v3/repos/comments/#list-commit-comments-for-a-repository)
- [Get Issues Comments](https://developer.github.com/v3/issues/comments/#list-comments-in-a-repository)
- [Get Pull Requests Comments](https://developer.github.com/v3/pulls/comments/#list-comments-in-a-repository)

The total number of commits is obteined through the next endpoint:

- [Get Statistics Per Collaborator](https://developer.github.com/v3/repos/statistics/#get-contributors-list-with-additions-deletions-and-commit-counts)

Requirements:

In order to use this tool you will need to have the personal access token to Github API. You can get one passing to the link:

[Create personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/), save it, and then use it to access API to get 5000 requests/hour.

Installation:

First you need to have the node.js v.8.9 or higher installed on your machine then:

1. Clone or download the repository.
2. Get into the root directory: $cd gh-parser.
3. Run npm install
4. Then from command-line:

$node index.js --repo <some repo (e.g. nodejs/node)> --period 20d

Please provide `--repo` and `--period` parameters. The `--repo` parameter is required, the `--period` parameter is optional and if not provided the data is going to be fetched for all period the repo exists.
