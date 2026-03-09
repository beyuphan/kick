import os
import asyncio
import socketio
import json
import threading
from aiohttp import web
from dotenv import load_dotenv
from database import init_db, bakiye_ekle, bakiye_harca
from kick_client import KickClient

load_dotenv()

BAKIYE_ODUL_ADI = "MesajÄ±nÄ± vurgula"



# --- ASYNC SOCKET.IO ---
sio = socketio.AsyncServer(
    async_mode='aiohttp',
    cors_allowed_origins='*',
    logger=False,
    engineio_logger=False
)
app = web.Application()
sio.attach(app)
loop = None

vip_count = 0

async def event_isleyici(event, data):
    global vip_count
    try:
        raw_inner = data.get('data')
        inner = json.loads(raw_inner) if isinstance(raw_inner, str) else raw_inner
        
        # 1. ÖDÜLLER (SADECE BAKIYE YÜKLEME)
        if event == "RewardRedeemedEvent":
            reward_title = inner.get('reward_title')
            user = inner.get('username')
            
            # Sadece belirlediğimiz ödül ise bakiye ekle
            if reward_title == BAKIYE_ODUL_ADI:
                yeni = bakiye_ekle(user, 1000)
                print(f"💰 [BAKİYE EKLENDİ] {user} -> {BAKIYE_ODUL_ADI} (Güncel: {yeni})")
                await sio.emit('reward', {'user': user, 'balance': yeni})
            else:
                # Diğer ödülleri sadece logla, bakiye ekleme!
                print(f"ℹ️ [DİĞER ÖDÜL] {user}: {reward_title} (İşlem yapılmadı)")

        # 2. CHAT KOMUTLARI (!EYLEM)
        elif "ChatMessageEvent" in event:
            user = inner.get('sender', {}).get('username')
            content = inner.get('content', '').strip().lower()
            
            # Metadata kirliliği bitti, sadece temiz log
            print(f"💬 [CHAT] {user}: {content}")

            # Eylem Komutları
            if content == "!meyve":
                if bakiye_harca(user, 500):
                    print(f"🍊 [EYLEM] {user} meyve tabağı patlattı!")
                    await sio.emit('action', {'type': 'fruit', 'user': user})
                else:
                    print(f"⚠️ [RED] {user} bakiyesi yetersiz.")

            elif content == "!vip":
                if vip_count < 4:
                    if bakiye_harca(user, 2000): # VIP masa daha pahalı olsun kanka
                        vip_count += 1
                        print(f"🛋️ [VIP] {user} masaya geçti. (Kapasite: {vip_count}/4)")
                        await sio.emit('occupy_table', {'user': user})
                    else:
                        print(f"❌ [RED] {user} parası yetmedi.")
                else:
                    # Kapasite doluysa para çekme, sadece uyarı ver
                    print(f"🚫 [DOLU] VIP masalar dolu, {user} bakiyesi korundu.")
                    await sio.emit('chat_message', {'msg': "VIP masalar dolu kanka, sonra dene!"})

            # Sıfırlama komutuna sayacı da ekle
            elif content == "!pavyonu_sifirla" and user == "rizelimichaelscofield":
                vip_count = 0
                await sio.emit('reset_ui')

            elif content == "!dans":
                if bakiye_harca(user, 1000):
                    print(f"💃 [EYLEM] {user} pisti kapattı!")
                    await sio.emit('action', {'type': 'dance', 'user': user})

            elif content == "!pavyon":
                print(f"🕺 [GİRİŞ] {user} pavyona giriş yaptı.")
                await sio.emit('pavyon_join', {'user': user})
            elif content == "!bahsis":
                if bakiye_harca(user, 100): # Her bahşiş 100 puan olsun
                    print(f"💸 [BAHŞİŞ] {user} para saçıyor!")
                    await sio.emit('money_rain', {'user': user})
                else:
                    print(f"❌ [RED] {user} parası yetersiz.")

            elif content == "!dans":
                if bakiye_harca(user, 300):
                    print(f"💃 [DANS] {user} pisti hareketlendirdi!")
                    await sio.emit('dance_trigger', {'user': user})

            elif content == "!bakiye":
                # Veritabanından bakiyeyi çekip ekrana veya loga basıyoruz
                conn = sqlite3.connect('pavyon.db')
                cursor = conn.cursor()
                cursor.execute("SELECT balance FROM users WHERE username = ?", (user,))
                row = cursor.fetchone()
                bakiye = row[0] if row else 0
                conn.close()
                
                print(f"💰 [BİLGİ] {user} bakiyesi: {bakiye}")
                # Kullanıcıya özel bakiye göstergesi fırlatalım
                await sio.emit('show_balance', {'user': user, 'balance': bakiye})

    except Exception as e:
        print(f"⚠️ Hata: {e}")

def bridge(event, data):
    """Thread-safe köprü: Kick (Thread) -> Main (Async)"""
    if loop:
        asyncio.run_coroutine_threadsafe(event_isleyici(event, data), loop)

if __name__ == "__main__":
    init_db()
    bakiye_ekle("rizelimichaelscofield", 50000)
    # Python 3.14 Loop Yönetimi
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    # Kick Client Başlat
    K_ID = os.getenv("KICK_CHANNEL_ID")
    K_KEY = os.getenv("PUSHER_KEY")
    client = KickClient(K_ID, K_KEY)
    threading.Thread(target=client.start, args=(bridge,), daemon=True).start()
    
    print(f"🚀 Pavyon Backend V7 (Lokal) Aktif. Port: 5000")
    web.run_app(app, port=5000, loop=loop)