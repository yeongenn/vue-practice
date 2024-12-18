<template>
    <ContextBox>공지사항</ContextBox>
    <NoticeSearch></NoticeSearch>
    <NoticeMain></NoticeMain>
</template>

<script setup>
const providedValue = ref();


// provide('[key]', [value])
provide('providedValue', providedValue);
</script>
