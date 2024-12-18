import { useQuery } from "@tanstack/vue-query"
import { noticeDetailApi } from "../../api/notice/noticeDetailApi"

export const useNoticeDetailQuery = (idx) => {
    return useQuery({
        queryKey: ['detailList'],
        queryFn: () => noticeDetailApi(idx),
        enabled: !!idx,
    })
}