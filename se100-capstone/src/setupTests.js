import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Ensure crypto exists in test environment
if (!globalThis.crypto) {
  globalThis.crypto = {}
}

// Mock randomUUID if not available
if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = vi.fn(() => 'test-uuid')
}