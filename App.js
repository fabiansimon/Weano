import { View, Text } from 'react-native'
import React from 'react'
import Colors from './src/constants/Theme'

export default function App() {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: Colors.blacK}}>
      <Text>App</Text>
    </View>
  )
}