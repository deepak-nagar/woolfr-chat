'use strict';
// ===========================  final end correct code 1/2/24 =================================================================== -->

//final 7 /2/24

const fs = require("fs");
const express = require('express');
const multer = require("multer");
const path = require("path");
const messagesModel = require('../model/messagesModel');
const { log } = require("console");

const save = async (data) => {
    try {
        console.log("data receive from controller", data);
       

        let details = {
            chatId: data.data.msg.chatId || 5,
            msgType: data.data.msgType || 0,
            fromUserId: data.data.sender_id,
            toUserId: data.data.receiver_id,
            message: data.data.msg.message,
            imgUrl: data.imgUrl,
            videoImgUrl: data.data.msg.videoImgUrl || null,
            videoUrl: data.data.msg.videoUrl || null,
            audioUrl: data.data.msg.audioUrl || null,
            stickerId: data.data.msg.stickerId || 0,
            stickerImgUrl: data.data.msg.stickerImgUrl || null,
            area: data.data.area || '',
            country: data.data.country || '',
            city: data.data.city || '',
            // lat: data.data.lat || null,
            // lng: data.data.lng || null,
            createAt: data.data.msg.timestamp ||  111111111 ,
            removeAt: data.data.msg.removeAt || '',
            removeFromUserId: data.data.msg.removeFromUserId || '',
            removeToUserId: data.data.msg.removeToUserId || 0,
            seenAt: data.data.seenAt || 0,
            seenFromUserId: data.data.seenFromUserId || '0',
            seenToUserId: data.data.seenToUserId || '0',
            u_agent: data.data.u_agent || '',
            ip_addr: data.data.ip_addr || '',
            location: {
                lat: data.data.msg.location.lat || null,
                long: data.data.msg.location.long || null
            }
        };

        console.log("load---service---->", details);
        let response = await messagesModel.save(details);
        console.log("resp-service---->", response);
        /** */
        if (data.expiryImage == 1) {
            const imageUrlPath = details.imgUrl;
            setTimeout(async () => {
                try {
                    await messagesModel.deleteImgUrl(details);
                    console.log(`Image deleted successfully.`);
                } catch (error) {
                    console.error(`Error deleting image :`, error);
                }
            }, 60000);
        }
        /** */
        return response;
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file');
    }
};

const getData = async (data) => {
    console.log("getdata/service-gg--");
    let response = await messagesModel.getData(data);
    console.log("response---gg--",response);
    return response;
}

const savePhrases = async (details) => {
    let data = {
        text: details.text,
        id: details.id
    };
    console.log("data---->", data);
    let response = await messagesModel.savePhrases(data);
    console.log("resp-service---->", response);
    return response;
}

const getPhrasesById = async (data) => {
    // console.log("getdata/service-gg--");
    let response = await messagesModel.getPhrasesById(data);
    // console.log("response---gg--");
    return response;
}

/********************************************** */
const createGallery = async (details) => {
    console.log("createGalleryservices-->>>>");
    let data = {
        user_id: details.user_id,
        image: details.image
    };
    const fs = require("fs").promises;
    var timestamp = new Date().getTime();
    // var imgName = timestamp + "-" + data.msg.name ;
    const filePath = __dirname + "/../photo/" + timestamp + ".jpg";
    let base64Data;
    if (data.image.includes('data:image/jpeg;base64,')) {
        log("data.image",data.image);
        base64Data = data.image.split(';base64,').pop().tostring()
    } else {
        base64Data = data.image;
    }

    // var bs64 = base64.encode(isUtf8.encode());
    // Uint8List decodedImage = base64.decode(bs64);
    // Image.memory(decodedImage)
     
    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(filePath, buffer);
    let response = await messagesModel.createGallery(data.user_id, filePath);
    return response;
}

const readGallery = async (user_id) => {
    console.log("readGallery services-->>>>");
    let response = await messagesModel.readGallery(user_id);
    console.log("response", response);
    return response;
}

// const deleteGallery = async (user_id) => {
//     console.log("deleteGallery services-->>>>")
//     let getData = await messagesModel.readGallery(user_id)
//     console.log("getData",getData);
//     let path =getData[0].imgUrl;
//     console.log("path",path);
//     await fs.unlink(path);
//     // let response = await messagesModel.deleteGallery(user_id);
//     // console.log("response", response);

//     return response;
// }


const util = require('util');
const { isUtf8 } = require("buffer");
const unlinkAsync = util.promisify(fs.unlink);

const deleteGallery = async (user_id) => {
    console.log("deleteGallery services-->>>>");
    try {
        let getData = await messagesModel.readGallery(user_id);
        console.log("getData", getData);
        if (getData && getData.length > 0) {
            let path = getData[0].imgUrl;
            console.log("path", path);
            await unlinkAsync(path);
            let response = await messagesModel.deleteGallery(user_id);
            console.log("response", response);
            return response;
        } else {
            console.log("No data found for user_id:", user_id);
            return null;
        }
    } catch (error) {
        console.error("Error in deleteGallery:", error);
        throw error;
    }
};

const updateGallery = async (details) => {
    console.log("updateGallery services-->>>>");
    // let response = await messagesModel.updateGallery(data);
    // console.log("response", response);
    // return response;
    let data = {
        user_id: details.user_id,
        image: details.image
    };
    let getData = await messagesModel.readGallery(data.user_id);
    let path;
    if (getData && getData.length > 0) {
        path = getData[0].imgUrl;
        // console.log("Deleting old image:", path);
        await unlinkAsync(path);
    } else {
        console.log("No data found for user_id:", data.user_id);
    }
    // console.log("oldpath",path);
    const fs = require('fs').promises;
    var timestamp = new Date().getTime();
    const filePath = __dirname + "/../photo/" + timestamp + ".jpg";
    let base64Data;
    if (data.image.includes('data:image/jpeg;base64,')) {
        base64Data = data.image.split(';base64,').pop();
    } else {
        base64Data = data.image;
    }
    const buffer = Buffer.from(base64Data, 'base64');
    // console.log("buffer/filepath",filePath,buffer);
    await fs.writeFile(filePath, buffer, "binary");

    let updateData = {
        user_id: data.user_id,
        oldImgUrl: path,
        newImgUrl: filePath
    }

    let response = await messagesModel.updateGallery(updateData);
    // console.log("updateGallery response", response);
    return response;
}

/**********************************************/

const multipleImage = async (file, data) => {
    console.log("data", data, file.file.length);
    let response = false;  

    if (file && file.file && file.file.name) {
        console.log("one", file.file.name);
        await messagesModel.multipleImage(file.file.name, data);
        response = true;
    } else {
        if (file.file.length > 0 && file.file.length <= 6) {
            for (let i = 0; i < file.file.length; i++) {
                console.log("two", file.file[i].name);
               await messagesModel.multipleImage(file.file[i].name, data);
                response = true; 
            }
        }
    }
    console.log("response", response);
    return response;
}

//  {[{name:'Screenshot (30).png',imgUrl:'http://localhsot sdhfsdhf'},{name:'Screenshot (30).png',imgUrl:'http://localhsot sdhfsdhf'}]}
module.exports = { save, getData, savePhrases, getPhrasesById, createGallery, readGallery, updateGallery, deleteGallery, multipleImage };
