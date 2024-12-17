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
                파일 :<input type="file" style="display: none" id="fileInput" @change="handlerFile" />
                <label class="img-label" htmlFor="fileInput"> 파일 첨부하기 </label>
                <div v-if="imageUrl">
                    <label>파일 미리보기</label>
                    <img :src="imageUrl" />
                </div>
                <div v-else>
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

const emit = defineEmits(['postSuccess', 'modalClose']); // 자식 컴포넌트에서 부모 컴포넌트의 동작을 유도할 수 있다
const props = defineProps(['idx']);

const modalState = useModalStore();
const noticeDetail = ref({});
const userInfo = useUserInfo();
const imageUrl = ref('');   // 미리보기용
const fileData = ref('');   // DB에 저장할 파일 데이터

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
    const formData = new FormData();
    if(formData.value) formData.append('file', formData.value);
    formData.append(
            'text', 
            new Blob([JSON.stringify(textData)], {
                type: 'application/json',
        })
    );
    
    //axios.post(`/api/board/noticeSaveBody.do`, textData).then((res) => {
    axios.post(`/api/board/noticeFileSaveForm.do`, formData).then((res) => {
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
        if(noticeDetail.value.fileExt === 'jpg' || noticeDetail.value.fileExt === 'gif' || noticeDetail.value.fileExt === 'png'){
        getFileImage();
    }
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

const handlerFile = (e) => {
    const fileInfo = e.target.files;
    //console.log(fileInfo);

    const fileInfoSplit = fileInfo[0].name.split('.');  // 파일명, 확장자 분리
    const fileExtension = fileInfoSplit[1].toLowerCase();    // 확장자명 가져오기
    if(fileExtension === 'jpg' || fileExtension === 'gif' || fileExtension === 'png'){
        //console.log(URL.createObjectURL(fileInfo[0]));
        imageUrl.value = URL.createObjectURL(fileInfo[0]);
    }
    fileData.value = fileInfo[0];

};

// 게시글 상세보기 시 이미지 파일 보이기
const getFileImage = () => {
    let param = new URLSearchParams();
    param.append('noticeSeq', props.idx);   // 파라미터로 시퀀스 넣어주기
    const postAction = {
        url: `/api/board/noticeDownload.do`,
        method: 'POST',
        data: param,
        responseType: 'blob',   // 
    };
     
    axios(postAction).then((res) => {
        //console.log(res);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        //console.log(url);
        imageUrl.value = url;   // v-bind로 img 태그 안에 url 추가
    })
    
}

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
