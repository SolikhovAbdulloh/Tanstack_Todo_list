import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

function SecondComponent(){
    const query = useQueryClient()
    const data = query.getQueryData(['TODO'])
    console.log(data);
    
  return (
    <div>SecondComponent</div>
  )
}

export default SecondComponent