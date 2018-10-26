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

to get a random emote!
