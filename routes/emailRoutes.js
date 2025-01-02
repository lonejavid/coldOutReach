// routes/emailRoutes.js
const express = require('express');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const { registerMail, getRegisteredEmails,removeEmail,oauth2callback,saveToken} = require('../controllers/emailController');
const customEmailController=require('../controllers/customEmail')
const sendMails=require('../controllers/sendMails');
const datacenter=require('../controllers/datacenter')
const {savedata,getUserData,storedData}=require('../controllers/savedata')
const userauthentication=require('../Middleware/Auth');
const AiChat = require('../controllers/AiChat');
//const getProfile=require('../controllers/getProfile')
const getCompanyDetiles=require('../controllers/getCompanyDetiles');
const removeCompany=require('../controllers/removeCompany');
// Route to register an email
const {launchEmailcompaign,emailPreview,getProgress}=require('../controllers/launchEmailcompaign');
const companydetails=require('../controllers/companydetails');

router.get('/registerMail', userauthentication.authenticate,registerMail);
router.get('/oauth2callback',oauth2callback)
// Route to get all registered emails for a user
router.get('/registeredEmails',userauthentication.authenticate, getRegisteredEmails);
router.post('/saveToken',userauthentication.authenticate,saveToken)

router.delete('/removeEmail', userauthentication.authenticate, removeEmail);

router.post("/AiChat", userauthentication.authenticate, AiChat);
router.post("/sendMailCustom", userauthentication.authenticate, upload.single('file'), customEmailController);
//router.get('/getProfile',userauthentication.authenticate,getProfile);
router.post("/companydetails", userauthentication.authenticate, companydetails);
router.get('/getCompanyDetiles',userauthentication.authenticate,getCompanyDetiles);

router.post('/launchEmailcompaign',upload.single('file'),userauthentication.authenticate,launchEmailcompaign);
router.delete('/removeCompany',userauthentication.authenticate,removeCompany);
router.get('/emailPreview',emailPreview);
router.get('/getProgress',getProgress)
router.post('/api/datacenter',upload.single('file'),userauthentication.authenticate,datacenter);
router.post('/api/save',userauthentication.authenticate,savedata);
router.get('/api/datahouse',userauthentication.authenticate,getUserData);
router.get('/storedData',userauthentication.authenticate,storedData);

module.exports = router;
