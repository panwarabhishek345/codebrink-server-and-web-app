"use strict";
class MediaObject {

    constructor(objectType, content, height, isFullScreenEnabled, codeCpp, codeJava) {
        this.objectType = objectType;

        if (content.length != 0)
            this.content = content;

        if (height.length == 0)
            this.height = -1;
        else
            this.height = height;

        this.isFullScreenEnabled = isFullScreenEnabled;

        if (codeCpp.length != 0)
            this.codeCpp = codeCpp;

        if (codeJava.length != 0)
            this.codeJava = codeJava;
    }
}

class ArticleObject {

    constructor(title, body, mediaObjects, topic, subtopic, tags, videoURL, articleImage, author,type) {
        this.title = title;
        this.body = body;
        this.mediaObjects = mediaObjects;
        this.topic = topic;
        this.tags = tags;
        this.subtopic = subtopic;
        if (articleImage && articleImage.length > 0)
            this.articleImage = articleImage;
        if (videoURL && videoURL.length > 0)
            this.videoURL = videoURL;
        this.author = { "_id": author };
        this.type = type;
    }
}
