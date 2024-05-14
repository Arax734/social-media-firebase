# Social Media Project

An application written in React in which a user, after logging in, can add posts, display them, give likes and dislikes. The application was written in Typescript using Firebase. Thanks to this technology, the Firestore database and authorization through a Google account were implemented.

Agreeing to cookies allows you to display your liked posts and those with similar titles first, so you can better tailor your content to you.

# Project configuration

In the first step, paste your own data in the firebase.ts file in the firebaseConfig variable. Next, you need to run Google authentication on your Firebase services and create a Firestore database, which will contain the following collections:

**posts:** description (string), publishDate (timeStamp), title (string), userId (string), username (string)

**likes:** postId (string), userId (string)

**dislikes:** postId (string), userId (string)

After this configuration, we can proceed to launch the project using

```
npm start
```

# Screenshots

![Screenshot](https://i.imgur.com/e4yoM7o.png)

![Screenshot](https://i.imgur.com/e2ilRSH.png)
