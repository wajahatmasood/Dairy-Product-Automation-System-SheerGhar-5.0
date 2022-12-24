module.exports = theFunc => (req, res, next)=>{

    // promose is a js prebuild class 
    // 1st part is try part and the next one is cath part
    Promise.resolve(theFunc(req, res, next)).catch(next);
};
