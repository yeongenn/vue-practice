import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { noticeDetailInsertApi } from "../../api/notice/noticeDetailInsertApi";
import { useRouter } from "vue-router";

export const useNoticeDetailInsertMutation = (detailValue, loginId) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: () => noticeDetailInsertApi(detailValue.value, loginId),
        onSuccess: () => {
            router.go(-1);
            queryClient.invalidateQueries({
                queryKey: ['noticeList']
            })
        },
        mutationKey: ['noticeInsert'],
    })
};