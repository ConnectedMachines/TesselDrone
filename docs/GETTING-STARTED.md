1. Clone down this repo: <code>$ git clone https://github.com/ConnectedMachines/MadProps.git</code>
2. Navigate into the cloned repo: <code>$ cd path/to/MadProps</code>
3. Create an upstream remote by adding the following blog to the repo's git config: <code>$ git config --edit</code>
```
[remote "upstream"]
  url = https://github.com/ConnectedMachines/MadProps.git
  fetch = +refs/heads/*:refs/remotes/upstream/*
```
4. Make sure you have [node.js](http://nodejs.org/download/) installed.
5. Install Gulp CLI: <code>$ npm install gulp --global</code>
6. Install Tessel CLI: <code>$ npm install tessel --global</code>
6. Get your Coveralls.io token and use it in this command: <code>$ coveralls_token=$'YOUR_TOKEN_IN_HERE'</code> 
7. Set environmental variables for Coveralls: <code>$ echo $'# Coveralls.io Environmental Variables:\nexport COVERALLS_SERVICE_NAME=\'travis-ci\'\nexport COVERALLS_REPO_TOKEN=\''"$coveralls_token"\''' >> ~/.bash_profile</code>
7. Build dependencies <code>$ npm install</code>
8. Run <code>$ gulp</code> to build, test, and start everything!
