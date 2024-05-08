'use strict';
const url = require("url");

const messageValidation = require('../Validation/messageValidation');
const messageServices = require('../Services/messageService');

const save = async (data) => {
    console.log("data receive from server:",data);

    return new Promise(async (resolve, reject) => {
        try {
            let validate = await messageValidation.save(data.data);
            console.log('validate');
            if (validate.status === 'ERROR') {
                return reject({ status: 400, error: validate.message });
            }
            let response = await messageServices.save(data);
            console.log('response controller:');
            resolve(response);
        } catch (error) {
            reject({ status: 500, error: 'Internal Server Error' });
        }
    });
};

const getData = async (data) => {
    console.log("data/cpntroller-gg--->>>>");
    return new Promise(async (resolve, reject) => {
        try {
            let response = await messageServices.getData(data);
            console.log('response --/controoler--gg-',response);
            resolve(response);
        } catch (error) {
            reject({ status: 500, error: 'Internal Server Error' });
        }
    });
}

const savePhrases = async (req, res) => {
    let details = req.body;
    console.log("details===>>>", details);
    try {
        let validate = await messageValidation.savePhrases(details);
        console.log('validate', validate);
        if (validate.status === 'ERROR') {
            return reject({ status: 400, error: validate.message });
        }
        let response = await messageServices.savePhrases(details);
        console.log('response controller:', response);
        res.status(200).json({ "message": "user created successfully" })
    } catch (error) {
        // console.log({ status: 500, error: 'Internal Server Error' });
        res.status(500).json({ "error": error });
    }
}

const getPhrasesById = async (req, res, next) => {
    let id = req.params.id;
    console.log("user_id",id)
    try {
        let response = await messageServices.getPhrasesById(id);
        // console.log('response --/getPhrasesById--gg-',response );
        res.status(200).json({ "data": response });
    } catch (error) {
        res.status(500).json({ "error": error });
    }
}

/*******************************************************createGallery */
const createGallery = async (req, res) => {
    try {
        const data = req.body;
        
        console.log("createGallery-controller->>>>");
        let validate = await messageValidation.createGallery(data);
        console.log('validate', validate);
        if (validate.status === 'ERROR') {
            return res.status(400).json({ error: validate.message });
        }
        let response = await messageServices.createGallery(data);
        console.log('response controller:', response);
        return res.status(200).json({ data: "image saved successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const readGallery = async (req, res) => {
    let user_id = req.params.id;
    console.log("user_id",user_id);
    console.log("readGallery-controller->>>>",user_id);
    let response = await messageServices.readGallery(user_id);
    console.log('response controller:', response);
    res.status(200).json({ "data": response });
}
const updateGallery = async (req, res) => {
    // let data =req.body;
    // console.log("updateGallery-controller->>>>",data);
    // let response = await messageServices.updateGallery(data);
    // console.log('response controller:', response);
    // res.status(200).json({ "data": "image save successfully" });
    try {
        const data = req.body;
        
        console.log("createGallery-controller->>>>");
        let validate = await messageValidation.updateGallery(data);
        console.log('validate', validate);
        if (validate.status === 'ERROR') {
            return res.status(400).json({ error: validate.message });
        }
        let response = await messageServices.updateGallery(data);
        console.log('response controller:', response);
        return res.status(200).json({ data: "image saved successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteGallery = async (req, res) => {
    let user_id = req.params.id;
    console.log("user_id",user_id);
    console.log("readGallery-controller->>>>",user_id);
    let response = await messageServices.deleteGallery(user_id);
    console.log('response controller:', response);
    res.status(200).json({ "data": response });
}
/*******************************************************/

const multipleImage = async (req, res) => {
    let data = req.body;
    let file = req.files;
    console.log("multipleImage from server:", data, file);
        let validate = await messageValidation.multipleImage(file, data);
        console.log('validate', validate);
        if (validate.status === 'ERROR') {
            return res.status(400).json({ "error": validate.message });
        }
        let response = await messageServices.multipleImage(file, data);
        // console.log('response controller:', response);
        if (!response) {
            return res.status(500).json({ "error": "Invalid" });
        }
        return res.status(200).json({ "data": "created" });
};

module.exports = { save, getData, savePhrases, getPhrasesById, createGallery, readGallery, updateGallery, deleteGallery ,multipleImage};


