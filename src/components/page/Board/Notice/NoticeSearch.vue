<template>
    <div class="search-box">
        <input v-model.lazy="keyword">
        <input type="date" v-model="searchStartDate"/>
        <input type="date" v-model="searchEndDate"/>
        <button @click="handlerSearch">검색</button>
        <button>신규등록</button>
    </div>
</template>


<script setup>
import router from '@/router';
import { watchEffect } from 'vue';

const keyword = ref('');    // 이 값이 변경되면 화면 리렌더링
const searchStartDate = ref('');
const searchEndDate = ref('');
const other = 1;    // 반응형 객체가 아닌 경우~

// // watch - 반응형 객체의 값이 변경되면 이하 함수가 실행된다
// // 첫번째 인자로는 반응형 객체가 들어가야한다 - 반응형 객체가 아닌 경우에는 함수로 넣어야
// watch(keyword, () => {
// //watch(() => other, () => {  // 첫번째 인자를 이렇게 넣어줘야 한다
//     console.log(keyword.value); // 객체값만 가져오고 싶을 때
// })

// // 근데 문제점 : 값 변경될때마다 watch가 수행된다 -> 불필요!
// // v-model.lazy 사용해서 막을 수 있다

const handlerSearch = () => {
    //alert(keyword.value + searchStartDate.value + searchEndDate.value);
    const query = [];   // url 파라미터 쿼리
    !keyword.value || query.push(`searchTitle=${keyword.value}`);
    !searchStartDate.value || query.push(`searchStDate=${searchStartDate.value}`);
    !searchEndDate.value || query.push(`searchEdDate=${searchEndDate.value}`);
    //console.log(query);
    const queryString = query.length > 0 ? `?${query.join('&')}` : '';
    //console.log(queryString);

    router.push(queryString);
};

// watchEffect - 인자로 받는 함수 내에 반응형 객체의 값이 변경되면 함수 수행
// 아래 코드 설명 - ref 같은 반응형 객체는 없다. 새로고침 누르면 최초에 한번 실행되는 코드
watchEffect(() => window.location.search && router.push(window.location.pathname, { replace : true}))
</script>

<style lang="scss" scoped>
.search-box {
    margin-bottom: 10px;
    display: block;
    float: inline-end;
}

input {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

button {
    text-align: center;
    text-decoration: none;
    display: inline-block;
    border: none;
    color: white;
    width: 70px;
    padding-top: 8px;
    padding-bottom: 8px;
    font-size: 12px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    background-color: #3bb2ea;

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
