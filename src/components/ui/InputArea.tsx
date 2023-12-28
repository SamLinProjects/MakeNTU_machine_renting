"use client"
import { forwardRef } from "react"

type InputProps = {
  placeHolder?: string,
  editable: boolean,
  value?: string,
  type?: string,
  onChange?: (value: string) => void
}

const InputArea = forwardRef<HTMLInputElement, InputProps>(
  ({placeHolder, editable, value, type = "text", onChange}, ref) => {
    return(
      <>
        {editable?
          <input
            className="p-1 border-2 bg-white border-gray-300 bg-slate-100d text-gray-800 rounded-lg focus:outline-0 focus:border-gray-600 md:min-w-[75%]"
            ref={ref}
            type={type}
            value={value}
            placeholder={placeHolder}
            onChange={(e)=>onChange?.(e.target.value)}
          />:
          <input 
            className="p-1 border-2 bg-gray-200 border-gray-300 text-gray-400 rounded-lg focus:outline-0 md:min-w-[75%]"
            ref={ref}
            type="text"
            value={value}
            readOnly
            placeholder={placeHolder}
            onChange={(e)=>onChange?.(e.target.value)}
          />
        }
      </>
    )

  }
)

InputArea.displayName = "InputArea";

export default InputArea;