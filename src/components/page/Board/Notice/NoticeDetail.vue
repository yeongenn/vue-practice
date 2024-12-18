<template>
    <!-- teleport
    컴포넌트 템플릿의 일부를 해당 컴포넌트의 DOM 계층 외부의 DOM 노드로 
    이동할 수 있게 해주는 빌트인 컴포넌트 -->
        <div>
            <div v-if="isLoading">...로딩 중... 기다려주세요...</div>
            <div v-else>
                <ContextBox>공지사항 상세조회</ContextBox>
                <label> 제목 :<input type="text" v-model="detailValue.title"/> </label>
                <label>
                    내용 :
                    <input type="text" v-model="detailValue.content"/>
                </label>
                파일 :<input type="file" style="display: none" id="fileInput" @change="handlerFile" />
                <label class="img-label" htmlFor="fileInput"> 파일 첨부하기 </label>
                <div @click="fileDownload">
                    <div v-if="imageUrl">
                    <label>파일 미리보기</label>
                    <img :src="imageUrl" />
                </div>
                <div v-else>
                    <label>파일명</label>
                </div>
                </div>
                <div class="button-box">
                    <button @click="handlerUpdateBtn">저장</button>
                    <button>삭제</button>
                    <!-- $ 사용하면 import 없이 tmeplate 안에서 사용 가능 -->
                    <button @click="$router.go(-1)">뒤로가기</button>
                </div>
            </div>
        </div>
</template>

<script setup>
import { useQuery } from '@tanstack/vue-query';
import axios from 'axios';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const { params } = useRoute();
const detailValue = ref({});

const searchDetail = async () => {
    const result = await axios.post(`/api/board/noticeDetailBody.do`, { noticeSeq: params.idx });
    return result.data;
};

const { data : noticeDetail, isLoading, isSuccess } = useQuery({
    queryKey: ['detailList'],
    queryFn: searchDetail,
})

watchEffect(() => {
    if(isSuccess.value && noticeDetail.value){
        //detailValue.value = toRaw(noticeDetail.value.detail); // proxy로 감싸진 원본 객체 꺼내오기
        detailValue.value = { ...noticeDetail.value.detail }; // 이렇게 사용도 가능하다
    }
});

const handlerUpdateBtn = () => {
    const textData = {
        title: noticeDetail.value.detail.title,
        content: noticeDetail.value.detail.content,
        noticeSeq: params.idx,
    };

    //console.log(textData);  // useQuery 사용해서 받아온 데이터는 기본적으로  readonly
    console.log(detailValue.value);
    
    // const formData = new FormData();
    // if(fileData.value) formData.append('file', fileData.value);
    // formData.append(
    //         'text', 
    //         new Blob([JSON.stringify(textData)], {
    //             type: 'application/json',
    //     })
    // );

    // //axios.post(`/api/board/noticeUpdateBody.do`, textData).then((res) => {
    // axios.post(`/api/board/noticeUpdateFileForm.do`, formData).then((res) => {
    //     if(res.data.result === 'success'){
    //         modalState.setModalState();
    //         emit('postSuccess');
    //     }
    // });
};

// useQuery 사용했더니 수정값이 안 넘어가~~~
// 방법 1.
//const computedValue = computed();

</script>

<style lang="scss" scoped>
.backdrop {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-flow: row wrep;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    font-weight: bold;
}

label {
    display: flex;
    flex-direction: column;
}

input[type='text'] {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    position: relative;
    width: 400px;
}

img {
    width: 100px;
    height: 100px;
}

.img-label {
    margin-top: 10px;
    padding: 6px 25px;
    background-color: #ccc;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.9);
    cursor: pointer;

    &:hover {
        background-color: #45a049;
        color: white;
    }

    &:active {
        background-color: #3e8e41;
        box-shadow: 0 2px #666;
        transform: translateY(2px);
    }
}

.button-box {
    text-align: right;
    margin-top: 10px;
}
button {
    background-color: #3bb2ea;
    border: none;
    color: white;
    padding: 10px 22px;
    text-align: right;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    transition: 0.3s;

    &:hover {
        background-color: #45a049;
    }

    &:active {
        background-color: #3e8e41;
        box-shadow: 0 2px #666;
        transform: translateY(2px);
    }
}
</style>
