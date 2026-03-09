import websocket
import json

class KickClient:
    def __init__(self, chatroom_id, pusher_key):
        self.url = f"wss://ws-us2.pusher.com/app/{pusher_key}?protocol=7&client=js&version=8.4.0"
        self.chatroom_id = chatroom_id
        self.callback = None

    def on_message(self, ws, message):
        data = json.loads(message)
        event = data.get("event")
        
        # Bağlantı ve Abone onaylarını sessizce hallet
        if event == "pusher:connection_established":
            ws.send(json.dumps({"event": "pusher:subscribe", "data": {"channel": f"chatrooms.{self.chatroom_id}.v2"}}))
            ws.send(json.dumps({"event": "pusher:subscribe", "data": {"channel": f"chatroom_{self.chatroom_id}"}}))
        
        # Sadece işimize yarayan eventleri callback'e gönder
        if self.callback and event in ["App\\Events\\ChatMessageEvent", "RewardRedeemedEvent"]:
            self.callback(event, data)

    def start(self, callback):
        self.callback = callback
        print("🔌 [SİSTEM] Kick bağlantısı başlatılıyor...")
        ws = websocket.WebSocketApp(self.url, on_message=self.on_message)
        ws.run_forever()