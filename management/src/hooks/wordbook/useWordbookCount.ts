import { useSelector } from "react-redux";
import { RootState } from "../../modules";

export default function useWordbookCount() {
  const useWordbookCount = useSelector(
    (state: RootState) => state.wordbook.count
  );
  return useWordbookCount;
}
