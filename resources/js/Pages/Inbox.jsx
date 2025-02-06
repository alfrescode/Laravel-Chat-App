import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export default function Inbox({ messages }) {

    const webSocketChannel = `message.${auth.user.id}`;

    const [selectedUser, setSelectedUser] = useState(null)
    const [currentMessage, setCurrentMessage] = useState([])
    const [messageInput, setMessageInput] = useState("")

    const targetscrollToBottom = () => {
        if (targetscrollToBottom.current) {
            targetscrollToBottom.current.scrollIntoView({ behavior: "smooth" });
        };

    const sendMessage = async () => {
        await axios.post(`/message/${selectedUserRef.current.id}`, {messageInput})
        setMessageInput("")
        getMessages()        
    }

    const getMessages = async () => {
        const response = await axios.get(`/message/${selectedUserRef.id}`)
        setCurrentMessage(response.data)
    }

    useEffect(() => {
        selectedUserRef.current = selectedUser
        if(selectedUser){
            getMessages()
        }
    },[selectedUser])

    useEffect(() => {
        
}