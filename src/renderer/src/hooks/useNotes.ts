import { useSelector } from "react-redux";
import { initialTypes } from "@renderer/store/note"
import { useDispatch } from 'react-redux';
import type { AppDispatch, } from '@renderer/store';
import { type RootState, } from "@renderer/store";
import { Eassy } from "~/config/enmu"
import { useEffect } from "react";


export const useNotesHooks = () => {
    const types = useSelector((state: RootState) => state.notes.types);
    const dispatch: AppDispatch = useDispatch()
    const init = () => {
        window.db.pageQuery(Eassy.typeKey)
            .then(res => {
                dispatch(initialTypes(res))
            })
    }
    const release = () => {

    }

    useEffect(() => {
        init();
        return () => {
            release()
        }
    }, []);


    return {
        init,
        types
    }
}
