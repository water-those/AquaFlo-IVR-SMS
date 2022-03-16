# Xylem Challenge IVR Backend

Based off of [Twilio's IVR Example](https://www.twilio.com/docs/tutorials/walkthrough/ivr-phone-tree/node/express).

## Local Development

1. First clone this repository and `cd` into it.

   ```bash
   git clone git@github.com:water-those/ivr.git \
   cd ivr
   ```
1. Install project's dependencies.

   ```bash
   npm install
   ```

1. Make sure the tests succeed.

   ```bash
   npm test
   ```

1. Start the development server.

   ```bash
   npm start
   ```

   Alternatively you might also consider using [nodemon](https://github.com/remy/nodemon) for this. It works just like
   the node command, but automatically restarts your application when you change any source code files.

   ```bash
   npm install -g nodemon \
   nodemon .
   ```

1. Check it out at [http://localhost:3000](http://localhost:3000).
