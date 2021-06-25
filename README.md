# Welcome

The file src/server.ts just launches a simple Hello World http server.

### Installation:

1. Install [Node.js](https://nodejs.org/en/)
2. Install [Visual Studio Code](https://code.visualstudio.com/) (or any other IDE)
3. Clone this git
4. Run `yarn install` or `npm install` to install the relevant packages
5. Execute `yarn test-server` (needs install of yarn) or `npm run test-server` to see if everything is working
6. Navigate to http://localhost:8080/ to see your local server

### Code quality check

For checking code quality, we've included our own tools in the `test/codeQuality` directory, the script for checking code quality can be executed using `yarn check-code` or `npm run check-code`. This script will then go over our source files and output (in the console) statistics about our code complexity and any other issues.

For checking yourself, we recommend you only include the `src` folder. Our test files (located in the `test` folder) should be excluded as well as any third party modules (located in `node_modules`).
