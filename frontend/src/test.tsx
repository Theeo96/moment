import React from 'react';

// 웹: React DOM, 앱: React Native → 자동 분기
const isWeb = typeof document !== 'undefined';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  title: {
    fontSize: isWeb ? 48 : 36,
    fontWeight: 'bold' as const,
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: isWeb ? 20 : 18,
    color: '#555',
    textAlign: 'center' as const,
    lineHeight: 28,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600' as const,
  },
};

export default function App() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome</h1>
      <p style={styles.subtitle}>
        이 페이지는 웹과 앱에서<br />
        <strong>완전히 동일하게</strong> 보입니다!
      </p>
      <button style={styles.button}>
        <span style={styles.buttonText}>Get Started</span>
      </button>
    </div>
  );
}