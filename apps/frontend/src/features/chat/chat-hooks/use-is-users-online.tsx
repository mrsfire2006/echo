import { useCallback } from "react";
import { useSignalR } from "../components/providers/signalR-provider";

export default function useIsUsersOnline() {
    const { connection } = useSignalR();





    const getUsersOnline = useCallback(async (userIds: string[]) => {
        if (!connection) return;
        const result = await connection?.invoke("GetOnlineUsersAsync", userIds);
        return result;
    }, [connection])

    return { getUsersOnline }
}