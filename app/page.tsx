'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Message, User } from '@/types/database'
import { supabase } from './supabase'
import { useRouter } from 'next/navigation'

export default function Component() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      fetchMessages()
      
      // Set up real-time subscription
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `user_id=eq.${selectedUser.id}`,
          },
          (payload) => {
            setMessages(current => [...current, payload.new as Message])
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [selectedUser?.id])

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching users:', error)
      return
    }

    setUsers(data)
    if (data.length > 0) {
      setSelectedUser(data[0])
    }
  }

  const fetchMessages = async () => {
    if (!selectedUser) return

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`user_id.eq.${selectedUser.id},is_founder.eq.true`)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return
    }

    setMessages(data)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !selectedUser) return

    const newMessage = {
      user_id: selectedUser.id,
      text: messageInput,
      is_founder: true,
      read_at: null
    }

    const { error } = await supabase
      .from('messages')
      .insert(newMessage)

    if (error) {
      console.error('Error sending message:', error)
      return
    }

    setMessageInput('')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          {users.map(user => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${
                selectedUser?.id === user.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <Avatar>
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`mb-4 ${message.is_founder ? 'text-right' : ''}`}
            >
              <div 
                className={`inline-block p-2 rounded-lg ${
                  message.is_founder 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200'
                }`}
              >
                <p>{message.text}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(message.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <Button type="submit">Send</Button>
          </div>
        </form>
      </div>
    </div>
  )
}