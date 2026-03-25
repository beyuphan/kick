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

BAKIYE_ODUL_ADI = "PAVYON 500 BAKİYE"



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
                yeni = bakiye_ekle(user, 500)
                print(f"💰 [BAKİYE EKLENDİ] {user} -> {BAKIYE_ODUL_ADI} (Güncel: {yeni})")
                await sio.emit('reward', {'user': user, 'balance': yeni})
            else:
                # Diğer ödülleri sadece logla, bakiye ekleme!
                print(f"ℹ️ [DİĞER ÖDÜL] {user}: {reward_title} (İşlem yapılmadı)")

        # 2. CHAT KOMUTLARI (!EYLEM)
        elif "ChatMessageEvent" in event:
            user = inner.get('sender', {}).get('username')
            raw_content = inner.get('content', '').strip() # Orijinal halini tut (büyük/küçük harf dahil)
            content = raw_content.lower()
            
            # Metadata kirliliği bitti, sadece temiz log
            print(f"💬 [CHAT] {user}: {content}")

            # Eylem Komutları
            if content == "!meyve":
                if bakiye_harca(user, 50):
                    print(f"🍊 [EYLEM] {user} masalara meyve tabağı gönderdi!")
                    await sio.emit('meyve_trigger', {'user': user})
                else:
                    print(f"⚠️ [RED] {user} bakiyesi yetersiz.")

            elif content == "!vip":
                if vip_count < 4:
                    if bakiye_harca(user, 600):
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

            elif content == "!pavyon":
                if bakiye_harca(user, 100): 
                    print(f"🕺 [GİRİŞ] {user} pavyona giriş yaptı.")
                    await sio.emit('pavyon_join', {'user': user})
                else:
                    print(f"❌ [RED] {user} parası yetersiz.")

            elif content == "!bahsis":
                if bakiye_harca(user, 350): # Her bahşiş 100 puan olsun
                    print(f"💸 [BAHŞİŞ] {user} para saçıyor!")
                    await sio.emit('money_rain', {'user': user})
                else:
                    print(f"❌ [RED] {user} parası yetersiz.")

            elif content == "!dans":
                if bakiye_harca(user, 150):
                    print(f"💃 [DANS] {user} pisti hareketlendirdi!")
                    await sio.emit('dance_trigger', {'user': user})

            elif content == "!sampanya":
                if bakiye_harca(user, 200): # Şampanya pahalıdır :)
                    print(f"🍾 [ŞAMPANYA] {user} şampanya patlattı!")
                    await sio.emit('action_alert', {
                        'type': 'champagne', 
                        'user': user, 
                        'message': f"🍾 {user} ŞAMPANYA PATLATTI! 🍾"
                    })
                else:
                    print(f"❌ [RED] {user} parası yetersiz.")

            elif content == "!cakar":
                if bakiye_harca(user, 400):
                    print(f"🚨 [ÇAKAR] {user} ışıkları çıldırttı!")
                    await sio.emit('strobe_lights', {'user': user})
                else:
                    print(f"❌ [RED] {user} parası yetersiz.")

            elif content == "!gul":
                if bakiye_harca(user, 250):
                    print(f"🌹 [GÜL] {user} gül döktürdü!")
                    await sio.emit('rose_rain', {'user': user})
            
            elif content == "!corap":
                if bakiye_harca(user, 200):
                    print(f"🌹 [GÜL] {user} ayak yaladı!")
                    await sio.emit('corap', {'user': user})

            elif content.startswith("!bakiye"):
                parts = raw_content.split()
                
                if len(parts) == 3 and user == "rizelimichaelscofield":
                    try:
                        miktar = int(parts[1])
                        hedef_kisi = parts[2]
                        
                        yeni_bakiye = bakiye_ekle(hedef_kisi, miktar)
                        print(f"👑 [YÖNETİCİ] {user}, {hedef_kisi} adlı kişiye {miktar} kredi ekledi! (Yeni Bakiyesi: {yeni_bakiye})")
                        
                        # İstersen chate veya ekrana da bilgi geçebilirsin
                        await sio.emit('chat_message', {'msg': f"Gazinonun ağası {hedef_kisi} kişisine {miktar} kredi ateşledi!"})
                        
                    except ValueError:
                        print(f"❌ [HATA] Yanlış format. Doğrusu: !bakiye 5000 kullaniciadi")
                
                # Sadece "!bakiye" yazılmışsa (Herkesin kendi bakiyesini görmesi için eski komut)
                elif len(parts) == 1:
                    import sqlite3 # Eğer yukarıda import edilmemişse diye buraya ekledik
                    conn = sqlite3.connect('pavyon.db')
                    cursor = conn.cursor()
                    cursor.execute("SELECT balance FROM users WHERE username = ?", (user,))
                    row = cursor.fetchone()
                    bakiye = row[0] if row else 0
                    conn.close()
                    
                    print(f"💰 [BİLGİ] {user} bakiyesi: {bakiye}")
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