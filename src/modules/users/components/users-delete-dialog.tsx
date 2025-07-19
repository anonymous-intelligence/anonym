'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { User } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')

  const handleDelete = () => {
    if (value.trim() !== currentRow.username) return

    onOpenChange(false)
    toast({
      title: 'The following user has been deleted:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>
            {JSON.stringify(currentRow, null, 2)}
          </code>
        </pre>
      ),
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.username}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='mr-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Kullanıcıyı Sil
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            <span className='font-bold'>{currentRow.username}</span> kullanıcısını silmek istediğinizden emin misiniz?
            <br />
            Bu işlem, <span className='font-bold'>{currentRow.role.toUpperCase()}</span> rolüne sahip kullanıcıyı sistemden kalıcı olarak silecektir. Bu işlem geri alınamaz.
          </p>
          <Label className='my-2'>
            Kullanıcı Adı:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Silmek istediğiniz kullanıcı adını giriniz.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Dikkat!</AlertTitle>
            <AlertDescription>
              Lütfen dikkatli olunuz, bu işlem geri alınamaz.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
