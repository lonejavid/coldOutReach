const  CompanyDetails=require('../Modals/CompanyDetails')

const getCompanyDetiles=async(req,res)=>{
    try{
        const userId=req.user._id;
        const companyDetails=await CompanyDetails.find({userId:userId});
      
        if(!companyDetails){
            res.status(404).json({message:'no company details found'})
        }
        else{
            res.status(200).json(companyDetails)
        }
        
    }
    catch(error){
        console.log(error)
    }
    
}
module.exports=getCompanyDetiles;