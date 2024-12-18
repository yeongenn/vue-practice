<template>
    <div class="divNoticeList">
        <!-- Modal의 경우에는 v-show 보다 v-if가 더 적합해보인다 -->
        <NoticeModal 
            v-if="modalState.modalState" 
            @postSuccess="searchList" 
            @modal-close="() => (noticeIdx = 0)" 
            :idx="noticeIdx"
        />
        현재 페이지: {{ currentPage }} 총 개수: {{ noticeList?.noticeCnt }}
        <table>
            <colgroup>
                <col width="10%" />
                <col width="50%" />
                <col width="30%" />
                <col width="10%" />
            </colgroup>

            <thead>
                <tr>
                    <th scope="col">번호</th>
                    <th scope="col">제목</th>
                    <th scope="col">작성일</th>
                    <th scope="col">작성자</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="isLoading">...로딩 중</template>
                <template v-if="isSuccess">
                    <template v-if="noticeList.noticeCnt > 0">
                        <tr v-for="notice in noticeList.notice" :key="notice.noticeIdx" @click="handlerDetail(notice.noticeIdx)">
                            <td>{{ notice.noticeIdx }}</td>
                            <td>{{ notice.title }}</td>
                            <td>{{ notice.createdDate.substr(0, 10) }}</td>
                            <td>{{ notice.author }}</td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="7">일치하는 검색 결과가 없습니다</td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </table>
        <Pagination
        :totalItems="noticeList?.noticeCnt || 0"
        :items-per-page="5"
        :max-pages-shown="5"
        :onClick="searchList"
        v-model="currentPage"></Pagination>
    </div>
    <!-- 중첩라우터를 사용하면 router-view 부분에 상세보기 창이 뜨게 된다 -->
    <router-view></router-view>
</template>

<script setup>
import axios from 'axios';
import { inject, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Pagination from '../../../common/Pagination.vue';
import { useModalStore } from '../../../../stores/modalState';
import { useQuery } from '@tanstack/vue-query';
import { useNoticeListSearchQuery } from '../../../../hook/notice/useNoticeListSearchQuery';

const route = useRoute();   // NoticeSearch에서 넘겨주는 데이터 받아오기
const router = useRouter();
//const noticeList = ref();   // 서버로부터 받아온 데이터
//const noticeCnt = ref(0);
const currentPage = ref(1);
//const modalValue = ref(false);  // 
const modalState = useModalStore();
const noticeIdx = ref(0);

const injectedValue = inject('providedValue');

watch(injectedValue, () => {
    console.log(injectedValue.value);
});

// 받아온 데이터 서버로 넘기기
// const searchList = async () => {
//     const param = new URLSearchParams({
//         // searchTitle: route.query.searchTitle || '',
//         // searchStDate: route.query.searchStDate || '',
//         // searchEdDate: route.query.searchEdDate || '',
//         ...injectedValue.value,
//         currentPage: currentPage.value,
//         pageSize: 5,
//     });
//     // const result = await axios.post('/api/board/noticeListJson.do', param).then((res) => {
//     //     // noticeList.value = res.data.notice;
//     //     // noticeCnt.value = res.data.noticeCnt;
//     // });
//     const result = await axios.post('/api/board/noticeListJson.do', param);
//     console.log(result.data);
//     return result.data;
// };

// const { data : noticeList, isLoading, refetch, isSuccess, isError } = useQuery({
//     queryKey: ['noticeList', injectedValue, currentPage],
//     //queryKey: ['noticeList'],
//     queryFn: searchList,
//     staleTime: 60 * 1000,   // 예를 들어 상세보기에서 뒤로가기 눌렀을 때 서버에 굳이 다녀오고 싶지 않다
// });

const { data: noticeList, isLoading, refetch, isSuccess } = useNoticeListSearchQuery(injectedValue, currentPage);

// const handlerModal = (idx) => {
//     //modalState.modalState = !modalState.modalState;
//     console.log(idx);
//     noticeIdx.value = idx;
//     modalState.setModalState();
//     //console.log(modalState.modalState);
// };

const handlerDetail = (param) => { // 숫자를 넘겨줄 때는 String 타입으로 변환해서 넘겨야한다
    router.push({
        name: 'noticeDetail',
        params: { idx: param },
    }) 
};

// const handlerDetail = (idx) => {
//     router.push(`${idx}`);
// }


//watch(route, () => console.log(route.query));
//watch(route, searchList);

// onMounted(() => {
//     searchList();
// });
</script>

<style lang="scss" scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0px 0px 0px;
    font-size: 18px;
    text-align: left;

    th,
    td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        text-align: center;
    }

    th {
        background-color: #2676bf;
        color: #ddd;
    }

    /* 테이블 올렸을 때 */
    tbody tr:hover {
        background-color: #d3d3d3;
        opacity: 0.9;
        cursor: pointer;
    }
}
</style>
