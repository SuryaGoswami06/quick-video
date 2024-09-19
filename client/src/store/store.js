import { configureStore } from "@reduxjs/toolkit";
import rtcReducer from './rtcSlice.js'

const store = configureStore({
    reducer:{
        rtc:rtcReducer
    }
})

export default store