import React, { Fragment, useRef, useState, useEffect } from "react";

export const useOTPHook = () => {


const confirmAccount = async(email) =>{
const respo = await fetch(`/api/v1/otp`, {
    method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email
        })
})

const response =  await respo.json()
return response.OTP
}


return {confirmAccount}
}