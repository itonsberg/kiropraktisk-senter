"use client"

import { useState, useRef, useEffect } from "react"
import { Send, X, MessageCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function KiroKIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hei! Jeg er Kiro KI, din digitale assistent. Fortell meg om dine plager, så kan jeg hjelpe deg med råd og informasjon. 😊"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter(line => line.trim())

          for (const line of lines) {
            // Handle Vercel AI SDK text stream format
            if (line.startsWith('0:')) {
              // Format: 0:"text content"
              const match = line.match(/^0:"(.+)"$/)
              if (match) {
                aiResponse += match[1]
              }
            } else if (line.startsWith('data: ')) {
              // Alternative format: data: {"content":"text"}
              try {
                const json = JSON.parse(line.slice(6))
                if (json.content) {
                  aiResponse += json.content
                }
              } catch (e) {
                // Not JSON, might be plain text
                aiResponse += line.slice(6)
              }
            } else if (line.trim() && !line.startsWith('{')) {
              // Plain text line
              aiResponse += line
            }

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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-4 bg-[#f48337] text-white rounded-full shadow-2xl shadow-[#f48337]/40 hover:scale-105 transition-transform"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-semibold">Kiro KI</span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-48px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#f48337] to-[#f48337]/90 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold">Kiro KI</h3>
            <p className="text-xs text-white/80">Digital symptomassistent</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.role === "user"
                  ? "bg-[#f48337] text-white"
                  : "bg-white text-gray-900 shadow-sm"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 shadow-sm rounded-2xl px-4 py-2">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
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
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-[#f48337] text-white rounded-full hover:bg-[#f48337]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Kiro KI gir generelle råd. Ved akutte plager, kontakt lege.
        </p>
      </div>
    </div>
  )
}
