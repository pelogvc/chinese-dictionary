import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setPage } from "../../modules/page";

export default function useSetPage() {
  const dispatch = useDispatch();
  return useCallback(name => dispatch(setPage(name)), [dispatch]);
}
