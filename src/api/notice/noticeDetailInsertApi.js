import axios from "axios";
import { Notice } from "../api";

export const noticeDetailInsertApi = async (detailValue, loginId) => {
    const textData = {
        title: detailValue.title,
        context: detailValue.content,
        loginId: loginId,
    };
    await axios.post(Notice.NoticeDetailInsert, textData);
};