const basicInfo = require('./basicinfo');
const userSwagger = require('./users');
const postSwagger = require('./posts');
const commentSwagger = require('./comments');


module.exports = {

  ...basicInfo,
  paths: {
    ...userSwagger,
    ...postSwagger,
    ...commentSwagger,
  },
};