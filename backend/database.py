import sqlite3

def init_db():
    conn = sqlite3.connect('pavyon.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users 
                     (username TEXT PRIMARY KEY, balance INTEGER DEFAULT 0)''')
    conn.commit()
    conn.close()
    print("📇 Kara Defter (DB) hazır.")

def bakiye_ekle(username, miktar):
    conn = sqlite3.connect('pavyon.db')
    cursor = conn.cursor()
    cursor.execute("INSERT OR IGNORE INTO users (username, balance) VALUES (?, 0)", (username,))
    cursor.execute("UPDATE users SET balance = balance + ? WHERE username = ?", (miktar, username))
    cursor.execute("SELECT balance FROM users WHERE username = ?", (username,))
    res = cursor.fetchone()[0]
    conn.commit()
    conn.close()
    return res

def bakiye_harca(username, miktar):
    conn = sqlite3.connect('pavyon.db')
    cursor = conn.cursor()
    cursor.execute("SELECT balance FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    if row and row[0] >= miktar:
        cursor.execute("UPDATE users SET balance = balance - ? WHERE username = ?", (miktar, username))
        conn.commit()
        conn.close()
        return True
    conn.close()
    return False