import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./menu";
import tabReducer from "./Tab"
import themeReducer from "./theme"
import settingsReducer from "./settings";
import notes from "./note"


// @ts-ignore
export const store = configureStore({
    reducer: {
        menu: menuReducer,
        tab: tabReducer,
        theme: themeReducer,
        settings: settingsReducer,
        notes
    },
});


export * from "./types"

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
