import { useSelector } from "react-redux";
import { RootState } from "../../modules";

export default function useWordbookData() {
  const useWordbookData = useSelector(
    (state: RootState) => state.wordbook.words
  );

  const data = Object.values(useWordbookData);

  const ret = [];
  for (const value of data) {
    ret.push({
      key: value.id,
      id: value.id,
      query: value.query,
      means: value.searchResultMap.searchResultListMap.WORD.items,
      meanExamples: value.searchResultMap.searchResultListMap.EXAMPLE.items
    });
  }
  return ret;
}
