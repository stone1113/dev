import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { platformConfigs, languageMap } from '@/data/mockData';
import type { Message } from '@/types';
import {
  MessageCircle,
  Send,
  MessageSquare,
  Instagram,
  Facebook,
  Mail,
  Smartphone,
  Music,
  Twitter,
  ShoppingBag,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  SendHorizonal,
  Sparkles,
  Languages,
  User,
  Bot,
  Check,
  CheckCheck,
  Clock,
  Wand2,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageCircle,
  Send,
  MessageSquare,
  Instagram,
  Facebook,
  Mail,
  Smartphone,
  Music,
  Twitter,
  ShoppingBag,
};

interface ChatInterfaceProps {
  onToggleProfile?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = () => {
  const {
    getSelectedConversation,
    addMessage,
    markAsRead,
    userSettings,
    translateMessage,
    isTranslating,
    currentLanguage,
    getSelectedAccount,
    generateAIReply,
    isGeneratingReply,
    updateUserSettings,
    // conversations,
    // setSelectedConversation
  } = useStore();

  const [inputMessage, setInputMessage] = useState('');
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, string>>({});
  const [inputTranslation, setInputTranslation] = useState<{original: string; translated: string; targetLang: string} | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAIReplyPanel, setShowAIReplyPanel] = useState(false);
  const [autoTranslatingIds, setAutoTranslatingIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = getSelectedConversation();

  // 获取翻译设置
  const translationSettings = userSettings.preferences.translation;
  const isAutoReceiveEnabled = translationSettings.enabled && translationSettings.autoReceive;

  // 获取待回复的会话列表（未读或待处理状态）
  // const pendingConversations = conversations.filter(
  //   c => c.unreadCount > 0 || c.status === 'pending'
  // );

  // 当前会话在待回复列表中的索引
  // const currentPendingIndex = pendingConversations.findIndex(
  //   c => c.id === conversation?.id
  // );

  // 切换到上一个/下一个待回复会话
  // const handlePrevPending = () => {
  //   if (pendingConversations.length === 0) return;
  //   const newIndex = currentPendingIndex <= 0
  //     ? pendingConversations.length - 1
  //     : currentPendingIndex - 1;
  //   setSelectedConversation(pendingConversations[newIndex].id);
  // };

  // const handleNextPending = () => {
  //   if (pendingConversations.length === 0) return;
  //   const newIndex = currentPendingIndex >= pendingConversations.length - 1
  //     ? 0
  //     : currentPendingIndex + 1;
  //   setSelectedConversation(pendingConversations[newIndex].id);
  // };

  useEffect(() => {
    if (conversation) {
      markAsRead(conversation.id);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.id, conversation?.messages.length]);
  
  // 当输入内容变化时，清除翻译结果
  useEffect(() => {
    if (inputTranslation && inputTranslation.original !== inputMessage) {
      setInputTranslation(null);
    }
  }, [inputMessage]);

  // 自动翻译消息 - 当开启自动接收翻译时，翻译所有消息到用户母语
  useEffect(() => {
    if (!isAutoReceiveEnabled || !conversation) return;

    // 筛选需要翻译的消息（所有消息都翻译成用户母语，包括客户、用户、AI、客服发送的）
    const messagesToTranslate = conversation.messages.filter(
      msg => !translatedMessages[msg.id] && !autoTranslatingIds.has(msg.id)
    );

    if (messagesToTranslate.length === 0) return;

    // 批量翻译未翻译的消息
    messagesToTranslate.forEach(async (message) => {
      setAutoTranslatingIds(prev => new Set(prev).add(message.id));

      try {
        // 判断源语言：客户消息用客户语言，客服/AI消息用发送目标语言
        const sourceLang = message.senderType === 'customer'
          ? (message.language || conversation.customer.language || 'en')
          : (translationSettings.sendLanguage || 'en');

        const result = await translateMessage(
          message.content,
          sourceLang,
          translationSettings.receiveLanguage
        );

        setTranslatedMessages(prev => ({
          ...prev,
          [message.id]: result.translatedText
        }));
      } finally {
        setAutoTranslatingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(message.id);
          return newSet;
        });
      }
    });
  }, [isAutoReceiveEnabled, conversation?.messages.length, conversation?.id]);

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#F7F8FA] rounded-xl">
        <div className="w-24 h-24 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="w-12 h-12 text-[#FF6B35]" />
        </div>
        <h3 className="text-lg font-medium text-[#1A1A1A] mb-2">选择一个会话开始聊天</h3>
        <p className="text-sm text-[#999]">从左侧列表选择一个客户开始对话</p>
      </div>
    );
  }
  
  const { Icon, color } = (() => {
    const config = platformConfigs.find(p => p.id === conversation.platform);
    const IconComponent = config ? iconMap[config.icon] : MessageCircle;
    return { Icon: IconComponent, color: config?.color || '#666' };
  })();
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: conversation.id,
      senderId: userSettings.id,
      senderType: 'agent',
      content: inputMessage,
      timestamp: new Date(),
      status: 'sent',
    };
    
    addMessage(conversation.id, newMessage);
    setInputMessage('');
    setInputTranslation(null);
  };

  // 翻译消息 - 使用用户的翻译设置
  const handleTranslateMessage = async (message: Message) => {
    if (translatedMessages[message.id]) {
      // Toggle off
      const newTranslations = { ...translatedMessages };
      delete newTranslations[message.id];
      setTranslatedMessages(newTranslations);
      return;
    }

    const translationSettings = userSettings.preferences.translation;
    const result = await translateMessage(
      message.content,
      message.language || 'en',
      translationSettings.enabled ? translationSettings.receiveLanguage : currentLanguage
    );

    setTranslatedMessages(prev => ({
      ...prev,
      [message.id]: result.translatedText
    }));
  };

  // 重新翻译消息 - 不收起译文，直接重新翻译
  const handleRetranslateMessage = async (message: Message) => {
    if (isTranslating) return;

    const translationSettings = userSettings.preferences.translation;
    const result = await translateMessage(
      message.content,
      message.language || 'en',
      translationSettings.enabled ? translationSettings.receiveLanguage : currentLanguage
    );

    setTranslatedMessages(prev => ({
      ...prev,
      [message.id]: result.translatedText
    }));
  };

  // AI回复建议
  const handleGenerateAIReply = async () => {
    if (!conversation) return;
    const suggestions = await generateAIReply(conversation.id);
    setAiSuggestions(suggestions.map(s => s.content));
    setShowAIReplyPanel(true);
  };
  
  const handleUseAIReply = (suggestion: string) => {
    if (!conversation) return;
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: conversation.id,
      senderId: userSettings.id,
      senderType: 'agent',
      content: suggestion,
      timestamp: new Date(),
      status: 'sent',
    };
    
    addMessage(conversation.id, newMessage);
    setAiSuggestions([]);
    setShowAIReplyPanel(false);
  };
  
  const formatMessageTime = (date: Date) => {
    return format(new Date(date), 'HH:mm');
  };
  
  const getMessageStatus = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-[#B3B3B3]" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-[#B3B3B3]" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-[#FF6B35]" />;
      default:
        return <Clock className="w-3 h-3 text-[#B3B3B3]" />;
    }
  };
  
  const customerLanguage = languageMap[conversation.customer.language] || { name: conversation.customer.language, flag: '🌐' };
  const platformAccount = getSelectedAccount(conversation.platform);
  
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E8E8]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={conversation.customer.avatar}
              alt={conversation.customer.name}
              className="w-10 h-10 rounded-full object-cover bg-[#F2F2F2]"
            />
            <div 
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white"
              style={{ backgroundColor: color }}
            >
              <Icon className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-[#1A1A1A]">{conversation.customer.name}</h3>
              {(() => {
                const pConfig = platformConfigs.find(p => p.id === conversation.platform);
                return pConfig ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-white"
                    style={{ backgroundColor: color }}
                  >
                    <Icon className="w-3 h-3" />
                    {pConfig.name}
                  </span>
                ) : null;
              })()}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#999]">
              <span>{conversation.customer.country}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <span>{customerLanguage.flag}</span>
                <span>{customerLanguage.name}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 平台账号信息 */}
          {platformAccount && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F7F8FA] rounded-lg mr-2">
              <div className="relative">
                <img
                  src={platformAccount.avatar}
                  alt={platformAccount.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white",
                  platformAccount.status === 'online' ? "bg-[#FF6B35]" :
                  platformAccount.status === 'busy' ? "bg-[#FFB088]" : "bg-[#B3B3B3]"
                )} />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-[#1A1A1A]">{platformAccount.name}</p>
                <p className="text-[10px] text-[#999]">{platformAccount.accountId}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-[#F2F2F2] rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-[#999]" />
            </button>
            <button className="p-2 hover:bg-[#F2F2F2] rounded-lg transition-colors">
              <Video className="w-5 h-5 text-[#999]" />
            </button>
            <button className="p-2 hover:bg-[#F2F2F2] rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-[#999]" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F7F8FA]/50">
        {conversation.messages.map((message, index) => {
          const isCustomer = message.senderType === 'customer';
          const isAI = message.senderType === 'ai';
          const showAvatar = index === 0 || 
            conversation.messages[index - 1].senderType !== message.senderType;
          
          return (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                isCustomer ? "justify-start" : "justify-end"
              )}
            >
              {/* Avatar (left side for customer) */}
              {isCustomer && showAvatar && (
                <img
                  src={conversation.customer.avatar}
                  alt={conversation.customer.name}
                  className="w-8 h-8 rounded-full object-cover bg-[#F2F2F2] flex-shrink-0"
                />
              )}
              {isCustomer && !showAvatar && <div className="w-8 flex-shrink-0" />}
              
              {/* Message Content */}
              <div className={cn(
                "max-w-[70%]",
                !isCustomer && "items-end"
              )}>
                {/* Sender Name */}
                {showAvatar && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#999]">
                      {isCustomer ? conversation.customer.name : 
                       isAI ? 'AI助手' : userSettings.name}
                    </span>
                    {isAI && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-[#FF6B35]/10 text-[#FF6B35] rounded-full">
                        AI
                      </span>
                    )}
                  </div>
                )}
                
                {/* Message Bubble */}
                <div className={cn(
                  "relative group px-4 py-2.5 rounded-2xl text-sm",
                  isCustomer
                    ? "bg-white border border-[#D9D9D9] rounded-tl-sm"
                    : "bg-[#FFF0E8] text-[#1A1A1A] rounded-tr-sm"
                )}>
                  {/* Primary Content */}
                  <p>{message.content}</p>

                  {/* Secondary Content - Translation */}
                  {/* 显示所有消息的翻译结果（接收翻译：翻译整个消息流到用户母语） */}
                  {translatedMessages[message.id] && (
                    <div className={cn(
                      "mt-1.5 pt-1.5 border-t text-xs",
                      isCustomer ? "border-[#D9D9D9]/60 text-[#999]" :
                      "border-[#E8855A]/20 text-[#999]"
                    )}>
                      <div className="flex items-center gap-1.5">
                        <p className="flex-1">{translatedMessages[message.id]}</p>
                        <button
                          onClick={() => handleRetranslateMessage(message)}
                          disabled={isTranslating}
                          className={cn(
                            "p-0.5 rounded transition-colors flex-shrink-0",
                            isCustomer ? "hover:bg-[#F2F2F2] text-[#B3B3B3] hover:text-[#666]" :
                            "hover:bg-[#E8855A]/10 text-[#B3B3B3] hover:text-[#666]"
                          )}
                          title="重新翻译"
                        >
                          <RefreshCw className={cn("w-3 h-3", isTranslating && "animate-spin")} />
                        </button>
                      </div>
                    </div>
                  )}
                  {/* For agent/AI messages: show translatedContent (发送时的原文) if no receive translation */}
                  {!isCustomer && !translatedMessages[message.id] && message.translatedContent && message.translatedContent !== message.content && (
                    <div className={cn(
                      "mt-1.5 pt-1.5 border-t text-xs",
                      isAI ? "border-[#E8855A]/20 text-[#999]" : "border-[#E8855A]/20 text-[#999]"
                    )}>
                      <p className="flex-1">{message.translatedContent}</p>
                    </div>
                  )}

                  {/* Message Actions */}
                  <div className={cn(
                    "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity",
                    isCustomer ? "left-full ml-2" : "right-full mr-2"
                  )}>
                    <button
                      onClick={() => handleTranslateMessage(message)}
                      disabled={isTranslating}
                      className="p-1.5 bg-white border border-[#D9D9D9] rounded-lg shadow-sm hover:bg-[#F7F8FA] transition-colors"
                      title="翻译"
                    >
                      <Languages className="w-3.5 h-3.5 text-[#999]" />
                    </button>
                  </div>
                </div>
                
                {/* Time & Status */}
                <div className={cn(
                  "flex items-center gap-1 mt-1",
                  isCustomer ? "justify-start" : "justify-end"
                )}>
                  <span className="text-[10px] text-[#B3B3B3]">
                    {formatMessageTime(message.timestamp)}
                  </span>
                  {!isCustomer && getMessageStatus(message.status)}
                </div>
              </div>
              
              {/* Avatar (right side for agent/AI) */}
              {!isCustomer && showAvatar && (
                isAI ? (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FF6B35]/10">
                    <Bot className="w-5 h-5 text-[#FF6B35]" />
                  </div>
                ) : platformAccount?.avatar ? (
                  <img
                    src={platformAccount.avatar}
                    alt={platformAccount.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-[#F2F2F2]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#E8E8E8]">
                    <User className="w-5 h-5 text-[#999]" />
                  </div>
                )
              )}
              {!isCustomer && !showAvatar && <div className="w-8 flex-shrink-0" />}
            </div>
          );
        })}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#E8E8E8] bg-white">
        {/* AI Takeover Mode - AI完全接管 */}
        {userSettings.preferences.ai.enabled && userSettings.preferences.ai.autoReply && (
          <div className="mb-3 p-4 bg-gradient-to-r from-[#FFF7F3] via-[#FFD4BE]/30 to-[#FF6B35]/5 border border-[#FF6B35]/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <div>
                  <p className="font-medium text-[#FF6B35]">AI客服接管中</p>
                  <p className="text-xs text-[#FF6B35]/70">AI将自动回复客户消息，无需人工干预</p>
                </div>
              </div>
              <button
                onClick={() => updateUserSettings({
                  preferences: {
                    ...userSettings.preferences,
                    ai: {
                      ...userSettings.preferences.ai,
                      autoReply: false
                    }
                  }
                })}
                className="px-4 py-2 bg-white border border-[#FF6B35] text-[#FF6B35] text-sm font-medium rounded-lg hover:bg-[#FF6B35]/5 transition-colors"
              >
                切换为AI辅助模式
              </button>
            </div>
          </div>
        )}

        {/* AI Assist Mode - AI辅助模式 */}
        {userSettings.preferences.ai.enabled && !userSettings.preferences.ai.autoReply && (
          <div className="mb-3">
            {/* AI Reply Toggle */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                <span className="text-xs font-medium text-[#1A1A1A]">AI辅助模式</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAIReplyPanel(!showAIReplyPanel)}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg transition-colors",
                    showAIReplyPanel
                      ? "bg-[#FF6B35]/10 text-[#FF6B35]"
                      : "text-[#999] hover:bg-[#F2F2F2]"
                  )}
                >
                  {showAIReplyPanel ? '收起建议' : '展开建议'}
                </button>
                <button
                  onClick={() => updateUserSettings({
                    preferences: {
                      ...userSettings.preferences,
                      ai: {
                        ...userSettings.preferences.ai,
                        autoReply: true
                      }
                    }
                  })}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gradient-to-r from-[#FF8F5E] to-[#FF6B35] text-white font-medium rounded-lg hover:from-[#FF6B35] hover:to-[#E85A2A] shadow-sm hover:shadow-md transition-all"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>切换AI接管</span>
                </button>
              </div>
            </div>
            
            {showAIReplyPanel && (
              <div className="space-y-2">
                {/* Generate Button */}
                {aiSuggestions.length === 0 && (
                  <button
                    onClick={handleGenerateAIReply}
                    disabled={isGeneratingReply}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      isGeneratingReply
                        ? "bg-[#F2F2F2] text-[#B3B3B3]"
                        : "bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] text-white hover:shadow-md"
                    )}
                  >
                    {isGeneratingReply ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>AI生成中...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>生成AI回复建议</span>
                      </>
                    )}
                  </button>
                )}
                
                {/* AI Suggestions */}
                {aiSuggestions.length > 0 && (
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="group p-3 bg-gradient-to-r from-[#FF6B35]/5 to-[#FFF7F3] border border-[#FF6B35]/10 rounded-xl hover:border-[#FF6B35]/30 transition-all"
                      >
                        <p className="text-sm text-[#333] mb-2 leading-relaxed">
                          {suggestion}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button className="p-1 hover:bg-[#E8E8E8] rounded transition-colors">
                              <ThumbsUp className="w-3.5 h-3.5 text-[#B3B3B3]" />
                            </button>
                            <button className="p-1 hover:bg-[#E8E8E8] rounded transition-colors">
                              <ThumbsDown className="w-3.5 h-3.5 text-[#B3B3B3]" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigator.clipboard.writeText(suggestion)}
                              className="p-1 hover:bg-[#E8E8E8] rounded transition-colors"
                              title="复制"
                            >
                              <Copy className="w-3.5 h-3.5 text-[#B3B3B3]" />
                            </button>
                            <button
                              onClick={() => handleUseAIReply(suggestion)}
                              className="flex items-center gap-1 px-2 py-1 bg-[#FF6B35] text-white text-xs font-medium rounded-lg hover:bg-[#E85A2A] transition-colors"
                            >
                              <Send className="w-3 h-3" />
                              <span>发送</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleGenerateAIReply}
                      disabled={isGeneratingReply}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-[#FF6B35] hover:bg-[#FF6B35]/5 rounded-xl transition-colors"
                    >
                      <RefreshCw className={cn("w-4 h-4", isGeneratingReply && "animate-spin")} />
                      <span>重新生成</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        

        <div className="flex items-end gap-2">
          <button className="p-2 hover:bg-[#F2F2F2] rounded-lg transition-colors">
            <Smile className="w-5 h-5 text-[#999]" />
          </button>
          <button className="p-2 hover:bg-[#F2F2F2] rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-[#999]" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`输入消息... (客户语言: ${customerLanguage.name})`}
              className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#D9D9D9] rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className={cn(
              "p-2.5 rounded-xl transition-all",
              inputMessage.trim()
                ? "bg-[#FF6B35] text-white hover:bg-[#E85A2A] shadow-md"
                : "bg-[#F2F2F2] text-[#B3B3B3]"
            )}
          >
            <SendHorizonal className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto">
          <span className="text-xs text-[#B3B3B3] flex-shrink-0">快捷回复:</span>
          {['您好，有什么可以帮您？', '请稍等，我为您查询', '感谢您的耐心等待'].map((text, i) => (
            <button
              key={i}
              onClick={() => setInputMessage(text)}
              className="px-2.5 py-1 text-xs bg-[#F2F2F2] text-[#666] rounded-full hover:bg-[#E8E8E8] transition-colors flex-shrink-0"
            >
              {text.length > 8 ? text.slice(0, 8) + '...' : text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
