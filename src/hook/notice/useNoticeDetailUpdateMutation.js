import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useRouter } from "vue-router";
import { noticeDetailUpdateApi } from "../../api/notice/noticeDetailUpdateApi";

export const useNoticeDetailUpdateMutation = (detailValue, idx) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        //mutationFn: updateNoticeDetail,
        mutationFn: () => noticeDetailUpdateApi(detailValue.value, idx),
        //onSuccess: apiSuccess,
        onSuccess: () => {
            router.go(-1);  //  stack되어있는 history 대상
            queryClient.invalidateQueries({
                queryKey: ['noticeList']    // noticeList 쿼리 refetch 해달라는 의미
            })
        },
        mutationKey: ['noticeUpdate'],  // 중복 방지 위해서라도 key 사용 권장
    })
};