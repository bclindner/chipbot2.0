# chipbot2

**chipbot2** is a Discord port of the original IRC-based [chipbot](https://github.com/arcticmetal/chipbot), written in Node.js.

At current, it only maintains the old bot's most popular features.

## Features

### Karma

chipbot2 allows to upvote and downvote subjects.

To check the karma of an existing subject:

```
subject~~
```

To upvote or downvote a subject, respectively:

```
subject++
subject--
```

You can also check the top and bottom subjects using:

```
.top [1-10]
.bottom [1-10]
```

If no number is specified for these commands, it automatically gets the top 5.

You can only get up to 10 top and bottom subjects, to prevent the bot from textwalling.

### Emotes

chipbot2 allows you to get a random Kaomoji, courtesy of President Hoodie himself! Simply type:

```
.emote
```

to get a random emote! If you remember what the emote's ID is, you can also get it by that too. For instance, `.emote 1` returns "\m|♡|m/"!

### Quotes

chipbot2 can also keep a list of quotes! You can get a random quote by typing:

```
.quote
```

You can also get a quote by its ID number, just like emotes:

```
.quote 100
```

You can even add your own quotes with `.addquote`!

```
.addquote <Brian Lindner> hey, is this thing on? <Hoodie> Nah.
```

### Installation

chipbot2 is a JavaScript app, which requires [Node.js](https://nodejs.org).

Once you have that installed, clone this repository, and run this command inside its folder to install the bot's dependencies:

```
npm install
```

Then, go ahead and make a file in the `config/` folder named `bot.json`, and place your Discord bot token in it like so:

```json
{
  "token": "<your Discord bot token here>"
}

```

After that, a simple `node index.js` or `npm start` will start the bot right up! You might want to use a program like [Nodemon](https://github.com/remy/nodemon/) or [PM2](https://github.com/Unitech/pm2) to keep the bot up in case it crashes.
