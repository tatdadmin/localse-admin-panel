import { GET_ALL_NOTICE } from "../../apis/Apis";
import { setLoader, storeNotices } from "../slices/NoticeSlice";

const getNotices = () => {
    return async (dispatch) => {
        try {
            dispatch(setLoader(true));
            const res = await GET_ALL_NOTICE();
            dispatch(storeNotices(res?.data || [])); 
        } catch (error) {
            console.error("Error fetching notices:", error);
        } finally {
            dispatch(setLoader(false));
        }
    };
};

export default getNotices;
