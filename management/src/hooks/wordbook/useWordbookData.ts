import { useSelector } from "react-redux";
import { RootState } from "../../modules";

export default function useWordbookData() {
  const useWordbookData = useSelector(
    (state: RootState) => state.wordbook.words
  );
  return useWordbookData.map((v, i) => {
    return {
      key: v.id,
      ...v
    };
  });
}
