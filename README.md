# Welcome

The file src/server.ts just launches a simple Hello World http server.

## Installation:

1. Install [Node.js](https://nodejs.org/en/)
2. Install [Visual Studio Code](https://code.visualstudio.com/) (or any other IDE)
3. Clone this git
4. Run `yarn install` or `npm install` to install the relevant packages
5. Execute `yarn test-server` (needs install of yarn) or `npm run test-server` to see if everything is working
6. Navigate to http://localhost:8080/ to see your local server

## Code quality check

For checking code quality, we recommend you only include the `src` folder. Our test files (located in the `test` folder) should be excluded as well as any third party modules (located in `node_modules`). Furthermore, if there is a `dist` folder present, this folder should also be excluded since this folder contains the compiled JavaScript files.

### Fan-out

Since TypeScript is not strictly an Object-Oriented language, the "Fan-out" metric will be used to assess coupling. However, in our opinion, this metric is flawed, especially in the way Understand calculates the metric. While the metric is supposed to count the amount of external files used by a module, the Understand metric instead (roughly) counts the amount of entities imported. This, in and of itself, already increases the fan-out a lot since we are of course importing several entities from the same file.

Furthermore, Understand does not distinguish between importing classes, types or functions. Since the code is evaulated on the "number of functions of other modules this module calls", classes and especially types (in the case of TypeScript) shouldn't be counted, yet they are in Understand.

Lastly, the entire premise of npm (the Node package manager) is that you can just import a lot of modules so you don't have to reinvent the wheel for every little thing. The fan-out metric goes directly against that by limiting the amount of functions / files a module is allowed to import. This is why we think the fan-out metric is unfair, especially when using TypeScript.
