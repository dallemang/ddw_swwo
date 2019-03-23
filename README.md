# ddw-react-oauth-start

This project is a quick-start for building a react application that authenticates with
data.world's OAuth service, and stores the data.world API token in the browser's local 
storage to allow making data.world API calls to access resources on behalf of an 
authenticated user. 

This app has no server-side state, and therefore has no secure place to put the OAuth
clientid/secret, or from which to make secure API calls - for this app, or any that 
are derived from it, the clientid/secret will be embedded in the compiled javascript
for the application and visible to anyone who inspects it.  

## Clone this repo

Clone this repo into a new repo locally, called "my-app" (or something more useful)

    > git clone https://github.com/datadotworld/ddw-react-oauth-start.git my-app

## Up and Running

You should be able to start the app in a development environment very quickly:

    > cd my-app
    > yarn install
    > yarn start
    
That should load the app up and start it on http://localhost:3000.  You should be able 
to click on the "Options" menu in the upper right of the screen and select "Log in"
to authenticate with your data.world account.

Once you do that, you should see a link in the center of the screen for "My 
Datasets" - a very simple feature that let's the logged-in user page through their
data.world datasets.  Not particularly useful in itself, but it shows an end-to-end 
flow through an application - login through API call - all you need to do to build
your own application is rip out the "MyDatasets" component and plug in your own.

## OAuth configuration

You'll notice in this repo that there are several environment files - this is where 
the ClientID/Secret needed to support the OAuth handshake to authenticate users.  
`.env.development` contains a pair that will work for any app with a callback
url of `http://localhost:3000/#/callback`, which means you can use that file
for your own local application development on any app based on this starter. 

## Hosting/sharing the applicaiton

If you want to share your application with others, you will need to host it 
somewhere other than `localhost`.  Since this is a completely client-side React app
that is a static web page from the POV of a web server, a good starting place to
host a shared instance of your application is on **Github Pages**.  This app is
pre-configured for deployment to Github pages - the `deploy` task in `package.json`
will do just that.  You will need to update the references to 
`ddw-react-oauth-start` in `package.json` and in `.env.production`, and then 
when you run

    > yarn deploy
    
it will build your React app and push the bundle to the `gh-pages` branch of your
project.  That will serve your application up on a URL under `github.io` - in order
for anyone (including you) to authenticate to the application and use it, you will
need to get a ClientID/Secret and update it into `.env.production` 

You can claim a new ClientID/Secret via [this form](https://docs.google.com/forms/d/e/1FAIpQLScQ8HHi37RfTCUnejCCXa2aVI77X9x5YiYdA8Z3HkjfTQ74Cw/viewform).

You will need to provide a callback URL for your application - if you are hosting 
your app on Github Pages, the default url will be:

    https://<YOUR_GITHUB_ACCOUNT>.github.io/<GITHUB_REPO>/#/callback

For example, the callback URL for this starter app is 
`https://datadotworld.github.io/ddw-react-oauth-start/#/callback`.  If you configure
the gh-pages URL differently, or host the app somewhere else, then the callback
URL will need to be updated accordingly.  Make sure to include the hash (`#`) in the 
URL - that's important to the React router being used within the application.

