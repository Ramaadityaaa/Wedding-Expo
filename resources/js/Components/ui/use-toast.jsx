import * as React from "react"
import { useToast } from "./use-toast";
// Batas maksimum toast yang ditampilkan bersamaan
const TOAST_LIMIT = 1 
// Delay removal (digunakan oleh Toaster.jsx untuk menghapus dari DOM setelah animasi selesai)
const TOAST_REMOVE_DELAY = 1000000 

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST", // Mengatur 'open: false'
  REMOVE_TOAST: "REMOVE_TOAST",   // Menghapus dari state
}

let count = 0

function genId() {
  count = (count + 1) % 1000000
  return count.toString()
}

function toastReducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action
      // Note: we're only setting "open" to false here.
      // The remove is handled in the Toast component (yang ada di toaster.jsx).
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      }
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    default:
        return state;
  }
}

const ToastContext = React.createContext(undefined)

/**
 * Provider yang menampung state semua Toast dan logic reducer.
 * HARUS diletakkan di App.jsx atau Layout utama.
 */
export function ToasterProvider({ children }) {
  const [state, dispatch] = React.useReducer(toastReducer, {
    toasts: [],
  })

  const [paused, setPaused] = React.useState(false)

  // Fungsi yang dipanggil oleh user (e.g., toast({ title: 'Success' }))
  function toast({ ...props }) {
    const id = genId()
    const update = (props) => dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...props, id } })
    const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

    dispatch({
      type: actionTypes.ADD_TOAST,
      toast: {
        ...props,
        id,
        open: true,
        // Ini dipanggil oleh <Toast> component (di toaster.jsx) saat di-dismiss
        onOpenChange: (open) => { 
          if (!open) dismiss()
        },
      },
    })

    return {
      id,
      dismiss,
      update,
    }
  }

  function dismiss(toastId) {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
  }

  function remove(toastId) {
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId })
  }

  // Logic untuk mengatur timer otomatis dismiss
  React.useEffect(() => {
    let timerRef = 0
    if (!paused) {
      if (state.toasts.length > 0) {
        const t = state.toasts[0]
        if (t.duration) {
          timerRef = setTimeout(() => dismiss(t.id), t.duration)
        }
      }
    }

    return () => clearTimeout(timerRef)
  }, [state.toasts, paused])


  return (
    <ToastContext.Provider value={{ toasts: state.toasts, toast, dismiss, remove, setPaused, paused }}>
      {children}
    </ToastContext.Provider>
  )
}

/**
 * HOOK UTAMA YANG AKAN DIPANGGIL OLEH KOMPONEN LAIN.
 * Ini adalah function yang dicari oleh BankSettingsPage.jsx Anda.
 */
export function useToast() {
  const context = React.useContext(ToastContext)

  if (!context) {
    // Ini error yang Anda dapatkan jika ToasterProvider belum dibungkus di level atas
    throw new Error("useToast must be used within a ToasterProvider") 
  }

  return context
}