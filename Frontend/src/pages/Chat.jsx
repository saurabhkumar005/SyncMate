import {useEffect, useState} from 'react';

import useSocket from '../hooks/useSocket.js';

import {
    getUserConversations,
    getConversationMessages
} from '../api/chat.api.js';




const Chat = ()=>{

    const socket = useSocket();

    const [conversations, setConversations] = useState([]);

    const [messages, setMessages] = useState([]);

    const [selectedConversation, setSelectedConversation] = useState(null);

    const [messageInput, setMessageInput] = useState('');




    useEffect(()=>{

        loadConversations();

    },[]);




    const loadConversations = async()=>{

        try{

            const response = await getUserConversations();

            setConversations(response.data);

        }catch(err){

            console.log(err);
        }
    };




    const openConversation = async(conversationId)=>{

        setSelectedConversation(conversationId);

        socket.emit('join_conversation', conversationId);

        const response = await getConversationMessages(conversationId);

        setMessages(response.data);
    };




    useEffect(()=>{

        socket.on('new_message',(message)=>{

            setMessages((prev)=>[
                ...prev,
                message
            ]);
        });

        return ()=>{

            socket.off('new_message');
        };

    },[]);




    const sendMessage = ()=>{

        if(!messageInput.trim()) return;

        socket.emit('send_message',{
            conversationId: selectedConversation,
            content: messageInput
        });

        setMessageInput('');
    };




    return(
        <div>

            <h1>Chat App</h1>

            <div>

                {
                    conversations.map((conversation)=>(
                        <button
                            key={conversation.id}
                            onClick={()=>
                                openConversation(conversation.id)
                            }
                        >
                            Conversation {conversation.id}
                        </button>
                    ))
                }

            </div>




            <div>

                {
                    messages.map((message)=>(
                        <p key={message.id}>
                            {message.content}
                        </p>
                    ))
                }

            </div>




            <input
                type="text"
                value={messageInput}
                onChange={(e)=>setMessageInput(e.target.value)}
            />

            <button onClick={sendMessage}>
                Send
            </button>

        </div>
    );
};

export default Chat;