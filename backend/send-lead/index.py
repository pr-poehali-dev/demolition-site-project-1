import os
import json
import urllib.request

TELEGRAM_API = "https://api.telegram.org/bot{token}/sendMessage"
CHAT_ID = "@temchec"


def handler(event: dict, context) -> dict:
    """Принимает заявку с сайта и отправляет её в Telegram @temchec."""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        body = {}

    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    message = body.get("message", "").strip()
    calc = body.get("calc", "")

    if not phone:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"ok": False, "error": "Укажите телефон"}),
        }

    text_parts = ["🏗 <b>Новая заявка с сайта PASTUHOUSE</b>"]
    if name:
        text_parts.append(f"👤 Имя: {name}")
    text_parts.append(f"📞 Телефон: {phone}")
    if message:
        text_parts.append(f"📝 Объект: {message}")
    if calc:
        text_parts.append(f"🔢 Калькулятор: {calc}")

    text = "\n".join(text_parts)

    token = os.environ["TELEGRAM_BOT_TOKEN"]
    url = TELEGRAM_API.format(token=token)

    payload = json.dumps({
        "chat_id": CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode())

    if not result.get("ok"):
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"ok": False, "error": "Telegram error"}),
        }

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"ok": True}),
    }
