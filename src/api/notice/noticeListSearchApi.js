import axios from "axios";
import { Notice } from "../api";

export const noticeListSearchApi = async (injectedValue, currentPage) => {
        const param = new URLSearchParams({
            ...injectedValue,
            currentPage: currentPage,
            pageSize: 5,
        });
        const result = await axios.post(Notice.SearchNoticeList, param);
        console.log(result.data);
        return result.data;
};