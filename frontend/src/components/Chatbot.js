import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import API from '../api/axiosConfig';

export default function Chatbot({ isAdminRoute }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: `Hi! 👋 I'm BuyMe's virtual AI assistant. Ask me anything!`, time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  if (isAdminRoute) return null;

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    const userMsg = { from: 'user', text: userText, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await API.post('/chatbot', { message: userText });
      if (data.success && data.reply) {
        setMessages(prev => [...prev, { from: 'bot', text: data.reply, time: new Date() }]);
      } else {
        setMessages(prev => [...prev, { from: 'bot', text: "I'm having trouble connecting to my brain right now.", time: new Date() }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { from: 'bot', text: "There was an error communicating with the server.", time: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = ['Store location', 'Delivery time', 'Return policy', 'Track my order'];

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* Chat Bubble Toggle */}
      <motion.button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? {} : { y: [0, -6, 0] }}
        transition={isOpen ? {} : { duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
        aria-label="Open chat assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.i key="close" className="fas fa-times" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} />
          ) : (
            <motion.i key="chat" className="fas fa-comment-dots" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} />
          )}
        </AnimatePresence>
        {!isOpen && messages.length === 1 && (
          <span className="chatbot-notification-dot"></span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="chatbot-header-info">
                <h5>BuyMe Assistant</h5>
                <span><span className="chatbot-online-dot"></span> Online</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="chatbot-close-btn">
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`chatbot-msg ${msg.from}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {msg.from === 'bot' && (
                    <div className="chatbot-msg-avatar">
                      <i className="fas fa-robot"></i>
                    </div>
                  )}
                  <div className="chatbot-msg-bubble">
                    <p>{formatText(msg.text)}</p>
                    <span className="chatbot-msg-time">
                      {msg.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div className="chatbot-msg bot" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="chatbot-msg-avatar"><i className="fas fa-robot"></i></div>
                  <div className="chatbot-msg-bubble chatbot-typing">
                    <span></span><span></span><span></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="chatbot-quick-replies">
              {quickReplies.map((reply, i) => (
                <button key={i} className="chatbot-quick-btn" onClick={() => sendMessage(reply)}>
                  {reply}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="chatbot-input-area">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="chatbot-input"
              />
              <motion.button
                onClick={() => sendMessage()}
                className="chatbot-send-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!input.trim()}
              >
                <i className="fas fa-paper-plane"></i>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
