import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   isHubConnected:false,
   hubConnection:{}
}

export const hubConnectionReducer = createSlice({
    name: 'hubConnectionReducer',
    initialState,
    reducers: {
        setHubConnectionData(state, action) {
            state.isHubConnected = action.payload.isHubConnected;
            state.hubConnection = action.payload.hubConnection;
        }
    }
})


export const { setHubConnectionData } = hubConnectionReducer.actions;
export default hubConnectionReducer.reducer;