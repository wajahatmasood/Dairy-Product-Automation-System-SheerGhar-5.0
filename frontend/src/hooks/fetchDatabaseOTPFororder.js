import React, { Fragment, useRef, useState, useEffect } from "react";

export const useServerOTPHook = () => {


const getOTPFromServer = async(id) =>{
const respo = await fetch(`/api/v1/getOrderOTP/${id}`, {
    method:"GET"
})

const response =  await respo.json()
return response.orderOTP
}


return {getOTPFromServer}
}