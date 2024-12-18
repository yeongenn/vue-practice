import axios from "axios";
import { Notice } from "../api";

export const noticeDetailUpdateApi = async (detailValue, idx) => {
    const textData = {
        ...detailValue,
        context: detailValue.content,
        noticeSeq: idx,
    };
    //console.log(detailValue.value);
    //await axios.post(`/api/board/noticeUpdateBody.do`, textData);
    await axios.post(Notice.NoticeDetailUpdate, textData);
};