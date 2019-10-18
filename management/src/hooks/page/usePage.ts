import { useSelector } from "react-redux";
import { RootState } from "../../modules";

export default function usePage() {
  const page = useSelector((state: RootState) => state.page);
  return page;
}
