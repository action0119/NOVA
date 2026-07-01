import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { Snackbar, Alert } from '@mui/material'

type ToastState = { message: string; open: boolean }

const ToastContext = createContext<(message: string) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ message: '', open: false })

  const showToast = useCallback((message: string) => {
    setToast({ message, open: true })
  }, [])

  const handleClose = () => setToast((prev) => ({ ...prev, open: false }))

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={2400}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ bgcolor: '#111111', color: '#FFFFFF', fontSize: 14, fontWeight: 500 }}
          icon={false}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
