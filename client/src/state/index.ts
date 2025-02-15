import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface InitialStateTypes {
    isSidebarCollapsed : Boolean;
    isDarkMode :false;
}

const initialState: InitialStateTypes = {
    isSidebarCollapsed: false,
    isDarkMode: false,
}

export const globalSlice = createSlice({
    name:'global',
    initialState,
    reducers: {
        setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.isSidebarCollapsed = action.payload;
        },
        setIsDarkMode: (state, action: PayloadAction<boolean>) => {
            state.isSidebarCollapsed = action.payload;
        },
    },
});

export const {setIsSidebarCollapsed, setIsDarkMode} = globalSlice.actions;

export default globalSlice.reducer;