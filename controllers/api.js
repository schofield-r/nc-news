const apiMap = require('../endpoints.json')

exports.getApiMap = (req,res,next)=>{
  res.status(200).send(apiMap)
}