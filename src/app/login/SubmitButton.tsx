'use client'

import { useFormStatus } from 'react-dom'
import { type ComponentProps } from 'react'

type Props = ComponentProps<'button'> & {
    pendingText?: string
}

export function SubmitButton({ children, pendingText, ...props }: Props) {
    const { pending } = useFormStatus()

    return (
        <button {...props} disabled={pending}>
            {pending ? pendingText : children}
        </button>
    )
}
