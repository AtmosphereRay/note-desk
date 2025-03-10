import { createSlice } from "@reduxjs/toolkit";
import { MenuListItem } from "./index";
import { Eassy } from "~/config/enmu";



const notesSlice = createSlice({
    name: "notes",
    initialState: {
        types: []
    },
    reducers: {
        initialTypes: (state,action) => {
            state.types = action.payload;
            // window.db.pageQuery(Eassy.typeKey)
            //     .then((res: EassyTypes) => {
            //         // state.types = res;
            //         console.log(state, 'orgina sa', res, state.types)
            //         state.types.splice(0);
            //         Object.assign(state.types, res);
            //     }).catch(e => {
            //         console.log(e,'get gailed!')
            //     })
        },
        setTypes: (state, action) => {
            state.types = action.payload
        },
    },
});


export const { initialTypes, setTypes } = notesSlice.actions;

export default notesSlice.reducer;
