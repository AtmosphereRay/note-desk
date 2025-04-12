import { createSlice } from "@reduxjs/toolkit";

const notesSlice = createSlice({
    name: "notes",
    initialState: {
        types: [] as EssayTypes,
        icons: {} as Record<string, string>
    },
    reducers: {
        initialTypes: (state, action) => {
            state.types = action.payload as EssayTypes;
            Array.isArray(action.payload) && action.payload.forEach((item: EssayType) => {
                state.icons[item.id] = item.icon;
            })
        },
        setTypes: (state, action) => {
            state.types = action.payload
        },
    },
});


export const { initialTypes, setTypes } = notesSlice.actions;

export default notesSlice.reducer;
