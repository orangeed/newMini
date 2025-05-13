function getCurrentMessage() {
  return getApp().globalData.__currentMessage
}

export const Message = {
  success(msg, duration = 2000) {
    getCurrentMessage()?.showMessage(msg, { type: 'success', duration })
  },
  error(msg, duration = 2000) {
    getCurrentMessage()?.showMessage(msg, { type: 'error', duration })
  },
  info(msg, duration = 2000) {
    getCurrentMessage()?.showMessage(msg, { type: 'info', duration })
  },
  warning(msg, duration = 2000) {
    getCurrentMessage()?.showMessage(msg, { type: 'warning', duration })
  }
}
