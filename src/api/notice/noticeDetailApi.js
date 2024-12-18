import axios from "axios";
import { Notice } from "../api";

export const noticeDetailApi = async (idx) => {
    const result = await axios.post(Notice.NoticeDetail, { noticeSeq: idx });
    return result.data;
};