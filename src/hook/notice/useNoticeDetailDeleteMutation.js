import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { noticeDetailDeleteApi } from "../../api/notice/noticeDetailDeleteApi";
import { useRouter } from "vue-router";

export const useNoticeDetailDeleteMutation = (idx) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        //mutationFn: deleteNoticeDetail,
        mutationFn: () => noticeDetailDeleteApi(idx),
        onSuccess: () => {
            router.go(-1);  //  stack되어있는 history 대상
            queryClient.invalidateQueries({
                queryKey: ['noticeList']    // noticeList 쿼리 refetch 해달라는 의미
            })
        },
        mutationKey: ['noticeDelete'],  // 중복 방지 위해서라도 key 사용 권장
    })
}