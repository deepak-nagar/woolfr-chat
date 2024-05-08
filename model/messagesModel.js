
'use strict'
const { connection } = require('../database/mysqlConnection');

const save = async (details) => {
    console.log("Received data from service", details);

    // Convert empty strings to null for numeric fields
    const lat = details.location.lat !== '' ? details.location.lat : null;
    const lng = details.location.long !== '' ? details.location.long : null;

    console.log("location/model");

    const query = `INSERT INTO messages 
        (chatId, msgType, fromUserId, toUserId, message, imgUrl, videoImgUrl, videoUrl, audioUrl, stickerId, stickerImgUrl, area, country, city,lat,lng, removeFromUserId, removeToUserId, seenAt, seenFromUserId, seenToUserId, u_agent, ip_addr, createAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const queryValues = [
        details.chatId,
        details.msgType,
        details.fromUserId,
        details.toUserId,
        details.message,
        details.imgUrl,
        details.videoImgUrl,
        details.videoUrl,
        details.audioUrl,
        details.stickerId,
        details.stickerImgUrl,
        details.area,
        details.country,
        details.city,
        lat,
        lng,
        details.removeFromUserId,
        details.removeToUserId,
        details.seenAt,
        details.seenFromUserId,
        details.seenToUserId,
        details.u_agent,
        details.ip_addr,
        details.createAt
    ];

        return new Promise(await function(resolve,reject){
            connection.query(query,queryValues,function(error,result){    
            if (error) {
                console.error("Error executing query:", error);
                reject("Error executing query");
            } else {
                console.log("Result:", result);
                resolve(result);
            }
        });
    });
};



const getData = async (data) => {
    console.log("getdata/model-==-",data);

    let query = `SELECT * FROM messages 
              WHERE (fromUserId = ${data.sender_id} AND toUserId = ${data.receiver_id})
              OR (fromUserId = ${data.receiver_id} AND toUserId = ${data.sender_id})
              ORDER BY id ASC`;
    console.log("getdata/model-->>2>>>");
    // return new Promise((resolve, reject) => {
    //     connection.query(query, (error, result) => {
    //         if (error) {
    //             console.error("Error executing query:", error);
    //             reject("Error executing query");
    //         } else {
    //             console.log("result-model-0-get--");
    //             resolve(result);
    //         }
    //     });
    // });
    return new Promise(await function(resolve,reject){
        connection.query(query,function(error,result){
            if(error){
                console.error("Error executing query:", error);
                reject (error)
            }else{
                console.log("result-model-0-get--",result);
                resolve (result)
            }
        })
    })
};


const getDataWithRoom = async (data) => {
    console.log("getdata/model-==-");
    let query = `SELECT * FROM messages
              WHERE (fromUserId = ${data.sender_id} AND toUserId = ${data.receiver_id} AND chatId = ${data.msg.chatId})
              OR (fromUserId = ${data.receiver_id} AND toUserId = ${data.sender_id} AND chatId = ${data.msg.chatId})
              ORDER BY id DESC
              LIMIT 1`;
    console.log("getdata/model-->>2>>>");
    // return new Promise((resolve, reject) => {
    //     connection.query(query, (error, result) => {
        return new Promise(await function(resolve,reject){
            connection.query(query,function(error,result){
            if (error) {
                console.error("Error executing query:", error);
                reject("Error executing query");
            } else {
                console.log("result-model-0-get--",result);
                resolve(result);
            }
        });
    });
};

const markMessagesAsSeen = async (data) => {       //update
    console.log("data/mark==");
    let query = `UPDATE messages SET seenAt = '1', seenFromUserId = '1',seenToUserId = '1' WHERE id = ${data} AND seenAt = '0'`;
        return new Promise(await function(resolve,reject){
            connection.query(query,function(error,result){
            if (error) {
                console.error("Error executing query:", error);
                reject("Error executing query");
            } else {
                console.log("result-model-0-get--", result);
                resolve(result);
            }
        });
    });
}

const updateOne = async (data) => {       //update  extra              // room and sender_id and receiver_id
    console.log("data/mark==", data, data[0].fromUserId);
    // let query = `UPDATE messages SET  seenFromUserId = '1'  WHERE id = ${data[0].id} AND seenAt = '0' `;
    let query = `UPDATE messages SET  seenFromUserId = '1'  WHERE id <= ${data[0].id} AND seenAt = '0' AND (fromUserId=${data, data[0].fromUserId} AND toUserId=${data, data[0].toUserId} ) `;

        return new Promise(await function(resolve,reject){
            connection.query(query,function(error,result){
            if (error) {
                console.error("Error executing query:", error);
                reject("Error executing query");
            } else {
                console.log("result-model-0-get--", result);
                resolve(result);
            }
        });
    });
}



const getDataById = async (data) => {
    console.log("getdata/model--");

    let query = `SELECT * FROM messages WHERE (id = ${data});`;
    // let query = `SELECT * FROM messages 
    //           WHERE (fromUserId = ${data.sender_id} AND toUserId = ${data.receiver_id})
    //           OR (fromUserId = ${data.receiver_id} AND toUserId = ${data.sender_id})
    //           ORDER BY id ASC`;
    console.log("getdata/model-->>2>>>");
        return new Promise(await function(resolve,reject){
            connection.query(query,function(error,result){
            if (error) {
                console.error("Error executing query:", error);
                reject("Error executing query");
            } else {
                console.log("result-model-0-get--");
                resolve(result);
            }
        });
    });
};

const deleteImgUrl = async (data) => {
    console.log("deleteImgUrl/model-==-", data);
    let query = `
        DELETE FROM messages
        WHERE chatId = ? AND fromUserId = ? AND toUserId = ? AND imgUrl = ? AND imgUrl < NOW() - INTERVAL 1 MINUTE;
    `;
    console.log("-=-=-=-", data.chatId, data.fromUserId, data.toUserId, data.imgUrl);
    console.log("getdata/model-->>2>>>");                   
    return new Promise((resolve, reject) => {
        connection.query(query, [data.chatId, data.fromUserId, data.toUserId, data.imgUrl], (error, result) => {
            if (error) {
                console.error("Error executing query:", error);
                reject("Error executing query");
            } else {
                console.log("result-deleteImgUrl-0-get--");
                resolve(result);
            }
        });
    });
}


const savePhrases = async(details)=>{
    console.log("details/savephrases=",details);
    let query = `INSERT INTO phrases (user_id,text) VALUE  ('${details.id}','${details.text}')`
        return new Promise(await function(resolve,reject){
            connection.query(query,function(error,result){
            if (error) {
                console.error("Error executing query:", error);
                reject("Error executing query",error);
            } else {
                console.log("result-savePhrases-0-get--");
                resolve(true);
            }
        });
    });
}

const getPhrasesById = async(details)=>{
    console.log("details/savephrases=",details);
    let query = `SELECT * FROM phrases WHERE user_id=${details} `
          return new Promise(await function(resolve,reject){
            connection.query(query,function(error,result){
            if (error) {
                console.error("Error executing query:", error);
                reject("Error executing query",error);
            } else {
                console.log("result-savePhrases-0-get--",result);
                resolve(result);
            }
        });
    });
}

/********************************************* */
const createGallery = async(user_id,imagePath)=>{
   
    let query = `INSERT INTO gallery (user_id, imgUrl) VALUES (${user_id}, '${imagePath}')`;
        return new Promise(await function(resolve,reject){
            connection.query(query,function(error,result){
            if (error) {
                console.error("Error executing query:", error);
                reject("Error executing query",error);
            } else {
                console.log("result-savePhrases-0-get--",result);
                resolve(result);
            }
        });
    });
}


const readGallery = async(user_id)=>{
   
    let query = `SELECT * FROM gallery WHERE user_id=${user_id}`;
          return new Promise(await function(resolve,reject){
            connection.query(query,function(error,result){
            if (error) {
                console.error("Error executing query:", error);
                reject("Error executing query",error);
            } else {
                console.log("result-savePhrases-0-get--",result);
                resolve(result);
            }
        });
    });
}

const deleteGallery = async(user_id)=>{
    console.log("user_id",user_id);
    let query = `DELETE FROM gallery WHERE user_id='${user_id}'`;
        return new Promise(await function(resolve,reject){
            connection.query(query,function(error,result){
            if (error) {
                console.error("Error executing query:", error);
                reject("Error executing query",error);
            } else {
                console.log("result-savePhrases-0-get--",result);
                resolve(result);
            }
        });
    });
}

const updateGallery = async(data)=>{
    // console.log("user_id",data.user_id,data.newImgUrl,data.oldImgUrl);
    let query = `UPDATE gallery SET imgUrl='${data.newImgUrl}' WHERE user_id='${data.user_id}' AND imgUrl='${data.oldImgUrl}'`;
        return new Promise(await function(resolve,reject){
            connection.query(query,function(error,result){
            if (error) {
                console.error("Error executing query:", error);
                reject("Error executing query",error);
            } else {
                console.log("result-savePhrases-0-get--",result);
                resolve(result);
            }
        });
    });
}
// ==============================================================

const multipleImage = async(image,details)=>{
    console.log("image",image,details);
    let query = `INSERT INTO messages(chatId,fromUserId,toUserId,imgUrl,seenAt,seenFromUserId,seenToUserId) VALUES ('${details.chatId}','${details.fromUserId}','${details.toUserId}','${image}','${details.seenAt}','${details.seenFromUserId}','${details.seenToUserId}')`;
    return new Promise(await function(resolve,reject){
        connection.query(query,function(error,result){
        if (error) {
            console.error("Error executing query:", error);
            reject("Error executing query",error);
        } else {
            console.log("result-savePhrases-0-get--",result);
            resolve(result);
        }
    });
});
}

module.exports = { save, getData, markMessagesAsSeen, getDataById, getDataWithRoom, updateOne, deleteImgUrl , savePhrases , getPhrasesById,createGallery,readGallery ,deleteGallery , updateGallery , multipleImage };



