import { useQuery } from "@tanstack/vue-query";
import { noticeListSearchApi } from "../../api/notice/noticeListSearchApi";

// export default로 하고 import도 중괗로 없이 했는데 안 떠~!~!
// default 빼고 중괄호로 import 하니까 뜬다 떼잉
export const useNoticeListSearchQuery = (injectedValue, currentPage) => {
    return useQuery({
        queryKey: ['noticeList', injectedValue, currentPage],
        //queryFn: searchList,
        queryFn: () => noticeListSearchApi(injectedValue.value, currentPage.value),
        staleTime: 60 * 1000,
    });
};