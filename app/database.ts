export type Message = {
    id: number
    user_id: string
    text: string
    created_at: string
    is_founder: boolean
    read_at: string | null
  }
  
  export type User = {
    id: string
    name: string   
  }