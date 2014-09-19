1. Clone down this repo: <code>$ git clone https://github.com/ConnectedMachines/MadProps.git</code>
2. Navigate into the cloned repo: <code>$ cd path/to/MadProps</code>
3. Create an upstream remote by adding the following blog to the repo's git config: <code>$ git config --edit</code>
```
[remote "upstream"]
  url = https://github.com/ConnectedMachines/MadProps.git
  fetch = +refs/heads/*:refs/remotes/upstream/*
```
4. Make sure you have [node.js](http://nodejs.org/download/) installed.
5. Install gulp: <code>$ npm install gulp --global</code>
6. Build dependencies <code>$ npm install</code>
7. Run <code>$ gulp</code> to build, test, and start everything!
