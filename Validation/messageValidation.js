'use strict';
const joi = require('joi');
const comman = require('../comman');

const save = async (data) => {
    let schema = joi.object({
        chatId: joi.string(),
        msgType: joi.string(),
        fromUserId: joi.string(),
        toUserId: joi.string(),
        message: joi.any().allow(''),
        imgUrl: joi.any().allow('') ,
        videoImgUrl: joi.string(),
        videoUrl: joi.string(),
        audioUrl: joi.string(),
        stickerId: joi.string(),
        stickerImgUrl: joi.string(),
        area: joi.string(),
        country: joi.string(),
        city: joi.string(),
        lat: joi.string(),
        lng: joi.string(),
        createAt: joi.string(),
        removeAt: joi.string(),
        removeFromUserId: joi.string(),
        removeToUserId: joi.string(),
        seenAt: joi.string(),
        seenFromUserId: joi.string(),
        seenToUserId: joi.string(),
        u_agent: joi.string(),
        ip_addr: joi.string()
    })
    let response = await comman.comman(schema, data);
    return response;
}

const savePhrases = async(details)=>{
    let schema = joi.object({
        text: joi.string(),
        id: joi.string()
    })
    let response = await comman.commanPhrases(schema, details);
    return response;

}
/********************************************** */
const createGallery = async(data)=>{
    let schema=joi.object({
        user_id:joi.number().required(),
        image:joi.string().required()
    })
    let response= await comman.commanPhrases(schema, data);
    // if(response.message == '"image" is not allowed' || response.message == null){
    //     schema= joi.object({
    //         image:joi.any().required(),
    //     });
    //     response = await comman.filecomman(schema,image);
    // };   
    return response;
}

const updateGallery = async(data)=>{
    let schema=joi.object({
        user_id:joi.number().required(),
        image:joi.string().required()
    })
    let response= await comman.commanPhrases(schema, data);
    // if(response.message == '"image" is not allowed' || response.message == null){
    //     schema= joi.object({
    //         image:joi.any().required(),
    //     });
    //     response = await comman.filecomman(schema, req.files);
    // };   
    return response;
}



const multipleImage = async(details)=>{
    let schema = joi.object({
        chatId: joi.string(),
        fromUserId: joi.string(),
        toUserId: joi.string(), 
        file:joi.any().allow(),  
        seenAt: joi.string(),
        seenFromUserId: joi.string(),
        seenToUserId: joi.string(),
    })
    let response = await comman.commanPhrases(schema, details);
    return response;
}
module.exports = {save , savePhrases ,createGallery , updateGallery,multipleImage }