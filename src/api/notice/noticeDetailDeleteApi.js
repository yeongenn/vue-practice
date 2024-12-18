import axios from "axios";
import { Notice } from "../api";

export const noticeDetailDeleteApi = async (idx) => {
    await axios.post(Notice.NoticeDetailDelete, { noticeSeq: idx });
};