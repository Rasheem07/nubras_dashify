/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction } from 'react'
import { Select } from '../ui/select'

export default function TableFilter({setData}: {setData: Dispatch<SetStateAction<any[]>>}) {
  return (
    <div className='flex items-center py-2'>
        <Select>

        </Select>
    </div>
  )
}
