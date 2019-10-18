import { useSelector } from "react-redux";
import { RootState } from "../../modules";

export default function useWordbookPage() {
  const wordbookPage = useSelector((state: RootState) => state.wordbook.page);
  return wordbookPage;
}
