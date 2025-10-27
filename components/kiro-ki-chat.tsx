"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, X, MessageCircle, Loader2, ExternalLink, Stethoscope, Calendar, BookOpen, Sparkles, Mic, Image as ImageIcon, User } from "lucide-react"
import { Button } from "@/components/ui/button"

type KiroMode = "chat" | "symptom" | "booking" | "learn" | "exercise"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ArticleCard {
  id: string
  title: string
  url: string
}

// Parse article references from AI response
function parseArticles(content: string): { text: string; articles: ArticleCard[] } {
  const articleRegex = /\[ARTICLE:([^:]+):([^:]+):([^\]]+)\]/g
  const articles: ArticleCard[] = []

  let text = content.replace(articleRegex, (match, id, title, url) => {
    articles.push({ id, title, url })
    return ''
  })

  return { text: text.trim(), articles }
}

// Icon mapping for treatment types
const treatmentIcons: Record<string, string> = {
  'rygg': '🦴',
  'nakke': '💆',
  'skulder': '💪',
  'kne': '🦵',
  'myalgi': '💥',
  'ankel-fot': '👣',
  'handledd': '✋',
  'albue': '💪',
  'kjeve': '😬',
  'hodepine': '🧠',
}

export function KiroKIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<KiroMode>("chat")
  const [isVisible, setIsVisible] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hei! Jeg er Kiro KI, din digitale assistent. Fortell meg om dine plager, så kan jeg hjelpe deg med råd og informasjon. 😊"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Show on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true)
      }
    }

    // Show after small delay or on first scroll
    const timer = setTimeout(() => {
      if (window.scrollY > 100) {
        setIsVisible(true)
      }
    }, 1000)

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Listen for Kiro Research Pill clicks
  useEffect(() => {
    const handleKiroResearch = (event: CustomEvent) => {
      const { query } = event.detail;
      setIsOpen(true);
      // Automatically send the query
      if (query && query.trim()) {
        handleSendWithQuery(query);
      }
    };

    window.addEventListener('kiro-ki-open', handleKiroResearch as EventListener);
    return () => {
      window.removeEventListener('kiro-ki-open', handleKiroResearch as EventListener);
    };
  }, []);

  const handleSendWithQuery = useCallback(async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    setInput("");

    setMessages(prev => [...prev, { role: "user", content: queryText }]);
    setIsLoading(true);

    try {
      const currentMessages = messages;
      const response = await fetch("/api/kiro-ki", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: queryText, history: currentMessages })
      });

      if (!response.ok) throw new Error('API error');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('0:')) {
              const match = line.match(/^0:"(.+)"$/);
              if (match) {
                aiResponse += match[1];
              }
            } else if (line.startsWith('data: ')) {
              try {
                const json = JSON.parse(line.slice(6));
                if (json.content) {
                  aiResponse += json.content;
                }
              } catch {}
            }
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = { role: "assistant", content: aiResponse };
              return newMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error('Kiro KI Error:', error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Beklager, jeg opplever tekniske problemer. Prøv igjen senere."
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // Call API endpoint for AI streaming response
      const response = await fetch("/api/kiro-ki", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: messages })
      })

      if (!response.ok) throw new Error('API error')

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let aiResponse = ""

      // Add placeholder message
      setMessages(prev => [...prev, { role: "assistant", content: "" }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          // Decode chunk and append directly (preserves newlines)
          const chunk = decoder.decode(value, { stream: true })
          aiResponse += chunk

          // Update the last message with streamed content
          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: aiResponse
            }
            return newMessages
          })
        }
      }

    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: "Beklager, jeg støtte på et problem. Prøv igjen eller ring oss på +47 400 95 900."
        }
        return newMessages
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Mode configurations
  const modes = [
    { id: "chat" as KiroMode, icon: MessageCircle, label: "Chat" },
    { id: "symptom" as KiroMode, icon: Stethoscope, label: "Symptomer" },
    { id: "booking" as KiroMode, icon: Calendar, label: "Booking" },
    { id: "learn" as KiroMode, icon: BookOpen, label: "Kunnskap" },
    { id: "exercise" as KiroMode, icon: Sparkles, label: "Øvelser" },
  ]

  const currentModeConfig = modes.find(m => m.id === mode) || modes[0]

  if (!isOpen) {
    return (
      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Thin Bottom Bar - Minimal State */}
          <div className="bg-white rounded-full shadow-2xl border border-gray-200 overflow-visible">
            <div className="flex items-center gap-3 px-6 py-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#f48337] flex items-center justify-center flex-shrink-0">
                <img
                  src="/media/logos/logo-white-icon.svg"
                  alt="Kiro KI"
                  className="w-6 h-6"
                />
              </div>

              {/* Input Area */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && input.trim()) {
                    e.preventDefault()
                    setIsOpen(true)
                    setTimeout(() => handleSend(), 100)
                  }
                }}
                placeholder="Har du smerter? Spør Kiro KI..."
                className="flex-1 text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-500"
              />

              {/* Mode Icons */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 overflow-visible">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (mode === m.id && isOpen) {
                        // If already in this mode and chat is open, do nothing
                        return
                      }
                      setMode(m.id)
                      if (!isOpen && m.id === "chat") {
                        // Only open if clicking chat mode when closed
                        setIsOpen(true)
                      } else if (!isOpen) {
                        // For other modes, just switch mode without opening
                        // User can click again or press enter to open
                      } else {
                        // If already open, just switch the mode
                      }
                    }}
                    className={`p-2 rounded-lg transition-all group relative ${
                      mode === m.id
                        ? 'bg-[#f48337]/15 text-[#f48337]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label={m.label}
                  >
                    <m.icon className="w-5 h-5" />
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[10000]">
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-48px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Header with Mode Tabs */}
      <div className="bg-gradient-to-r from-[#f48337] to-[#f48337]/90 text-white">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <img
                src="/media/logos/logo-white-icon.svg"
                alt="Kiro KI"
                className="w-5 h-5"
              />
            </div>
            <div>
              <h3 className="font-bold">Kiro KI</h3>
              <p className="text-xs text-white/80">{currentModeConfig.label}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1 px-2 pb-2">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                mode === m.id
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white/90 hover:bg-white/10"
              }`}
            >
              <m.icon className="w-4 h-4" />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => {
          const { text, articles } = message.role === "assistant" ? parseArticles(message.content) : { text: message.content, articles: [] }

          return (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] ${message.role === "user" ? "" : "space-y-3"}`}>
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-[#f48337] text-white"
                      : "bg-white text-gray-900 shadow-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
                </div>

                {/* Article Cards */}
                {articles.length > 0 && (
                  <div className="space-y-2">
                    {articles.map((article, idx) => (
                      <a
                        key={idx}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-[#f48337]"
                      >
                        <div className="text-2xl">{treatmentIcons[article.id] || '📄'}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{article.title}</p>
                          <p className="text-xs text-gray-500">Les mer om behandling</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[#f48337] flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 shadow-sm rounded-2xl px-4 py-2">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Mode Specific */}
      <div className="p-4 bg-white border-t">
        {mode === "chat" && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Beskriv dine symptomer..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#f48337] text-black"
                disabled={isLoading}
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  // Handle file upload
                  console.log('File uploaded:', e.target.files?.[0])
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                title="Last opp bilde"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-[#f48337] text-white rounded-full hover:bg-[#f48337]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Kiro KI gir generelle råd basert på forskning.
            </p>
          </div>
        )}

        {mode === "booking" && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 mb-2">Bestill Time</h4>
            <a
              href="https://onlinebooking.solvitjournal.no/kiropraktisk-senter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#f48337] text-white rounded-full hover:bg-[#f48337]/90 transition-colors font-semibold"
            >
              <Calendar className="w-5 h-5" />
              Book Online
            </a>
            <a
              href="tel:+4740095900"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white ring-1 ring-gray-300 text-gray-900 rounded-full hover:bg-gray-50 transition-colors font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Ring: +47 400 95 900
            </a>
            <p className="text-xs text-gray-500 text-center">
              Åpningstider: Man-Fre 08:00-17:00
            </p>
          </div>
        )}

        {mode === "symptom" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">Klikk på området hvor du har smerter:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Rygg 🦴", value: "rygg" },
                { label: "Nakke 💆", value: "nakke" },
                { label: "Skulder 💪", value: "skulder" },
                { label: "Kne 🦵", value: "kne" },
                { label: "Ankel/Fot 👣", value: "ankel" },
                { label: "Håndledd ✋", value: "handledd" },
              ].map((area) => (
                <button
                  key={area.value}
                  onClick={() => {
                    setInput(`Jeg har smerter i ${area.value}`)
                    setMode("chat")
                    setTimeout(() => handleSend(), 100)
                  }}
                  className="px-4 py-3 bg-gray-50 hover:bg-[#f48337]/10 hover:ring-2 hover:ring-[#f48337] rounded-xl text-sm font-medium text-gray-700 transition-all"
                >
                  {area.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === "learn" && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 mb-2">Utforsk Kunnskap</h4>
            <div className="space-y-2">
              <a href="/behandlinger/rygg" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <span className="text-xl">🦴</span>
                <span className="text-sm font-medium text-gray-700">Ryggsmerter</span>
              </a>
              <a href="/behandlinger/nakke" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <span className="text-xl">💆</span>
                <span className="text-sm font-medium text-gray-700">Nakkesmerter</span>
              </a>
              <a href="/" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <span className="text-xl">📚</span>
                <span className="text-sm font-medium text-gray-700">Se alle behandlinger</span>
              </a>
            </div>
          </div>
        )}

        {mode === "exercise" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Spør om øvelser for ditt område:</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                "Øvelser for ryggen",
                "Tøyninger for nakken",
                "Styrketrening for kneet",
              ].map((exercise) => (
                <button
                  key={exercise}
                  onClick={() => {
                    setInput(exercise)
                    setMode("chat")
                    setTimeout(() => handleSend(), 100)
                  }}
                  className="px-4 py-3 bg-gray-50 hover:bg-[#f48337]/10 hover:ring-2 hover:ring-[#f48337] rounded-xl text-sm font-medium text-gray-700 text-left transition-all"
                >
                  💪 {exercise}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
