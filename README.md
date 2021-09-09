# FIRST TIME SETUP
## Clone & setup Spartan Protocol DAppV2 project
- Copy repo URL into your Github Desktop or CLI and clone to your local machine
![image](https://user-images.githubusercontent.com/26967164/132610078-44392ce6-35eb-458a-9967-82913504979f.png)
- Install node globally on your pc if you havent already: https://nodejs.org/en/download/
- Install yarn globally on your pc if you havent already: https://yarnpkg.com/
- Install Visual Studio Code (or your preferred editor) to your pc: https://code.visualstudio.com/

## Setup editor / Prettier config
- Now that you have the project ready; let's get your editor setup and using the prettier formatting rules to ensure your code changes are being formatted based on the rules of the project
- Start by opening your project in your editor; ideally do this through GitHub desktop to ensure the project is scoped in the editor:
![image](https://user-images.githubusercontent.com/26967164/132611043-e2e99b9f-2ae1-4e33-b3f5-8244b265168a.png)
- Go to the extensions section:
![image](https://user-images.githubusercontent.com/26967164/132611270-89e9b10a-e75d-4ddd-b0e5-78e12ed1c417.png)
- Install `ESLint` & also `Prettier - Code formatter`
![image](https://user-images.githubusercontent.com/26967164/132611570-76ca2b7c-e2d9-41af-b052-c19cdd063367.png)
- Open any of the project's .js files and right click the code editor and select `Format Document`
![image](https://user-images.githubusercontent.com/26967164/132611698-a1daf1e7-ccdd-4c4b-979a-70e2a931c00b.png)
- Then change to `Prettier` for the formatter selection box:
![image](https://user-images.githubusercontent.com/26967164/132611784-e8a4c38d-7479-4945-91da-c6d63cd1e9fc.png)
- Optional but recommended: change project to auto-format on save.
- To change this setting, use Command + , on Mac or Control + , on Windows to open the settings menu. Then search for Editor: Format on Save and make sure it is checked.
![image](https://user-images.githubusercontent.com/26967164/132611941-5ed1874e-3dfa-43a3-a993-1508f0fe313b.png)

## Install dependencies
- Now that you have project and editor setup and ready; it's time to make sure the project grabs all the external dependencies it needs
- Open the terminal in Visual Studio ( Cntrl + ` )
- Type and run `yarn` in the project directory to get all dependencies loaded into your local project folder
- Your project is now setup and good to go!

# AFTER SETUP
## Running the project locally
- Open the terminal in Visual Studio ( Cntrl + ` )
- Then run 'yarn start' in the project directory and a localhost window will pop up with your local project running live for you to preview as you change the code (magic!?)

- Ready to contribute? Reach out in the community telegram to get connected with an online contributor who will put you through to the contributors channel. In the meantime:
## Select a GitHub issue
- Browse the issues list for an issue you want to work on: https://github.com/spartan-protocol/SpartanProtocol-DAppV2/issues
- Assign it to yourself (reach out if you want advice or permissions)
- Create a new branch with the Github Issue ID in it and some sort of a short descriptor of your choosing. i.e. "Fix-Home-Button-#435"
- Hint: you can create a branch easily in GitHub desktop:
![image](https://user-images.githubusercontent.com/26967164/132612388-97a7ebf2-50fc-4a9a-bade-9316e38182d2.png)
- Go ahead and code!
- Whenever you feel like a chunk/stage is done, feel free to make a commit to to your personal branch with some describing info.
- Hint: This is easy in GitHub Desktop; whenever you save; you will see the changes updated in GitHub Desktop. Just fill out some info in the bottom left of the screen and hit `Commit to *YourBranchName*`
![image](https://user-images.githubusercontent.com/26967164/132612853-86d064fd-c8e8-4c89-93bf-82eae65f2301.png)
- This commits the changes locally; but not for the general public to see; to sync these commits for everyone; select `Push` up the top near your branch name

## Submit PR
- At this point you probably would want to have reached out and ensured you have been added as a contributor to the project on Github to make the permissions easier to navigate. Jump on Telegram and mention something along the lines of: `I have a PR that i want to submit, can someone add me to the contributors channel and add my GitHub username: *username* to the repo`
- If you would like to keep your username undoxxed from your Telegram name (this is good practice!) do the same as the above but dont say your username and it can instead be shared privately via PM with one of the other contributors once they reply to you
- Once you feel your branch has sufficiently covered the Github issue you were working on; feel free to make a `Pull Request` (dont be afraid; you can't accidentally break anything thats live; the other contributors will have to review and decide whether to merge it before that happens)
- Hint: This is easy to do in GitHub Desktop, after you have `Pushed` (see above) you are able to finalize your branch and make a request to merge it with another branch (or main/master). Just select create PR near the top
- This will pop up GitHub in your browser with some info for you to fill out; this is more important than the commits to fill out with any information/nuances that you want to communicate with the rest of the contributors. This info will be used (along with the list of lines of code changed) for the other contributors to decide whether to merge it or not.
- Keep an eye out for reviews/comments from the other contributors on your PR and more importantly *CONGRATS* on becoming a Spartan contributor!

## Contributors
- Any and all skill levels welcome!
- https://t.me/SpartanProtocolOrg

-----------------------------------------------------------------------------------------------------

# BASE PROJECT INFO

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
