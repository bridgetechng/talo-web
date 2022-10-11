import React from 'react';
import './chartbox.css'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Actualchart from './Actualchart';





export default function Chartbox (props){

    return(
         <>
         <div className="chartboxContainer widgetWidth">
         <h6 className="chartTitle">Investment</h6>
          {/* THE AMOUNT I HID UNDER TOTAL VALUATION*/}<h1> ${props.investmentAmount.toLocaleString()}</h1>
         <Actualchart/>
        
         </div>
         
         
         </>
     )

}