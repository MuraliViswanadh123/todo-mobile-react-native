import React,{useCallback,useRef,useState} from 'react';
import { FlatList,KeyboardAvoidingView,Platform,Pressable,StyleSheet,TextInput,View } from 'react-native';
import { SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context';

export default function App(){
  const [tasks,setTasks]=useState([]);
  const [draft,setDraft]=useState('');
  const nextId=useRef(1);

  const addTask=useCallback(()=>{
    const text=draft.trim();
    if(!text) return;
    setTasks((prev)=>[
      ...prev,
      {id:String(nextId.current++),text,done:false},
    ]);
    setDraft('');
  },[draft]);
  const toggleTask=useCallback((id)={
    
  })

}