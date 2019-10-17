import { useDispatch } from "react-redux";
import { setPage } from "../modules/page";
import { useCallback } from "react";

export default function useSetPage() {
    const dispatch = useDispatch();
    return useCallback(name => dispatch(setPage(name)), [dispatch])
}