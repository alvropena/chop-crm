'use client'

import { useState } from 'react'
import { Search, MessageSquare, User, Phone, Mail, Calendar, Tag, CheckCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for users
const users = [
  { id: 1, name: 'Alice Johnson', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Thanks for your help!', unread: 2, tags: ['VIP', 'Technical'], status: 'Open' },
  { id: 2, name: 'Bob Smith', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'When can we schedule a call?', unread: 0, tags: ['Sales Lead'], status: 'Resolved' },
  { id: 3, name: 'Charlie Brown', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'I have a question about...', unread: 1, tags: ['Support'], status: 'In Progress' },
]

// Mock data for chat messages
const chatMessages = [
  { id: 1, sender: 'Alice Johnson', content: 'Hi there! I need some assistance with my account.', timestamp: '10:30 AM' },
  { id: 2, sender: 'You', content: 'Of course, I\'d be happy to help. What seems to be the issue?', timestamp: '10:32 AM' },
  { id: 3, sender: 'Alice Johnson', content: 'I\'m having trouble updating my billing information.', timestamp: '10:35 AM' },
]

// Mock data for communication log
const communicationLog = [
  { id: 1, type: 'Email', date: '2023-05-01', summary: 'Sent welcome email' },
  { id: 2, type: 'Phone', date: '2023-05-03', summary: 'Discussed account setup' },
  { id: 3, type: 'Chat', date: '2023-05-05', summary: 'Resolved billing issue' },
]

export default function Component() {
  const [selectedUser, setSelectedUser] = useState(users[0])
  const [messageInput, setMessageInput] = useState('')
  const [newTag, setNewTag] = useState('')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the message to your backend
    console.log('Sending message:', messageInput)
    setMessageInput('')
  }

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTag.trim()) {
      setSelectedUser(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleStatusChange = (value: string) => {
    setSelectedUser(prev => ({
      ...prev,
      status: value
    }))
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Contacts</h2>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-8" />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          {users.map(user => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${selectedUser.id === user.id ? 'bg-gray-100' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{user.name}</p>
                  {user.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">{user.unread}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white p-4 shadow flex justify-between items-center">
          <h2 className="text-xl font-bold">{selectedUser.name}</h2>
          <div className="flex items-center gap-2">
            <Select onValueChange={handleStatusChange} defaultValue={selectedUser.status}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Set status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant={selectedUser.status === 'Resolved' ? 'default' : 'outline'}>
              {selectedUser.status}
            </Badge>
          </div>
        </div>

        {/* Chat and User Info */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              {chatMessages.map(message => (
                <div key={message.id} className={`mb-4 ${message.sender === 'You' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-2 rounded-lg ${message.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    <p>{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
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

          {/* User Info Panel */}
          <div className="w-80 bg-white border-l p-4 overflow-y-auto">
            <div className="text-center mb-4">
              <Avatar className="w-20 h-20 mx-auto">
                <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                <AvatarFallback>{selectedUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold mt-2">{selectedUser.name}</h3>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 234 567 890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{selectedUser.name.toLowerCase().replace(' ', '.')}@example.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined Jan 2023</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedUser.tags.map((tag, index) => (
                  <Badge key={index}>{tag}</Badge>
                ))}
              </div>
              <form onSubmit={handleAddTag} className="flex gap-2">
                <Input
                  placeholder="Add new tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <Button type="submit" size="sm"><Tag className="h-4 w-4" /></Button>
              </form>
            </div>
            <Separator className="my-4" />
            <Tabs defaultValue="notes">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="communication">Communication Log</TabsTrigger>
              </TabsList>
              <TabsContent value="notes">
                <textarea
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Add notes about this user..."
                ></textarea>
              </TabsContent>
              <TabsContent value="communication">
                <ScrollArea className="h-40">
                  {communicationLog.map((log) => (
                    <div key={log.id} className="mb-2 p-2 bg-gray-50 rounded">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{log.type}</span>
                        <span className="text-gray-500">{log.date}</span>
                      </div>
                      <p className="text-sm mt-1">{log.summary}</p>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}