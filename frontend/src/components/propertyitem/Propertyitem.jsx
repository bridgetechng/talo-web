import React from 'react';
import './propertyitem.css';
import Chartbox from '../chartbox/Chartbox';
import House1 from '../../images/house1.jpeg';

import Actualchart from '../chartbox/Actualchart';
import {Link,useLocation} from "react-router-dom";

export default function Propertyitem (props){
       
     
const location = useLocation()
/*ideally there should be a property item component for the property items on the home page 
but the change was small ,just changing available to owned, so i used location and ternary below to switch between owned and available
*/
    

    return(
         <>
           
         <div className="propertyitemContainer">
         <img style={{height:200, width:300}}  src={props.imageLink} alt="property picture" className="houselistpic" />
         
         <div className="chartForList">
         <Actualchart /> {/*this component needs a container around it*/}
         </div>

         <div className="houseInfoContainer">
          
          <div className="address">{props.address?(props.address.substring(0,18).toUpperCase()+"..."):"234 ABBEY ROAD HOUSTON, TEXAS"}</div>
           <div className="houseStats">
          
            <div className="percentAppreciation">
            <div className="moneyHeader">{location.pathname.substring(0,5)==="/home"?"Owned" :"Available:"}</div>
                {(props.percentage).toFixed(1)}%
            </div>

            <div className="priceAndView">
               <div className="moneyHeader">total value:</div>
              <div className="price">
               ${props.purchasePrice.toLocaleString()}
              </div>

              <Link to={`/propertyview/${props.address}`}>
              <button  type="button" className="view">
                VIEW
              </button>
              </Link>

            </div>
             


           </div>
        


         </div>

         </div>
         
         
         
         </>
     )

}