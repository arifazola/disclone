import type { QueryClient } from "@tanstack/react-query";
import type { MessageModel } from "../models/messageModel";
import type { ResponseModel } from "../models/responseModel";

export function updateMessageDataQuery(queryClient: QueryClient, newMessageModel: MessageModel) {
    queryClient.setQueryData(['messages'], (oldMessage: ResponseModel<MessageModel[]>) => {
        const newData = oldMessage.Data ? [...oldMessage.Data, newMessageModel] : [newMessageModel]

        const newResponse: ResponseModel<MessageModel[]> = {
            Message: "Success",
            Data: newData
        }
        return newResponse
    })
}