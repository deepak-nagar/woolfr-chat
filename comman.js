
const comman = async (schema, data) => {
    let response = {
        status: null,
        message: null
    }
    let validate = schema.validate(data);
    // if (validate && validate.error && validate.error.details) {
    //     response.status = "ERROR";
    //     response.message = validate.error.details[0].message
    // }
    return response;
}


const commanPhrases = async (schema, details) => {
    let response = {
        status: null,
        message: null
    }
    let validate = schema.validate(details);
    if (validate && validate.error && validate.error.details) {
        response.status = "ERROR";
        response.message = validate.error.details[0].message
    }
    return response;
}


// const filecomman = async(schema,image)=>{
//     let response = {
//         status: null,
//         message: null
//     }
//     let validate = schema.validate(image);
//     if (validate && validate.error && validate.error.details) {
//         response.status = "ERROR";
//         response.message = "please select file";
//     }
//     return response;
// }

module.exports = { comman , commanPhrases  }