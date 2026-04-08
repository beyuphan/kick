import websocket
import json

class KickClient:
    def __init__(self, chatroom_id, pusher_key):
        self.url = f"wss://ws-us2.pusher.com/app/{pusher_key}?protocol=7&client=js&version=8.4.0"
        self.chatroom_id = chatroom_id
        self.callback = None
        self.ws = None

    def on_message(self, ws, message):
        data = json.loads(message)
        event = data.get("event")
        
        if event == "pusher:connection_established":
            ws.send(json.dumps({"event": "pusher:subscribe", "data": {"channel": f"chatrooms.{self.chatroom_id}.v2"}}))
            ws.send(json.dumps({"event": "pusher:subscribe", "data": {"channel": f"chatroom_{self.chatroom_id}"}}))
        
        if self.callback and event in ["App\\Events\\ChatMessageEvent", "RewardRedeemedEvent"]:
            self.callback(event, data)

    def start(self, callback):
        self.callback = callback
        print("🔌 [KICK] WebSocket bağlantısı kuruluyor...")
        self.ws = websocket.WebSocketApp(self.url, on_message=self.on_message)
        self.ws.run_forever()

    def stop(self):
        if self.ws:
            print("🛑 [KICK] WebSocket bağlantısı PANEL tarafından kesildi.")
            self.ws.close()
            self.ws = None