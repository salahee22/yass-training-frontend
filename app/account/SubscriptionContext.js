'use client'
import { createContext, useContext } from 'react'

export const SubscriptionContext = createContext(null)
export const useSubscription = () => useContext(SubscriptionContext)