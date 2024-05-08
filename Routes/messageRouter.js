'use strict';
const express = require('express');

const app = express();
const messageRouter = express.Router();
const messageController = require('../Controller/messageController');

//phrases
messageRouter.post('/save-phrases', messageController.savePhrases);
messageRouter.get('/get-phrases/:id', messageController.getPhrasesById);

// gallery
messageRouter.post('/create-gallery', messageController.createGallery);
messageRouter.get('/read-gallery/:id', messageController.readGallery);
messageRouter.delete('/delete-gallery/:id', messageController.deleteGallery);
messageRouter.put('/update-gallery', messageController.updateGallery);

//multiple image
messageRouter.post('/multiple-image', messageController.multipleImage);

module.exports = messageRouter;
