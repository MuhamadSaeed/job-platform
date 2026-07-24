import os.path
import uuid  # 1. تم إضافة uuid لتوليد معرف فريد لكل اجتماع
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# الصلاحية المطلوبة للتقويم
SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_calendar_service():
    creds = None
    
    # ملف token.json بيحفظ التوكن بعد أول تسجيل دخول عشان ما يطلبش منك تسجيل دخول كل مرة
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        
    # لو مافيش توكن أو انتهت صلاحيته
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # استخدام ملف client_secret.json الجديد
            flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', SCOPES)
            creds = flow.run_local_server(port=8080)
            
        # حفظ التوكن للمرات القادمة
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    return build('calendar', 'v3', credentials=creds)


def create_google_meet_event(summary: str, start_time: str, end_time: str, applicant_email: str):
    """
    دالة لإنشاء موعد مقابلة وإنشاء رابط Google Meet حقيقي
    start_time & end_time بصيغة ISO (مثل: '2026-07-25T10:00:00')
    """
    service = get_calendar_service()
    
    event = {
        'summary': summary,
        'description': 'مقابلة عمل عبر منصة JobPlatform',
        'start': {'dateTime': start_time, 'timeZone': 'Africa/Cairo'},
        'end': {'dateTime': end_time, 'timeZone': 'Africa/Cairo'},
        'attendees': [
            {'email': applicant_email}
        ],
        'conferenceData': {
            'createRequest': {
                # 2. تغيير requestId إلى UUID عشوائي لمنع تكرار روابط اللقاءات
                'requestId': str(uuid.uuid4()),
                'conferenceSolutionKey': {'type': 'hangoutsMeet'}
            }
        }
    }

    # إنشاء الموعد مع تفعيل conferenceDataVersion=1 لتوليد رابط Meet
    created_event = service.events().insert(
        calendarId='primary',
        body=event,
        conferenceDataVersion=1
    ).execute()

    # استخراج رابط جوجل ميت الشغال
    meet_link = created_event.get('hangoutLink')
    return {
        "event_id": created_event.get('id'),
        "meet_link": meet_link,
        "html_link": created_event.get('htmlLink')
    }