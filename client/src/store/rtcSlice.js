import { createSlice } from "@reduxjs/toolkit";

const rtcSlice = createSlice({
    name:'rtc',
    initialState:{
        initiator:true
    },
    reducers:{
        setInitiator:(state,action)=>{
            state.initiator = action.payload
        }
    }
})

export const {setInitiator} = rtcSlice.actions;

export default rtcSlice.reducer