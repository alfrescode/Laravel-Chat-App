import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export default function Inbox({ messages, auth, users }) {

    if (!auth || !auth.user) {
        console.error("Auth or auth.user is undefined");
        return <div>Loading...</div>;
    }

    const webSocketChannel = `message.${auth.user.id}`;

    const [selectedUser, setSelectedUser] = useState(null);
    const [currentMessage, setCurrentMessage] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    const selectedUserRef = useRef(null);
    const scrollToBottomRef = useRef(null);

    const scrollToBottom = () => {
        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const sendMessage = async () => {
        try {
            await axios.post(`/inbox/${selectedUserRef.current.id}`, { message: messageInput });
            setMessageInput("");
            getMessages();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const getMessages = async () => {
        try {
            const response = await axios.get(`/inbox/${selectedUserRef.current.id}`);
            setCurrentMessage(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        selectedUserRef.current = selectedUser;
        if (selectedUser) {
            getMessages();
        }
    }, [selectedUser]);

    useEffect(() => {
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    }, [currentMessage]);

    const connectToWebSocket = () => {
        window.Echo.private(webSocketChannel)
            .listen('MessageSent', async (e) => {
                if (selectedUserRef.current && e.message.sender_id === selectedUserRef.current.id) {
                    setCurrentMessage((prevMessages) => [...prevMessages, e.message]);
                    scrollToBottom();
                }
            });
    };

    useEffect(() => {
        connectToWebSocket();
        return () => {
            window.Echo.leave(webSocketChannel);
        };
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Inbox" />

            <div className="h-screen flex bg-gray-100" style={{ height: "calc(100vh - 4rem)" }}>
                {/* Sidebar */}
                <div className="w-1/4 bg-white border-r border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                        Inbox
                    </div>
                    <div className="p-4 space-y-4">
                        {/* Contact List */}
                        {users.map((user, key) => (
                            <div
                                key={key}
                                onClick={() => setSelectedUser(user)}
                                className={`flex items-center ${user.id == selectedUser?.id ? 'bg-gray-200' : ''}`}
                            >
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="ml-4">
                                    <div className="font-semibold">{user.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Chat */}
                <div className="flex flex-col w-3/4">
                    {!selectedUser &&
                        <div className="h-full flex justify-center items-center">
                            Select Conversation
                        </div>
                    }
                    {selectedUser &&
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-200 flex items-center">
                                <div className="w-12 h-12 bg-blue-200 rounded"></div>
                                <div className="ml-4">
                                    <div className="font-bold">{selectedUser.name}</div>
                                </div>
                            </div>
                            {/* Chat Body */}
                            <div className="flex-1 p-4 overflow-y-auto">
                                {currentMessage.map((message, key) => (
                                    <div key={key} className={`flex ${message.sender_id == auth.user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`p-2 rounded-lg ${message.sender_id == auth.user.id ? 'bg-blue-200' : 'bg-gray-200'}`}>
                                            {message.message}
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollToBottomRef}></div>
                            </div>
                            {/* Chat Footer */}
                            <div className="p-4 border-t border-gray-200">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 p-2 border border-gray-200 rounded-lg"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
        </AuthenticatedLayout>
    );
}