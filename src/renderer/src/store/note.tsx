import { createSlice } from "@reduxjs/toolkit";
 
const notesSlice = createSlice({
    name: "notes",
    initialState: {
        types: [] as EssayTypes
    },
    reducers: {
        initialTypes: (state,action) => {
            state.types = action.payload;
        },
        setTypes: (state, action) => {
            state.types = action.payload
        },
    },
});


export const { initialTypes, setTypes } = notesSlice.actions;

export default notesSlice.reducer;
