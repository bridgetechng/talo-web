import React,{useEffect, useState, useRef} from 'react';

import "./registerpage.css";

import {Link,useNavigate} from "react-router-dom";

import axios from 'axios'  

import urbanlogo from '../../images/talo.png';



export default function Registerpage() {
   
 /*I am pushing people AWAY from this page if they have user info details, i.e they have logged in */
 
  const [userInfo,setUserInfo]  = useState(JSON.parse(window.sessionStorage.getItem('userInfo')))
  
  const navigate = useNavigate()
   
  
  useEffect(()=>{

   if(userInfo !== null){
    
    navigate('/home')
   }

 },[userInfo])

  /*I am pushing people AWAY from this page if they have user info details, i.e they have logged in  END*/
   
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')
  const [firstName,setFirstName] = useState('')
  const [lastName,setLastname] = useState('')
  const [phoneNumber,setPhoneNumber] = useState('')
  const [serverError,setServerError] = useState('')

 
 
 /*usually for my post routes*/
 const config = {
  method:"POST",
  headers:{
    'Content-Type':'application/json'
    
  }
}
/*usually for my post routes END */




const  registerHandler = async(e) => {
  
  try{
  e.preventDefault()
   
if(password !== confirmPassword)
{
 window.alert("Passwords do not match, please ensure you are typing the right password.")


}else{
  const {data} = await axios.post(`/api/users/register`,
  {
    email:email,
    password:password,
    firstName:firstName,
    lastName:lastName,
    phoneNumber:phoneNumber,
   
  },
   config
  ) 


  if(data !== null){
  sessionStorage.setItem('userInfo',JSON.stringify(data))
  setUserInfo(JSON.parse(window.sessionStorage.getItem('userInfo')))
  }else{
    throw Error('Invalid User name or password.')
  }

}
  }catch(err){
    console.log(err)
    setServerError(err.response.data.message)
  }
 
}
  
  
  

  
  return (

      <> 
       <div className="registerContainer"> 
       
      {/* <div className="urbanLogoReg">
       <img src={urbanlogo} alt="urban hive logo" className="urbanLogoReg" />
  </div>*/}

         
       
       
        <form className="formContainerReg" onSubmit={registerHandler}>
           
        <div className=" inputOrganiser">   

        <div className="urbanLogoReg">
           <img src={urbanlogo} style={{height:'120px', backgroundColor:'inherit'}} alt="urban hive logo"  />
           <div className="verticalDivider"></div>
           
           <div className="headers">
            <div className="bigHeader">TALO</div>
            <div className="smallHeader">INVESTMENT</div>
           </div>
          
         </div>
        
           <div className="form-grouping">
           <label id="name-label" for="name" className="backgroundColor">First Name</label>
            <input type="text" required  placeholder='enter your first name' className="input-box" value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
            </div>





           <div className="form-grouping">
           <label id="name-label" for="name" className="backgroundColor">Last Name</label>
            <input type="text" required  placeholder='enter your surname' className="input-box" value={lastName} onChange={(e)=>setLastname(e.target.value)}/>
            </div>



            <div className="form-grouping">
           <label id="name-label" for="name" className="backgroundColor">Email Address</label>
            <input type="email" required  placeholder='enter your email' className="input-box" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>


            <div className="form-grouping">
           <label id="name-label" for="name" className="backgroundColor">Phone Number</label>
            <input type="text" required  placeholder='enter your number' className="input-box" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)}/>
            </div>

   
            <div className="form-grouping">
            <label id="name-label" for="name" className="backgroundColor">Password</label>
            <input type="password" required   placeholder='enter your password' className="input-box" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>


            <div className="form-grouping">
            <label id="name-label" for="name" className="backgroundColor"> Confirm Password</label>
            <input type="password" required  placeholder='enter your password again' className="input-box" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
            </div>
           
       
            </div> 
            

            <div className="form-grouping">
          
            {serverError!=='' && <div className='center errorNotif'><h2>{serverError}</h2></div>}
         
          <button type="submit" id="submit" className=" buttonAdjustReg" >
            REGISTER
          </button>
          
           </div>


           <div className="relativeParentReg">
        <Link to = {"/"} >
       <div className='registrationLinkReg'>Already have an Account ? <span className="fakeAtag">Login</span></div>
        </Link>
        </div>

     </form>

     <div className='welcomeDetailsReg'>
        <div className='textContainerReg'>
         <div className='welcomeHeader'>
          Welcome to Talo Investment !
        </div>
          <div className='welcomeText'>
           <div className='welcomeTextIntro'>Your one stop platform for:</div>
            

            <ul>
              <li>buying property in parts.</li>
              <li>Easy sales of property.</li>
              <li>Accurately monitoring market conditions.</li>
            </ul>
         </div>
       </div>
     

      </div>

       
        
      

          
      </div> {/*login container ending */}
        
      </> 
      
    )
}