![dbio-logo](./readme-assets/logo.png)
# dBio Client

The dBio Client is the user facing interface of the dBio system. All users (both patients and third party providers) must initially sign up for dBio through the client.

## Tools and Third Party SDKs

At the time of this writing Node.js version 16.14.0 was used for development. However, this should be backwards compatible with node versions 14 and 12.

The dBio Client utilizes the following tools:
- **[Trunk](https://trunk.io/)** - Used for linting. See the _trunk.yaml_ file that handles versioning of linters.

The dBio uses the following third party SDKs:
- **[Torus CustomAuth SDK](https://docs.tor.us/customauth/get-started)** - used to create an ethereum address and generate a private/public key pair for the user.
- **[Auth0 React SDK](https://auth0.com/docs/libraries/auth0-react)** - used for authentication. Generates a JWT that is used to retrieve a user's Torus key and to initialize the IronCore SDK.
- **[IronWeb Data Control Platform SDK](https://ironcorelabs.com/docs/data-control-platform/javascript/react/)** - [IronCore's](https://ironcorelabs.com/) SDK that is implemented for proxy re-encryption.

## Future Development and Configuration

#### **A Note to Developers**
The React state management architecture on this application is primarily handled with [Redux Toolkit](https://redux-toolkit.js.org/). For components styling [MUI](https://mui.com/) with [Emotion](https://emotion.sh/docs/introduction) as a styling engine.

#### **Configuration**

Configuration constants can be found in the **_.env_** file.

For future developers, if you wish to build on this client or run it you will need to do a few things.

1. Create your own [Auth0](https://auth0.com/) application. Once this Auth0 application is created you will need you plug in your own Auth0 application domain and client id into the *REACT_APP_AUTH0_DOMAIN* and *REACT_APP_AUTH0_CLIENT_ID* variables in the *.env* file.
2. Note that you need to make sure you verifier on your Auth0 application is configured as google.
3. The *REACT_APP_BACKEND_ENDPOINT* in *.env* is the URL address for the dBio protocol server.
4. The *REACT_APP_TORUS_VERIFIER* in *.env* will need to be obtained from [Torus](tor.us). You will need to setup a [Torus](tor.us) verifier. Register with Torus and under their "Custom Auth" tab in the dashboard you can create your own verifier. In the below image you can see a verifier was created that uses a JWT login, has a verifier-id (This is used in .env), my Auth0 client ID and finally the Auth0 domain.
5. The *REACT_APP_INFURA_ENDPOINT* should be the endpoint for your [Infura](https://infura.io/) project. The Infura API provides instant access over HTTPS and WebSockets to the Ethereum network.
6. The *REACT_APP_SMART_CONTRACT_ADDRESS* is the address of the smart contract used for minting patient resources as NFTs and transfering them to the patient. 

![torus-example](./readme-assets/torus.png)

## Running Locally

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
