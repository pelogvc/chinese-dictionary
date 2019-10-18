import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setPage } from "../../modules/wordbook";

export default function useWordbookSetPage() {
  const dispatch = useDispatch();
  return useCallback(name => dispatch(setPage(name)), [dispatch]);
}
