<template>
    <!-- teleport
    컴포넌트 템플릿의 일부를 해당 컴포넌트의 DOM 계층 외부의 DOM 노드로 
    이동할 수 있게 해주는 빌트인 컴포넌트 -->
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <label> 제목 :<input type="text" v-model="noticeDetail.title" /> </label>
                <label>
                    내용 :
                    <input type="text" v-model="noticeDetail.content" />
                </label>
                파일 :<input type="file" style="display: none" id="fileInput" />
                <label class="img-label" htmlFor="fileInput"> 파일 첨부하기 </label>
                <div>
                    <label>파일명</label>
                </div>
                <div class="button-box">
                    <button @click="props.idx ? handlerUpdateBtn() : handlerSaveBtn()">{{ props.idx ? '수정' : '저장' }}</button>
                    <button @click="handlerDeleteBtn"  v-if="props.idx">삭제</button>
                    <button @click="handlerModal">나가기</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import axios from 'axios';
import { useModalStore } from '../../../../stores/modalState';
import { useUserInfo } from '../../../../stores/userInfo';
import { onMounted, onUnmounted } from 'vue';

const modalState = useModalStore();
const noticeDetail = ref({});
const userInfo = useUserInfo();
const emit = defineEmits(['postSuccess', 'modalClose']); // 자식 컴포넌트에서 부모 컴포넌트의 동작을 유도할 수 있다
const props = defineProps(['idx']);

const handlerModal = () => {
    modalState.setModalState();
}

const handlerSaveBtn = () => {
    const textData = {
        // title: noticeDetail.value.title,
        // context: noticeDetail.value.context,
        ...noticeDetail.value,
        loginId: userInfo.user.loginId
    };
    axios.post(`/api/board/noticeSaveBody.do`, textData).then((res) => {
        if(res.data.result === 'success'){
            modalState.setModalState();
            emit('postSuccess');
        }
    });
    console.log(textData);
};

const searchDetail = () => {
    axios.post(`/api/board/noticeDetailBody.do`, { noticeSeq: props.idx }).then((res) => {
        noticeDetail.value = res.data.detail;
    });
};

const handlerUpdateBtn = () => {
    const textData = {
        title: noticeDetail.value.title,
        context: noticeDetail.value.content,
        noticeSeq: props.idx,
    };
    axios.post(`/api/board/noticeUpdateBody.do`, textData).then((res) => {
        if(res.data.result === 'success'){
            modalState.setModalState();
            emit('postSuccess');
        }
    });
};

const handlerDeleteBtn = () => {
    axios.post(`/api/board/noticeDeleteBody.do`, { noticeSeq: props.idx }).then((res) => {
        if(res.data.result === 'success'){
            modalState.setModalState();
            emit('postSuccess');
        }
    });
};

onMounted(() => {
    // console.log(props.idx);
    // searchDetail();
    props.idx && searchDetail();    // 신규 등록일 때는 api 호출 X
});

onUnmounted(() => emit('modalClose'));
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
