"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from "../ui/button";
import { Input } from '../ui/input';
import ReactMarkdown from 'react-markdown';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [showNotification, setShowNotification] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);

  useEffect(() => {
    // Scroll to bottom when messages or typing changes
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setTyping(true);

    // If chat is closed, increment notification count
    if (!isOpen) {
      setNotificationCount((prev) => prev + 1);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          domain: process.env.NEXT_PUBLIC_DOMAIN,
        }),
      });
      const data = await response.json();
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: data?.answer || 'Sorry, I did not understand that.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      // If chat is closed when bot responds, increment notification count
      if (!isOpen) {
        setNotificationCount((prev) => prev + 1);
      }
    } catch (error) {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      if (!isOpen) {
        setNotificationCount((prev) => prev + 1);
      }
    } finally {
      setTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setNotificationCount(0);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Default message preview above the button */}
      {/* {!isOpen && showNotification && (
        <div className="mb-2 w-max max-w-xs bg-white border border-gray-200 shadow-lg rounded-md px-4 py-2 text-sm text-gray-800">
          How may I assist you?
        </div>
      )} */}
      {/* Chat Window */}
      {isOpen && (
        <div
          className="mb-20 sm:mb-4 sm:w-[420px] sm:h-[600px] sm:rounded-lg w-5/6 h-[70vh] left-1/2 -translate-x-1/2 bottom-4 fixed sm:static sm:translate-x-0 sm:left-auto sm:bottom-auto rounded-md max-w-full bg-background border shadow-lg flex flex-col animate-scale-in"
          style={{ minWidth: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b text-base sm:text-base text-sm">
            <h3 className="font-semibold text-main-accent-dark">Chat Support</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseChat}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 space-y-1" style={{ minHeight: 0 }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] py-2 px-3 rounded-md text-xs sm:text-xs text-[13px] font-normal mb-0.5 ${
                    message.sender === 'user'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                  <p className="text-[10px] opacity-60 mt-0.5 text-right">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="max-w-[85%] sm:max-w-[70%] py-2 px-3 rounded-md bg-gray-100 text-gray-900 text-xs sm:text-xs text-[13px] font-normal mb-0.5">
                  <span className="inline-block animate-bounce">•</span>
                  <span className="inline-block animate-bounce [animation-delay:.2s]">•</span>
                  <span className="inline-block animate-bounce [animation-delay:.4s]">•</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 sm:p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 text-sm sm:text-base py-2"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={!inputValue.trim()}
                className="h-10 w-10 sm:h-12 sm:w-12 bg-main-accent-dark"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={isOpen ? handleCloseChat : handleOpenChat}
        size="icon"
        className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-main-accent-dark"
      >
        {/* Notification badge with number */}
        {!isOpen && notificationCount > 0 && (
          <span className="absolute top-2 right-2 h-5 w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
            {notificationCount}
          </span>
        )}
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default ChatWidget; 